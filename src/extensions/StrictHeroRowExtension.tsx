import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const StrictHeroRowComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { gridCols, displayType, flexWrap, height, maxWidth } = node.attrs;

  let colsClass = '';
  if (displayType === 'grid') {
    colsClass = gridCols === 1 ? 'grid-cols-1' : 
                gridCols === 'left-sidebar' ? 'grid-cols-1 md:grid-cols-[1fr_2fr]' :
                gridCols === 'right-sidebar' ? 'grid-cols-1 md:grid-cols-[2fr_1fr]' :
                'grid-cols-1 md:grid-cols-2';
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
          className="bg-indigo-800 text-white p-1.5 rounded-lg cursor-grab active:cursor-grabbing shadow-lg"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div 
        onClick={handleSelectNode}
        className={cn(
          "absolute -top-7 left-0 bg-indigo-800 text-[8px] text-white px-2 py-1 rounded font-black uppercase tracking-widest z-40 cursor-pointer opacity-0 group-hover/row:opacity-100 transition-opacity",
          selected && "opacity-100"
        )}
      >
        HERO ROW - {gridCols || 2} COLS
      </div>

      <div 
        className={cn(
          "transition-all duration-300 gap-8 items-center",
          baseDisplayClass,
          colsClass,
          sizeClass,
          selected ? "ring-2 ring-indigo-800 ring-offset-4 rounded-xl" : "hover:ring-1 hover:ring-indigo-300"
        )}
      >
        <NodeViewContent style={{ display: 'contents' }} />
      </div>
    </NodeViewWrapper>
  );
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    strictHeroRow: {
      updateGridCols: (cols: number | string) => ReturnType;
    }
  }
}

export const StrictHeroRowExtension = Node.create({
  name: 'strictHeroRow',
  group: 'layoutBlock',
  content: 'strictHeroColumn strictHeroColumn', // EXACTLY two strict columns
  draggable: true,
  defining: true,
  
  addAttributes() {
    return {
      id: { default: null },
      gridCols: { default: 2 },
      displayType: { default: 'grid' }, // 'grid' | 'flex'
      flexWrap: { default: 'wrap' }, // 'wrap' | 'nowrap'
      height: { default: 'auto' },
      maxWidth: { default: 'max-w-7xl mx-auto' },
    };
  },

  addCommands() {
    return {
      updateGridCols: (newCols: number | string) => ({ tr, state, dispatch }: any) => {
        const { selection } = state;
        let pos = selection.from;
        let rowNode = null;
        let rowPos = -1;

        if ('node' in selection && (selection as any).node.type.name === 'strictHeroRow') {
          rowNode = (selection as any).node;
          rowPos = selection.from;
        } else {
          while (pos > 0) {
            const node = state.doc.nodeAt(pos) || state.doc.resolve(pos).node();
            if (node && node.type.name === 'strictHeroRow') {
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
          tr.setNodeMarkup(rowPos, undefined, { ...rowNode.attrs, gridCols: newCols });
        }
        
        return true;
      }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="strict-hero-row"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'strict-hero-row' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(StrictHeroRowComponent);
  },
});
