/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';
import { Menu, Link as LinkIcon } from 'lucide-react';

const NavigationComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, links, textAlign, logoText } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;
  const { activePageId } = useProjectStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this navigation?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/nav relative my-4 w-full',
        textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
      )}
    >
      <div className={cn(
        'w-full flex items-center justify-between p-6 transition-all duration-300 rounded-2xl',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="NAVIGATION"
          selected={selected}
          isActive={editor.isActive('navigationElement')}
          node={node}
          groupName="navigation"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        {/* LOGO */}
        <div className="text-lg font-black tracking-tighter italic uppercase text-slate-900 dark:text-white">
          {logoText || 'LANDO'}
        </div>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8">
           {links.map((link: any, idx: number) => (
             <a 
               key={idx}
               href={link.url}
               onClick={(e) => e.preventDefault()}
               className={cn(
                 "text-[10px] font-black uppercase tracking-widest italic transition-all hover:text-indigo-600 dark:hover:text-indigo-400",
                 link.url === '#' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
               )}
             >
               {link.label}
             </a>
           ))}
        </div>

        {/* MOBILE TOGGLE (Simulation) */}
        <div className="md:hidden p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
           <Menu className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const NavigationElement = Node.create({
  name: 'navigationElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      logoText: { default: 'LANDO' },
      links: {
        default: [
          { label: 'HOME', url: '/' },
          { label: 'FEATURES', url: '/features' },
          { label: 'PRICING', url: '/pricing' },
          { label: 'CONTACT', url: '/contact' },
        ],
        parseHTML: element => {
          const val = element.getAttribute('data-links');
          try { return JSON.parse(val || '[]'); } catch (e) { return []; }
        },
        renderHTML: attributes => ({
          'data-links': JSON.stringify(attributes.links)
        })
      },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'nav[data-type="navigation-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['nav', mergeAttributes(HTMLAttributes, { 'data-type': 'navigation-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NavigationComponent);
  },
});
