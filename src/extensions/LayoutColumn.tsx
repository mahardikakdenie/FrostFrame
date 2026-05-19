import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Plus, Trash2, LayoutTemplate, ArrowUp, ArrowDown } from 'lucide-react';
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
  const focusedId = useUIStore(state => state.focusedId);
  const hoveredId = useUIStore(state => state.hoveredId);
  const selectionPath = useUIStore(state => state.selectionPath);
  const inspectMode = useUIStore(state => state.inspectMode);
  
  const isFocused = focusedId === id;
  const isHovered = hoveredId === id;
  const isAncestorOfFocus = selectionPath.some(item => item.id === id) && !isFocused;
  const isEmpty = node.childCount === 0;

  const handleSelectNode = (e: React.MouseEvent) => {
    if (inspectMode) return;
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (inspectMode) return;
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (inspectMode) return;
    e.stopPropagation();
    if (confirm('Delete this column and its contents?')) {
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

  const handleWrapWithRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    editor.commands.wrapInRow();
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
      const normalizedDirection = normalizeResponsive(flexDirection, 'col');
      const normalizedAlign = normalizeResponsive(alignItems, 'stretch');
      const normalizedJustify = normalizeResponsive(justifyContent, 'start');
      const normalizedContent = normalizeResponsive(node.attrs.alignContent, 'start');

      const classes = ['flex', 'flex-wrap'];

      const directionMap: Record<string, string> = {
        'row': 'flex-row',
        'row-reverse': 'flex-row-reverse',
        'col': 'flex-col',
        'col-reverse': 'flex-col-reverse'
      };

      const alignMap: Record<string, string> = {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
        'stretch': 'items-stretch'
      };

      const justifyMap: Record<string, string> = {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end',
        'between': 'justify-between',
        'around': 'justify-around'
      };

      const contentMap: Record<string, string> = {
        'start': 'content-start',
        'center': 'content-center',
        'end': 'content-end',
        'between': 'content-between',
        'around': 'content-around',
        'stretch': 'content-stretch'
      };

      // Base (Mobile)
      classes.push(directionMap[normalizedDirection.mobile] || directionMap.col);
      classes.push(alignMap[normalizedAlign.mobile] || alignMap.stretch);
      classes.push(justifyMap[normalizedJustify.mobile] || justifyMap.start);
      classes.push(contentMap[normalizedContent.mobile] || contentMap.start);

      // Tablet (md)
      if (normalizedDirection.tablet) classes.push(`md:${directionMap[normalizedDirection.tablet]}`);
      if (normalizedAlign.tablet) classes.push(`md:${alignMap[normalizedAlign.tablet]}`);
      if (normalizedJustify.tablet) classes.push(`md:${justifyMap[normalizedJustify.tablet]}`);
      if (normalizedContent.tablet) classes.push(`md:${contentMap[normalizedContent.tablet]}`);

      // Desktop (lg)
      if (normalizedDirection.desktop) classes.push(`lg:${directionMap[normalizedDirection.desktop]}`);
      if (normalizedAlign.desktop) classes.push(`lg:${alignMap[normalizedAlign.desktop]}`);
      if (normalizedJustify.desktop) classes.push(`lg:${justifyMap[normalizedJustify.desktop]}`);
      if (normalizedContent.desktop) classes.push(`lg:${contentMap[normalizedContent.desktop]}`);

      return classes.join(' ');
    }
    return 'flex flex-col'; // Default
  };

  const currentMinHeight = (typeof minHeight === 'object' && minHeight !== null) ? (minHeight[activeDevice] || '120px') : (minHeight || '120px');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');
  const currentGap = (typeof gap === 'object' && gap !== null) ? (gap[activeDevice] || '1rem') : (gap || '1rem');

  return (
    <NodeViewWrapper 
      onClick={handleSelectNode}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "group/column relative transition-all duration-500 flex flex-col",
        getWidthClass(),
        // 🚀 ADAPTIVE FOCUS: Only show ring if directly selected and not an ancestor of a deeper focus
        isFocused ? "ring-2 ring-indigo-500 z-30 shadow-2xl" : "hover:ring-1 hover:ring-indigo-100",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-[100] shadow-2xl",
        isAncestorOfFocus && "ring-0 ring-transparent shadow-none hover:ring-0",
        
        // Subtle indicator always visible, but hidden if child is focused
        "border-2 border-dashed transition-colors",
        (isFocused || isEmpty) ? "border-indigo-200" : (isAncestorOfFocus ? "border-transparent" : "border-slate-200/40 hover:border-indigo-200/50"),
        
        // 🚀 Drag Over Highlight
        "dragging-over:bg-indigo-50/50 dragging-over:border-indigo-400 dragging-over:ring-2 dragging-over:ring-indigo-100",
        textAlign
      )}
      style={{ 
        backgroundColor: background || 'transparent',
        minHeight: currentMinHeight,
        marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
      }}
    >
      {/* Background & Overlay Layer (Handles Clipping for visuals only) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-inherit">
        {bgImage && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundPosition: bgPosition || 'center',
              backgroundSize: bgSize || 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
        {bgOverlay && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: bgOverlay,
              opacity: bgOpacity !== undefined ? bgOpacity / 100 : 0.4
            }}
          />
        )}
      </div>

      {/* Level Indicator Tag (Dampened if child is focused) */}
      <div className={cn(
        "absolute top-0 right-4 z-40 pointer-events-none transition-opacity duration-500",
        isAncestorOfFocus ? "opacity-0" : "opacity-100"
      )}>
        <div className={cn(
          "px-1.5 py-0.5 rounded-b-md text-[6px] font-black uppercase tracking-tighter transition-all",
          selected ? "bg-indigo-500 text-white opacity-100" : "bg-slate-50 text-slate-400 group-hover/column:opacity-100 opacity-40"
        )}>
          {selected ? 'Active Column' : 'Level 2: Col'}
        </div>
      </div>
      <div className={cn("w-full h-full relative z-10", getResponsiveSpacing(padding, 'p'))}>
          {/* Label & Actions (Dampened if child is focused) */}
          <div className={cn(
            "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all z-50 pointer-events-none",
            (isFocused && !isAncestorOfFocus) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <button 
              onClick={handleDelete}
              className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto ml-1"
              title="Delete Column"
            >
               <Trash2 className="w-3 h-3" />
            </button>
            <button 
              onClick={handleMove('down')}
              className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto ml-0.5"
              title="Move Down"
            >
               <ArrowDown className="w-3 h-3" />
            </button>
            <button 
              onClick={handleMove('up')}
              className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto ml-0.5"
              title="Move Up"
            >
               <ArrowUp className="w-3 h-3" />
            </button>
            <button 
              onClick={handleWrapWithRow}
              className="bg-indigo-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-indigo-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto ml-1"
              title="Refactor: Wrap with Row"
            >
               <LayoutTemplate className="w-3 h-3" />
            </button>
            <div 
              onClick={handleSelectNode}
              className="bg-slate-900/40 backdrop-blur-md text-[9px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest pointer-events-auto cursor-pointer shadow-xl border border-white/10"
            >
              Column
            </div>
            <div 
              data-drag-handle 
              onClick={handleSelectNode}
              className="bg-slate-900/40 backdrop-blur-md text-white p-1 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl border border-white/10"
            >
              <GripVertical className="w-3 h-3" />
            </div>
          </div>

          <div className="relative w-full h-full min-h-[120px]">
            {isEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-0">
                <div className="w-12 h-12 rounded-full bg-indigo-50/50 border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-400 transition-all duration-500 group-hover/column:scale-110 group-hover/column:border-indigo-400 group-hover/column:bg-indigo-100/50 shadow-inner">
                  <Plus className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40 group-hover/column:opacity-100 transition-all duration-500">
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] italic group-hover/column:scale-105 transition-transform">DROP HERE</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Drag Elements Into This Slot</span>
                </div>
              </div>
            )}
            <NodeViewContent 
              className={cn(
                "w-full h-full min-h-[120px] relative z-10",
                getFlexClass()
              )} 
              style={{ gap: currentGap }}
            />
          </div>
      </div>
    </NodeViewWrapper>
  );
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    layoutColumn: {
      wrapInRow: () => ReturnType;
    }
  }
}

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
        parseHTML: element => {
          const val = element.getAttribute('data-width');
          try { return JSON.parse(val || '"w-full"'); } catch(e) { return val || 'w-full'; }
        },
        renderHTML: attributes => ({ 'data-width': typeof attributes.width === 'object' ? JSON.stringify(attributes.width) : attributes.width })
      },
      displayType: { default: 'flex' },
      flexDirection: { 
        default: 'col',
        keepAttributes: true,
        parseHTML: element => {
           const val = element.getAttribute('data-flex-direction');
           try { return JSON.parse(val || '"col"'); } catch(e) { return val || 'col'; }
        },
        renderHTML: attributes => ({ 'data-flex-direction': typeof attributes.flexDirection === 'object' ? JSON.stringify(attributes.flexDirection) : attributes.flexDirection })
      },
      alignItems: { 
        default: 'stretch',
        keepAttributes: true,
        parseHTML: element => {
           const val = element.getAttribute('data-align-items');
           try { return JSON.parse(val || '"stretch"'); } catch(e) { return val || 'stretch'; }
        },
        renderHTML: attributes => ({ 'data-align-items': typeof attributes.alignItems === 'object' ? JSON.stringify(attributes.alignItems) : attributes.alignItems })
      },
      justifyContent: { 
        default: 'start',
        keepAttributes: true,
        parseHTML: element => {
           const val = element.getAttribute('data-justify-content');
           try { return JSON.parse(val || '"start"'); } catch(e) { return val || 'start'; }
        },
        renderHTML: attributes => ({ 'data-justify-content': typeof attributes.justifyContent === 'object' ? JSON.stringify(attributes.justifyContent) : attributes.justifyContent })
      },
      alignContent: { 
        default: 'start',
        keepAttributes: true,
        parseHTML: element => {
           const val = element.getAttribute('data-align-content');
           try { return JSON.parse(val || '"start"'); } catch(e) { return val || 'start'; }
        },
        renderHTML: attributes => ({ 'data-align-content': typeof attributes.alignContent === 'object' ? JSON.stringify(attributes.alignContent) : attributes.alignContent })
      },
      gap: { 
        default: '1rem',
        keepAttributes: true,
        parseHTML: element => { try { return JSON.parse(element.getAttribute('data-gap') || '"1rem"'); } catch(e) { return element.getAttribute('data-gap') || '1rem'; } },
        renderHTML: attributes => ({ 'data-gap': typeof attributes.gap === 'object' ? JSON.stringify(attributes.gap) : attributes.gap })
      },
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
        parseHTML: element => {
          const val = element.getAttribute('data-padding');
          try { return JSON.parse(val || '"4"'); } catch(e) { return val || '4'; }
        },
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
        parseHTML: element => {
          const val = element.getAttribute('data-margin-top');
          try { return JSON.parse(val || '"0px"'); } catch(e) { return val || '0px'; }
        },
        renderHTML: attributes => ({ 'data-margin-top': typeof attributes.marginTop === 'object' ? JSON.stringify(attributes.marginTop) : attributes.marginTop })
      }
    };
  },

  addCommands() {
    return {
      wrapInRow: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        let nodePos = -1;
        let targetNode = null;

        if ('node' in selection) {
          targetNode = (selection as any).node;
          nodePos = selection.from;
        } else {
          let $pos = state.doc.resolve(selection.from);
          for (let d = $pos.depth; d >= 0; d--) {
            const node = $pos.node(d);
            if (node.type.isBlock) {
              targetNode = node;
              nodePos = $pos.before(d);
              break;
            }
          }
        }

        if (!targetNode || nodePos === -1) return false;

        if (dispatch) {
          let columnToWrap = targetNode;
          
          // If the node is NOT a column, we must wrap it in a column first
          if (targetNode.type.name !== 'layoutColumn') {
            columnToWrap = state.schema.nodes.layoutColumn.createAndFill(
              { id: crypto.randomUUID() },
              [targetNode]
            );
          }

          if (columnToWrap) {
            const rowNode = state.schema.nodes.layoutRow.createAndFill(
              { id: crypto.randomUUID(), displayType: 'grid', gridCols: 1 }, 
              [columnToWrap]
            );
            
            if (rowNode) {
              tr.replaceWith(nodePos, nodePos + targetNode.nodeSize, rowNode);
            }
          }
        }
        return true;
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
        let flexDirection = dom.getAttribute('data-flex-direction');
        let alignItems = dom.getAttribute('data-align-items');
        let justifyContent = dom.getAttribute('data-justify-content');
        let alignContent = dom.getAttribute('data-align-content');
        let gap = dom.getAttribute('data-gap');

        try { width = JSON.parse(width || '"w-full"'); } catch(e) {}
        try { padding = JSON.parse(padding || '"4"'); } catch(e) {}
        try { marginTop = JSON.parse(marginTop || '"0px"'); } catch(e) {}
        try { flexDirection = JSON.parse(flexDirection || '"col"'); } catch(e) {}
        try { alignItems = JSON.parse(alignItems || '"stretch"'); } catch(e) {}
        try { justifyContent = JSON.parse(justifyContent || '"start"'); } catch(e) {}
        try { alignContent = JSON.parse(alignContent || '"start"'); } catch(e) {}
        try { gap = JSON.parse(gap || '"1rem"'); } catch(e) {}

        return { width, padding, minHeight, marginTop, flexDirection, alignItems, justifyContent, alignContent, gap };
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
