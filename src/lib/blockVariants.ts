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
  Square,
  Heart,
  Phone,
  Briefcase,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  MessageSquare,
  FormInput,
  CheckSquare,
  AlignJustify
} from 'lucide-react';

export const BLOCK_VARIANTS: Record<string, { id: string, name: string, icon: any, image?: string, generatePayload: () => any }[]> = {
  bento: [
    {
      id: "bento-modern",
      name: "Bento Modern",
      icon: Grid3X3,
      generatePayload: () => ({
        type: 'featuresSection',
        attrs: { id: crypto.randomUUID() },
        content: [
          { type: 'sectionHeading', attrs: { id: crypto.randomUUID() } },
          {
            type: 'sectionGrid',
            attrs: { id: crypto.randomUUID(), displayType: 'bento' },
            content: [
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), gridColumn: 'col-span-2', gridRow: 'row-span-2', icon: 'Zap' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'BIG FEATURE' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'This is a large bento tile that spans multiple rows and columns.' }] }
                ]
              },
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), gridColumn: 'col-span-2', icon: 'Shield' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'SECURE' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'Wide tile for important info.' }] }
                ]
              },
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), gridColumn: 'col-span-1', icon: 'Smartphone' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'MOBILE' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'Small square tile.' }] }
                ]
              },
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), gridColumn: 'col-span-1', icon: 'Heart' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3' }, content: [{ type: 'text', text: 'LOVED' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID() }, content: [{ type: 'text', text: 'Compact.' }] }
                ]
              }
            ]
          }
        ]
      })
    }
  ],
  forms: [
    {
      id: "form-contact",
      name: "Contact Form",
      icon: MessageSquare,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), padding: 'py-12' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), displayType: 'flex', flexDirection: 'col', gap: '1rem' },
            content: [
              { type: 'inputElement', attrs: { id: crypto.randomUUID(), label: 'NAME', placeholder: 'Your Name', name: 'name', required: true } },
              { type: 'inputElement', attrs: { id: crypto.randomUUID(), label: 'EMAIL', placeholder: 'your@email.com', name: 'email', required: true } },
              { type: 'textareaElement', attrs: { id: crypto.randomUUID(), label: 'MESSAGE', placeholder: 'How can we help?', name: 'message', rows: 4 } },
              { type: 'buttonElement', attrs: { id: crypto.randomUUID(), text: 'SEND MESSAGE', width: 'full' } }
            ]
          }
        ]
      })
    },
    {
      id: "form-newsletter",
      name: "Newsletter",
      icon: Zap,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), padding: 'py-12' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), displayType: 'flex', flexDirection: 'row', alignItems: 'end', gap: '1rem' },
            content: [
              { type: 'inputElement', attrs: { id: crypto.randomUUID(), label: 'NEWSLETTER', placeholder: 'your@email.com', name: 'email' } },
              { type: 'buttonElement', attrs: { id: crypto.randomUUID(), text: 'SUBSCRIBE', size: 'md' } }
            ]
          }
        ]
      })
    },
    {
      id: "el-input",
      name: "Input Field",
      icon: FormInput,
      generatePayload: () => ({ type: 'inputElement', attrs: { id: crypto.randomUUID() } })
    },
    {
      id: "el-textarea",
      name: "TextArea",
      icon: AlignJustify,
      generatePayload: () => ({ type: 'textareaElement', attrs: { id: crypto.randomUUID() } })
    },
    {
      id: "el-checkbox",
      name: "Checkbox",
      icon: CheckSquare,
      generatePayload: () => ({ type: 'checkboxElement', attrs: { id: crypto.randomUUID() } })
    }
  ],
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
      id: "hero-wedding",
      name: "Wedding Elegant",
      icon: Heart,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'py-32', background: '#fff9f9' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), width: '800px', displayType: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center', gap: '2rem' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID(), textAlign: 'text-center', color: '#db2777' }, content: [{ type: 'text', text: 'SAVE THE DATE' }] },
              { 
                type: 'heroHeadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  textAlign: 'text-center', 
                  color: '#831843', 
                  fontStyle: 'normal', 
                  transform: 'none', 
                  textTransform: 'normal',
                  fontFamily: 'serif'
                }, 
                content: [{ type: 'text', text: 'Romeo & Juliet' }] 
              },
              { 
                type: 'heroSubheadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  textAlign: 'text-center', 
                  color: '#9d174d', 
                  textTransform: 'normal',
                  opacity: 'opacity-100',
                  fontWeight: 'font-medium'
                }, 
                content: [{ type: 'text', text: 'Join us for a celebration of love, laughter, and a happily ever after.' }] 
              },
              { 
                type: 'buttonElement', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  text: 'RSVP NOW', 
                  color: '#db2777', 
                  transform: 'none', 
                  fontStyle: 'normal', 
                  borderRadius: '9999px' 
                } 
              }
            ]
          }
        ]
      })
    },
    {
      id: "hero-cicilan",
      name: "Cicilan Fintech",
      icon: Smartphone,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2, padding: 'py-24', background: '#f8fafc' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), displayType: 'flex', flexDirection: 'col', alignItems: 'start', justifyContent: 'center', gap: '1.5rem' },
            content: [
              { type: 'heroBadge', attrs: { id: crypto.randomUUID(), color: '#0f172a' }, content: [{ type: 'text', text: 'CICILAN TANPA KARTU' }] },
              { 
                type: 'heroHeadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  color: '#0f172a', 
                  fontStyle: 'normal', 
                  transform: 'none',
                  fontWeight: 'font-bold'
                }, 
                content: [{ type: 'text', text: 'BELI SEKARANG, BAYAR NANTI' }] 
              },
              { 
                type: 'heroSubheadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  color: '#475569', 
                  textTransform: 'normal',
                  opacity: 'opacity-100'
                }, 
                content: [{ type: 'text', text: 'Dapatkan limit hingga Rp 50.000.000 dengan proses verifikasi hanya 5 menit.' }] 
              },
              { 
                type: 'buttonElement', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  text: 'AJUKAN SEKARANG', 
                  color: '#2563eb', 
                  transform: 'none', 
                  fontStyle: 'normal',
                  borderRadius: '0.5rem'
                } 
              }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              { type: 'heroMedia', attrs: { id: crypto.randomUUID(), minHeight: '400px' } }
            ]
          }
        ]
      })
    },
    {
      id: "hero-funnel",
      name: "Funnel VSL",
      icon: PlayCircle,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'py-20' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), width: '1000px', displayType: 'flex', flexDirection: 'col', alignItems: 'center', gap: '2rem' },
            content: [
              { 
                type: 'heroHeadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  textAlign: 'text-center', 
                  transform: 'none', 
                  fontStyle: 'normal' 
                }, 
                content: [{ type: 'text', text: 'STRATEGI RAHASIA MELEDAKKAN OMSET 10X LIPAT' }] 
              },
              { type: 'videoElement', attrs: { id: crypto.randomUUID(), width: '100%', aspectRatio: 'video' } },
              { 
                type: 'buttonElement', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  text: 'SAYA MAU AKSES SEKARANG!', 
                  color: '#ea580c', 
                  size: 'lg', 
                  width: 'full',
                  transform: 'none', 
                  fontStyle: 'normal' 
                } 
              }
            ]
          }
        ]
      })
    },
    {
      id: "hero-corporate",
      name: "Corporate Clean",
      icon: Briefcase,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2, padding: 'py-24' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), displayType: 'flex', flexDirection: 'col', alignItems: 'start', justifyContent: 'center', gap: '1.5rem' },
            content: [
              { 
                type: 'heroHeadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  fontStyle: 'normal', 
                  transform: 'none', 
                  textTransform: 'normal'
                }, 
                content: [{ type: 'text', text: 'Professional Solutions for Your Business' }] 
              },
              { 
                type: 'heroSubheadline', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  textTransform: 'normal', 
                  opacity: 'opacity-100'
                }, 
                content: [{ type: 'text', text: 'We help leading companies build robust digital products and scale their operations.' }] 
              },
              { 
                type: 'buttonElement', 
                attrs: { 
                  id: crypto.randomUUID(), 
                  text: 'LEARN MORE', 
                  color: '#0f172a', 
                  transform: 'none', 
                  fontStyle: 'normal' 
                } 
              }
            ]
          },
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              { type: 'imageElement', attrs: { id: crypto.randomUUID() } }
            ]
          }
        ]
      })
    }
  ],
  features: [
    {
      id: "features-cicilan-steps",
      name: "Cicilan Process",
      icon: Smartphone,
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
                attrs: { id: crypto.randomUUID(), icon: 'Smartphone', iconTransform: 'none' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: '1. DAFTAR' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textTransform: 'normal' }, content: [{ type: 'text', text: 'Isi data diri dan unggah foto KTP Anda.' }] }
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
                attrs: { id: crypto.randomUUID(), icon: 'Shield', iconTransform: 'none' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: '2. VERIFIKASI' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textTransform: 'normal' }, content: [{ type: 'text', text: 'Tim kami akan memverifikasi data Anda dalam 5 menit.' }] }
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
                attrs: { id: crypto.randomUUID(), icon: 'Zap', iconTransform: 'none' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: '3. CAIR' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textTransform: 'normal' }, content: [{ type: 'text', text: 'Limit aktif dan siap digunakan untuk belanja.' }] }
                ]
              }
            ]
          }
        ]
      })
    },
    {
      id: "features-wedding-details",
      name: "Wedding Details",
      icon: Heart,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'grid', gridCols: 2, padding: 'py-20', background: '#fff9f9' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID() },
            content: [
              {
                type: 'featureCard',
                attrs: { id: crypto.randomUUID(), icon: 'Heart', iconTransform: 'none' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: 'AKAD NIKAH' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textTransform: 'normal' }, content: [{ type: 'text', text: 'Pukul 09:00 - 11:00 WIB di Masjid Agung.' }] }
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
                attrs: { id: crypto.randomUUID(), icon: 'Smile', iconTransform: 'none' },
                content: [
                  { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: 'RESEPSI' }] },
                  { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textTransform: 'normal' }, content: [{ type: 'text', text: 'Pukul 12:00 - 15:00 WIB di Ballroom Hotel.' }] }
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
      id: "pricing-wedding-gift",
      name: "Wedding Gift",
      icon: CreditCard,
      generatePayload: () => ({
        type: 'layoutRow',
        attrs: { id: crypto.randomUUID(), displayType: 'flex', justifyContent: 'center', padding: 'py-20', background: '#fff9f9' },
        content: [
          {
            type: 'layoutColumn',
            attrs: { id: crypto.randomUUID(), width: '600px', padding: 'p-12', background: 'white' },
            content: [
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h3', textAlign: 'text-center', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: 'KIRIM HADIAH' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textAlign: 'text-center', textTransform: 'normal' }, content: [{ type: 'text', text: 'Doa Restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan hadiah, silakan melalui:' }] },
              { type: 'dividerElement', attrs: { id: crypto.randomUUID() } },
              { type: 'heroHeadline', attrs: { id: crypto.randomUUID(), level: 'h4', textAlign: 'text-center', transform: 'none', fontStyle: 'normal' }, content: [{ type: 'text', text: 'BANK BCA: 123456789' }] },
              { type: 'heroSubheadline', attrs: { id: crypto.randomUUID(), textAlign: 'text-center', textTransform: 'normal' }, content: [{ type: 'text', text: 'A/N: ROMEO' }] }
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
      id: "el-nav",
      name: "Navigation",
      icon: AlignJustify,
      generatePayload: () => ({ type: 'navigationElement', attrs: { id: crypto.randomUUID() } })
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
