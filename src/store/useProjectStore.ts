"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, savePageToDB, getPageFromDB } from '../lib/db';

interface PageMetadata {
  id: string;
  name: string;
  slug: string;
}

interface ProjectState {
  pages: PageMetadata[];
  activePageId: string | null;
  
  // Actions
  setPages: (pages: PageMetadata[]) => void;
  setActivePageId: (id: string | null) => void;
  
  addPage: (name: string, slug: string) => Promise<string>;
  deletePage: (id: string) => Promise<void>;
  updatePageMetadata: (id: string, name: string, slug: string) => Promise<void>;
  
  // Initialization
  initProject: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      pages: [],
      activePageId: null,

      setPages: (pages) => set({ pages }),
      setActivePageId: (id) => set({ activePageId: id }),

      initProject: async () => {
        const allPages = await db.pages.toArray();
        if (allPages.length === 0) {
          // Create default Home page if no pages exist
          const homeId = crypto.randomUUID();
          const defaultContent = {
            type: 'doc',
            content: [
              {
                type: 'layoutRow',
                attrs: { id: crypto.randomUUID(), gridCols: 1, displayType: 'flex' },
                content: [
                  { 
                    type: 'layoutColumn', 
                    attrs: { id: crypto.randomUUID() },
                    content: [
                      { type: 'paragraphElement', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: ' ' }] }
                    ]
                  }
                ]
              }
            ]
          };
          await savePageToDB(homeId, 'Home', '/', defaultContent);
          
          set({ 
            pages: [{ id: homeId, name: 'Home', slug: '/' }],
            activePageId: homeId 
          });
        } else {
          const metadata = allPages.map(p => ({ id: p.id, name: p.name, slug: p.slug }));
          set({ 
            pages: metadata,
            activePageId: get().activePageId || metadata[0].id
          });
        }
      },

      addPage: async (name, slug) => {
        const id = crypto.randomUUID();
        const defaultContent = {
          type: 'doc',
          content: [
            {
              type: 'layoutRow',
              attrs: { id: crypto.randomUUID(), gridCols: 1, displayType: 'flex' },
              content: [
                { 
                  type: 'layoutColumn', 
                  attrs: { id: crypto.randomUUID() },
                  content: [
                    { type: 'paragraphElement', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: ' ' }] }
                  ]
                }
              ]
            }
          ]
        };
        await savePageToDB(id, name, slug, defaultContent);
        
        const newPages = [...get().pages, { id, name, slug }];
        set({ pages: newPages, activePageId: id });
        return id;
      },

      deletePage: async (id) => {
        const { pages, activePageId } = get();
        if (pages.length <= 1) return; // Prevent deleting the last page

        await db.pages.delete(id);
        const newPages = pages.filter(p => p.id !== id);
        
        let nextActiveId = activePageId;
        if (activePageId === id) {
          nextActiveId = newPages[0].id;
        }
        
        set({ pages: newPages, activePageId: nextActiveId });
      },

      updatePageMetadata: async (id, name, slug) => {
        const page = await db.pages.get(id);
        if (page) {
          await db.pages.update(id, { name, slug });
          const newPages = get().pages.map(p => p.id === id ? { ...p, name, slug } : p);
          set({ pages: newPages });
        }
      }
    }),
    {
      name: 'lando-project-storage',
    }
  )
);
