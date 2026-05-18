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
  Minus,
  Maximize,
  Square
} from 'lucide-react';

export const BLOCK_VARIANTS: Record<string, { id: string, name: string, icon: any, image?: string, generatePayload: () => any }[]> = {
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
      name: "Split Brutalist",
      icon: Columns2,
      image: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ffffff'/%3E%3Cg transform='skewX(-10) translate(40, 60)'%3E%3Crect width='80' height='15' fill='%234f46e5'/%3E%3C/g%3E%3Crect x='40' y='95' width='180' height='35' fill='%230f172a'/%3E%3Crect x='40' y='140' width='180' height='35' fill='%230f172a'/%3E%3Crect x='40' y='190' width='160' height='10' fill='%2364748b'/%3E%3Crect x='40' y='205' width='140' height='10' fill='%2364748b'/%3E%3Crect x='40' y='235' width='70' height='25' fill='%234f46e5'/%3E%3Crect x='120' y='235' width='70' height='25' fill='%23ffffff' stroke='%230f172a' stroke-width='2'/%3E%3Crect x='240' y='50' width='130' height='200' fill='%23f1f5f9' stroke='%23e2e8f0' stroke-width='1'/%3E%3Cpath d='M250 70 L360 230' stroke='%23cbd5e1' stroke-width='2'/%3E%3Cpath d='M360 70 L250 230' stroke='%23cbd5e1' stroke-width='2'/%3E%3C/svg%3E",
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2, padding: 'py-24' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), displayType: 'flex', flexDirection: 'col', alignItems: 'start', justifyContent: 'center', gap: '1.5rem' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'NEW RELEASE 2024' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'DESIGN WITHOUT LIMITS' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'The most powerful brutalist editor for professional teams.' }] },
              { type: 'heroButtonGroup', attrs: { id: crypto.randomUUID() } }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              { type: 'heroMedia', attrs: { id: crypto.randomUUID(), minHeight: '500px' } }
            ]
          }
        ]
      })
    },
    {
      id: "hero-centered",
      name: "Centered Impact",
      icon: LayoutPanelTop,
      image: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ffffff'/%3E%3Cg transform='translate(200, 80)'%3E%3Cg transform='skewX(-10) translate(-40, 0)'%3E%3Crect width='80' height='15' fill='%234f46e5'/%3E%3C/g%3E%3Crect x='-120' y='30' width='240' height='40' fill='%230f172a'/%3E%3Crect x='-100' y='80' width='200' height='10' fill='%2364748b'/%3E%3Crect x='-80' y='95' width='160' height='10' fill='%2364748b'/%3E%3Crect x='-75' y='125' width='70' height='25' fill='%234f46e5'/%3E%3Crect x='5' y='125' width='70' height='25' fill='%23ffffff' stroke='%230f172a' stroke-width='2'/%3E%3C/g%3E%3Crect x='50' y='240' width='300' height='40' fill='%23f1f5f9' rx='4'/%3E%3C/svg%3E",
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'py-32' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), width: '900px', displayType: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center', gap: '2rem' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID(), textAlign: 'text-center' }, content: [{ type: 'text', text: 'WELCOME TO THE FUTURE' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), textAlign: 'text-center' }, content: [{ type: 'text', text: 'ULTIMATE WEB BUILDER' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textAlign: 'text-center' }, content: [{ type: 'text', text: 'Create high-converting landing pages with our brutalist aesthetic.' }] },
              { type: 'heroButtonGroup', attrs: { id: crypto.randomUUID(), textAlign: 'text-center' } },
              { type: 'heroMedia', attrs: { id: crypto.randomUUID(), minHeight: '300px', bgOpacity: 10 } }
            ]
          }
        ]
      })
    },
    {
      id: "hero-full-width",
      name: "Brutalist Banner",
      icon: Maximize,
      image: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='400' height='300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Crect x='40' y='100' width='100' height='15' fill='%234f46e5' transform='skewX(-10)'/%3E%3Crect x='40' y='130' width='320' height='50' fill='%23ffffff'/%3E%3Crect x='40' y='200' width='200' height='10' fill='%2394a3b8'/%3E%3Crect x='40' y='230' width='100' height='30' fill='%234f46e5'/%3E%3C/svg%3E",
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 1, padding: 'py-0', background: '#0f172a' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), padding: 'p-32', minHeight: '100vh', displayType: 'flex', flexDirection: 'col', alignItems: 'start', justifyContent: 'center', gap: '2.5rem' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID(), color: '#ffffff' }, content: [{ type: 'text', text: 'UNLEASH CREATIVITY' }] },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), color: '#ffffff' }, content: [{ type: 'text', text: 'REDEFINING DIGITAL SPACES' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), color: '#94a3b8' }, content: [{ type: 'text', text: 'A new era of web design is here. Bold, raw, and unapologetically fast.' }] },
              { type: 'heroButtonGroup', attrs: { id: crypto.randomUUID() } }
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
      id: "el-button",
      name: "Button",
      icon: Square,
      generatePayload: () => ({ type: 'buttonElement', attrs: { id: crypto.randomUUID() } })
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
