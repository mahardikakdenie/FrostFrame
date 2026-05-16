import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useUIStore } from '../../store/useUIStore';
import { LayoutSection } from '../../extensions/LayoutSection';
import { LayoutRow } from '../../extensions/LayoutRow';
import { LayoutColumn } from '../../extensions/LayoutColumn';
import { HeroHeadline } from '../../extensions/HeroHeadline';
import { HeroSubheadline } from '../../extensions/HeroSubheadline';
import { HeroBadge } from '../../extensions/HeroBadge';
import { HeroButtonGroup } from '../../extensions/HeroButtonGroup';
import { HeroMedia } from '../../extensions/HeroMedia';
import { PricingSection } from '../../extensions/PricingSection';
import { FeaturesSection } from '../../extensions/FeaturesSection';
import { SectionHeading } from '../../extensions/SectionHeading';
import { SectionGrid } from '../../extensions/SectionGrid';
import { FeatureCard } from '../../extensions/FeatureCard';
import { TestimonialSection } from '../../extensions/TestimonialSection';
import { FooterSection } from '../../extensions/FooterSection';
import { ImageElement } from '../../extensions/ImageElement';
import { VideoElement } from '../../extensions/VideoElement';
import { DividerElement } from '../../extensions/DividerElement';
import { SpacerElement } from '../../extensions/SpacerElement';
import { ParagraphElement } from '../../extensions/ParagraphElement';
import { IconElement } from '../../extensions/IconElement';
import { Dropcursor } from '@tiptap/extension-dropcursor';

// @ts-ignore
import Document from '@tiptap/extension-document';
import { FloatingToolbar } from './FloatingToolbar';

