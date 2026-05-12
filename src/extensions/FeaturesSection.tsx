import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { cn } from '../lib/utils';

const FeaturesSectionNodeView = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id: sectionId } = node.attrs;
  const drillDownId = useUIStore((state) => state.drillDownId);
  const setDrillDownId = useUIStore((state) => state.setDrillDownId);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  
  const isDrilledDown = drillDownId === sectionId;
  const isFocused = selected || useUIStore.getState().focusedId === sectionId;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDrillDownId(sectionId);
  };
  
  const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isDrilledDown) {
          const { getPos } = props;
          if (typeof getPos === 'function') {
             editor.commands.setNodeSelection(getPos());
          }
      }
  };

  return (
    <NodeViewWrapper className="group relative">
      <div 
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={cn(
          "py-24 px-6 bg-white transition-all m-4 rounded overflow-hidden relative",
          isFocused ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-100 shadow-sm",
          isDrilledDown ? "cursor-default" : "cursor-pointer"
        )}
      >
        {isFocused && (
          <div className="absolute top-0 left-4 bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-b font-black z-30 shadow-lg font-mono flex items-center gap-2">
            <span>FEATURES_SECTION.NODE</span>
            {isDrilledDown && <span className="bg-white/20 px-1 rounded">EDITING_INTERNALS</span>}
          </div>
        )}

        {/* Interaction Shield */}
        {!isDrilledDown && (
          <div className="absolute inset-0 z-20 bg-transparent" />
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          <NodeViewContent />
        </div>

        {/* Drill-Down Badge/Action */}
        {isFocused && !isDrilledDown && (
          <div className="absolute top-4 right-4 z-30 animate-in fade-in slide-in-from-top-1">
             <button 
              onClick={(e) => { e.stopPropagation(); setDrillDownId(sectionId); }}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
             >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Edit Details
             </button>
          </div>
        )}
        
        {isDrilledDown && (
          <div className="absolute top-4 right-4 z-30">
             <button 
              onClick={(e) => { e.stopPropagation(); setDrillDownId(null); }}
              className="bg-slate-800 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all"
             >
                Finish Editing
             </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const FeaturesSection = Node.create({
  name: 'featuresSection',
  group: 'block levelThreeElement',
  content: 'sectionHeading sectionGrid',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      background: { default: 'bg-white' },
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-type="features-section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-type': 'features-section' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FeaturesSectionNodeView);
  },
});
