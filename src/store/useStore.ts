"use client";

import { create } from 'zustand';

interface BuilderState {
  activeSectionId: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isDragging: boolean;
  
  setActiveSection: (id: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setIsDragging: (dragging: boolean) => void;
}

export const useStore = create<BuilderState>((set) => ({
  activeSectionId: null,
  previewMode: 'desktop',
  isDragging: false,

  setActiveSection: (id) => set({ activeSectionId: id }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
}));
