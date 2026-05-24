import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const ButtonGroupComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, buttons, textAlign } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

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
    const baseColor = btn.color || 'var(--primary-color)';

    if (isPrimary) {
      return (
        <button
          key={index}
          style={{ backgroundColor: baseColor, borderRadius: '0.75rem' }}
          className="text-white font-black text-[10px] px-8 py-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 active:translate-y-0 text-center uppercase italic tracking-widest skew-x--10 border-2 border-transparent"
        >
          <div className="skew-x-10">{btn.text || 'BUTTON'}</div>
        </button>
      );
    }

    return (
      <button
        key={index}
        style={{ 
          borderColor: baseColor, 
          color: baseColor,
          borderRadius: '0.75rem',
          backgroundColor: 'transparent'
        }}
        className="bg-white dark:bg-slate-900/40 border-2 text-[10px] px-8 py-4 font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase italic tracking-widest skew-x--10 shadow-xl"
      >
        <div className="skew-x-10">{btn.text || 'BUTTON'}</div>
      </button>
    );
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/buttons relative my-8',
        textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
      )}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className={cn(
        'flex flex-wrap gap-4 relative transition-all duration-300 p-2',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="BUTTON GROUP"
          selected={selected}
          isActive={editor.isActive('heroButtonGroup')}
          node={node}
          groupName="buttons"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

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
          try { return JSON.parse(val || '[]'); } catch (e) { return []; }
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
