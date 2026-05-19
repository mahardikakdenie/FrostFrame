import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';
import { useUIStore } from '../../store/useUIStore';
import { cn, debounce } from '../../lib/utils';
import { BuilderExtensions } from '../../extensions/registry';
import { buildSelectionPath, resolveSmartDropPosition } from './editorHelpers';
import { FloatingToolbar } from './FloatingToolbar';
import { Plus } from 'lucide-react';
import { saveDraftToDB, getDraftFromDB, migrateFromLocalStorage } from '../../lib/db';

export const Editor = () => {
  const focusedId = useUIStore((state) => state.focusedId);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const activeNodeType = useUIStore((state) => state.activeNodeType);
  const isDragging = useUIStore((state) => state.isDragging);
  const draggedType = useUIStore((state) => state.draggedType);
  const setDragState = useUIStore((state) => state.setDragState);

  // 🚀 UX IMPROVEMENT: Visual Drop Indicator State
  const [dropIndicator, setDropIndicator] = useState<{ 
    top: number, 
    left: number, 
    width: number,
    side: 'top' | 'bottom' | 'inside',
    label: string
  } | null>(null);

  // 🚀 OPTIMIZATION (Fase 9): TEXT_NODES registry
  const TEXT_NODES = [
    'heroHeadline', 'heroSubheadline', 'heroBadge', 
    'paragraphElement', 'sectionHeading', 'featureCard',
    'layoutColumn', 'doc' // Whitelist nodes that are intended to hold text content
  ];

  const debouncedSave = useMemo(() => 
    debounce(async (editor: any) => {
      const json = editor.getJSON();
      await saveDraftToDB(json);
      console.log('Auto-saved draft to IndexedDB (debounced)');
    }, 1500), 
  []);

  const editor = useEditor({
    extensions: BuilderExtensions,
    content: {
      type: 'doc',
      content: [
        {
          type: 'layoutRow',
          attrs: { id: crypto.randomUUID(), gridCols: 1, displayType: 'flex' },
          content: [
            { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }
          ]
        }
      ]
    },
    onUpdate: ({ editor }) => {
      debouncedSave(editor);
    },
    onSelectionUpdate: ({ editor, transaction }) => {
      // 🚀 UX FIX: Ignore selection updates triggered by sidebar attribute changes
      // to prevent "flicker" or jumping focus to child elements when editing parents
      if (transaction && transaction.getMeta('isSidebarUpdate')) return;

      const path = buildSelectionPath(editor.state.doc, editor.state.selection);
      const leafNode = path.length > 0 ? path[path.length - 1] : null;
      
      // 🚀 OPTIMIZATION: Only update if the selection has actually changed
      const currentStoreId = useUIStore.getState().focusedId;
      const currentStorePath = useUIStore.getState().selectionPath;
      
      const isSamePath = JSON.stringify(path) === JSON.stringify(currentStorePath);
      const isSameId = (leafNode?.id || null) === currentStoreId;

      if (!isSameId || !isSamePath) {
        if (leafNode) {
          setFocusedId(leafNode.id, 'element', path, leafNode.type);
        } else {
          setFocusedId(null, 'section', [], null);
        }
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none pb-32 transition-all duration-300 min-h-[500px] relative',
        contenteditable: 'true',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // 🚀 OPTIMIZATION (Fase 9B): Block typing if not in a text node
          const allowedKeys = ['Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Escape', 'Enter'];
          
          // Allow system/control commands and navigation
          if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) {
            return false;
          }

          // Verify if we are inside a valid text element
          const { selection } = view.state;
          const parentNode = selection.$from.parent;
          
          const isTextNode = parentNode && TEXT_NODES.includes(parentNode.type.name);

          if (!isTextNode) {
            // Block character insertion if not in a text-capable node
            event.preventDefault();
            return true;
          }
          
          return false;
        },
        dragstart: (view, event) => {
          // Detect if dragging a node already in the editor
          const { selection } = view.state;
          let type = event.dataTransfer?.getData('tiptap-node-type');
          
          if (!type && selection instanceof NodeSelection) {
            type = selection.node.type.name;
          }

          if (type) {
            setDragState(true, type);
            document.body.classList.add('is-dragging-' + type);
          }
          return false;
        },
        dragend: () => {
          setDragState(false, null);
          document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '');
          setDropIndicator(null);
          return false;
        },
        dragover: (view, event) => {
          event.preventDefault();
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'copy';
          }

          // Remove existing dragging-over classes
          const existing = document.querySelectorAll('.dragging-over');
          existing.forEach(el => el.classList.remove('dragging-over'));

          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
          
          // 🚀 COORDINATE FIX: Ensure we use isDragging store state reliably
          if (pos && (isDragging || document.body.classList.toString().includes('is-dragging'))) {
            // Calculate Smart Position
            const match = document.body.className.match(/is-dragging-([a-zA-Z]+)/);
            const effectiveType = draggedType || (match ? match[1] : 'paragraphElement');
            
            const { insertPos, side } = resolveSmartDropPosition(view, pos.pos, effectiveType);

            // Get Coordinates for Indicator
            const resolved = view.state.doc.resolve(insertPos);
            
            // Determine which node to highlight (the sibling node)
            let targetNodePos = -1;
            if (side === 'top') {
              targetNodePos = insertPos;
            } else if (side === 'bottom') {
              // The node is before insertPos
              const $pos = view.state.doc.resolve(insertPos);
              if ($pos.nodeBefore) {
                  targetNodePos = insertPos - $pos.nodeBefore.nodeSize;
              } else {
                  targetNodePos = insertPos;
              }
            } else {
              // Inside or Empty Column - highlight parent
              for (let d = resolved.depth; d >= 0; d--) {
                const node = resolved.node(d);
                if (node.type.name !== 'doc') {
                  targetNodePos = resolved.before(d);
                  break;
                }
              }
            }

            const targetDOM = targetNodePos !== -1 ? view.nodeDOM(targetNodePos) : null;
            
            if (targetDOM instanceof HTMLElement) {
              const rect = targetDOM.getBoundingClientRect();
              
              // Calculate top position based on side
              let indicatorTop = rect.top;
              if (side === 'bottom') indicatorTop = rect.bottom;
              if (side === 'inside') indicatorTop = rect.top + (rect.height / 2);

              setDropIndicator({
                top: indicatorTop,
                left: rect.left,
                width: rect.width,
                side,
                label: effectiveType.replace('Element', '').replace(/([A-Z])/g, ' $1').trim().toUpperCase()
              });
            }

            let nodePos = view.state.doc.resolve(pos.pos);
            // Highlight current column for drop target feedback
            for (let d = nodePos.depth; d >= 0; d--) {
              const node = nodePos.node(d);
              if (node.type.name === 'layoutColumn') {
                const dom = view.nodeDOM(nodePos.before(d)) as HTMLElement;
                if (dom) dom.classList.add('dragging-over');
                break;
              }
            }
          }
          return true;
        },
        dragleave: () => {
           const existing = document.querySelectorAll('.dragging-over');
           existing.forEach(el => el.classList.remove('dragging-over'));
           setDropIndicator(null);
           return false;
        }
      },
      handleDrop(view, event, slice, moved) {
        // 🚀 OPTIMIZATION (Fase Fix Drag): Aggressive cleanup of drop target highlights
        const existingHighlights = document.querySelectorAll('.dragging-over');
        existingHighlights.forEach(el => el.classList.remove('dragging-over'));
        
        setDropIndicator(null);
        
        let type = event.dataTransfer?.getData('tiptap-node-type');
        const payloadStr = event.dataTransfer?.getData('tiptap-variant-payload');
        
        if (!type && slice.content.childCount > 0) {
           type = slice.content.child(0).type.name;
        }

        if (!type) return false;

        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!coordinates) return false;

        // 🚀 OPTIMIZATION (Fase Fix Drag): Manual Move Implementation
        if (moved) {
          const { tr } = view.state;
          const { insertPos } = resolveSmartDropPosition(view, coordinates.pos, type);
          tr.deleteSelection();
          const mappedPos = tr.mapping.map(insertPos);
          tr.insert(mappedPos, slice.content);
          view.dispatch(tr);
          return true;
        }

        // Handle External Drops
        const { parentType, insertPos } = resolveSmartDropPosition(view, coordinates.pos, type);

        if (payloadStr) {
          try {
            const content = JSON.parse(payloadStr);
            (window as any).editor.chain().focus().insertContentAt(insertPos, content).run();
            return true;
          } catch (e) { console.error(e); }
        }

        // Standard Node Creation with default content
        const node = view.state.schema.nodes[type].createAndFill({ id: crypto.randomUUID() });
        let content = node ? node.toJSON() : { type, attrs: { id: crypto.randomUUID() } };

        const defaultTextMap: Record<string, string> = {
          'heroHeadline': 'NEW LANDO HEADLINE',
          'heroSubheadline': 'The fastest way to build beautiful landing pages with absolute precision.',
          'heroBadge': 'NEW RELEASE',
        };
        if (defaultTextMap[type] && (!content.content || content.content.length === 0)) {
          content.content = [{ type: 'text', text: defaultTextMap[type] }];
        }

        // Wrap in Row/Column if dropped at root
        if (parentType === 'doc' && !type.includes('Section') && !type.toLowerCase().includes('row')) {
          const wrappedContent = {
            type: 'layoutRow',
            attrs: { id: crypto.randomUUID(), displayType: 'flex', padding: 'py-12' },
            content: [{ type: 'layoutColumn', attrs: { id: crypto.randomUUID() }, content: [content] }]
          };
          (window as any).editor.chain().focus().insertContentAt(insertPos, wrappedContent).run();
        } else {
          (window as any).editor.chain().focus().insertContentAt(insertPos, content).run();
        }

        return true;
      },
    },
  });

  // Export editor instance to global window for sidebar interaction
  useEffect(() => {
    if (editor) {
      (window as any).editor = editor;
      
      // Load initial content from DB (includes migration)
      const loadInitialContent = async () => {
        await migrateFromLocalStorage();
        const draft = await getDraftFromDB();
        if (draft && draft.content) {
          editor.commands.setContent(draft.content);
          console.log('🚀 [IndexedDB] Draft loaded successfully.');
        }
      };
      
      loadInitialContent();
    }
  }, [editor]);

  // 🚀 SYNC: Select node in editor when focusedId changes externally
  useEffect(() => {
    if (!editor || !focusedId) return;

    const { selection } = editor.state;
    const currentId = selection instanceof NodeSelection 
      ? selection.node.attrs.id 
      : (selection.$from.parent.attrs.id || selection.$from.before().toString());

    if (currentId !== focusedId) {
      // Find node by ID
      let foundPos = -1;
      editor.state.doc.descendants((node, pos) => {
        if (node.attrs.id === focusedId || pos.toString() === focusedId) {
          foundPos = pos;
          return false;
        }
      });

      if (foundPos !== -1) {
        try {
          editor.commands.setNodeSelection(foundPos);
        } catch (e) {
          // Fallback to text selection if node selection fails
          editor.commands.setTextSelection(foundPos);
        }
      }
    }
  }, [focusedId, editor]);

  if (!editor) return null;

  return (
    <div className="w-full h-full bg-white relative">
      <FloatingToolbar editor={editor} />
      <EditorContent editor={editor} />
      
      {/* 🚀 REFINED VISUAL DROP INDICATOR (Border Style using Portal) */}
      {dropIndicator && createPortal(
        <div 
          style={{ 
            top: dropIndicator.top - (dropIndicator.side === 'bottom' ? 2 : 1), 
            left: dropIndicator.left, 
            width: dropIndicator.width 
          }} 
          className={cn(
            "fixed z-[9999] pointer-events-none transition-all duration-75 flex items-center",
            dropIndicator.side === 'inside' 
              ? "h-[2px] bg-indigo-400/50 border-t-2 border-dashed border-indigo-400"
              : "h-[3px] bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
          )}
        >
          {dropIndicator.side !== 'inside' && (
            <div className={cn(
              "absolute left-0 px-2 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-br-md rounded-tr-md flex items-center gap-1.5 shadow-2xl",
              dropIndicator.side === 'top' ? "-top-5" : "top-0"
            )}>
              <Plus className="w-3 h-3" />
              DROP {dropIndicator.side === 'top' ? 'ABOVE' : 'BELOW'} {dropIndicator.label}
            </div>
          )}
          {dropIndicator.side === 'inside' && (
             <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full border-2 border-indigo-200 shadow-lg backdrop-blur-md">
                INSERT INTO CONTAINER
             </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};