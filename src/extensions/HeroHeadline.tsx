import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const HeroHeadlineComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, level, fontWeight, lineHeight, textAlign, color, letterSpacing, fontSizeScale, fontStyle, transform, textTransform, fontFamily } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this headline?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className="group/headline relative my-4"
    >
      <div className={cn(
        'relative transition-all duration-300',
        selected ? 'ring-2 ring-indigo-500 ring-offset-8 rounded-lg' : 'hover:ring-2 hover:ring-indigo-200 hover:ring-offset-8 rounded-lg',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label={`HEADLINE ${level?.toUpperCase() ?? 'H1'}`}
          selected={selected}
          isActive={editor.isActive('heroHeadline')}
          node={node}
          groupName="headline"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            color: color || 'var(--secondary-color)',
            fontFamily: fontFamily || 'var(--font-heading)',
            letterSpacing: letterSpacing || 'normal',
            ...getFontSize()
          }}
          className={cn(
            'outline-none transition-all duration-300 min-h-[1em]',
            fontStyle || 'italic',
            transform || ((level === 'h1' || level === 'h2') ? 'skew-x-[-2deg]' : ''),
            textTransform || ((level === 'h1' || level === 'h2') ? 'uppercase' : ''),
            fontWeight || 'font-black',
            lineHeight || 'leading-tight',
            textAlign || 'text-left',
            level === 'h1' && !fontSizeScale && 'text-6xl tracking-tight',
            level === 'h2' && !fontSizeScale && 'text-5xl tracking-tight',
            level === 'h3' && !fontSizeScale && 'text-4xl tracking-tight',
            level === 'h4' && !fontSizeScale && 'text-3xl tracking-tight',
            level === 'h5' && !fontSizeScale && 'text-2xl tracking-normal',
            level === 'h6' && !fontSizeScale && 'text-xl tracking-normal',
            level === 'p' && !fontSizeScale && 'text-xl font-medium text-slate-500 not-italic'
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroHeadline = Node.create({
  name: 'heroHeadline',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      level: { default: 'h1' },
      fontWeight: { default: 'font-black' },
      lineHeight: { default: 'leading-[0.85]' },
      textAlign: { default: 'text-left' },
      color: { default: null },
      letterSpacing: { default: null },
      fontSizeScale: { default: null },
      fontStyle: { default: null },
      transform: { default: null },
      textTransform: { default: null },
      fontFamily: { default: null }
    };
  },

  parseHTML() {
    return [
      { tag: 'h1[data-type="hero-headline"]', getAttrs: () => ({ level: 'h1' }) },
      { tag: 'h2[data-type="hero-headline"]', getAttrs: () => ({ level: 'h2' }) },
      { tag: 'h3[data-type="hero-headline"]', getAttrs: () => ({ level: 'h3' }) },
      { tag: 'h4[data-type="hero-headline"]', getAttrs: () => ({ level: 'h4' }) },
      { tag: 'h5[data-type="hero-headline"]', getAttrs: () => ({ level: 'h5' }) },
      { tag: 'h6[data-type="hero-headline"]', getAttrs: () => ({ level: 'h6' }) },
      { tag: 'p[data-type="hero-headline"]', getAttrs: () => ({ level: 'p' }) },
      { tag: 'div[data-type="hero-headline"]', getAttrs: () => ({ level: 'h1' }) },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level || 'h1';
    return [level, mergeAttributes(HTMLAttributes, { 'data-type': 'hero-headline' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroHeadlineComponent);
  },
});
