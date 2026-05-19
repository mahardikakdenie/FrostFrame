import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const HeroSubheadlineComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, fontWeight, lineHeight, textAlign, color, letterSpacing, fontSizeScale } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
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
    <NodeViewWrapper className="group/subheadline relative my-4" onClick={(e) => e.stopPropagation()}>
      <div className={cn(
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-6 rounded-lg shadow-2xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-6 rounded-lg",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
      )}>
        {/* Badge Label & Actions (Top-Right Standard) */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-50",
          (selected || editor.isActive('heroSubheadline')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this subtitle?')) {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
                }
              }
            }}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Subtitle"
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
            SUBTITLE
          </div>

          <div 
            data-drag-handle
            className="bg-slate-900/40 backdrop-blur-md text-white p-1 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl border border-white/20"
          >
            <GripVertical className="w-3 h-3" />
          </div>
        </div>

        <div 
          style={{ 
            color: color || '#64748b',
            letterSpacing: letterSpacing || '0.1em',
            ...getFontSize()
          }}
          className={cn(
            "text-sm leading-relaxed font-black max-w-lg transition-all duration-300 outline-none min-h-[1.5em] uppercase opacity-80",
            fontWeight,
            lineHeight,
            textAlign
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroSubheadline = Node.create({
  name: 'heroSubheadline',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      fontWeight: { default: 'font-black' },
      lineHeight: { default: 'leading-relaxed' },
      textAlign: { default: 'text-left' },
      color: { default: '#64748b' },
      letterSpacing: { default: '0.1em' },
      fontSizeScale: { default: null }
    };
  },

  parseHTML() {
    return [{ tag: 'p[data-type="hero-subheadline"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-subheadline' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroSubheadlineComponent);
  },
});
