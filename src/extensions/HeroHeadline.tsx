import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

const HeroHeadlineComponent = (props: any) => {
  const { node, selected } = props;
  const { level, fontWeight, lineHeight, textAlign, color, letterSpacing, fontSizeScale } = node.attrs;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof props.getPos === 'function') {
      props.editor.commands.setNodeSelection(props.getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this headline?')) {
      const pos = props.getPos();
      if (typeof pos === 'number') {
        props.editor.view.dispatch(props.editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper 
      className="group/headline relative my-4"
      onDoubleClick={handleDoubleClick}
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/headline:opacity-100 transition-opacity z-50",
          selected && "opacity-100"
        )}
      >
        <div 
          data-drag-handle
          className="p-1.5 bg-indigo-600 text-white rounded-lg cursor-grab active:cursor-grabbing shadow-lg hover:scale-110 transition-transform"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className={cn(
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-8 rounded-lg" : "hover:ring-2 hover:ring-indigo-200 hover:ring-offset-8 rounded-lg"
      )}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300",
          (selected || props.editor.isActive('heroHeadline')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Headline"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={() => { if (typeof props.getPos === 'function') props.editor.commands.setNodeSelection(props.getPos()); }}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            HEADLINE {level?.toUpperCase()}
          </div>
          {selected && (
            <span className="bg-slate-900/10 backdrop-blur-md text-[8px] text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-tight ml-1">
              Editing
            </span>
          )}
        </div>

        <div 
          style={{ 
            color: color || 'inherit',
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
      lineHeight: { default: 'leading-[0.95]' },
      textAlign: { default: 'text-left' },
      color: { default: '#0f172a' },
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

  addCommands() {
    return {
      setHeadlineLevel: (level: string) => ({ commands }) => {
        return commands.updateAttributes('heroHeadline', { level });
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroHeadlineComponent);
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heroHeadline: {
      setHeadlineLevel: (level: string) => ReturnType;
    }
  }
}
