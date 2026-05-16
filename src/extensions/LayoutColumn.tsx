import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { getResponsiveSpacing, normalizeResponsive } from '../lib/responsive';

const LayoutColumnComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { 
    id, 
    width, 
    flexSizing, 
    displayType,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    padding, 
    background, 
    bgImage,
    bgOverlay,
    bgOpacity,
    bgPosition,
    bgSize,
    textAlign, 
    minHeight, 
    marginTop 
  } = node.attrs;

  const activeDevice = useUIStore(state => state.activeDevice);
  const isEmpty = node.childCount === 0;

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
    if (confirm('Delete this column and its contents?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  // Map width values to Tailwind classes
  const getWidthClass = () => {
    if (flexSizing === 'flex-1') return 'flex-1 w-full';
    
    const normalizedWidth = normalizeResponsive(width, 'w-full');
    const classes = [];
    
    const widthMap: Record<string, string> = {
        'w-full': 'w-full',
        'w-1/2': 'w-1/2',
        'w-1/3': 'w-1/3',
        'w-2/3': 'w-2/3',
        'w-1/4': 'w-1/4',
        'w-3/4': 'w-3/4',
        'auto': 'w-auto'
    };

    if (normalizedWidth.mobile) classes.push(widthMap[normalizedWidth.mobile] || normalizedWidth.mobile);
    else if (normalizedWidth.desktop) classes.push(widthMap[normalizedWidth.desktop] || normalizedWidth.desktop);

    if (normalizedWidth.tablet) classes.push(`md:${widthMap[normalizedWidth.tablet] || normalizedWidth.tablet}`);
    if (normalizedWidth.desktop) classes.push(`lg:${widthMap[normalizedWidth.desktop] || normalizedWidth.desktop}`);

    return classes.join(' ');
  };

  const getFlexClass = () => {
    if (displayType === 'flex') {
      const direction = {
        'row': 'flex-row',
        'row-reverse': 'flex-row-reverse',
        'col': 'flex-col',
        'col-reverse': 'flex-col-reverse'
      }[flexDirection as string] || 'flex-col';

      const align = {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
        'stretch': 'items-stretch'
      }[alignItems as string] || 'items-stretch';

      const justify = {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end',
        'between': 'justify-between',
        'around': 'justify-around'
      }[justifyContent as string] || 'justify-start';

      return `flex ${direction} ${align} ${justify} flex-wrap`;
    }
    return 'flex flex-col'; // Default
  };

  const currentMinHeight = (typeof minHeight === 'object' && minHeight !== null) ? (minHeight[activeDevice] || '120px') : (minHeight || '120px');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');

  return (
    <NodeViewWrapper 
      className={cn(
        "group/column relative transition-all duration-300 flex flex-col overflow-hidden",
        getWidthClass(),
        selected ? "ring-2 ring-indigo-500 z-30" : "hover:ring-1 hover:ring-indigo-200",
        // Subtle indicator always visible
        "border-2 border-dashed border-slate-200/40 hover:border-indigo-200/50",
        // 🚀 Drag Over Highlight (using a global class managed by handleDOMEvents)
        "dragging-over:bg-indigo-50/50 dragging-over:border-indigo-400 dragging-over:ring-2 dragging-over:ring-indigo-100",
        textAlign
      )}
      onDoubleClick={handleDoubleClick}
      style={{ 
        backgroundColor: background || 'transparent',
        minHeight: currentMinHeight,
        marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
      }}
    >
      {/* Background Image Layer */}
      {bgImage && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: bgPosition || 'center',
            backgroundSize: bgSize || 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* Overlay Layer */}
      {bgOverlay && (
        <div 
          className="absolute inset-0 z-1 pointer-events-none"
          style={{
            backgroundColor: bgOverlay,
            opacity: bgOpacity !== undefined ? bgOpacity / 100 : 0.4
          }}
        />
      )}

      {/* Level Indicator Tag */}
      <div className="absolute top-0 right-4 z-40 pointer-events-none">
        <div className={cn(
          "px-1.5 py-0.5 rounded-b-md text-[6px] font-black uppercase tracking-tighter transition-all opacity-40 group-hover/column:opacity-100",
          selected ? "bg-indigo-500 text-white opacity-100" : "bg-slate-50 text-slate-400"
        )}>
          {selected ? 'Active Column' : 'Level 2: Col'}
        </div>
      </div>
      <div className={cn("w-full h-full relative z-10", getResponsiveSpacing(padding, 'p'))}>
          {/* Label & Actions */}
          <div className={cn(
            "absolute -top-6 right-0 flex flex-row-reverse items-center gap-1 opacity-0 group-hover/column:opacity-100 transition-opacity z-50 pointer-events-none",
            selected && "opacity-100"
          )}>
            <button 
              onClick={handleDelete}
              className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto ml-1"
              title="Delete Column"
            >
               <Trash2 className="w-2.5 h-2.5" />
            </button>
            <div 
              onClick={handleSelectNode}
              className="bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded font-black uppercase tracking-widest pointer-events-auto cursor-pointer shadow-xl"
            >
              Column
            </div>
            <div 
              data-drag-handle 
              onClick={handleSelectNode}
              className="bg-indigo-600 text-white p-0.5 rounded cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl"
            >
              <GripVertical className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="relative w-full h-full min-h-[120px]">
            {isEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-0">
                <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 transition-all duration-500 group-hover/column:scale-110 group-hover/column:border-indigo-200 group-hover/column:text-indigo-400 group-hover/column:bg-indigo-50/50">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-center gap-1 opacity-20 group-hover/column:opacity-100 transition-all duration-500">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic group-hover/column:text-indigo-500">Empty Content Slot</span>
                  <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter group-hover/column:text-indigo-300">Drop Elements Here</span>
                </div>
              </div>
            )}
            <NodeViewContent 
              className={cn(
                "w-full h-full min-h-[120px] relative z-10",
                getFlexClass()
              )} 
              style={{ gap: gap || '1rem' }}
            />
          </div>
      </div>
    </NodeViewWrapper>
  );
};

