import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';
import { saveToClipboard } from '../lib/db';

const ImageComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, src, alt, borderRadius, objectFit, minHeight, marginTop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);
  const hoveredId = useUIStore(state => state.hoveredId);
  const openMediaModal = useUIStore(state => state.openMediaModal);
  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const isDragging = useUIStore(state => state.isDragging);
  const isHovered = hoveredId === id;

  /** Apply a new image URL to this node */
  const applyImage = (url: string) => {
    const pos = getPos();
    if (typeof pos === 'number') {
      editor.view.dispatch(
        editor.view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: url })
      );
    }
  };

  /** Open MediaLibraryModal and apply selected image */
  const openImagePicker = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Select node first so sidebar shows this element's config
    if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
    openMediaModal(id || 'image-pick', applyImage, 'image');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: 'Delete Image',
      message: 'Are you sure you want to remove this image?',
      variant: 'danger',
      onConfirm: () => {
        const pos = getPos();
        if (typeof pos === 'number') {
          editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
        }
      }
    });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nodeJSON = node.toJSON();
    await saveToClipboard(nodeJSON);
  };

  const currentMinHeight = (typeof minHeight === 'object' && minHeight !== null)
    ? (minHeight[activeDevice] || 'auto')
    : (minHeight || 'auto');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null)
    ? (marginTop[activeDevice] || '0px')
    : (marginTop || '0px');

  return (
    <NodeViewWrapper
      data-drag-handle
      draggable
      data-node-id={id}
      className={cn(
        'group/image relative my-4 w-full transition-all',
        (isHovered || selected) ? 'z-[300]' : 'z-10'
      )}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
      }}
    >
      <div className={cn(
        'relative transition-all duration-300',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl',
        isHovered && 'ring-4 ring-indigo-500/40 z-[301] shadow-2xl'
      )}>
        <ElementToolbar
          label="IMAGE"
          selected={selected}
          isActive={editor.isActive('imageElement')}
          node={node}
          groupName="image"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        {src ? (
          /* ── Image exists: show image + hover overlay to replace ── */
          <div className={cn("relative group/img-wrap", !selected && "pointer-events-none")} draggable={true}>
            <img
              src={src}
              alt={alt || ''}
              draggable={false}  /* prevent native browser image-drag conflict */
              className="w-full transition-all duration-500 select-none"
              style={{
                borderRadius: borderRadius || '0.75rem',
                objectFit: objectFit || 'cover',
                minHeight: currentMinHeight !== 'auto' ? currentMinHeight : undefined,
                marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined,
                display: 'block'
              }}
            />
            {/* Hover overlay — double-click or button to replace */}
            <div
              onDoubleClick={openImagePicker}
              draggable={false}  /* prevent accidental div drag */
              className={cn(
                'absolute inset-0 flex items-center justify-center gap-2',
                'bg-slate-900/0 hover:bg-slate-900/40 transition-all duration-300 cursor-pointer',
                'rounded-[inherit]'
              )}
              style={{ borderRadius: borderRadius || '0.75rem' }}
            >
              <div className="opacity-0 group-hover/img-wrap:opacity-100 transition-all duration-300 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-white/50 pointer-events-none">
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">
                  Replace Image
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty placeholder: click to open modal ── */
          <div
            onClick={openImagePicker}
            draggable={false}  /* prevent div native drag */
            className="w-full bg-gradient-to-br from-slate-50 to-indigo-50/30 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-indigo-200/60 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 group/placeholder"
            style={{
              borderRadius: borderRadius || '0.75rem',
              minHeight: currentMinHeight !== 'auto' ? currentMinHeight : '200px',
              marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover/placeholder:scale-110 group-hover/placeholder:shadow-indigo-200 transition-all duration-300 border border-indigo-100 pointer-events-none">
              <ImageIcon className="w-8 h-8 text-indigo-400 group-hover/placeholder:text-indigo-600 transition-colors" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center pointer-events-none">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic group-hover/placeholder:text-indigo-600 transition-colors">
                Click to select image
              </span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter italic">
                Unsplash · Local Upload
              </span>
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
    return [{ tag: 'div[data-type="image-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
