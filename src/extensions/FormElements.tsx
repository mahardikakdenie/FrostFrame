import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InputComponent } from './form/InputComponent';
import { TextAreaComponent } from './form/TextAreaComponent';
import { CheckboxComponent } from './form/CheckboxComponent';

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
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'input-element' })]; },
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
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'textarea-element' })]; },
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
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'checkbox-element' })]; },
  addNodeView() { return ReactNodeViewRenderer(CheckboxComponent); },
});
