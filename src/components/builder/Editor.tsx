import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useUIStore } from '../../store/useUIStore';
import { debounce } from '../../lib/utils';
import { BuilderExtensions } from '../../extensions/registry';
import { buildSelectionPath, resolveSmartDropPosition } from './editorHelpers';
import { FloatingToolbar } from './FloatingToolbar';

export const Editor = () => {
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const activeNodeType = useUIStore((state) => state.activeNodeType);

  // 🚀 OPTIMIZATION (Fase 9): TEXT_NODES registry
  const TEXT_NODES = [
    'heroHeadline', 'heroSubheadline', 'heroBadge', 
    'paragraphElement', 'sectionHeading', 'featureCard',
    'layoutColumn' // Column allows text directly inside if not using elements
  ];

  const debouncedSave = useMemo(() => 
    debounce((editor: any) => {
      const json = editor.getJSON();
      localStorage.setItem('lando-builder-draft', JSON.stringify(json));
      console.log('Auto-saved draft to LocalStorage (debounced)');
    }, 1500), 
  []);

  const editor = useEditor({
    extensions: BuilderExtensions,
    content: (() => {
      const saved = localStorage.getItem('lando-builder-draft');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved draft", e);
        }
      }
      return {
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
      };
    })(),
    onUpdate: ({ editor }) => {
      debouncedSave(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      const path = buildSelectionPath(editor.state.doc, editor.state.selection);
      if (path.length > 0) {
        const leafNode = path[path.length - 1];
        setFocusedId(leafNode.id, 'element', path, leafNode.type);
      } else {
        setFocusedId(null, 'section', [], null);
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
          const type = event.dataTransfer?.getData('tiptap-node-type');
          if (type) {
            document.body.classList.add('is-dragging-' + type);
          }
          return false;
        },
        dragend: () => {
          document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '');
          return false;
        },
        dragover: (view, event) => {
          // Remove existing dragging-over classes
          const existing = document.querySelectorAll('.dragging-over');
          existing.forEach(el => el.classList.remove('dragging-over'));

          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (pos) {
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
          return false;
        },
        dragleave: () => {
           const existing = document.querySelectorAll('.dragging-over');
           existing.forEach(el => el.classList.remove('dragging-over'));
           return false;
        }
      },
      handleDrop(view, event, slice, moved) {
        document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '');
        
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
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full h-full bg-white relative">
      <FloatingToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
