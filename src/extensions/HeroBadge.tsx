import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';
import * as LucideIcons from 'lucide-react';

const HeroBadgeComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { 
    id, 
    color, 
    textAlign, 
    letterSpacing, 
    fontSizeScale,
    icon,
    iconPosition,
    variant,
    fontStyle,
    transform,
    textTransform,
    borderRadius,
    borderWidth,
    borderColor,
    shadow,
    blur,
    grayscale,
    opacity
  } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this badge?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const IconComponent = icon ? (LucideIcons as any)[icon] : null;
  const isItalic = fontStyle === 'italic' || (!fontStyle);
  const isUppercase = textTransform === 'uppercase' || (!textTransform);
  
  // Default transform for Lando style is skew
  const badgeTransform = transform || 'skew-x-[-10deg]';
  const innerTransform = badgeTransform.includes('skew-x--')
    ? badgeTransform.replace('skew-x--', 'skew-x-')
    : badgeTransform.includes('skew-x-')
      ? badgeTransform.replace('skew-x-', 'skew-x--')
      : '';

  const getVariantStyles = () => {
    const baseColor = color || 'var(--primary-color)';
    switch (variant) {
      case 'outline':
        return {
          color: baseColor,
          backgroundColor: 'transparent',
          border: `${borderWidth || '1px'} solid ${borderColor || baseColor}`,
        };
      case 'solid':
        return {
          color: '#ffffff',
          backgroundColor: baseColor,
          border: `${borderWidth || '1px'} solid ${borderColor || 'transparent'}`,
        };
      case 'glass':
        return {
          color: baseColor,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: `blur(${blur || 8}px)`,
          border: `${borderWidth || '1px'} solid rgba(255, 255, 255, 0.2)`,
        };
      case 'subtle':
      default:
        return {
          color: baseColor,
          backgroundColor: color ? `${color}15` : 'rgba(var(--primary-color-rgb), 0.1)',
          border: `${borderWidth || '1px'} solid ${borderColor || 'rgba(var(--primary-color-rgb), 0.1)'}`,
        };
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/badge w-full relative my-2 z-10',
        textAlign === 'text-center' ? 'flex justify-center' : textAlign === 'text-right' ? 'flex justify-end' : 'flex justify-start'
      )}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className={cn(
        'relative transition-all duration-300 py-1',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-lg' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-lg',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="BADGE"
          selected={selected}
          isActive={editor.isActive('heroBadge')}
          node={node}
          groupName="badge"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div
          style={{
            ...getVariantStyles(),
            letterSpacing: letterSpacing || '0.2em',
            borderRadius: borderRadius || '0.5rem',
            opacity: opacity !== undefined ? opacity / 100 : 1,
            filter: grayscale ? `grayscale(${grayscale}%)` : undefined,
            ...getFontSize()
          }}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black outline-none min-w-[50px] min-h-[1.5em] transition-all duration-300",
            badgeTransform,
            isItalic ? 'italic' : 'not-italic',
            isUppercase ? 'uppercase' : 'normal-case',
            shadow
          )}
        >
          <div className={cn("flex items-center gap-2", innerTransform)}>
            {IconComponent && iconPosition !== 'right' && <IconComponent className="w-3 h-3" />}
            <NodeViewContent />
            {IconComponent && iconPosition === 'right' && <IconComponent className="w-3 h-3" />}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroBadge = Node.create({
  name: 'heroBadge',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      color: { default: null },
      textAlign: { default: 'text-left' },
      letterSpacing: { default: '0.2em' },
      fontSizeScale: { default: 0.7 },
      icon: { default: null },
      iconPosition: { default: 'left' },
      variant: { default: 'subtle' },
      fontStyle: { default: 'italic' },
      transform: { default: 'skew-x-[-10deg]' },
      textTransform: { default: 'uppercase' },
      borderRadius: { default: '0.5rem' },
      borderWidth: { default: '1px' },
      borderColor: { default: null },
      shadow: { default: 'shadow-sm' },
      blur: { default: 0 },
      grayscale: { default: 0 },
      opacity: { default: 100 }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-badge"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-badge' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroBadgeComponent);
  },
});

