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
  // Row is Horizontal by default (flex-row)
  if (displayType === 'flex') {
    const direction = {
      'row': 'flex-row',
      'row-reverse': 'flex-row-reverse',
      'col': 'flex-col',
      'col-reverse': 'flex-col-reverse'
    }[flexDirection as string] || 'flex-row';

    const align = {
      'start': 'items-start',
      'center': 'items-center',
      'end': 'items-end',
      'stretch': 'items-stretch'
    }[alignItems as string] || 'items-center'; // Center align horizontally by default

    const justify = {
      'start': 'justify-start',
      'center': 'justify-center',
      'end': 'justify-end',
      'between': 'justify-between',
      'around': 'justify-around'
    }[justifyContent as string] || 'justify-start';

    return `flex ${direction} ${align} ${justify} flex-wrap`;
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

  return (
  <NodeViewWrapper 
    onClick={handleSelectNode}
    onDoubleClick={handleDoubleClick}
    className={cn(
      "group/row relative w-full my-6 cursor-pointer transition-all duration-300",
      getResponsiveSpacing(padding, 'py'),
      // Subtle indicator always visible
      "border-2 border-dashed border-slate-200/60 rounded-[2.5rem] hover:border-indigo-300/50"
    )}
    style={{
      minHeight: currentMinHeight !== 'auto' ? currentMinHeight : undefined,
      marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined,
      backgroundColor: background || 'transparent',
    }}
  >
    {/* Background Image Layer */}
    {bgImage && (
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2.5rem]"
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
        className="absolute inset-0 z-1 pointer-events-none rounded-[2.5rem]"
        style={{
          backgroundColor: bgOverlay,
          opacity: bgOpacity !== undefined ? bgOpacity / 100 : 0.4
        }}
      />
    )}

    {/* Hierarchy Indicator Tag (Always Visible but Subtle) */}
    <div className="absolute -top-3 left-8 flex items-center gap-2 z-30 pointer-events-none">
      <div className={cn(
        "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-[0.2em] transition-all",
        selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover/row:bg-indigo-100 group-hover/row:text-indigo-500"
      )}>
        {selected ? 'Active Row' : 'Level 1: Row'}
      </div>
    </div>
    {/* Empty Row Placeholder */}
    {isRowEmpty && (
      <div className="absolute inset-0 m-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30 flex items-center justify-center pointer-events-none z-10">
        <div className="flex flex-col items-center gap-2 opacity-40">
          <Layout className="w-8 h-8 text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Empty Row - Drop Columns Here</span>
        </div>
      </div>
    )}
    {/* Drag Handle */}
    <div className={cn(
      "absolute -left-10 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity z-50",
      selected && "opacity-100"
    )}>
      <div 
        data-drag-handle 
        onClick={handleSelectNode}
        className="bg-slate-800 text-white p-1.5 rounded-lg cursor-grab active:cursor-grabbing shadow-lg"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>

    {/* Label & Actions */}
    <div 
      className={cn(
        "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-all z-40",
        selected && "opacity-100 translate-y-0",
        !selected && "translate-y-2"
      )}
    >
      <button 
        onClick={handleDelete}
        className="bg-rose-500 text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
        title="Delete Row"
      >
         <Trash2 className="w-2.5 h-2.5" />
      </button>
      <div 
        onClick={handleSelectNode}
        className="bg-indigo-600 text-[8px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest cursor-pointer shadow-xl"
      >
        STRUCTURE: {displayType.toUpperCase()} {displayType === 'grid' ? `(${targetCols} COLS)` : ''}
      </div>
    </div>

    <div 
      className={cn(
        "transition-all duration-500 ease-out px-6 w-full relative z-10",
        selected ? "ring-4 ring-indigo-500/20 ring-offset-4 rounded-[2rem] border-2 border-indigo-100" : "hover:ring-2 hover:ring-indigo-100 hover:rounded-2xl"
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
        style={{ gap: gap || '1.5rem' }}
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
            className="group/slot border-2 border-dashed border-slate-100 rounded-2xl min-h-[120px] flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
          >
             <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover/slot:text-indigo-500 group-hover/slot:scale-110 transition-all">
                <Plus className="w-4 h-4" />
             </div>
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover/slot:text-indigo-400">Add Column</span>
          </div>
        ))}
      </div>
    </div>

    {/* Add Column Button Line */}
    <div className="absolute -bottom-4 left-0 right-0 h-8 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity z-40">
      <div className="w-full h-[1px] bg-indigo-200 absolute"></div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          editor.commands.addLayoutColumn();
        }}
        className="relative bg-white border border-indigo-200 text-indigo-600 rounded-full p-1.5 shadow-xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 flex items-center gap-1.5 px-3"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="text-[9px] font-black uppercase tracking-widest italic">Add New Column</span>
      </button>
    </div>

    {/* 🚀 Visual Resize Handle */}
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
    flexDirection: { default: 'row' },
    alignItems: { default: 'stretch' },
    justifyContent: { default: 'start' },
    gap: { default: '1.5rem' },
    background: { default: null },
    bgImage: { default: null },
    bgOverlay: { default: null },
    bgOpacity: { default: 40 },
    bgPosition: { default: 'center' },
    bgSize: { default: 'cover' },
    padding: { 
      default: 'py-8',
      keepAttributes: true,
      parseHTML: element => element.getAttribute('data-padding'),
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
          tr.insert(rowPos + rowNode.nodeSize - 1, state.schema.nodes.layoutColumn.createAndFill()!);
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
    
            if (targetCount > currentCount) {
              const colsToAdd = targetCount - currentCount;
              const newColsArr = [];
              for (let i = 0; i < colsToAdd; i++) {
                newColsArr.push(state.schema.nodes.layoutColumn.createAndFill()!);
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
        try { gridCols = JSON.parse(gridCols || '1'); } catch(e) {}
        try { padding = JSON.parse(padding || '"py-8"'); } catch(e) {}
        try { minHeight = JSON.parse(minHeight || 'null'); } catch(e) {}
        return { gridCols, padding, minHeight };
      }
    }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'layout-row' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LayoutRowComponent);
  },
});
