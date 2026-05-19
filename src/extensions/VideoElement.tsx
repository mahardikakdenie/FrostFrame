import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Trash2, GripVertical, Play, ArrowUp, ArrowDown, Move } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { normalizeResponsive } from '../lib/responsive';

const VideoComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, src, sourceType, poster, borderRadius, minHeight, marginTop, padding, autoplay, loop } = node.attrs;
  
  const activeDevice = useUIStore(state => state.activeDevice);
  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
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
      className={cn(
        "group/video relative my-4 w-full transition-all",
        (isHovered || selected) ? "z-[300]" : "z-10"
      )}
      onClick={handleSelectNode}
      onDoubleClick={handleDoubleClick}
    >
      {/* Visual Indicator & Drag Handle (Left Side) */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity z-50",
          (selected || isHovered) && "opacity-100"
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
        {/* Badge Label & Actions (Top-Right Standard) */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-[400]",
          (selected || isHovered) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Video"
          >
             <Trash2 className="w-3 h-3" />
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
            className="bg-indigo-600 text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer pointer-events-auto flex items-center gap-1.5"
          >
            <Move className="w-2.5 h-2.5" />
            {sourceType?.toUpperCase() || 'VIDEO'}
          </div>
        </div>

        {src ? (
          sourceType === 'youtube' ? (
            <iframe 
              src={getYoutubeEmbedUrl(src)}
              className="w-full h-full absolute inset-0 border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video 
              key={src} // Force re-render on src change
              src={src} 
              poster={poster}
              autoPlay={autoplay}
              loop={loop}
              muted
              playsInline
              className="w-full h-full object-cover"
              controls
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-4 py-20">
             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 text-white animate-pulse">
                <Play className="w-6 h-6 fill-white" />
             </div>
             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic text-center px-8">
               {sourceType === 'youtube' ? 'Enter YouTube URL in Sidebar' : 'Configure Video Source in Sidebar'}
             </span>
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
  isolating: true,

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
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'video-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent);
  },
});
