import React from 'react';
import { EditorContent } from '@tiptap/react';
import { FloatingToolbar } from './FloatingToolbar';
import { useEditorConfig } from '../../hooks/useEditorConfig';
import { EditorBackground } from './EditorBackground';
import { DropIndicator } from './DropIndicator';

/**
 * Optimized Editor Component.
 * Orchestrates the Tiptap editor, background visuals, and drop indicators.
 */
export const Editor = () => {
  const { editor, dropIndicator, isDragging, inspectMode } = useEditorConfig();

  if (!editor) return null;

  return (
    <div className="w-full h-full bg-[#fcfdfe] dark:bg-slate-900 relative min-h-screen">
      {/* 🎨 PREMIUM CANVAS BACKGROUND */}
      <EditorBackground />

      <div className="relative z-10 w-full h-full">
        {!inspectMode && !isDragging && <FloatingToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      
      {/* 🚀 DROP INDICATORS (Line & Ghost Box) */}
      <DropIndicator indicator={dropIndicator} />
    </div>
  );
};
