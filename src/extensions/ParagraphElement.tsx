import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

const ParagraphElementComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { textAlign, color, fontSizeScale, lineHeight } = node.attrs;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this paragraph?')) {
      const pos = props.getPos();
      if (typeof pos === 'number') {
        props.editor.view.dispatch(props.editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper 
      className="group/para relative my-4"
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/paragraph:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300 p-2",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl"
      )}>
        {/* Label & Actions */}
        <div className={cn(
          "absolute -top-8 left-0 flex items-center gap-2 pointer-events-none transition-all duration-300",
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <span className="bg-slate-800 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl">
            PARAGRAPH
          </span>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
          >
             <Trash2 className="w-3 h-3" />
          </button>
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
