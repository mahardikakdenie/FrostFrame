import React from 'react';
import { createPortal } from 'react-dom';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropIndicatorProps {
  indicator: {
    top: number;
    left: number;
    width: number;
    side: 'top' | 'bottom' | 'inside';
    label: string;
  } | null;
}

const GHOST_HEIGHT = 120;
const SLOT_HEIGHT = 40;

/**
 * Visual Drop Indicator component.
 * Renders a line for top/bottom insertion and a ghost box for empty containers.
 */
export const DropIndicator = ({ indicator }: DropIndicatorProps) => {
  if (!indicator) return null;

  return (
    <>
      {/* LINE INDICATOR — cursor-aware: appears exactly above or below the target element */}
      {indicator.side !== 'inside' && createPortal(
        <div
          data-drop-ghost
          style={{
            position: 'fixed',
            top: (indicator.side === 'top' ? indicator.top - SLOT_HEIGHT : indicator.top) - 2,
            left: indicator.left,
            width: indicator.width,
            height: 4,
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 50%, #a78bfa 100%)',
            borderRadius: 4,
            boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 16px 4px rgba(99,102,241,0.55)',
            transition: 'top 80ms ease-out, width 80ms ease-out',
          }}
        >
          {/* ... (rest of the line indicator JSX) */}
          {/* Left endpoint dot */}
          <div style={{
            position: 'absolute',
            left: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#6366f1',
            boxShadow: '0 0 10px 3px rgba(99,102,241,0.7)',
            border: '2px solid white',
          }} />

          {/* Centre label pill */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: -22,
            transform: 'translateX(-50%)',
            background: '#6366f1',
            color: 'white',
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            padding: '3px 10px',
            borderRadius: 99,
            boxShadow: '0 2px 12px rgba(99,102,241,0.5)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {indicator.side === 'top' ? `↑ ${indicator.label}` : `↓ ${indicator.label}`}
          </div>

          {/* Right endpoint dot */}
          <div style={{
            position: 'absolute',
            right: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#a78bfa',
            boxShadow: '0 0 8px 2px rgba(167,139,250,0.6)',
          }} />
        </div>,
        document.body
      )}

      {/* GHOST BOX INDICATOR — only for empty containers (inside) */}
      {indicator.side === 'inside' && createPortal(
        <div
          data-drop-ghost
          style={{
            position: 'fixed',
            top: indicator.top - (GHOST_HEIGHT / 2),
            left: indicator.left,
            width: indicator.width,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className={cn(
            "min-h-[120px] rounded-[2rem]",
            "flex flex-col items-center justify-center gap-3 overflow-hidden",
            "border-2 border-dashed border-indigo-500 bg-indigo-50/40 dark:bg-indigo-900/20",
            "backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Plus className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] italic leading-none">
                INSERT {indicator.label}
              </span>
              <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                Adding to empty container
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
