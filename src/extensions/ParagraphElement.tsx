import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const ParagraphElementComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, textAlign, color, fontSizeScale, lineHeight } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this paragraph?')) {
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
      className="group/para relative my-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={cn(
        "relative transition-all duration-300 p-2",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl shadow-2xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
      )}>
        {/* Badge Label & Actions (Top-Right Standard) */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-50",
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Paragraph"
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
          >
             <ArrowUp className="w-3 h-3" />
          </button>

          <div 
            onClick={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
            className="bg-slate-900/40 backdrop-blur-md text-[9px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer pointer-events-auto"
          >
            PARAGRAPH
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
            color: color || '#475569',
            fontSize: fontSizeScale ? `${fontSizeScale}rem` : '1rem'
          }}
          className={cn(
            "outline-none transition-all duration-300 min-h-[1.5em] leading-relaxed",
            textAlign || 'text-left'
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const ParagraphElement = Node.create({
  name: 'paragraphElement',
  group: 'block levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      textAlign: { default: 'text-left' },
      color: { default: '#475569' },
      fontSizeScale: { default: 1 },
      lineHeight: { default: 'relaxed' }
    };
  },

  parseHTML() {
    return [{ tag: 'p[data-type="paragraph-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-type': 'paragraph-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ParagraphElementComponent);
  },
});
