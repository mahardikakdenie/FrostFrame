import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { MoveVertical } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const SpacerComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, height, marginTop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this spacer?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const currentHeight = (typeof height === 'object' && height !== null)
    ? (height[activeDevice] || '40px')
    : (height || '40px');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null)
    ? (marginTop[activeDevice] || '0px')
    : (marginTop || '0px');

  return (
    <NodeViewWrapper
      data-drag-handle
      className="group/spacer relative w-full"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
      }}
    >
      <div
        className={cn(
          'relative transition-all duration-300 flex items-center justify-center border-2 border-transparent',
          selected ? 'ring-2 ring-indigo-500 ring-offset-2 rounded-lg bg-indigo-50/20 border-dashed border-indigo-200' : 'hover:bg-slate-50/50 hover:border-dashed hover:border-slate-200 rounded-lg',
          isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
        )}
        style={{
          height: currentHeight,
          marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
        }}
      >
        <ElementToolbar
          label="SPACER"
          selected={selected}
          isActive={editor.isActive('spacerElement')}
          node={node}
          groupName="spacer"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div className="opacity-10 pointer-events-none flex flex-col items-center gap-1">
          <MoveVertical className="w-4 h-4" />
          <span className="text-[8px] font-black">{currentHeight}</span>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const SpacerElement = Node.create({
  name: 'spacerElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      height: {
        default: '40px',
        keepAttributes: true,
        parseHTML: element => element.getAttribute('data-height'),
        renderHTML: attributes => ({ 'data-height': typeof attributes.height === 'object' ? JSON.stringify(attributes.height) : attributes.height })
      },
      marginTop: { default: '0px' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="spacer-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'spacer-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SpacerComponent);
  },
});
