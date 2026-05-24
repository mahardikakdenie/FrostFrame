import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/useUIStore';
import { ElementToolbar } from '../utils/ElementToolbar';
import { createMoveHandler } from '../utils/nodeMove';

interface FormFieldWrapperProps {
  id: string;
  label: string;
  type: string;
  selected: boolean;
  getPos: () => number;
  node: any;
  editor: any;
  children: React.ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ 
  id, 
  label, 
  type, 
  selected, 
  getPos, 
  node, 
  editor, 
  children 
}) => {
  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleSelectNode = () => {
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: `Delete ${type}`,
      message: `Are you sure you want to remove this ${type.toLowerCase()}?`,
      variant: 'danger',
      onConfirm: () => {
        const pos = getPos();
        if (typeof pos === 'number') {
          editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
        }
      }
    });
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        "group/field relative my-6 w-full transition-all",
        (isHovered || selected) ? "z-[300]" : "z-10"
      )}
      onClick={handleSelectNode}
    >
      <div className={cn(
        "relative transition-all duration-500 p-4 rounded-[2rem] border-2",
        selected 
          ? "border-indigo-500/40 bg-indigo-500/5 dark:bg-indigo-500/10 backdrop-blur-sm shadow-[0_20px_50px_rgba(79,70,229,0.15)]" 
          : "border-transparent hover:bg-slate-100/40 dark:hover:bg-slate-800/40 hover:backdrop-blur-sm",
        isHovered && !selected && "border-indigo-500/10 shadow-xl"
      )}>
        <ElementToolbar
          label={label}
          selected={selected}
          isActive={selected}
          node={node}
          groupName="field"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={handleSelectNode}
        />

        {children}
      </div>
    </NodeViewWrapper>
  );
};
