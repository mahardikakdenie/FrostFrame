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
import { FreeRowExtension } from '../../extensions/FreeRowExtension';
import { FreeColumnExtension } from '../../extensions/FreeColumnExtension';
import { StrictHeroRowExtension } from '../../extensions/StrictHeroRowExtension';
import { StrictHeroColumnExtension } from '../../extensions/StrictHeroColumnExtension';
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

export const Editor = () => {
  const setFocusedId = useUIStore((state) => state.setFocusedId);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heroHeadline') return 'ENTER HEADLINE...';
          if (node.type.name === 'heroSubheadline') return 'Enter subheadline description here...';
          if (node.type.name === 'heroBadge') return 'NEW RELEASE';
          return 'Start typing...';
        },
        showOnlyWhenEditable: true,
      }),
      LayoutSection,
      LayoutRow,
      LayoutColumn,
      FreeRowExtension,
      FreeColumnExtension,
      StrictHeroRowExtension,
      StrictHeroColumnExtension,
      HeroHeadline,
      HeroSubheadline,
      HeroBadge,
      HeroButtonGroup,
      HeroMedia,
      PricingSection,
      FeaturesSection,
      SectionHeading,
      SectionGrid,
      FeatureCard,
      TestimonialSection,
      FooterSection,
    ],
    content: `
      <section data-type="layout-section" padding="py-8">
        <div data-type="free-row" gridCols="1">
          <div data-type="free-column">
            <h1 data-type="hero-headline" style="text-align: center">Drag block from sidebar!</h1>
          </div>
        </div>
      </section>
    `,
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
        class: 'prose max-w-none focus:outline-none pb-32 transition-all duration-300',
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
      },
      handleDrop(view, event, _slice, moved) {
        document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '');
        if (!moved && event.dataTransfer) {
          const type = event.dataTransfer.getData('tiptap-node-type');
          const payloadStr = event.dataTransfer.getData('tiptap-variant-payload');
          
          if (type) {
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (coordinates) {
              const { pos } = coordinates;
              
              // Validate Hierarchy
              const resolvedPos = view.state.doc.resolve(pos);
              const parent = resolvedPos.parent;
              const parentType = parent.type.name;

              // Rule 1: Section only in Root
              if (type.includes('Section') && parentType !== 'doc') {
                return false;
              }

              // Rule 2: Row only in Section, Column, or Root
              if (type.includes('Row') && !parentType.includes('Section') && !parentType.toLowerCase().includes('column') && parentType !== 'doc') {
                return false;
              }

              // Rule 3: Column mapping
              if (type.toLowerCase().includes('column')) {
                if (!parentType.toLowerCase().includes('row')) return false;
                if (type === 'freeColumn' && parentType !== 'freeRow') return false;
                if (type === 'layoutColumn' && parentType !== 'layoutRow') return false;
                if (type === 'strictHeroColumn' && parentType !== 'strictHeroRow') return false;
              }

              // Rule 4: Elements only in Column or Card
              const isElement = ['heroHeadline', 'heroSubheadline', 'heroBadge', 'heroButtonGroup', 'heroMedia', 'featureCard'].includes(type);
              if (isElement && !parentType.toLowerCase().includes('column') && !parentType.toLowerCase().includes('grid') && !parentType.includes('Section')) {
                return false;
              }

              // If variant payload is provided, use it
              if (payloadStr) {
                try {
                  const content = JSON.parse(payloadStr);
                  if (parentType === 'doc' && !type.includes('Section')) {
                    const wrappedContent = {
                      type: 'layoutSection',
                      attrs: { id: crypto.randomUUID() },
                      content: [content]
                    };
                    (window as any).editor.chain().focus().insertContentAt(pos, wrappedContent).run();
                  } else {
                    (window as any).editor.chain().focus().insertContentAt(pos, content).run();
                  }
                  return true;
                } catch (e) {
                  console.error("Failed to parse variant payload", e);
                }
              }

              if (type === 'strictHeroRow') {
                const rowId = crypto.randomUUID();
                const content = {
                  type: 'strictHeroRow',
                  attrs: { id: rowId },
                  content: [
                    {
                      type: 'strictHeroColumn',
                      attrs: { role: 'content', id: crypto.randomUUID() },
                      content: [
                        { type: 'heroBadge', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW RELEASE' }] },
                        { type: 'heroHeadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'Strict Block Library' }] },
                        { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'This block is predefined.' }] },
                        { type: 'heroButtonGroup', attrs: { id: crypto.randomUUID() } }
                      ]
                    },
                    {
                      type: 'strictHeroColumn',
                      attrs: { role: 'media', id: crypto.randomUUID() },
                      content: [
                        { type: 'heroMedia', attrs: { id: crypto.randomUUID() } }
                      ]
                    }
                  ]
                };
                if (parentType === 'doc') {
                  const wrappedContent = {
                    type: 'layoutSection',
                    attrs: { id: crypto.randomUUID() },
                    content: [content]
                  };
                  (window as any).editor.chain().focus().insertContentAt(pos, wrappedContent).run();
                } else {
                  (window as any).editor.chain().focus().insertContentAt(pos, content).run();
                }
                return true;
              }

              if (type === 'freeRow') {
                const content = {
                  type: 'freeRow',
                  attrs: { id: crypto.randomUUID() },
                  content: [{ type: 'freeColumn', attrs: { id: crypto.randomUUID() } }, { type: 'freeColumn', attrs: { id: crypto.randomUUID() } }]
                };
                if (parentType === 'doc') {
                  const wrappedContent = {
                    type: 'layoutSection',
                    attrs: { id: crypto.randomUUID() },
                    content: [content]
                  };
                  (window as any).editor.chain().focus().insertContentAt(pos, wrappedContent).run();
                } else {
                  (window as any).editor.chain().focus().insertContentAt(pos, content).run();
                }
                return true;
              }

              // Default standard insertion
              const node = view.state.schema.nodes[type].createAndFill({ id: crypto.randomUUID() });
              if (node) {
                (window as any).editor.chain().focus().insertContentAt(pos, node.toJSON()).run();
              } else {
                (window as any).editor.chain().focus().insertContentAt(pos, { type, attrs: { id: crypto.randomUUID() } }).run();
              }
              return true;
            }
          }
        }
        return false;
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
    <div className="w-full h-full bg-white">
      <EditorContent editor={editor} />
    </div>
  );
};