export const Editor = () => {
  const setFocusedId = useUIStore((state) => state.setFocusedId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Dropcursor.configure({
        color: 'var(--primary-color)',
        width: 2,
      }),
      Document.extend({
        content: 'block+', // Allow any block at root to prevent strict schema crashes
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'doc') return 'DRAG A ROW FROM SIDEBAR TO START...';
          if (node.type.name === 'heroHeadline') return 'ENTER HEADLINE...';
          if (node.type.name === 'heroSubheadline') return 'Enter subheadline description here...';
          if (node.type.name === 'heroBadge') return 'NEW RELEASE';
          return '';
        },
        showOnlyWhenEditable: true,
      }),
      LayoutSection,
      LayoutRow,
      LayoutColumn,
      HeroHeadline,
      HeroSubheadline,
      HeroBadge,
      HeroButtonGroup,
      HeroMedia,
      ImageElement,
      VideoElement,
      DividerElement,
      SpacerElement,
      PricingSection,
      FeaturesSection,
      SectionHeading,
      SectionGrid,
      FeatureCard,
      TestimonialSection,
      FooterSection,
      ParagraphElement,
      IconElement,
    ],
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
    onSelectionUpdate: ({ editor }) => {
      const { selection, doc } = editor.state;
      
      const getPath = (from: number) => {
        const path: { id: string; type: string; label: string }[] = [];
        const resolved = doc.resolve(from);
        
        // Root to deepest node
        for (let depth = 0; depth <= resolved.depth; depth++) {
          const node = resolved.node(depth);
          if (node && node.type.name !== 'doc') {
            const pos = resolved.before(depth);
            const id = node.attrs?.id || pos.toString();
            
            // Only add if not already in path
            if (!path.some(p => p.id === id)) {
              path.push({
                id,
                type: node.type.name,
                label: node.type.name.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
              });
            }
          }
        }

        // Handle selected node explicitly for NodeSelection
        const selectedNode = (selection as any).node;
        if (selectedNode && selectedNode.type.name !== 'doc') {
          const pos = selection.from;
          const id = selectedNode.attrs?.id || pos.toString();
          if (!path.some(p => p.id === id)) {
            path.push({
              id,
              type: selectedNode.type.name,
              label: selectedNode.type.name.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
            });
          }
        }

        return path;
      };

      const path = getPath(selection.from);
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
            for (let d = nodePos.depth; d >= 0; d--) {
              const node = nodePos.node(d);
              if (node.type.name === 'layoutColumn') {
                const dom = view.nodeDOM(nodePos.before(d)) as HTMLElement;
                if (dom) {
                  dom.classList.add('dragging-over');
                }
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
        
        // Identify the node type being dropped
        let type = event.dataTransfer?.getData('tiptap-node-type');
        const payloadStr = event.dataTransfer?.getData('tiptap-variant-payload');
        
        // If it's an internal move, get the type from the slice
        if (!type && slice.content.childCount > 0) {
           type = slice.content.child(0).type.name;
        }

        if (!type) return false;

        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!coordinates) return false;

        const { pos } = coordinates;
        const resolvedPos = view.state.doc.resolve(pos);
        
        // Helper to find the nearest valid ancestor
        const findValidAncestor = () => {
          for (let depth = resolvedPos.depth; depth >= 0; depth--) {
            const node = resolvedPos.node(depth);
            const name = node.type.name.toLowerCase();
            if (name.includes('column') || name.includes('row') || name.includes('section') || name.includes('media') || name === 'doc') {
              return { node, depth, pos: depth === resolvedPos.depth ? pos : resolvedPos.after(depth + 1) };
            }
          }
          return null;
        };

        const ancestor = findValidAncestor();
        if (!ancestor) return false;

        let parentType = ancestor.node.type.name;
        let insertPos = ancestor.pos;

        const isRow = type.toLowerCase().includes('row');
        const isElement = [
          'heroHeadline', 'heroSubheadline', 'heroBadge', 'heroButtonGroup', 
          'heroMedia', 'featureCard', 'paragraphElement', 'iconElement', 
          'dividerElement', 'imageElement', 'videoElement', 'spacerElement'
        ].includes(type);

        // 🚀 SMART DROP REDIRECT V3 (Unified for Moves and New Drops)
        if ((isElement || isRow) && (parentType === 'layoutRow' || parentType === 'layoutSection')) {
            let targetRowNode = null;
            let targetRowPos = -1;

            if (parentType === 'layoutSection') {
              ancestor.node.forEach((child, offset) => {
                  if (child.type.name === 'layoutRow') {
                    const childStart = ancestor.pos + 1 + offset;
                    if (pos >= childStart && pos <= childStart + child.nodeSize) {
                        targetRowNode = child;
                        targetRowPos = childStart;
                    }
                  }
              });
              if (!targetRowNode && ancestor.node.childCount > 0) {
                  targetRowNode = ancestor.node.child(0);
                  targetRowPos = ancestor.pos + 1;
              }
            } else {
              targetRowNode = ancestor.node;
              targetRowPos = ancestor.pos;
            }

            if (targetRowNode && targetRowNode.childCount > 0) {
              const targetColNode = targetRowNode.child(0);
              parentType = 'layoutColumn';
              insertPos = targetRowPos + 1 + targetColNode.nodeSize - 1;
            }
        }

        // Logic for handling the actual drop/move
        if (moved) {
          // Internal move: Let ProseMirror handle the transaction but at our redirected position
          // We manually create the transaction to ensure our insertPos is respected
          const tr = view.state.tr;
          // Delete from old position (already handled by PM if we return false, but we want to return true)
          // To be safe and simple, we'll let PM handle internal moves if they are already in a valid container
          if (parentType === 'layoutColumn' || parentType === 'doc') {
             // If our redirect changed the position, we must handle it manually
             // But PM internal move is complex. Let's just return false for now if moved and in column
             return false; 
          }
        }

        // Handle External Drops or Redirected Internal Drops
        if (payloadStr) {
          try {
            const content = JSON.parse(payloadStr);
            (window as any).editor.chain().focus().insertContentAt(insertPos, content).run();
            return true;
          } catch (e) { console.error(e); }
        }

        // Standard Node Creation
        const node = view.state.schema.nodes[type].createAndFill({ id: crypto.randomUUID() });
        let content = node ? node.toJSON() : { type, attrs: { id: crypto.randomUUID() } };

        // Default content for new elements
        const defaultTextMap: Record<string, string> = {
          'heroHeadline': 'NEW LANDO HEADLINE',
          'heroSubheadline': 'The fastest way to build beautiful landing pages with absolute precision.',
          'heroBadge': 'NEW RELEASE',
        };
        if (defaultTextMap[type] && (!content.content || content.content.length === 0)) {
          content.content = [{ type: 'text', text: defaultTextMap[type] }];
        }

        if (parentType === 'doc' && !type.includes('Section') && !isRow) {
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
      
      // Auto-save logic: every 30 seconds
      const interval = setInterval(() => {
        const json = editor.getJSON();
        localStorage.setItem('lando-builder-draft', JSON.stringify(json));
        console.log('Auto-saved draft to LocalStorage');
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full h-full bg-white">
      <EditorContent editor={editor} />
    </div>
  );
};
