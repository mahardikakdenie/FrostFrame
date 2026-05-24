import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Play, Upload, Youtube } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { normalizeResponsive } from '../lib/responsive';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';
import { saveToClipboard } from '../lib/db';

const VideoComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, src, sourceType, poster, borderRadius, minHeight, marginTop, padding, autoplay, loop } = node.attrs;
  
  const activeDevice = useUIStore(state => state.activeDevice);
  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const openMediaModal = useUIStore(state => state.openMediaModal);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isDragging = useUIStore(state => state.isDragging);
  const isHovered = hoveredId === id;

  const handleSelectNode = () => {
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  /** Open file picker (upload mode) via MediaLibraryModal */
  const openVideoPicker = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleSelectNode();
    openMediaModal(id || 'video-pick', (url: string) => {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(
          editor.view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: url,
            sourceType: 'upload',
          })
        );
      }
    }, 'video');
  };

  /** Double-click: open upload modal if in upload mode, else just select */
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sourceType === 'upload' || !src) {
      openVideoPicker(e);
    } else {
      handleSelectNode();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: 'Delete Video',
      message: 'Are you sure you want to remove this video element?',
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

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        loop: loop ? '1' : '0',
        mute: '1',
        playlist: videoId,
        rel: '0',
        modestbranding: '1'
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    return url;
  };

  const getResponsiveVal = (attr: any, defaultValue: string) => {
    const normalized = normalizeResponsive(attr, defaultValue);
    return normalized[activeDevice] || normalized.desktop || defaultValue;
  };

  const currentMinHeight = getResponsiveVal(minHeight, sourceType === 'youtube' ? 'auto' : '300px');
  const currentMarginTop = getResponsiveVal(marginTop, '0px');
  const currentPadding = getResponsiveVal(padding, '0');
  const currentBorderRadius = getResponsiveVal(borderRadius, '1.5rem');

  return (
    <NodeViewWrapper
      data-drag-handle
      draggable
      data-node-id={id}
      className={cn(
        "group/video relative my-4 w-full transition-all",
        (isHovered || selected) ? "z-[300]" : "z-10"
      )}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSelectNode(); }}
      onDoubleClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDoubleClick(e); }}
    >
      <div className={cn(
        "relative transition-all duration-300 bg-slate-900 flex items-center justify-center",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 shadow-2xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 shadow-lg",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-[301] shadow-2xl transition-all duration-300"
      )}
      style={{ 
        borderRadius: currentBorderRadius,
        aspectRatio: sourceType === 'youtube' ? '16/9' : undefined,
        minHeight: currentMinHeight !== 'auto' ? currentMinHeight : undefined,
        marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined,
        padding: currentPadding !== '0' ? currentPadding : undefined
      }}>
        <ElementToolbar
          label={`VIDEO · ${sourceType?.toUpperCase() ?? 'LINK'}`}
          selected={selected}
          isActive={selected || isHovered}
          node={node}
          groupName="video"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={handleSelectNode}
        />

        {src ? (
          sourceType === 'youtube' ? (
            <iframe
              src={getYoutubeEmbedUrl(src)}
              draggable={false}
              className={cn(
                "w-full h-full absolute inset-0 border-0",
                !selected && "pointer-events-none"
              )}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={src}
              src={src}
              poster={poster}
              autoPlay={autoplay}
              loop={loop}
              muted
              playsInline
              draggable={false}
              className={cn(
                "w-full h-full object-cover",
                !selected && "pointer-events-none"
              )}
              controls={selected}
            />
          )
        ) : (
          /* ── Empty state: interactive CTA matching source type ── */
          <div className="flex flex-col items-center gap-6 py-16 px-8 w-full">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 text-white shadow-xl",
              sourceType === 'youtube' ? 'bg-red-600/80' : 'bg-indigo-600/80'
            )}>
              {sourceType === 'youtube'
                ? <Youtube className="w-7 h-7" />
                : sourceType === 'upload'
                  ? <Upload className="w-7 h-7" />
                  : <Play className="w-7 h-7 fill-white" />}
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-[11px] font-black text-white/80 uppercase tracking-widest italic">
                {sourceType === 'youtube'
                  ? 'Paste YouTube URL in Sidebar'
                  : sourceType === 'upload'
                    ? 'Upload a Video File'
                    : 'Paste a Direct Video Link'}
              </span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                {sourceType === 'youtube' ? 'youtube.com/watch?v=...' : 'MP4 · WEBM · OGG'}
              </span>
            </div>

            {/* CTA button for upload mode */}
            {sourceType === 'upload' && (
              <button
                onClick={openVideoPicker}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Select Video File
              </button>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const VideoElement = Node.create({
  name: 'videoElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      src: { default: null },
      sourceType: { default: 'link' }, // 'link' | 'upload' | 'youtube'
      poster: { default: null },
      borderRadius: { 
        default: '1.5rem',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-border-radius');
          try { return JSON.parse(val || '"1.5rem"'); } catch(e) { return val || '1.5rem'; }
        },
        renderHTML: attributes => ({ 'data-border-radius': typeof attributes.borderRadius === 'object' ? JSON.stringify(attributes.borderRadius) : attributes.borderRadius })
      },
      minHeight: { 
        default: null,
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-min-height');
          try { return JSON.parse(val || 'null'); } catch(e) { return val; }
        },
        renderHTML: attributes => ({ 'data-min-height': typeof attributes.minHeight === 'object' ? JSON.stringify(attributes.minHeight) : attributes.minHeight })
      },
      marginTop: { 
        default: '0px',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-margin-top');
          try { return JSON.parse(val || '"0px"'); } catch(e) { return val || '0px'; }
        },
        renderHTML: attributes => ({ 'data-margin-top': typeof attributes.marginTop === 'object' ? JSON.stringify(attributes.marginTop) : attributes.marginTop })
      },
      padding: { 
        default: '0',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-padding');
          try { return JSON.parse(val || '"0"'); } catch(e) { return val || '0'; }
        },
        renderHTML: attributes => ({ 'data-padding': typeof attributes.padding === 'object' ? JSON.stringify(attributes.padding) : attributes.padding })
      },
      autoplay: { default: false },
      loop: { default: true }
    };
  },

  parseHTML() {
    return [{ 
      tag: 'div[data-type="video-element"]',
      getAttrs: dom => {
        let borderRadius = dom.getAttribute('data-border-radius');
        let minHeight = dom.getAttribute('data-min-height');
        let marginTop = dom.getAttribute('data-margin-top');
        let padding = dom.getAttribute('data-padding');
        try { borderRadius = JSON.parse(borderRadius || '"1.5rem"'); } catch(e) {}
        try { minHeight = JSON.parse(minHeight || 'null'); } catch(e) {}
        try { marginTop = JSON.parse(marginTop || '"0px"'); } catch(e) {}
        try { padding = JSON.parse(padding || '"0"'); } catch(e) {}
        return { borderRadius, minHeight, marginTop, padding };
      }
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'video-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent);
  },
});
