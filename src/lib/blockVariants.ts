import { 
  LayoutTemplate, 
  LayoutPanelTop, 
  Rows3, 
  Columns2, 
  CreditCard, 
  Star, 
  Zap, 
  Layout, 
  Grid3X3,
  AlignLeft,
  AlignCenter,
  ImageIcon,
  Type,
  Smile,
  Minus
} from 'lucide-react';

export const BLOCK_VARIANTS: Record<string, { id: string, name: string, icon: any, generatePayload: () => any }[]> = {
  layoutRow: [
    {
      id: "grid-2",
      name: "2 Columns (Grid)",
      icon: Columns2,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2 },
        content: [
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }, 
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }
        ]
      })
    },
    {
      id: "grid-3",
      name: "3 Columns (Grid)",
      icon: Grid3X3,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 3 },
        content: [
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }, 
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } },
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }
        ]
      })
    },
    {
      id: "flex-center",
      name: "Flex Centered",
      icon: AlignCenter,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { 
          id: crypto.randomUUID(), 
          displayType: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 'py-12'
        },
        content: [
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID(), width: 'auto', flexSizing: 'flex-none' } }
        ]
      })
    },
    {
      id: "row-stack",
      name: "1 Column (Full)",
      icon: Rows3,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 1 },
        content: [
          { type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }
        ]
      })
    }
  ],
  heroSections: [
    {
      id: "hero-split",
      name: "Split Hero",
      icon: Columns2,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2, padding: 'py-20' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              {
                type: 'layoutRow',
                attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 1 },
                content: [
                  { 
                    type: 'layoutColumn', 
                    attrs: { id: crypto.randomUUID() },
                    content: [{ type: 'heroBadge', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW RELEASE' }] }]
                  },
                  { 
                    type: 'layoutColumn', 
                    attrs: { id: crypto.randomUUID() },
                    content: [{ type: 'heroHeadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'Build Your Future' }] }]
                  },
                  { 
                    type: 'layoutColumn', 
                    attrs: { id: crypto.randomUUID() },
                    content: [{ type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'The fastest way to build beautiful landing pages.' }] }]
                  },
                  { 
                    type: 'layoutColumn', 
                    attrs: { id: crypto.randomUUID() },
                    content: [{ type: 'heroButtonGroup', attrs: { id: crypto.randomUUID() } }]
                  }
                ]
              }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              { type: 'heroMedia', attrs: { id: crypto.randomUUID() } }
            ]
          }
        ]
      })
    }
  ],
  features: [
    {
      id: "features-3-col",
      name: "3 Column Features",
      icon: Zap,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 3, padding: 'py-20' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), icon: 'Zap' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'ULTRA-FAST' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'ZERO LATENCY RENDERING ENGINE.' }] }
                ]
              }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), icon: 'Shield' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'IRONCLAD' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'MILITARY GRADE INFRASTRUCTURE.' }] }
                ]
              }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), icon: 'Smartphone' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'RESPONSIVE' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'PERFECT ON EVERY DEVICE.' }] }
                ]
              }
            ]
          }
        ]
      })
    }
  ],
  pricing: [
    {
      id: "pricing-basic",
      name: "Standard Pricing",
      icon: CreditCard,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 3, padding: 'py-20' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), padding: 'p-8', background: 'bg-white' },
            content: [
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'STARTER' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h2' }, content: [{ type: 'text', text: '$0' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'PERFECT FOR EXPLORATION.' }] }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), padding: 'p-8', background: 'bg-indigo-50' },
            content: [
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'PRO' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h2' }, content: [{ type: 'text', text: '$29' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'FOR SERIOUS CREATORS.' }] }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), padding: 'p-8', background: 'bg-white' },
            content: [
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'ULTIMATE' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h2' }, content: [{ type: 'text', text: 'CUSTOM' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'SCALE WITHOUT LIMITS.' }] }
            ]
          }
        ]
      })
    }
  ],
  basicElements: [
    {
      id: "el-headline",
      name: "Headline",
      icon: Type,
      generatePayload: () => ({ type: 'heroHeadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW LANDO HEADLINE' }] })
    },
    {
      id: "el-paragraph",
      name: "Paragraph",
      icon: AlignLeft,
      generatePayload: () => ({ type: 'paragraphElement', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'This is a standard paragraph element. You can type your detailed description or content here.' }] })
    },
    {
      id: "el-subheadline",
      name: "Subheadline",
      icon: Layout,
      generatePayload: () => ({ type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'The fastest way to build beautiful landing pages.' }] })
    },
    {
      id: "el-icon",
      name: "Icon",
      icon: Smile,
      generatePayload: () => ({ type: 'iconElement', attrs: { id: crypto.randomUUID(), icon: 'Zap', size: 48, color: '#4f46e5' } })
    },
    {
      id: "el-badge",
      name: "Badge",
      icon: Star,
      generatePayload: () => ({ type: 'heroBadge', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW RELEASE' }] })
    },
    {
      id: "el-buttons",
      name: "ButtonGroup",
      icon: Grid3X3,
      generatePayload: () => ({ 
        type: 'heroButtonGroup', 
        attrs: { 
          id: crypto.randomUUID(),
          buttons: [
            { text: 'GET STARTED', link: '#', color: '#4f46e5', variant: 'primary' },
            { text: 'VIEW DEMO', link: '#', color: '#0f172a', variant: 'secondary' }
          ]
        } 
      })
    },
    {
      id: "el-image",
      name: "Image",
      icon: ImageIcon,
      generatePayload: () => ({ type: 'imageElement', attrs: { id: crypto.randomUUID() } })
    },
    {
      id: "el-video",
      name: "Video",
      icon: Zap,
      generatePayload: () => ({ type: 'videoElement', attrs: { id: crypto.randomUUID() } })
    },
    {
      id: "el-divider",
      name: "Divider",
      icon: Minus,
      generatePayload: () => ({ type: 'dividerElement', attrs: { id: crypto.randomUUID() } })
    },
    {
      id: "el-spacer",
      name: "Spacer",
      icon: Rows3,
      generatePayload: () => ({ type: 'spacerElement', attrs: { id: crypto.randomUUID() } })
    }
  ]
};
