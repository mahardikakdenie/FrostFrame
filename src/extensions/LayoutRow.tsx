import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Plus, Layout, Trash2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { getResponsiveGridCols, getResponsiveSpacing, normalizeResponsive } from '../lib/responsive';

const LayoutRowComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { 
  id, 
  displayType, 
  gridCols, 
  flexDirection, 
  alignItems, 
  justifyContent, 
  alignContent,
  gap, 
  background, 
  bgImage,
  bgOverlay,
  bgOpacity,
  bgPosition,
  bgSize,
  padding,
  maxWidth,
  minHeight,
  marginTop
  } = node.attrs;

  const activeDevice = useUIStore(state => state.activeDevice);
  const focusedId = useUIStore(state => state.focusedId);
  const hoveredId = useUIStore(state => state.hoveredId);
  const selectionPath = useUIStore(state => state.selectionPath);
  
  const isFocused = focusedId === id;
  const isHovered = hoveredId === id;
  const isAncestorOfFocus = selectionPath.some(item => item.id === id) && !isFocused;
  
  const [isResizing, setIsResizing] = React.useState(false);

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
  if (confirm('Delete this row and all its contents?')) {
    const pos = getPos();
    if (typeof pos === 'number') {
      editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
    }
  }
  };

  const startResizing = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsResizing(true);

  const startY = e.pageY;
  const currentMinHeightStr = typeof minHeight === 'object' && minHeight !== null ? (minHeight[activeDevice] || '120px') : (minHeight || '120px');
  const startHeight = parseInt(currentMinHeightStr.toString().replace(/[^\d-]/g, '')) || 120;

  const onMouseMove = (moveEvent: MouseEvent) => {
    const currentHeight = Math.max(0, startHeight + (moveEvent.pageY - startY));
    const valObj = typeof minHeight === 'object' && minHeight !== null ? { ...minHeight } : { desktop: minHeight || 'auto' };
    valObj[activeDevice] = `${currentHeight}px`;

    const pos = getPos();
    if (typeof pos === 'number') {
      editor.view.dispatch(
        editor.view.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          minHeight: valObj
        })
      );
    }
  };

  const onMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  };

  // Helper to generate grid classes
  const getGridClass = () => {
  if (displayType !== 'grid') return '';
  return getResponsiveGridCols(gridCols);
  };

  // Helper to generate flex classes
  const getFlexClass = () => {
  if (displayType === 'flex') {
    const normalizedDirection = normalizeResponsive(flexDirection, 'row');
    const normalizedAlign = normalizeResponsive(alignItems, 'center');
    const normalizedJustify = normalizeResponsive(justifyContent, 'start');
    const normalizedContent = normalizeResponsive(alignContent, 'start');

    const classes = ['flex', 'flex-wrap'];

    const directionMap: Record<string, string> = { 'row': 'flex-row', 'row-reverse': 'flex-row-reverse', 'col': 'flex-col', 'col-reverse': 'flex-col-reverse' };
    const alignMap: Record<string, string> = { 'start': 'items-start', 'center': 'items-center', 'end': 'items-end', 'stretch': 'items-stretch' };
    const justifyMap: Record<string, string> = { 'start': 'justify-start', 'center': 'justify-center', 'end': 'justify-end', 'between': 'justify-between', 'around': 'justify-around' };
    const contentMap: Record<string, string> = { 'start': 'content-start', 'center': 'content-center', 'end': 'content-end', 'between': 'content-between', 'around': 'content-around', 'stretch': 'content-stretch' };

    // Base (Mobile)
    classes.push(directionMap[normalizedDirection.mobile] || directionMap.row);
    classes.push(alignMap[normalizedAlign.mobile] || alignMap.center);
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

  // Default to horizontal row if not grid
  return 'flex flex-row items-center justify-start w-full';
  };

  const containerClass = displayType === 'grid' ? 'grid' : getFlexClass();
  const gridClass = getGridClass();

  // Calculate empty slots for grid
  const childCount = node.childCount;
  const isRowEmpty = childCount === 0;
  const normalizedGridCols = normalizeResponsive(gridCols, 1);
  const targetCols = displayType === 'grid' ? (normalizedGridCols.desktop || 1) : 0;
  const emptySlots = targetCols > childCount ? Array.from({ length: targetCols - childCount }) : [];

  const currentMinHeight = (typeof minHeight === 'object' && minHeight !== null) ? (minHeight[activeDevice] || 'auto') : (minHeight || 'auto');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');
  const currentGap = (typeof gap === 'object' && gap !== null) ? (gap[activeDevice] || '1.5rem') : (gap || '1.5rem');

  return (
  <NodeViewWrapper 
    onClick={handleSelectNode}
    onDoubleClick={handleDoubleClick}
    className={cn(
      "group/row relative w-full my-6 cursor-pointer transition-all duration-300",
      getResponsiveSpacing(padding, 'py'),
      // 🚀 ADAPTIVE FOCUS: Dampen border if child is focused
      "border-2 border-dashed rounded-[2.5rem] transition-colors",
      isFocused ? "border-indigo-400 bg-indigo-50/5 shadow-2xl z-[100]" : (isAncestorOfFocus ? "z-10 border-transparent" : "z-10 border-slate-200/60 hover:border-indigo-300/50"),
      isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-[200] shadow-2xl transition-all duration-300"
    )}
    style={{
      minHeight: currentMinHeight !== 'auto' ? currentMinHeight : undefined,
      marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined,
      backgroundColor: background || 'transparent',
    }}
  >
    {/* Background & Overlay Layer (Handles Clipping for visuals only) */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
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

    {/* Hierarchy Indicator Tag (Dampened if child is focused) */}
    <div className={cn(
      "absolute -top-3 left-8 flex items-center gap-2 z-30 pointer-events-none transition-opacity duration-500",
      isAncestorOfFocus ? "opacity-0" : "opacity-100"
    )}>
      <div className={cn(
        "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-[0.2em] transition-all",
        selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover/row:bg-indigo-100 group-hover/row:text-indigo-500 opacity-40 group-hover/row:opacity-100"
      )}>
        {selected ? 'Active Row' : 'Level 1: Row'}
      </div>
    </div>
    {/* Empty Row Placeholder */}
    {isRowEmpty && (
      <div className="absolute inset-0 m-6 border-2 border-dashed border-indigo-200 rounded-[2.5rem] bg-indigo-50/10 flex items-center justify-center pointer-events-none z-10 shadow-inner">
        <div className="flex flex-col items-center gap-3 opacity-40 group-hover/row:opacity-100 transition-all duration-500">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-500 animate-pulse">
            <Layout className="w-6 h-6" />
          </div>
          <span className="text-[12px] font-black uppercase tracking-0.4em italic text-indigo-600">DROP HERE</span>
        </div>
      </div>
    )}
    {/* Drag Handle (Dampened if child is focused) */}
    <div className={cn(
      "absolute -left-10 top-0 bottom-0 flex flex-col items-center justify-center transition-opacity z-50",
      (isFocused && !isAncestorOfFocus) ? "opacity-100" : (isAncestorOfFocus ? "opacity-0" : "opacity-0 group-hover/row:opacity-100")
    )}>
      <div 
        data-drag-handle 
        onClick={handleSelectNode}
        className="bg-slate-900/60 backdrop-blur-md text-white p-1.5 rounded-full cursor-grab active:cursor-grabbing shadow-lg border border-white/10"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>

    {/* Label & Actions (Dampened if child is focused) */}
    <div 
      className={cn(
        "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all z-50 pointer-events-none",
        (isFocused && !isAncestorOfFocus) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <button 
        onClick={handleDelete}
        className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
        title="Delete Row"
      >
         <Trash2 className="w-3 h-3" />
      </button>
      <div 
        onClick={handleSelectNode}
        className="bg-slate-900/40 backdrop-blur-md text-[9px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest cursor-pointer shadow-xl border border-white/10"
      >
        STRUCTURE: {displayType.toUpperCase()} {displayType === 'grid' ? `(${targetCols} COLS)` : ''}
      </div>
    </div>

    <div 
      className={cn(
        "transition-all duration-500 ease-out px-6 w-full relative z-10",
        isFocused ? "ring-4 ring-indigo-500/20 ring-offset-4 rounded-[2rem] border-2 border-indigo-100 shadow-2xl" : (isAncestorOfFocus ? "" : "hover:ring-2 hover:ring-indigo-100 hover:rounded-2xl")
      )}
      style={{ 
        maxWidth: maxWidth === 'w-full' ? '100%' : '1280px',
        margin: '0 auto'
      }}
    >
      <div 
        className={cn(
          "w-full", 
          containerClass, 
          gridClass,
          "[&_[data-node-view-content]]:contents",
          "[&_[data-node-view-content-react]]:contents"
        )}
        style={{ gap: currentGap }}
      >
        {/* Existing Columns */}
        <NodeViewContent />

        {/* Clickable Empty Grid Slots */}
        {displayType === 'grid' && emptySlots.map((_, i) => (
          <div 
            key={`empty-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              editor.commands.addLayoutColumn();
            }}
            className="group/slot relative border-2 border-dashed border-slate-100 rounded-2xl min-h-[120px] flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
          >
             {/* Delete Slot Button */}
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 const currentCols = typeof gridCols === 'object' ? (gridCols.desktop || 1) : (gridCols || 1);
                 
                 // If there's only 1 target column left and it's empty, delete the whole row
                 if (currentCols <= 1 && childCount === 0) {
                   handleDelete(e);
                 } else if (currentCols > 1) {
                   // Otherwise, reduce the column count
                   const pos = getPos();
                   if (typeof pos === 'number') {
                     const newVal = typeof gridCols === 'object' 
                        ? { ...gridCols, desktop: Math.max(1, currentCols - 1) } 
                        : Math.max(1, currentCols - 1);

                     editor.view.dispatch(
                       editor.view.state.tr.setNodeMarkup(pos, undefined, {
                         ...node.attrs,
                         gridCols: newVal
                       })
                     );
                   }
                 }
               }}
               className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-md hover:bg-rose-600 transition-all opacity-0 group-hover/slot:opacity-100 z-20"
               title="Remove Column Slot"
             >
               <Trash2 className="w-3.5 h-3.5" />
             </button>

             <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover/slot:text-indigo-500 group-hover/slot:scale-110 transition-all pointer-events-none">
                <Plus className="w-4 h-4" />
             </div>
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover/slot:text-indigo-400 pointer-events-none">Add Column</span>
          </div>
        ))}
      </div>
    </div>

    {/* 🚀 NEW: Floating Add Column Button (Right Side) */}
    <div className={cn(
      "absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 transition-all z-50",
      selected && "opacity-100 translate-x-2"
    )}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          editor.commands.addLayoutColumn();
        }}
        className="bg-indigo-600 text-white w-10 h-10 rounded-full shadow-2xl hover:bg-indigo-700 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center border-4 border-white group/btn"
        title="Add New Column to Row"
      >
        <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
      </button>
    </div>

    {/* Visual Resize Handle */}
    <div 
      onMouseDown={startResizing}
      className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-slate-200 rounded-full cursor-ns-resize z-50 transition-all opacity-0 group-hover/row:opacity-100 hover:bg-indigo-500 hover:h-2 hover:w-32 active:bg-indigo-600 shadow-sm flex items-center justify-center gap-1",
        isResizing && "opacity-100 bg-indigo-600 h-2 w-32"
      )}
    >
      <div className="w-1 h-1 bg-white/40 rounded-full" />
      <div className="w-1 h-1 bg-white/40 rounded-full" />
      <div className="w-1 h-1 bg-white/40 rounded-full" />
    </div>
  </NodeViewWrapper>
  );
  };

  declare module '@tiptap/core' {
  interface Commands<ReturnType> {
  layoutRow: {
    updateGridCols: (cols: number | any) => ReturnType;
    addLayoutColumn: () => ReturnType;
  }
  }
  }

  export const LayoutRow = Node.create({
  name: 'layoutRow',
  group: 'block',
  content: 'layoutColumn+',
  draggable: true,
  defining: true,

  addAttributes() {
  return {
    id: { default: null },
    displayType: { default: 'flex' },
    gridCols: { 
      default: 1,
      keepAttributes: true,
      parseHTML: element => element.getAttribute('data-grid-cols'),
      renderHTML: attributes => ({ 'data-grid-cols': typeof attributes.gridCols === 'object' ? JSON.stringify(attributes.gridCols) : attributes.gridCols })
    },
    flexDirection: { 
      default: 'row',
      keepAttributes: true,
      parseHTML: element => {
         const val = element.getAttribute('data-flex-direction');
         try { return JSON.parse(val || '"row"'); } catch(e) { return val || 'row'; }
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
      default: '1.5rem',
      keepAttributes: true,
      parseHTML: element => {
        const val = element.getAttribute('data-gap');
        try { return JSON.parse(val || '"1.5rem"'); } catch(e) { return val || '1.5rem'; }
      },
      renderHTML: attributes => ({ 'data-gap': typeof attributes.gap === 'object' ? JSON.stringify(attributes.gap) : attributes.gap })
    },
    background: { default: null },
    bgImage: { default: null },
    bgOverlay: { default: null },
    bgOpacity: { default: 40 },
    bgPosition: { default: 'center' },
    bgSize: { default: 'cover' },
    padding: { 
      default: 'py-8',
      keepAttributes: true,
      parseHTML: element => {
        const val = element.getAttribute('data-padding');
        try { return JSON.parse(val || '"py-8"'); } catch(e) { return val || 'py-8'; }
      },
      renderHTML: attributes => ({ 'data-padding': typeof attributes.padding === 'object' ? JSON.stringify(attributes.padding) : attributes.padding })
    },
    minHeight: { 
      default: null,
      keepAttributes: true,
      parseHTML: element => element.getAttribute('data-min-height'),
      renderHTML: attributes => ({ 'data-min-height': typeof attributes.minHeight === 'object' ? JSON.stringify(attributes.minHeight) : attributes.minHeight })
    },
    maxWidth: { default: 'w-full' },
  };
  },
  addCommands() {
    return {
      addLayoutColumn: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        let pos = selection.from;
        let rowNode = null;
        let rowPos = -1;

        if ('node' in selection && (selection as any).node.type.name === 'layoutRow') {
          rowNode = (selection as any).node;
          rowPos = selection.from;
        } else {
          let $pos = state.doc.resolve(pos);
          for (let d = $pos.depth; d >= 0; d--) {
            const node = $pos.node(d);
            if (node.type.name === 'layoutRow') {
              rowNode = node;
              rowPos = $pos.before(d);
              break;
            }
          }
        }

        if (!rowNode || rowPos === -1) return false;

        if (dispatch) {
          const currentGridCols = normalizeResponsive(rowNode.attrs.gridCols, 1);
          const newGridCols = { ...currentGridCols, desktop: (currentGridCols.desktop || 0) + 1 };
          
          tr.setNodeMarkup(rowPos, undefined, { 
            ...rowNode.attrs, 
            gridCols: newGridCols 
          });
          tr.setMeta('isSidebarUpdate', true);
          tr.insert(rowPos + rowNode.nodeSize - 1, state.schema.nodes.layoutColumn.createAndFill({ id: crypto.randomUUID() })!);
        }
        
        return true;
      },
      updateGridCols: (newCols: number | any) => ({ tr, state, dispatch }) => {
        const { selection } = state;
        let pos = selection.from;
        let rowNode = null;
        let rowPos = -1;

        if ('node' in selection && (selection as any).node.type.name === 'layoutRow') {
          rowNode = (selection as any).node;
          rowPos = selection.from;
        } else {
          let $pos = state.doc.resolve(pos);
          for (let d = $pos.depth; d >= 0; d--) {
            const node = $pos.node(d);
            if (node.type.name === 'layoutRow') {
              rowNode = node;
              rowPos = $pos.before(d);
              break;
            }
          }
        }

        if (!rowNode || rowPos === -1) return false;

        if (dispatch) {
            const normalizedNewCols = typeof newCols === 'object' ? newCols : { desktop: newCols };
            const targetCount = normalizedNewCols.desktop || 1;
            const currentCount = rowNode.childCount;
    
            tr.setNodeMarkup(rowPos, undefined, { ...rowNode.attrs, gridCols: newCols });
            tr.setMeta('isSidebarUpdate', true);
    
            if (targetCount > currentCount) {
              const colsToAdd = targetCount - currentCount;
              const newColsArr = [];
              for (let i = 0; i < colsToAdd; i++) {
                newColsArr.push(state.schema.nodes.layoutColumn.createAndFill({ id: crypto.randomUUID() })!);
              }
              tr.insert(rowPos + rowNode.nodeSize - 1, newColsArr);
            } else if (targetCount < currentCount) {
              let currentEndPos = rowPos + rowNode.nodeSize - 1;
              for (let i = 0; i < currentCount - targetCount; i++) {
                const childNode = rowNode.child(currentCount - 1 - i);
                tr.delete(currentEndPos - childNode.nodeSize, currentEndPos);
                currentEndPos -= childNode.nodeSize;
              }
            }
        }
        
        return true;
      }
    };
  },

  parseHTML() {
    return [{ 
      tag: 'div[data-type="layout-row"]',
      getAttrs: dom => {
        let gridCols = dom.getAttribute('data-grid-cols');
        let padding = dom.getAttribute('data-padding');
        let minHeight = dom.getAttribute('data-min-height');
        let flexDirection = dom.getAttribute('data-flex-direction');
        let alignItems = dom.getAttribute('data-align-items');
        let justifyContent = dom.getAttribute('data-justify-content');
        let alignContent = dom.getAttribute('data-align-content');
        let gap = dom.getAttribute('data-gap');

        try { gridCols = JSON.parse(gridCols || '1'); } catch(e) {}
        try { padding = JSON.parse(padding || '"py-8"'); } catch(e) {}
        try { minHeight = JSON.parse(minHeight || 'null'); } catch(e) {}
        try { flexDirection = JSON.parse(flexDirection || '"row"'); } catch(e) {}
        try { alignItems = JSON.parse(alignItems || '"stretch"'); } catch(e) {}
        try { justifyContent = JSON.parse(justifyContent || '"start"'); } catch(e) {}
        try { alignContent = JSON.parse(alignContent || '"start"'); } catch(e) {}
        try { gap = JSON.parse(gap || '"1.5rem"'); } catch(e) {}

        return { gridCols, padding, minHeight, flexDirection, alignItems, justifyContent, alignContent, gap };
      }
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'layout-row' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LayoutRowComponent);
  },
});
