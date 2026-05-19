import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import {GripVertical, Image as ImageIcon, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const ImageComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, src, alt, borderRadius, objectFit, minHeight, marginTop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this image?')) {
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

  const currentMinHeight = (typeof minHeight === 'object' && minHeight !== null) ? (minHeight[activeDevice] || 'auto') : (minHeight || 'auto');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');

  return (
    <NodeViewWrapper 
      onClick={handleSelectNode}
      className={cn(
        "group/image relative my-4 w-full transition-all",
        (isHovered || selected) ? "z-[300]" : "z-10"
      )}
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-[301] shadow-2xl transition-all duration-300"
      )}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-[400]",
          (selected || editor.isActive('imageElement')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Image"
          >
             <Trash className="w-2.5 h-2.5" />
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
            onClick={handleSelectNode}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            IMAGE
          </div>
        </div>

        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full transition-all duration-500"
            style={{ 
              borderRadius: borderRadius || '0.75rem',
              objectFit: objectFit || 'cover',
              minHeight: currentMinHeight !== 'auto' ? currentMinHeight : undefined,
              marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
            }}
          />
        ) : (
          <div 
            className="w-full bg-slate-100 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 cursor-pointer hover:bg-indigo-50 transition-colors"
            style={{ 
              borderRadius: borderRadius || '0.75rem',
              minHeight: currentMinHeight !== 'auto' ? currentMinHeight : '200px',
              marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover/image:scale-110 transition-transform">
               <ImageIcon className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="flex flex-col items-center gap-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic group-hover/image:text-indigo-500 transition-colors">
                 Click to select image
               </span>
               <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter italic">Unsplash or Local Upload</span>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const ImageElement = Node.create({
  name: 'imageElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      src: { default: null },
      alt: { default: '' },
      borderRadius: { default: '0.75rem' },
      objectFit: { default: 'cover' },
      minHeight: { default: null },
      marginTop: { default: '0px' }
    };
  },

  parseHTML() {
    return [{ tag: 'img[data-type="image-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { 'data-type': 'image-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
