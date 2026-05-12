import { create } from 'zustand';

interface SelectionPathItem {
  id: string;
  type: string;
  label: string;
}

interface UIState {
  hoveredId: string | null;
  focusedId: string | null; 
  selectionPath: SelectionPathItem[];
  activeNodeType: string | null;
  selectionLevel: 'section' | 'element';
  previewMode: 'desktop' | 'tablet' | 'mobile';
  drillDownId: string | null; 
  
  setHoveredId: (id: string | null) => void;
  setFocusedId: (id: string | null, level?: 'section' | 'element', path?: SelectionPathItem[], type?: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setDrillDownId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hoveredId: null,
  focusedId: null,
  selectionPath: [],
  activeNodeType: null,
  selectionLevel: 'section',
  previewMode: 'desktop',
  drillDownId: null,

  setHoveredId: (id) => set({ hoveredId: id }),
  setFocusedId: (id, level = 'section', path = [], type = null) => 
    set({ focusedId: id, selectionLevel: level, selectionPath: path, activeNodeType: type }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setDrillDownId: (id) => set({ drillDownId: id }),
}));
