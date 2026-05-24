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
  const inspectMode = useUIStore((state) => state.inspectMode);

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
          const target = event.target as HTMLElement;
          const dragHandleEl = target.closest('[data-drag-handle]') as HTMLElement | null;

          let type: string | null = null;

          if (dragHandleEl) {
            // Check if grip has data-node-id (for ElementToolbar grips outside wrapper)
            const nodeId = dragHandleEl.getAttribute('data-node-id');
            if (nodeId) {
              // Find wrapper by data-node-id
              const wrapperEl = document.querySelector(`[data-node-id="${nodeId}"][data-node-view-wrapper]`) as HTMLElement | null;
              if (wrapperEl) {
                try {
                  const pmPos = view.posAtDOM(wrapperEl, 0);
                  const node = view.state.doc.nodeAt(pmPos);
                  // Check if the node directly at the position is the target leaf node
                  if (node && node.type.spec.draggable && node.attrs.id === nodeId) {
                    type = node.type.name;
                    const sel = NodeSelection.create(view.state.doc, pmPos);
                    view.dispatch(view.state.tr.setSelection(sel));
                  } else {
                    const $pos = view.state.doc.resolve(pmPos);
                    // Search from deepest (leaf) to root to find the target node first
                    let nodePos = -1;
                    for (let d = $pos.depth; d > 0; d--) {
                      const n = $pos.node(d);
                      if (n.type.spec.draggable && n.attrs.id === nodeId) {
                        nodePos = $pos.before(d);
                        type = n.type.name;
                        break;
                      }
                    }
                    if (nodePos >= 0 && type) {
                      const sel = NodeSelection.create(view.state.doc, nodePos);
                      view.dispatch(view.state.tr.setSelection(sel));
                    }
                  }
                } catch { /* ignore */ }
              }
            } else {
              // Original path: grip is inside wrapper
              const wrapperEl = dragHandleEl.closest('[data-node-view-wrapper]') as HTMLElement | null;
              if (wrapperEl) {
                try {
                  const pmPos = view.posAtDOM(wrapperEl, 0);
                  const node = view.state.doc.nodeAt(pmPos);
                  // Check if the node directly at the position is the target leaf node
                  if (node && node.type.spec.draggable) {
                    type = node.type.name;
                    const sel = NodeSelection.create(view.state.doc, pmPos);
                    view.dispatch(view.state.tr.setSelection(sel));
                  } else {
                    const $pos = view.state.doc.resolve(pmPos);
                    // Search from deepest to root
                    let nodePos = -1;
                    for (let d = $pos.depth; d > 0; d--) {
                      const n = $pos.node(d);
                      if (n.type.spec.draggable) {
                        nodePos = $pos.before(d);
                        type = n.type.name;
                        break;
                      }
                    }
                    if (nodePos >= 0 && type) {
                      const sel = NodeSelection.create(view.state.doc, nodePos);
                      view.dispatch(view.state.tr.setSelection(sel));
                    }
                  }
                } catch { /* ignore */ }
              }
            }
          }

          // Fallback: resolve from event.target directly
          if (!type) {
            try {
              const wrapperEl = (target.closest('[data-node-view-wrapper]') as HTMLElement | null)
                ?? (target.hasAttribute?.('data-node-view-wrapper') ? target : null);
              if (wrapperEl) {
                const pmPos = view.posAtDOM(wrapperEl, 0);
                const node = view.state.doc.nodeAt(pmPos);
                // Check if the node directly at the position is the target leaf node
                if (node && node.type.spec.draggable) {
                  type = node.type.name;
                  const sel = NodeSelection.create(view.state.doc, pmPos);
                  view.dispatch(view.state.tr.setSelection(sel));
                } else {
                  const $pos = view.state.doc.resolve(pmPos);
                  for (let d = $pos.depth; d > 0; d--) {
                    const n = $pos.node(d);
                    if (n.type.spec.draggable) {
                      const nodePos = $pos.before(d);
                      type = n.type.name;
                      const sel = NodeSelection.create(view.state.doc, nodePos);
                      view.dispatch(view.state.tr.setSelection(sel));
                      break;
                    }
                  }
                }
              }
            } catch { /* ignore */ }
          }

          // Fallback: check existing NodeSelection
          if (!type) {
            const { selection } = view.state;
            if (selection instanceof NodeSelection) {
              type = selection.node.type.name;
            }
          }

          // Also check dataTransfer for external drags
          if (!type) {
            type = event.dataTransfer?.getData('tiptap-node-type') || null;
          }

          if (type) {
            setDragState(true, type);
            document.body.classList.add('is-dragging-' + type);
            (view as any).__dragSourceType = type;

            // ── PREMIUM CUSTOM DRAG PREVIEW (GLASSMORPHISM GHOST) ───────────
            if (event.dataTransfer) {
              const label = type.replace('Element', '').replace(/([A-Z])/g, ' $1').trim().toUpperCase();
              
              const ghost = document.createElement('div');
              ghost.style.position = 'absolute';
              ghost.style.top = '-9999px';
              ghost.style.left = '-9999px';
              ghost.style.padding = '10px 20px';
              ghost.style.background = 'rgba(15, 23, 42, 0.85)';
              ghost.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              ghost.style.color = '#ffffff';
              ghost.style.borderRadius = '99px';
              ghost.style.fontSize = '10px';
              ghost.style.fontWeight = '900';
              ghost.style.letterSpacing = '0.15em';
              ghost.style.fontStyle = 'italic';
              ghost.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)';
              ghost.style.pointerEvents = 'none';
              ghost.style.zIndex = '99999';
              ghost.style.display = 'flex';
              ghost.style.alignItems = 'center';
              ghost.style.gap = '8px';
              ghost.style.fontFamily = 'var(--font-heading, sans-serif)';
              
              // Custom emoji/icon and uppercase styled text
              ghost.innerHTML = `
                <span style="font-size: 12px;">⚡</span>
                <span>DRAGGING ${label}</span>
              `;
              
              document.body.appendChild(ghost);
              
              // Set the custom drag ghost image positioned exactly under the cursor
              event.dataTransfer.setDragImage(ghost, 40, 20);
              
              // Instantly cleanup from DOM so it doesn't linger
              setTimeout(() => ghost.remove(), 0);
            }
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

          // ── AUTO SCROLL ON DRAG OVER VIEWPORT EDGES ──────────────────────
          const scrollThreshold = 80; // pixels from the edge of the viewport
          const scrollSpeed = 16; // pixels to scroll per dragover tick

          const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
            if (!node) return null;
            if (node.scrollHeight > node.clientHeight) {
              const overflowY = window.getComputedStyle(node).overflowY;
              if (overflowY === 'auto' || overflowY === 'scroll') return node;
            }
            return getScrollParent(node.parentElement);
          };

          try {
            const scrollContainer = getScrollParent(view.dom);
            if (scrollContainer) {
              if (event.clientY < scrollThreshold) {
                scrollContainer.scrollBy(0, -scrollSpeed);
              } else if (window.innerHeight - event.clientY < scrollThreshold) {
                scrollContainer.scrollBy(0, scrollSpeed);
              }
            } else {
              if (event.clientY < scrollThreshold) {
                window.scrollBy(0, -scrollSpeed);
              } else if (window.innerHeight - event.clientY < scrollThreshold) {
                window.scrollBy(0, scrollSpeed);
              }
            }
          } catch { /* ignore */ }

          // Remove existing dragging-over classes
          const existing = document.querySelectorAll('.dragging-over');
          existing.forEach(el => el.classList.remove('dragging-over'));

          // 🔑 FIX: Read live store state — the dragover closure is created once
          // at useEditor() init and never recreates, so React state is always stale here.
          const liveStore = useUIStore.getState();
          const liveDragging = liveStore.isDragging;
          const liveDraggedType = liveStore.draggedType;

          // Also check dataTransfer directly — for external (sidebar) drags the
          // browser populates this even before handleDrop fires.
          const dtType = event.dataTransfer?.types?.includes('tiptap-node-type')
            ? event.dataTransfer.getData('tiptap-node-type')
            : null;

          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });

          const isDraggingNow = liveDragging || dtType || document.body.className.includes('is-dragging');

          if (pos && isDraggingNow) {
            const match = document.body.className.match(/is-dragging-([a-zA-Z]+)/);
            const effectiveType = dtType || liveDraggedType || (match ? match[1] : 'paragraphElement');

            const { insertPos, side, rect } = resolveSmartDropPosition(view, pos.pos, effectiveType, event.clientX, event.clientY);

            if (rect) {
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
            } else {
              // rect is null — still clear stale indicator
              setDropIndicator(null);
            }

            const nodePos = view.state.doc.resolve(pos.pos);
            for (let d = nodePos.depth; d >= 0; d--) {
              const node = nodePos.node(d);
              if (node.type.name === 'layoutColumn') {
                const dom = view.nodeDOM(nodePos.before(d)) as HTMLElement;
                if (dom && side === 'inside') dom.classList.add('dragging-over');
                break;
              }
            }
          }
          return true;
        },
        dragleave: (view, event) => {
           // Only clear when cursor truly leaves the editor container,
           // not when it crosses internal element boundaries.
           const editorEl = view.dom.closest('.ProseMirror') || view.dom;
           const related = event.relatedTarget as Node | null;
           if (related && editorEl.contains(related)) return false;
           const existing = document.querySelectorAll('.dragging-over');
           existing.forEach(el => el.classList.remove('dragging-over'));
           setDropIndicator(null);
           return false;
        }
      },
        handleDrop(view, event, slice, moved) {
          // Cleanup
          const existingHighlights = document.querySelectorAll('.dragging-over');
          existingHighlights.forEach(el => el.classList.remove('dragging-over'));
          setDropIndicator(null);
          
          let type = event.dataTransfer?.getData('tiptap-node-type');
          const payloadStr = event.dataTransfer?.getData('tiptap-variant-payload');
          
          // For internal moves (moved=true), get type from the slice itself
          if (!type && slice.content.childCount > 0) {
            type = slice.content.child(0).type.name;
          }
          // Also check the stored drag type from dragstart
          if (!type) {
            type = (view as any).__dragSourceType || null;
          }

          if (!type) return false;

          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (!coordinates) return false;

          // ── INTERNAL MOVE DETECTION ───────────────────────────────────────
          // ProseMirror sets moved=true only when it owns the full drag lifecycle.
          // For Image/Video (and elements where native browser drag interferes),
          // moved can be false even for internal repositions.
          // We detect internal moves by checking __dragSourceType (set in dragstart)
          // AND verifying the current selection is a NodeSelection on a draggable node.
          const storedSourceType = (view as any).__dragSourceType as string | undefined;

          const isInternalMove = (() => {
            // Classic ProseMirror internal move
            if (moved && storedSourceType) return true;
            // Fallback: dragstart stored a type AND current selection IS a NodeSelection
            // on a draggable node (meaning dragstart correctly selected the node)
            if (storedSourceType && !payloadStr) {
              const { selection } = view.state;
              if (selection instanceof NodeSelection) {
                const selNode = (selection as NodeSelection).node;
                return selNode.type.spec.draggable === true && selNode.type.name === storedSourceType;
              }
            }
            return false;
          })();

          // ── INTERNAL MOVE (element already exists in editor) ─────────────────
          if (isInternalMove) {
            // Resolve the target insertion position on the ORIGINAL state
            // (before any deletion). This gives us the semantic position.
            const { insertPos, parentType } = resolveSmartDropPosition(
              view, coordinates.pos, type, event.clientX, event.clientY, coordinates.inside
            );

            // Build transaction:
            //  1. Get the actual node to insert from selection (memory), fallback to slice
            //  2. Delete the selection (original node)
            //  3. Map insertPos through the deletion so it stays valid
            //  4. Insert the node at the mapped position
            const { tr, selection } = view.state;
            const draggedFrom = selection.from;
            const draggedTo = selection.to;

            const nodeToInsert = (selection instanceof NodeSelection)
              ? (selection as NodeSelection).node
              : slice.content.childCount > 0
                ? slice.content.child(0)
                : null;

            if (!nodeToInsert) return false;

            // Apply the deletion step first
            tr.delete(draggedFrom, draggedTo);

            // Map the target position: if target was after the deleted range,
            // positions will have shifted left by (draggedTo - draggedFrom).
            // tr.mapping handles this correctly.
            const mappedInsertPos = tr.mapping.map(insertPos);

            // For block nodes that need column wrapping (doc-level drop),
            // wrap them appropriately
            if (parentType === 'doc' && !type.includes('Section') && !type.toLowerCase().includes('row')) {
              const wrappedContent = {
                type: 'layoutRow',
                attrs: { id: crypto.randomUUID(), displayType: 'flex', padding: 'py-12' },
                content: [{ type: 'layoutColumn', attrs: { id: crypto.randomUUID() }, content: [nodeToInsert.toJSON()] }]
              };
              tr.insert(mappedInsertPos, view.state.schema.nodeFromJSON(wrappedContent));
            } else {
              tr.insert(mappedInsertPos, nodeToInsert);
            }

            view.dispatch(tr);
            // Clean up stored drag type
            delete (view as any).__dragSourceType;
            return true;
          }

          // ── EXTERNAL DROP (new element from library) ──────────────────────
          delete (view as any).__dragSourceType;
          const { parentType, insertPos } = resolveSmartDropPosition(view, coordinates.pos, type, event.clientX, event.clientY, coordinates.inside);

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
      
      // 🚀 SYNC: Toggle contenteditable based on inspectMode
      editor.setOptions({
        editorProps: {
          attributes: {
            contenteditable: (!inspectMode).toString(),
          }
        }
      });
      
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
    <div className="w-full h-full bg-[#fcfdfe] dark:bg-slate-900 relative min-h-screen">
      {/* ... (background code remains unchanged) ... */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Glows (Mesh Gradient Style) - Improved Light Mode Colors */}
        <div className="absolute -top-[5%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 dark:bg-indigo-950/20 blur-[120px] animate-pulse duration-[12s]" />
        <div className="absolute top-[15%] -right-[5%] w-[50%] h-[50%] rounded-full bg-purple-100/30 dark:bg-rose-950/10 blur-[100px] animate-pulse duration-[8s]" />
        <div className="absolute -bottom-[15%] left-[10%] w-[60%] h-[60%] rounded-full bg-amber-50/40 dark:bg-slate-800/10 blur-[120px]" />
        
        {/* 🌫️ PREMIUM NOISE TEXTURE: Gives it that 'physical' frosted feel */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Modern Dot Grid Layer - Better contrast for Light Mode */}
        <div 
          className="absolute inset-0 opacity-[0.5] dark:opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* Central Stage Guide (Subtle Highlight for the main area) */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-6xl border-x border-slate-200/30 dark:border-slate-800/20 bg-white/10 dark:bg-transparent" />
      </div>

      <div className="relative z-10 w-full h-full">
        {!inspectMode && !isDragging && <FloatingToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      
      {/* ─────────────────────────────────────────────────────────────────
          🚀 DROP INDICATOR: LINE for top/bottom, GHOST BOX for inside
          ───────────────────────────────────────────────────────────────── */}

      {/* LINE INDICATOR — cursor-aware: appears exactly above or below the target element */}
      {dropIndicator && dropIndicator.side !== 'inside' && createPortal(
        <div
          data-drop-ghost
          style={{
            position: 'fixed',
            top: dropIndicator.top - 2,
            left: dropIndicator.left,
            width: dropIndicator.width,
            height: 4,
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 50%, #a78bfa 100%)',
            borderRadius: 4,
            boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 16px 4px rgba(99,102,241,0.55)',
            transition: 'top 80ms ease-out, width 80ms ease-out',
          }}
        >
          {/* Left endpoint dot */}
          <div style={{
            position: 'absolute',
            left: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#6366f1',
            boxShadow: '0 0 10px 3px rgba(99,102,241,0.7)',
            border: '2px solid white',
          }} />

          {/* Centre label pill */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: -22,
            transform: 'translateX(-50%)',
            background: '#6366f1',
            color: 'white',
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            padding: '3px 10px',
            borderRadius: 99,
            boxShadow: '0 2px 12px rgba(99,102,241,0.5)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {dropIndicator.side === 'top' ? `↑ ${dropIndicator.label}` : `↓ ${dropIndicator.label}`}
          </div>

          {/* Right endpoint dot */}
          <div style={{
            position: 'absolute',
            right: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#a78bfa',
            boxShadow: '0 0 8px 2px rgba(167,139,250,0.6)',
          }} />
        </div>,
        document.body
      )}

      {/* GHOST BOX INDICATOR — only for empty containers (inside) */}
      {dropIndicator && dropIndicator.side === 'inside' && createPortal(
        <div
          data-drop-ghost
          style={{
            position: 'fixed',
            top: dropIndicator.top - 60,
            left: dropIndicator.left,
            width: dropIndicator.width,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className={cn(
            "min-h-[120px] rounded-[2rem]",
            "flex flex-col items-center justify-center gap-3 overflow-hidden",
            "border-2 border-dashed border-indigo-500 bg-indigo-50/40 dark:bg-indigo-900/20",
            "backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Plus className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] italic leading-none">
                INSERT {dropIndicator.label}
              </span>
              <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                Adding to empty container
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};