export const LayoutColumn = Node.create({
  name: 'layoutColumn',
  group: 'block',
  content: 'block*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      width: { 
        default: 'w-full',
        keepAttributes: true,
        parseHTML: element => element.getAttribute('data-width'),
        renderHTML: attributes => ({ 'data-width': typeof attributes.width === 'object' ? JSON.stringify(attributes.width) : attributes.width })
      },
      displayType: { default: 'flex' },
      flexDirection: { default: 'col' },
      alignItems: { default: 'stretch' },
      justifyContent: { default: 'start' },
      gap: { default: '1rem' },
      minHeight: { 
        default: 'min-h-[120px]',
        keepAttributes: true,
        parseHTML: element => element.getAttribute('data-min-height'),
        renderHTML: attributes => ({ 'data-min-height': attributes.minHeight })
      },
      flexSizing: { default: 'flex-1' },
      padding: { 
        default: '4',
        keepAttributes: true,
        parseHTML: element => element.getAttribute('data-padding'),
        renderHTML: attributes => ({ 'data-padding': typeof attributes.padding === 'object' ? JSON.stringify(attributes.padding) : attributes.padding })
      },
      background: { default: null },
      bgImage: { default: null },
      bgOverlay: { default: null },
      bgOpacity: { default: 40 },
      bgPosition: { default: 'center' },
      bgSize: { default: 'cover' },
      textAlign: { default: 'text-left' },
      marginTop: { 
        default: '0px',
        keepAttributes: true,
        parseHTML: element => element.getAttribute('data-margin-top'),
        renderHTML: attributes => ({ 'data-margin-top': typeof attributes.marginTop === 'object' ? JSON.stringify(attributes.marginTop) : attributes.marginTop })
      }
    };
  },

  parseHTML() {
    return [{ 
      tag: 'div[data-type="layout-column"]',
      getAttrs: dom => {
        let width = dom.getAttribute('data-width');
        let padding = dom.getAttribute('data-padding');
        let minHeight = dom.getAttribute('data-min-height');
        let marginTop = dom.getAttribute('data-margin-top');
        try { width = JSON.parse(width || '"w-full"'); } catch(e) {}
        try { padding = JSON.parse(padding || '"4"'); } catch(e) {}
        try { marginTop = JSON.parse(marginTop || '"0px"'); } catch(e) {}
        return { width, padding, minHeight, marginTop };
      }
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'layout-column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LayoutColumnComponent);
  },
});
