import { useEffect, useMemo, useState } from 'react';
import { useEditor } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';
import { useUIStore } from '../store/useUIStore';
import { debounce } from '../lib/utils';
import { BuilderExtensions } from '../extensions/registry';
import { buildSelectionPath, resolveSmartDropPosition } from '../components/builder/editorHelpers';
import { saveDraftToDB, getDraftFromDB, migrateFromLocalStorage } from '../lib/db';

const TEXT_NODES = [
  'heroHeadline', 'heroSubheadline', 'heroBadge', 
  'paragraphElement', 'sectionHeading', 'featureCard',
  'layoutColumn', 'doc'
];

export interface DropIndicatorState {
  top: number;
  left: number;
  width: number;
  side: 'top' | 'bottom' | 'inside';
  label: string;
}

/**
 * Custom hook to encapsulate Tiptap editor configuration and event handling.
 */
export const useEditorConfig = () => {
  const focusedId = useUIStore((state) => state.focusedId);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const isDragging = useUIStore((state) => state.isDragging);
  const draggedType = useUIStore((state) => state.draggedType);
  const setDragState = useUIStore((state) => state.setDragState);
  const inspectMode = useUIStore((state) => state.inspectMode);

  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState | null>(null);

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
      if (transaction && transaction.getMeta('isSidebarUpdate')) return;

      const path = buildSelectionPath(editor.state.doc, editor.state.selection);
      const leafNode = path.length > 0 ? path[path.length - 1] : null;
      
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
          const allowedKeys = ['Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Escape', 'Enter'];
          if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) {
            return false;
          }
          const { selection } = view.state;
          const parentNode = selection.$from.parent;
          const isTextNode = parentNode && TEXT_NODES.includes(parentNode.type.name);
          if (!isTextNode) {
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
            const nodeId = dragHandleEl.getAttribute('data-node-id');
            if (nodeId) {
              const wrapperEl = document.querySelector(`[data-node-id="${nodeId}"][data-node-view-wrapper]`) as HTMLElement | null;
              if (wrapperEl) {
                try {
                  const pmPos = view.posAtDOM(wrapperEl, 0);
                  const node = view.state.doc.nodeAt(pmPos);
                  if (node && node.type.spec.draggable && node.attrs.id === nodeId) {
                    type = node.type.name;
                    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, pmPos)));
                  } else {
                    const $pos = view.state.doc.resolve(pmPos);
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
                      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
                    }
                  }
                } catch { /* ignore */ }
              }
            } else {
              const wrapperEl = dragHandleEl.closest('[data-node-view-wrapper]') as HTMLElement | null;
              if (wrapperEl) {
                try {
                  const pmPos = view.posAtDOM(wrapperEl, 0);
                  const node = view.state.doc.nodeAt(pmPos);
                  if (node && node.type.spec.draggable) {
                    type = node.type.name;
                    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, pmPos)));
                  } else {
                    const $pos = view.state.doc.resolve(pmPos);
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
                      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
                    }
                  }
                } catch { /* ignore */ }
              }
            }
          }

          if (!type) {
            try {
              const wrapperEl = (target.closest('[data-node-view-wrapper]') as HTMLElement | null)
                ?? (target.hasAttribute?.('data-node-view-wrapper') ? target : null);
              if (wrapperEl) {
                const pmPos = view.posAtDOM(wrapperEl, 0);
                const node = view.state.doc.nodeAt(pmPos);
                if (node && node.type.spec.draggable) {
                  type = node.type.name;
                  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, pmPos)));
                } else {
                  const $pos = view.state.doc.resolve(pmPos);
                  for (let d = $pos.depth; d > 0; d--) {
                    const n = $pos.node(d);
                    if (n.type.spec.draggable) {
                      const nodePos = $pos.before(d);
                      type = n.type.name;
                      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
                      break;
                    }
                  }
                }
              }
            } catch { /* ignore */ }
          }

          if (!type) {
            const { selection } = view.state;
            if (selection instanceof NodeSelection) type = selection.node.type.name;
          }

          if (!type) type = event.dataTransfer?.getData('tiptap-node-type') || null;

          if (type) {
            setDragState(true, type);
            document.body.classList.add('is-dragging-' + type);
            (view as any).__dragSourceType = type;

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
              ghost.innerHTML = `<span style="font-size: 12px;">⚡</span><span>DRAGGING ${label}</span>`;
              document.body.appendChild(ghost);
              event.dataTransfer.setDragImage(ghost, 40, 20);
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
          if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';

          const scrollThreshold = 80;
          const scrollSpeed = 16;
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
              if (event.clientY < scrollThreshold) scrollContainer.scrollBy(0, -scrollSpeed);
              else if (window.innerHeight - event.clientY < scrollThreshold) scrollContainer.scrollBy(0, scrollSpeed);
            } else {
              if (event.clientY < scrollThreshold) window.scrollBy(0, -scrollSpeed);
              else if (window.innerHeight - event.clientY < scrollThreshold) window.scrollBy(0, scrollSpeed);
            }
          } catch { /* ignore */ }

          const existing = document.querySelectorAll('.dragging-over');
          existing.forEach(el => el.classList.remove('dragging-over'));

          const liveStore = useUIStore.getState();
          const dtType = event.dataTransfer?.types?.includes('tiptap-node-type') ? event.dataTransfer.getData('tiptap-node-type') : null;
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
          const isDraggingNow = liveStore.isDragging || dtType || document.body.className.includes('is-dragging');

          if (pos && isDraggingNow) {
            const match = document.body.className.match(/is-dragging-([a-zA-Z]+)/);
            const effectiveType = dtType || liveStore.draggedType || (match ? match[1] : 'paragraphElement');
            const { side, rect } = resolveSmartDropPosition(view, pos.pos, effectiveType, event.clientX, event.clientY);

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
        const existingHighlights = document.querySelectorAll('.dragging-over');
        existingHighlights.forEach(el => el.classList.remove('dragging-over'));
        setDropIndicator(null);
        
        let type = event.dataTransfer?.getData('tiptap-node-type');
        const payloadStr = event.dataTransfer?.getData('tiptap-variant-payload');
        
        if (!type && slice.content.childCount > 0) type = slice.content.child(0).type.name;
        if (!type) type = (view as any).__dragSourceType || null;
        if (!type) return false;

        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!coordinates) return false;

        const storedSourceType = (view as any).__dragSourceType as string | undefined;
        const isInternalMove = (moved && !!storedSourceType) || (!!storedSourceType && !payloadStr && view.state.selection instanceof NodeSelection && (view.state.selection as NodeSelection).node.type.spec.draggable === true && (view.state.selection as NodeSelection).node.type.name === storedSourceType);

        if (isInternalMove) {
          const { insertPos, parentType } = resolveSmartDropPosition(view, coordinates.pos, type, event.clientX, event.clientY);
          const { tr, selection } = view.state;
          const nodeToInsert = (selection instanceof NodeSelection) ? (selection as NodeSelection).node : (slice.content.childCount > 0 ? slice.content.child(0) : null);
          if (!nodeToInsert) return false;

          tr.delete(selection.from, selection.to);
          const mappedInsertPos = tr.mapping.map(insertPos);

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
          delete (view as any).__dragSourceType;
          return true;
        }

        delete (view as any).__dragSourceType;
        const { parentType, insertPos } = resolveSmartDropPosition(view, coordinates.pos, type, event.clientX, event.clientY);

        if (payloadStr) {
          try {
            const content = JSON.parse(payloadStr);
            (window as any).editor.chain().focus().insertContentAt(insertPos, content).run();
            return true;
          } catch (e) { console.error(e); }
        }

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

  useEffect(() => {
    if (editor) {
      (window as any).editor = editor;
      editor.setOptions({
        editorProps: { attributes: { contenteditable: (!inspectMode).toString() } }
      });
      const loadInitialContent = async () => {
        await migrateFromLocalStorage();
        const draft = await getDraftFromDB();
        if (draft && draft.content) editor.commands.setContent(draft.content);
      };
      loadInitialContent();
    }
  }, [editor, inspectMode]);

  useEffect(() => {
    if (!editor || !focusedId) return;
    const { selection } = editor.state;
    const currentId = selection instanceof NodeSelection 
      ? selection.node.attrs.id 
      : (selection.$from.parent.attrs.id || selection.$from.before().toString());

    if (currentId !== focusedId) {
      let foundPos = -1;
      editor.state.doc.descendants((node, pos) => {
        if (node.attrs.id === focusedId || pos.toString() === focusedId) {
          foundPos = pos;
          return false;
        }
      });
      if (foundPos !== -1) {
        try { editor.commands.setNodeSelection(foundPos); }
        catch { editor.commands.setTextSelection(foundPos); }
      }
    }
  }, [focusedId, editor]);

  return { editor, dropIndicator, isDragging, inspectMode };
};
