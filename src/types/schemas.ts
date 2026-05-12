import { z } from 'zod';

export const HeroSchema = z.object({
  eyebrow: z.string().default('New Release'),
  title: z.string().default('Build Your Future in Seconds'),
  subtitle: z.string().default('The fastest way to build beautiful landing pages without code.'),
  primaryCTA: z.object({
    text: z.string().default('Get Started'),
    link: z.string().default('#'),
  }),
  secondaryCTA: z.object({
    text: z.string().default('View Demo'),
    link: z.string().default('#'),
  }),
  mediaUrl: z.string().default('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015'),
});

export const FeatureSchema = z.object({
  title: z.string().default('Why Choose Us'),
  subtitle: z.string().default('Everything you need to scale your business.'),
  columns: z.number().min(2).max(4).default(3),
  features: z.array(z.object({
    title: z.string().default('Fast Performance'),
    description: z.string().default('Optimized for speed and SEO out of the box.'),
    icon: z.string().default('Zap'),
  })).default([
    { title: 'Lightning Fast', description: 'Built with Next.js 14 for maximum performance.', icon: 'Zap' },
    { title: 'SEO Optimized', description: 'Clean HTML structure for better search rankings.', icon: 'Search' },
    { title: 'Responsive', description: 'Looks great on every device, from mobile to ultra-wide.', icon: 'Smartphone' },
  ]),
});

export const PricingSchema = z.object({
  title: z.string().default('Simple Pricing'),
  subtitle: z.string().default('Choose the plan that fits your needs.'),
  billingCycle: z.enum(['monthly', 'annually']).default('monthly'),
  tiers: z.array(z.object({
    name: z.string().default('Pro'),
    price: z.string().default('$19'),
    badge: z.string().optional(),
    features: z.array(z.string()).default(['Unlimited Projects', 'Priority Support']),
    ctaText: z.string().default('Get Started'),
  })).default([
    { name: 'Basic', price: '$0', features: ['1 Project', 'Community Support'], ctaText: 'Start Free' },
    { name: 'Pro', price: '$19', badge: 'Most Popular', features: ['Unlimited Projects', 'Priority Support', 'Custom Domain'], ctaText: 'Go Pro' },
    { name: 'Enterprise', price: '$99', features: ['SLA Guarantee', 'Dedicated Manager', 'Custom Security'], ctaText: 'Contact Sales' },
  ]),
});

export const TestimonialSchema = z.object({
  quote: z.string().default('This is the best landing page builder I have ever used. Highly recommended!'),
  author: z.object({
    name: z.string().default('Sarah Connor'),
    role: z.string().default('Founder @ Cyberdyne'),
    avatar: z.string().default('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1974'),
  }),
  rating: z.number().min(1).max(5).default(5),
  logos: z.array(z.string()).default([
    'ACME CORP', 'GLOBAL TECH', 'INDIGO LABS', 'MODERN WEB'
  ]),
});

export const FooterSchema = z.object({
  logo: z.string().default('Lando'),
  description: z.string().default('Building the future of the web, one page at a time.'),
  links: z.array(z.object({
    title: z.string(),
    items: z.array(z.object({ label: z.string(), link: z.string() })),
  })).default([
    { title: 'Product', items: [{ label: 'Features', link: '#' }, { label: 'Pricing', link: '#' }] },
    { title: 'Company', items: [{ label: 'About', link: '#' }, { label: 'Contact', link: '#' }] },
  ]),
  copyright: z.string().default('© 2026 Lando Inc. All rights reserved.'),
});

export type HeroData = z.infer<typeof HeroSchema>;
export type FeatureData = z.infer<typeof FeatureSchema>;
export type PricingData = z.infer<typeof PricingSchema>;
export type TestimonialData = z.infer<typeof TestimonialSchema>;
export type FooterData = z.infer<typeof FooterSchema>;
