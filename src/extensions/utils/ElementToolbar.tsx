/**
 * ElementToolbar — Shared floating toolbar for all block elements.
 *
 * Renders:
 *  - A hover-visible grip icon on the left (always present for drag affordance)
 *  - A top-right floating label strip (visible on select/active) containing:
 *      ◉ Drag handle (GripVertical)
 *      ◉ Type label pill
 *      ◉ Copy button (copies node JSON to clipboard store)
 *      ◉ Move Up / Move Down buttons (optional)
 *      ◉ Delete button
 *
 * Usage:
 *  <ElementToolbar
 *    label="HEADLINE"
 *    selected={selected}
 *    isActive={editor.isActive('heroHeadline')}
 *    node={node}                             ← pass the ProseMirror node for Copy
 *    onDelete={handleDelete}
 *    onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
 *    onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
 *    onSelect={() => editor.commands.setNodeSelection(getPos())}
 *    groupName="headline"     // used for group-hover/[groupName]:opacity-100
 *  />
 */
import React, { useState } from 'react';
import { GripVertical, Trash2, ArrowUp, ArrowDown, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/useUIStore';
import type { Node as ProsemirrorNode } from '@tiptap/pm/model';

interface ElementToolbarProps {
  /** Short uppercase label shown in the floating pill, e.g. "HEADLINE H1" */
  label: string;
  /** Whether this node is currently selected (NodeSelection) */
  selected: boolean;
  /** Whether editor.isActive(nodeType) returns true */
  isActive: boolean;
  /** Tailwind group name — must match group/[name] on NodeViewWrapper, e.g. "headline" */
  groupName: string;
  /** The ProseMirror node — used for Copy action */
  node?: ProsemirrorNode;
  /** Called when the Delete button is clicked */
  onDelete: (e: React.MouseEvent) => void;
  /** Called when Move Up is clicked. Omit to hide the button. */
  onMoveUp?: (e: React.MouseEvent) => void;
  /** Called when Move Down is clicked. Omit to hide the button. */
  onMoveDown?: (e: React.MouseEvent) => void;
  /** Called when the label pill is clicked (selects the node) */
  onSelect?: () => void;
  /** Extra Tailwind classes for the left-side hover grip container */
  gripClassName?: string;
}

export const ElementToolbar: React.FC<ElementToolbarProps> = ({
  label,
  selected,
  isActive,
  groupName,
  node,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSelect,
  gripClassName,
}) => {
  const showActions = selected || isActive;
  const setCopiedNode = useUIStore(state => state.setCopiedNode);
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node) return;

    const json = node.toJSON() as Record<string, unknown>;
    // Always regenerate id so paste creates a unique clone
    if (json.attrs && typeof json.attrs === 'object') {
      json.attrs = { ...(json.attrs as Record<string, unknown>), id: crypto.randomUUID() };
    }

    setCopiedNode(json);

    // Also mirror to localStorage for cross-tab persistence (backward compat)
    try { localStorage.setItem('lando-clipboard', JSON.stringify(json)); } catch {}

    // Visual "Copied!" feedback for 1.5s
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1500);
  };

  return (
    <>
      {/* ── Left hover grip — always visible on hover, acts as drag affordance ── */}
      <div
        data-drag-handle
        className={cn(
          'absolute -left-7 top-1/2 -translate-y-1/2 z-50',
          'transition-all duration-200',
          `opacity-0 group-hover/${groupName}:opacity-100`,
          selected && 'opacity-100',
          'bg-slate-900/50 backdrop-blur-md text-white p-1 rounded-full',
          'cursor-grab active:cursor-grabbing shadow-xl border border-white/20 pointer-events-auto',
          gripClassName,
        )}
        title="Drag to reorder"
      >
        <GripVertical className="w-3 h-3" />
      </div>

      {/* ── Top-right floating label strip ── */}
      <div
        className={cn(
          'absolute -top-7 right-0 flex flex-row-reverse items-center gap-1',
          'transition-all duration-200 z-50',
          showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
        )}
      >
        {/* Delete */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onDelete}
          className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>

        {/* Move Down */}
        {onMoveDown && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMoveDown}
            className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Move Down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        )}

        {/* Move Up */}
        {onMoveUp && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMoveUp}
            className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Move Up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        )}

        {/* Copy — only shown when node prop is provided */}
        {node && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleCopy}
            className={cn(
              'backdrop-blur-md text-white p-1 rounded-full shadow-xl transition-all hover:scale-110 active:scale-90 pointer-events-auto',
              justCopied
                ? 'bg-emerald-500/90 hover:bg-emerald-600'
                : 'bg-slate-700/80 hover:bg-slate-900'
            )}
            title={justCopied ? 'Copied!' : 'Copy element'}
          >
            {justCopied
              ? <Check className="w-3 h-3" />
              : <Copy className="w-3 h-3" />
            }
          </button>
        )}

        {/* Type label pill */}
        <div
          onClick={onSelect}
          className="bg-slate-900/40 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer pointer-events-auto whitespace-nowrap"
        >
          {label}
        </div>

        {/* Drag handle in the label strip */}
        <div
          data-drag-handle
          className="bg-slate-900/40 backdrop-blur-md text-white p-1 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl border border-white/20"
          title="Drag to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </div>
      </div>
    </>
  );
};
