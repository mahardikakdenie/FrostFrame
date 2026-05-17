import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import * as LucideIcons from 'lucide-react';
import { Trash2, GripVertical } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const IconComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { iconName, size, color, marginTop, textAlign } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this icon?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const Icon = (LucideIcons as any)[iconName || 'Star'] || LucideIcons.HelpCircle;
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');

  return (
    <NodeViewWrapper 
      className={cn(
        "group/icon relative my-4 w-full flex",
        textAlign === 'text-center' ? 'justify-center' : textAlign === 'text-right' ? 'justify-end' : 'justify-start'
      )}
      onClick={handleSelectNode}
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity z-50",
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
      )}
      style={{ marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined }}
      >
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-20",
          (selected || editor.isActive('iconElement')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Icon"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={handleSelectNode}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            ICON
          </div>
        </div>

        <Icon 
          size={size || 48} 
          color={color || 'var(--primary-color)'} 
          className="transition-all duration-500"
        />
      </div>
    </NodeViewWrapper>
  );
};

export const IconElement = Node.create({
  name: 'iconElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      iconName: { default: 'Star' },
      size: { default: 48 },
      color: { default: null },
      marginTop: { default: '0px' },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="icon-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'icon-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IconComponent);
  },
});
