import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const FreeRowComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { gap, gridCols, displayType, flexWrap, height, maxWidth } = node.attrs;
  const childCount = node.childCount;

  let isCustom = typeof gridCols === 'string' && gridCols.includes('sidebar');
  
  let colsClass = '';
  if (displayType === 'grid') {
    if (isCustom) {
      colsClass = {
        'left-sidebar': 'grid-cols-1 md:grid-cols-[1fr_2fr]',
        'right-sidebar': 'grid-cols-1 md:grid-cols-[2fr_1fr]',
      }[gridCols as string] || '';
    } else {
      const cols = Math.max(1, Math.min(childCount, 12));
      colsClass = {
         1: 'grid-cols-1',
         2: 'grid-cols-1 md:grid-cols-2',
         3: 'grid-cols-1 md:grid-cols-3',
         4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
         5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
         6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
      }[cols] || `grid-cols-1 md:grid-cols-${cols}`;
    }
  }

  const baseDisplayClass = displayType === 'flex' ? `flex ${flexWrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'}` : 'grid';
  const sizeClass = `${height === 'auto' ? '' : height} ${maxWidth === 'w-full' ? 'w-full' : maxWidth}`;

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  return (
    <NodeViewWrapper className={cn("group/row relative w-full my-4", height !== 'auto' && height)}>
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

      <div 
        onClick={handleSelectNode}
        className={cn(
          "absolute -top-7 left-0 bg-slate-800 text-[8px] text-white px-2 py-1 rounded font-black uppercase tracking-widest z-40 cursor-pointer opacity-0 group-hover/row:opacity-100 transition-opacity",
          selected && "opacity-100"
        )}
      >
        ROW - {isCustom ? gridCols : childCount} COLS
      </div>

      <div 
        className={cn(
          "transition-all duration-300 gap-6 lg:gap-8 items-center",
          baseDisplayClass,
          colsClass,
          sizeClass,
          selected ? "ring-2 ring-slate-800 ring-offset-4 rounded-xl" : "hover:ring-1 hover:ring-slate-300"
        )}
      >
        <NodeViewContent style={{ display: 'contents' }} />
      </div>
    </NodeViewWrapper>
  );
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    freeRow: {
      updateGridCols: (cols: number | string) => ReturnType;
      addFreeColumn: () => ReturnType;
    }
  }
}

export const FreeRowExtension = Node.create({
  name: 'freeRow',
  group: 'layoutBlock',
  content: 'freeColumn+',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      gap: { default: '1.5rem' },
      gridCols: { default: 2 }, // 1, 2, 3, 4, 'left-sidebar', 'right-sidebar'
      displayType: { default: 'grid' }, // 'grid' | 'flex'
      flexWrap: { default: 'wrap' }, // 'wrap' | 'nowrap'
      height: { default: 'auto' }, // 'auto' | 'min-h-screen' | 'h-screen'
      maxWidth: { default: 'max-w-7xl mx-auto' }, // 'max-w-7xl mx-auto' | 'w-full'
    };
  },

  addCommands() {
    return {
      addFreeColumn: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        let pos = selection.from;
        let rowNode = null;
        let rowPos = -1;

        if ('node' in selection && (selection as any).node.type.name === 'freeRow') {
          rowNode = (selection as any).node;
          rowPos = selection.from;
        } else {
          while (pos > 0) {
            const node = state.doc.nodeAt(pos) || state.doc.resolve(pos).node();
            if (node && node.type.name === 'freeRow') {
              rowNode = node;
              rowPos = state.doc.resolve(pos).depth === 0 ? pos : state.doc.resolve(pos).before();
              break;
            }
            const resolved = state.doc.resolve(pos);
            if (resolved.depth === 0) break;
            pos = resolved.before();
          }
        }

        if (!rowNode || rowPos === -1) return false;

        if (dispatch) {
          const newChildCount = rowNode.childCount + 1;
          const isCustom = typeof rowNode.attrs.gridCols === 'string' && rowNode.attrs.gridCols.includes('sidebar');
          const newGridCols = isCustom ? rowNode.attrs.gridCols : newChildCount;
          
          tr.insert(rowPos + rowNode.nodeSize - 1, state.schema.nodes.freeColumn.createAndFill()!);
          tr.setNodeMarkup(rowPos, undefined, { ...rowNode.attrs, gridCols: newGridCols });
        }
        
        return true;
      },
      updateGridCols: (newCols: number | string) => ({ tr, state, dispatch }) => {
        const { selection } = state;
        let pos = selection.from;
        let rowNode = null;
        let rowPos = -1;

        if ('node' in selection && (selection as any).node.type.name === 'freeRow') {
          rowNode = (selection as any).node;
          rowPos = selection.from;
        } else {
          while (pos > 0) {
            const node = state.doc.nodeAt(pos) || state.doc.resolve(pos).node();
            if (node && node.type.name === 'freeRow') {
              rowNode = node;
              rowPos = state.doc.resolve(pos).depth === 0 ? pos : state.doc.resolve(pos).before();
              break;
            }
            const resolved = state.doc.resolve(pos);
            if (resolved.depth === 0) break;
            pos = resolved.before();
          }
        }

        if (!rowNode || rowPos === -1) return false;

        if (dispatch) {
            const targetCount = typeof newCols === 'number' ? newCols : 2;
            const currentCount = rowNode.childCount;
    
            tr.setNodeMarkup(rowPos, undefined, { ...rowNode.attrs, gridCols: newCols });
    
            if (targetCount > currentCount) {
              const colsToAdd = targetCount - currentCount;
              const newColsArr = [];
              for (let i = 0; i < colsToAdd; i++) {
                newColsArr.push(state.schema.nodes.freeColumn.createAndFill()!);
              }
              tr.insert(rowPos + rowNode.nodeSize - 1, newColsArr);
            } else if (targetCount < currentCount) {
              let endPos = rowPos + rowNode.nodeSize - 1;
              for (let i = 0; i < currentCount - targetCount; i++) {
                const childNode = rowNode.child(currentCount - 1 - i);
                tr.delete(endPos - childNode.nodeSize, endPos);
                endPos -= childNode.nodeSize;
              }
            }
        }
        
        return true;
      }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="free-row"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'free-row' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FreeRowComponent);
  },
});
