/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import Link from 'next/link';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';
import { Menu, Zap, Globe } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const NavigationComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { 
    id, 
    links, 
    textAlign, 
    logoText, 
    logoType,
    logoImage,
    logoHeight,
    variant, 
    isSticky, 
    paddingY,
    logoColor,
    ctaText,
    showCTA
  } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const colorMode = useThemeStore(state => state.colorMode);
  const isHovered = hoveredId === id;

  // 🚀 LOGO THEME ADAPTATION: If using default logo, switch based on theme
  const activeLogo = (logoImage === '/logo.svg' || logoImage === '/logo-dark.svg') 
    ? (colorMode === 'dark' ? '/logo-dark.svg' : '/logo.svg')
    : logoImage;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this navigation?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      onClick={handleSelect}
      className={cn(
        'group/nav relative my-4 w-full transition-all duration-700 ease-in-out',
        isSticky && 'sticky top-0 z-[1000]',
        textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
      )}
    >
      <div className={cn(
        'w-full flex items-center justify-between transition-all duration-500 rounded-[2rem]',
        paddingY || 'p-6',
        variant === 'glass' && 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]',
        variant === 'outline' && 'bg-transparent border-2 border-slate-100 dark:border-slate-800',
        variant === 'minimal' && 'bg-transparent',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4',
        isHovered && 'ring-4 ring-indigo-500/10 z-50 shadow-2xl'
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

        {/* 🚀 BRANDING AREA */}
        <div className="flex items-center gap-3 group/logo cursor-pointer shrink-0">
          {logoType === 'image' && activeLogo ? (
            <img 
              src={activeLogo} 
              alt="Logo" 
              className="object-contain transition-all duration-700 group-hover/logo:scale-110 group-hover/logo:rotate-2"
              style={{ height: logoHeight || '40px' }}
            />
          ) : (
            <>
              <div className="w-11 h-11 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover/logo:scale-110 group-hover/logo:rotate-12 transition-all duration-500">
                 <Zap className="w-6 h-6 fill-current" />
              </div>
              <div 
                className={cn(
                   "text-2xl font-black tracking-tighter italic uppercase transition-all duration-300",
                   "bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400"
                )}
                style={logoColor ? { backgroundImage: 'none', color: logoColor } : {}}
              >
                {logoText || 'LANDO'}
              </div>
            </>
          )}
        </div>

        {/* 🚀 NAVIGATION LINKS */}
        <div className={cn(
          "hidden lg:flex items-center gap-10",
          textAlign === 'text-center' && "absolute left-1/2 -translate-x-1/2"
        )}>
           {links.map((link: any, idx: number) => (
             <Link 
               key={idx}
               href={link.url}
               onClick={(e) => {
                 if (editor.isEditable) e.preventDefault();
               }}
               className={cn(
                 "text-[11px] font-black uppercase tracking-[0.25em] italic transition-all duration-300 relative group/link py-2",
                 link.url === '#' || link.url === '/' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
               )}
             >
               {link.label}
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-500 group-hover/link:w-full" />
             </Link>
           ))}
        </div>

        {/* 🚀 ACTION AREA */}
        <div className="flex items-center gap-4 shrink-0">
           {showCTA && (
             <button className="hidden sm:flex items-center gap-2 px-7 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/10 dark:shadow-none border border-white/10">
                {ctaText || 'Get Started'}
                <Globe className="w-3.5 h-3.5" />
             </button>
           )}
           <div className="lg:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <Menu className="w-5 h-5" />
           </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const NavigationElement = Node.create({
  name: 'navigationElement',
  group: 'block',
  draggable: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      logoType: { default: 'image' },
      logoText: { default: 'FrostUI' },
      logoImage: { default: '/logo.svg' },
      logoHeight: { default: '45px' },
      variant: { default: 'glass' }, 
      isSticky: { default: false },
      paddingY: { default: 'p-6' },
      logoColor: { default: null },
      showCTA: { default: true },
      ctaText: { default: 'GET STARTED' },
      links: {
        default: [
          { label: 'HOME', url: '/' },
          { label: 'FEATURES', url: '/features' },
          { label: 'PRICING', url: '/pricing' },
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
