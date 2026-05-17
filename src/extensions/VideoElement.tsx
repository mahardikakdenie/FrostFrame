import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Trash2, GripVertical, Play, Video as VideoIcon } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const VideoComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { src, sourceType, poster, borderRadius, minHeight, marginTop, autoplay, loop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this video?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&mute=1&playlist=${match[2]}`;
    }
    return url;
  };

  const currentMinHeight = (typeof minHeight === 'object' && minHeight !== null) ? (minHeight[activeDevice] || 'auto') : (minHeight || 'auto');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');

  return (
    <NodeViewWrapper 
      className="group/video relative my-4 w-full"
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300 overflow-hidden bg-slate-900 flex items-center justify-center",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl shadow-2xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl shadow-lg"
      )}
      style={{ 
        borderRadius: borderRadius || '0.75rem',
        aspectRatio: sourceType === 'youtube' ? '16/9' : undefined,
        minHeight: currentMinHeight !== 'auto' ? currentMinHeight : (sourceType === 'youtube' ? 'auto' : '300px'),
        marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
      }}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300",
          (selected || editor.isActive('videoElement')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Video"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={handleSelectNode}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            {sourceType?.toUpperCase() || 'VIDEO'}
          </div>
        </div>

        {src ? (
          sourceType === 'youtube' ? (
            <iframe 
              src={getYoutubeEmbedUrl(src)}
              className="w-full h-full absolute inset-0"
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

  addAttributes() {
    return {
      id: { default: null },
      src: { default: null },
      sourceType: { default: 'link' }, // 'link' | 'upload' | 'youtube'
      poster: { default: null },
      borderRadius: { default: '1.5rem' },
      minHeight: { default: null },
      marginTop: { default: '0px' },
      autoplay: { default: false },
      loop: { default: true }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'video-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent);
  },
});
