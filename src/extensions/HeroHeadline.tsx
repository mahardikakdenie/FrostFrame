import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const HeroHeadlineComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, level, fontWeight, lineHeight, textAlign, color, letterSpacing, fontSizeScale } = node.attrs;

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

  const handleMove = (direction: 'up' | 'down') => (e: React.MouseEvent) => {
    e.stopPropagation();
    const pos = getPos();
    if (typeof pos !== 'number') return;

    const { doc } = editor.state;
    const $pos = doc.resolve(pos);
    const parent = $pos.parent;
    const index = $pos.index();

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parent.childCount) return;

    const otherNode = parent.child(targetIndex);
    const targetPos = direction === 'up' 
      ? pos - otherNode.nodeSize 
      : pos + node.nodeSize;

    editor.chain()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .insertContentAt(targetPos, node.toJSON())
      .setNodeSelection(targetPos)
      .focus()
      .run();
  };

  return (
    <NodeViewWrapper 
      className="group/headline relative my-4"
    >
      <div className={cn(
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-8 rounded-lg" : "hover:ring-2 hover:ring-indigo-200 hover:ring-offset-8 rounded-lg",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
      )}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-50",
          (selected || editor.isActive('heroHeadline')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Headline"
          >
             <Trash2 className="w-3 h-3" />
          </button>
          
          <button 
            onClick={handleMove('down')}
            className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Move Down"
          >
             <ArrowDown className="w-3 h-3" />
          </button>
          
          <button 
            onClick={handleMove('up')}
            className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Move Up"
          >
             <ArrowUp className="w-3 h-3" />
          </button>

          <div 
            onClick={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
            className="bg-slate-900/40 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer pointer-events-auto"
          >
            HEADLINE {level?.toUpperCase()}
          </div>
          
          <div 
            data-drag-handle
            className="bg-slate-900/40 backdrop-blur-md text-white p-1 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl border border-white/20"
          >
            <GripVertical className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            color: color || 'var(--secondary-color)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: letterSpacing || 'normal',
            ...getFontSize()
          }}
          className={cn(
            "outline-none transition-all duration-300 min-h-[1em] italic",
            fontWeight || 'font-black',
            lineHeight || 'leading-tight',
            textAlign || 'text-left',
            level === 'h1' && !fontSizeScale && "text-6xl tracking-tight uppercase skew-x-[-2deg]",
            level === 'h2' && !fontSizeScale && "text-5xl tracking-tight uppercase skew-x-[-2deg]",
            level === 'h3' && !fontSizeScale && "text-4xl tracking-tight uppercase",
            level === 'h4' && !fontSizeScale && "text-3xl tracking-tight",
            level === 'h5' && !fontSizeScale && "text-2xl tracking-normal",
            level === 'h6' && !fontSizeScale && "text-xl tracking-normal",
            level === 'p' && !fontSizeScale && "text-xl font-medium text-slate-500 not-italic"
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
      fontSizeScale: { default: null }
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
