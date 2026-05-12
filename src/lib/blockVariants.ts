import { LayoutTemplate, LayoutPanelTop, Rows3, Columns2 } from 'lucide-react';

export const BLOCK_VARIANTS: Record<string, { id: string, name: string, icon: any, generatePayload: () => any }[]> = {
  strictHeroRow: [
    {
      id: "hero-split",
      name: "Hero Split 50:50",
      icon: Columns2,
      generatePayload: () => ({
        type: 'strictHeroRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2 },
        content: [
          {
            type: 'strictHeroColumn',
            attrs: { role: 'content', id: crypto.randomUUID(), width: 'w-full md:w-1/2', flexSizing: 'flex-1' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW RELEASE' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'Strict Block Library' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'This block is predefined.' }] },
              { type: 'heroButtonGroup', attrs: { id: crypto.randomUUID() } }
            ]
          },
          {
            type: 'strictHeroColumn',
            attrs: { role: 'media', id: crypto.randomUUID(), width: 'w-full md:w-1/2', flexSizing: 'flex-1' },
            content: [
              { type: 'heroMedia', attrs: { id: crypto.randomUUID() } }
            ]
          }
        ]
      })
    },
    {
      id: "hero-stacked",
      name: "Hero Stacked 1 Column",
      icon: Rows3,
      generatePayload: () => ({
        type: 'strictHeroRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 1 },
        content: [
          {
            type: 'strictHeroColumn',
            attrs: { role: 'content', id: crypto.randomUUID(), width: 'w-full', flexSizing: 'flex-1' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW RELEASE' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), textAlign: 'center' }, content: [{ type: 'text', text: 'Centered Stacked Hero' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textAlign: 'center' }, content: [{ type: 'text', text: 'Perfect for bold statements.' }] },
              { type: 'heroButtonGroup', attrs: { id: crypto.randomUUID(), justify: 'center' } }
            ]
          },
          {
            type: 'strictHeroColumn',
            attrs: { role: 'media', id: crypto.randomUUID(), width: 'w-full', flexSizing: 'flex-1' },
            content: [
              { type: 'heroMedia', attrs: { id: crypto.randomUUID() } }
            ]
          }
        ]
      })
    }
  ],
  freeRow: [
    {
      id: "free-split-2",
      name: "2 Columns (Split)",
      icon: Columns2,
      generatePayload: () => ({
        type: 'freeRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2 },
        content: [
          { type: 'freeColumn', attrs: { id: crypto.randomUUID(), width: 'w-full md:w-1/2', flexSizing: 'flex-1' } }, 
          { type: 'freeColumn', attrs: { id: crypto.randomUUID(), width: 'w-full md:w-1/2', flexSizing: 'flex-1' } }
        ]
      })
    },
    {
      id: "free-stack-1",
      name: "1 Column Row",
      icon: Rows3,
      generatePayload: () => ({
        type: 'freeRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 1 },
        content: [
          { type: 'freeColumn', attrs: { id: crypto.randomUUID(), width: 'w-full', flexSizing: 'flex-1' } }
        ]
      })
    }
  ]
};
