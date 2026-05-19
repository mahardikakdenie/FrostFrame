import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2, Plus } from 'lucide-react';

const ButtonGroupComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { buttons, textAlign } = node.attrs;

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this button group?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const renderButton = (btn: any, index: number) => {
    const isPrimary = btn.variant === 'primary';
    
    if (isPrimary) {
      return (
        <button 
          key={index}
          style={{ backgroundColor: btn.color || 'var(--primary-color)' }}
          className="text-white font-black text-[10px] px-8 py-4 rounded-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 active:translate-y-0 text-center uppercase italic tracking-widest skew-x--10"
        >
          <div className="skew-x-10">{btn.text || 'BUTTON'}</div>
        </button>
      );
    }

    return (
      <button 
        key={index}
        style={{ borderColor: btn.color || 'var(--primary-color)', color: btn.color || 'var(--primary-color)' }}
        className="bg-white border-2 text-[10px] px-8 py-4 rounded-xl font-black hover:bg-slate-50 transition-all uppercase italic tracking-widest skew-x--10 shadow-xl"
      >
        <div className="skew-x-10">{btn.text || 'BUTTON'}</div>
      </button>
    );
  };

  return (
    <NodeViewWrapper className={cn(
      "group/buttons relative my-8",
      textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
    )}>
       {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/buttons:opacity-100 transition-opacity z-50",
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
        "flex flex-wrap gap-4 relative transition-all duration-300 p-2",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl"
      )}
      >
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-50",
          (selected || editor.isActive('heroButtonGroup')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Group"
          >
             <Trash2 className="w-3 h-3" />
          </button>
          <span className="bg-slate-900/40 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20">
            BUTTON GROUP
          </span>
        </div>
        
        {buttons.map((btn: any, idx: number) => renderButton(btn, idx))}
        
        {buttons.length === 0 && (
          <div className="text-[10px] font-black uppercase italic text-slate-400 p-4 border-2 border-dashed border-slate-100 rounded-xl w-full text-center">
            Empty Button Group
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const HeroButtonGroup = Node.create({
  name: 'heroButtonGroup',
  group: 'block heroBlock levelThreeElement',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      buttons: { 
        default: [
          { text: 'GET STARTED', link: '#', color: null, variant: 'primary' },
          { text: 'VIEW DEMO', link: '#', color: null, variant: 'secondary' }
        ],
        parseHTML: element => {
          const val = element.getAttribute('data-buttons');
          try { return JSON.parse(val || '[]'); } catch(e) { return []; }
        },
        renderHTML: attributes => ({
          'data-buttons': JSON.stringify(attributes.buttons)
        })
      },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-button-group"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-button-group' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonGroupComponent);
  },
});
