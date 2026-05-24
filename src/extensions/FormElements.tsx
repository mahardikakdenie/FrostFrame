import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const FormFieldWrapper = ({ 
  id, 
  label, 
  type, 
  selected, 
  getPos, 
  node, 
  editor, 
  children 
}: { 
  id: string, 
  label: string, 
  type: string, 
  selected: boolean, 
  getPos: () => number, 
  node: any, 
  editor: any, 
  children: React.ReactNode 
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
        "group/field relative my-4 w-full transition-all",
        (isHovered || selected) ? "z-[300]" : "z-10"
      )}
      onClick={handleSelectNode}
    >
      <div className={cn(
        "relative transition-all duration-300 p-2 rounded-xl",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 bg-indigo-50/30" : "hover:bg-slate-50/50",
        isHovered && "ring-2 ring-indigo-500/20 shadow-lg"
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

const InputComponent = (props: any) => {
  const { node } = props;
  const { placeholder, label, required, name } = node.attrs;

  return (
    <FormFieldWrapper {...props} label="INPUT FIELD" type="Input">
      <div className="flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-[10px] font-black text-slate-900 uppercase italic tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <input 
          type="text"
          name={name}
          placeholder={placeholder || 'Enter value...'}
          disabled
          className="w-full bg-white border-2 border-slate-900 px-4 py-3 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none skew-x-[-2deg]"
        />
      </div>
    </FormFieldWrapper>
  );
};

const TextAreaComponent = (props: any) => {
  const { node } = props;
  const { placeholder, label, required, name, rows } = node.attrs;

  return (
    <FormFieldWrapper {...props} label="TEXTAREA" type="TextArea">
      <div className="flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-[10px] font-black text-slate-900 uppercase italic tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <textarea 
          name={name}
          placeholder={placeholder || 'Enter message...'}
          rows={rows || 4}
          disabled
          className="w-full bg-white border-2 border-slate-900 px-4 py-3 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none skew-x-[-2deg] resize-none"
        />
      </div>
    </FormFieldWrapper>
  );
};

const CheckboxComponent = (props: any) => {
  const { node } = props;
  const { label, required, name } = node.attrs;

  return (
    <FormFieldWrapper {...props} label="CHECKBOX" type="Checkbox">
      <div className="flex items-center gap-3 text-left">
        <div className="relative w-5 h-5 border-2 border-slate-900 bg-white skew-x-[-2deg] flex items-center justify-center">
          {/* Mock Check */}
        </div>
        {label && (
          <label className="text-[10px] font-black text-slate-900 uppercase italic tracking-wider cursor-default">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
      </div>
    </FormFieldWrapper>
  );
};

export const InputElement = Node.create({
  name: 'inputElement',
  group: 'block',
  draggable: true,
  isolating: true,
  addAttributes() {
    return {
      id: { default: null },
      label: { default: 'FULL NAME' },
      placeholder: { default: 'Enter your full name...' },
      required: { default: false },
      name: { default: 'name' },
      type: { default: 'text' }
    };
  },
  parseHTML() { return [{ tag: 'div[data-type="input-element"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'input-element' }), 0]; },
  addNodeView() { return ReactNodeViewRenderer(InputComponent); },
});

export const TextAreaElement = Node.create({
  name: 'textareaElement',
  group: 'block',
  draggable: true,
  isolating: true,
  addAttributes() {
    return {
      id: { default: null },
      label: { default: 'MESSAGE' },
      placeholder: { default: 'How can we help you?' },
      required: { default: false },
      name: { default: 'message' },
      rows: { default: 4 }
    };
  },
  parseHTML() { return [{ tag: 'div[data-type="textarea-element"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'textarea-element' }), 0]; },
  addNodeView() { return ReactNodeViewRenderer(TextAreaComponent); },
});

export const CheckboxElement = Node.create({
  name: 'checkboxElement',
  group: 'block',
  draggable: true,
  isolating: true,
  addAttributes() {
    return {
      id: { default: null },
      label: { default: 'I AGREE TO THE TERMS' },
      required: { default: false },
      name: { default: 'terms' }
    };
  },
  parseHTML() { return [{ tag: 'div[data-type="checkbox-element"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'checkbox-element' }), 0]; },
  addNodeView() { return ReactNodeViewRenderer(CheckboxComponent); },
});
