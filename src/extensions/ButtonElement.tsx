import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { ExternalLink } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';
import * as LucideIcons from 'lucide-react';

const ButtonComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { 
    id, 
    text, 
    link, 
    variant, 
    color, 
    gradient,
    size, 
    borderRadius, 
    width, 
    marginTop, 
    transform, 
    fontStyle, 
    textTransform, 
    fontFamily,
    fontWeight,
    letterSpacing,
    leadingIcon,
    trailingIcon,
    borderWidth,
    borderColor,
    shadow,
    hoverEffect,
    blur,
    opacity
  } = node.attrs;

  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: 'Delete Button',
      message: 'Are you sure you want to remove this button?',
      variant: 'danger',
      onConfirm: () => {
        const pos = getPos();
        if (typeof pos === 'number') {
          editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
        }
      }
    });
  };

  const LeadingIconComp = leadingIcon ? (LucideIcons as any)[leadingIcon] : null;
  const TrailingIconComp = trailingIcon ? (LucideIcons as any)[trailingIcon] : null;

  const buttonTransform = transform || 'skew-x-[-10deg]';
  const innerTransform = buttonTransform.includes('skew-x--')
    ? buttonTransform.replace('skew-x--', 'skew-x-')
    : buttonTransform.includes('skew-x-')
      ? buttonTransform.replace('skew-x-', 'skew-x--')
      : '';

  const baseColor = color || 'var(--primary-color)';

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: borderColor || baseColor,
          color: baseColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: baseColor,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: `blur(${blur || 8}px)`,
          borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
          color: color || '#ffffff',
        };
      case 'soft':
        return {
          backgroundColor: color ? `${color}15` : 'rgba(var(--primary-color-rgb), 0.1)',
          borderColor: 'transparent',
          color: baseColor,
        };
      case 'primary':
      default:
        return {
          backgroundColor: gradient || baseColor,
          backgroundImage: gradient ? gradient : undefined,
          borderColor: 'transparent',
          color: '#ffffff',
        };
    }
  };

  const getHoverClasses = () => {
    switch (hoverEffect) {
      case 'scale': return 'hover:scale-105 active:scale-95';
      case 'glow': return 'hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]';
      case 'lift': 
      default: return 'hover:-translate-y-1 active:translate-y-0';
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/btn relative my-4 inline-block transition-all',
        width === 'full' ? 'w-full' : 'w-auto',
        (isHovered || selected) ? 'z-[300]' : 'z-10'
      )}
      style={{ marginTop: marginTop || '0px' }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
      }}
    >
      <div className={cn(
        'relative transition-all duration-300',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl shadow-2xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-2 rounded-xl',
        isHovered && 'ring-4 ring-indigo-500/40 z-[301] shadow-2xl'
      )}>
        <ElementToolbar
          label="BUTTON"
          selected={selected}
          isActive={editor.isActive('buttonElement')}
          node={node}
          groupName="btn"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <button
          style={{
            ...getVariantStyles(),
            borderRadius: borderRadius || '0.75rem',
            fontFamily: fontFamily || 'var(--font-heading)',
            borderWidth: borderWidth || (variant === 'secondary' ? '2px' : '0px'),
            opacity: opacity !== undefined ? opacity / 100 : 1,
            letterSpacing: letterSpacing || 'normal',
          }}
          className={cn(
            'transition-all text-center shadow-xl border-solid flex items-center justify-center',
            fontWeight || 'font-black',
            buttonTransform,
            fontStyle || 'italic',
            textTransform || 'uppercase',
            size === 'sm' ? 'px-6 py-2.5 text-[8px]' : size === 'lg' ? 'px-12 py-5 text-[12px]' : 'px-9 py-4 text-[10px]',
            width === 'full' ? 'w-full' : 'w-auto',
            shadow,
            getHoverClasses(),
            variant === 'secondary' && !borderColor && 'dark:bg-slate-900/40'
          )}
        >
          <div className={cn('flex items-center justify-center gap-2.5', innerTransform)}>
            {LeadingIconComp && <LeadingIconComp className="w-3.5 h-3.5" />}
            {text || 'BUTTON'}
            {TrailingIconComp && <TrailingIconComp className="w-3.5 h-3.5" />}
            {!leadingIcon && !trailingIcon && link && variant === 'ghost' && <ExternalLink className="w-3 h-3 opacity-50" />}
          </div>
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export const ButtonElement = Node.create({
  name: 'buttonElement',
  group: 'block',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      text: { default: 'CLICK ME' },
      link: { default: '#' },
      variant: { default: 'primary' },
      color: { default: null },
      gradient: { default: null },
      size: { default: 'md' },
      borderRadius: { default: '0.75rem' },
      width: { default: 'auto' },
      marginTop: { default: '0px' },
      transform: { default: 'skew-x-[-10deg]' },
      fontStyle: { default: 'italic' },
      textTransform: { default: 'uppercase' },
      fontFamily: { default: null },
      fontWeight: { default: 'font-black' },
      letterSpacing: { default: null },
      leadingIcon: { default: null },
      trailingIcon: { default: null },
      borderWidth: { default: null },
      borderColor: { default: null },
      shadow: { default: 'shadow-xl' },
      hoverEffect: { default: 'lift' },
      blur: { default: 0 },
      opacity: { default: 100 }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="button-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'button-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonComponent);
  },
});

