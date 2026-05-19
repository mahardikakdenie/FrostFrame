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
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  drillDownId: string | null; 
  activeSidebarTab: 'library' | 'design';
  isDragging: boolean;
  draggedType: string | null;
  mediaModal: { 
    isOpen: boolean; 
    targetNodeId: string | null; 
    onSelect: ((url: string) => void) | null;
    type: 'image' | 'video';
  };
  confirmModal: { 
    isOpen: boolean; 
    title: string; 
    message: string; 
    onConfirm: (() => void) | null;
    variant: 'danger' | 'warning' | 'info';
  };
  jsonModal: {
    isOpen: boolean;
  };
  inspectMode: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  
  setHoveredId: (id: string | null) => void;
  setFocusedId: (id: string | null, level?: 'section' | 'element', path?: SelectionPathItem[], type?: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setDrillDownId: (id: string | null) => void;
  setActiveSidebarTab: (tab: 'library' | 'design') => void;
  setDragState: (isDragging: boolean, type: string | null) => void;
  openMediaModal: (targetId: string, onSelect: (url: string) => void, type?: 'image' | 'video') => void;
  closeMediaModal: () => void;
  openConfirmModal: (config: { title: string; message: string; onConfirm: () => void; variant?: 'danger' | 'warning' | 'info' }) => void;
  closeConfirmModal: () => void;
  openJsonModal: () => void;
  closeJsonModal: () => void;
  setInspectMode: (enabled: boolean) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved') => void;
}

export const useUIStore = create<UIState>((set) => ({
  hoveredId: null,
  focusedId: null,
  selectionPath: [],
  activeNodeType: null,
  selectionLevel: 'section',
  previewMode: 'desktop',
  activeDevice: 'desktop',
  drillDownId: null,
  activeSidebarTab: 'library',
  isDragging: false,
  draggedType: null,
  mediaModal: { isOpen: false, targetNodeId: null, onSelect: null, type: 'image' },
  confirmModal: { 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: null,
    variant: 'danger'
  },
  jsonModal: { isOpen: false },
  inspectMode: false,
  saveStatus: 'idle',

  setHoveredId: (id) => set({ hoveredId: id }),
  setFocusedId: (id, level = 'section', path, type = null) => {
    set((state) => ({ 
      focusedId: id, 
      selectionLevel: level, 
      selectionPath: path !== undefined ? path : state.selectionPath, 
      activeNodeType: type 
    }));
    if (id) set({ activeSidebarTab: 'library' }); // Auto switch to library/props tab on focus
  },
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setActiveDevice: (device) => set({ activeDevice: device }),
  setDrillDownId: (id) => set({ drillDownId: id }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setDragState: (isDragging, type) => set({ isDragging, draggedType: type }),
  openMediaModal: (id, onSelect, type = 'image') => set({ mediaModal: { isOpen: true, targetNodeId: id, onSelect, type } }),
  closeMediaModal: () => set((state) => ({ mediaModal: { ...state.mediaModal, isOpen: false, targetNodeId: null, onSelect: null } })),
  openConfirmModal: ({ title, message, onConfirm, variant = 'danger' }) => 
    set({ confirmModal: { isOpen: true, title, message, onConfirm, variant } }),
  closeConfirmModal: () => set((state) => ({ confirmModal: { ...state.confirmModal, isOpen: false } })),
  openJsonModal: () => set({ jsonModal: { isOpen: true } }),
  closeJsonModal: () => set({ jsonModal: { isOpen: false } }),
  setInspectMode: (enabled) => set({ inspectMode: enabled }),
  setSaveStatus: (status) => set({ saveStatus: status }),
}));
