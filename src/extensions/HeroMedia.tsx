import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Image as ImageIcon } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const HeroMediaComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, bgImage, bgOverlay, bgOpacity, bgPosition, bgSize, borderRadius, minHeight } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this media container?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className="group/media relative my-8"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div
        className={cn(
          'relative transition-all duration-300 overflow-hidden cursor-pointer min-h-[300px] flex items-center justify-center p-12',
          selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-[1.5rem]' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4',
          isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
        )}
        style={{
          borderRadius: borderRadius || '1.5rem',
          minHeight: minHeight || '400px'
        }}
      >
        {/* Background Image Layer */}
        {bgImage && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundPosition: bgPosition || 'center',
              backgroundSize: bgSize || 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}

        {/* Overlay Layer */}
        {bgOverlay && (
          <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              backgroundColor: bgOverlay,
              opacity: bgOpacity !== undefined ? bgOpacity / 100 : 0.4
            }}
          />
        )}

        <ElementToolbar
          label="BANNER"
          selected={selected}
          isActive={editor.isActive('heroMedia')}
          node={node}
          groupName="media"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div className="relative z-10 w-full">
          <NodeViewContent className="w-full flex flex-col items-center justify-center gap-4" />

          {!bgImage && node.childCount === 0 && (
            <div className="flex flex-col items-center gap-4 text-slate-400 opacity-40">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest">Banner Backdrop</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter italic">Upload Background Image in Sidebar</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroMedia = Node.create({
  name: 'heroMedia',
  group: 'block heroBlock levelThreeElement',
  content: 'block*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      bgImage: { default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015' },
      bgOverlay: { default: '#0f172a' },
      bgOpacity: { default: 40 },
      bgPosition: { default: 'center' },
      bgSize: { default: 'cover' },
      borderRadius: { default: '1.5rem' },
      minHeight: { default: '400px' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-media"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-media' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroMediaComponent);
  },
});
