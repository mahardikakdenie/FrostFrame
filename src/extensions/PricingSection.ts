import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Pricing } from '../components/sections/Pricing';

export const PricingSection = Node.create({
  name: 'pricingSection',
  group: 'block levelThreeElement',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      title: { default: 'Simple, Transparent Pricing' },
      subtitle: { default: 'Choose the plan that fits your business needs.' },
      billingCycle: { default: 'monthly' }, // 'monthly' | 'annually'
      tiers: { 
        default: [
          { name: 'Basic', price: '$0', features: ['1 Project', 'Basic Support', 'Public URL'], ctaText: 'Start Free' },
          { name: 'Pro', price: '$19', badge: 'Most Popular', features: ['Unlimited Projects', 'Priority Support', 'Custom Domain'], ctaText: 'Go Pro' },
          { name: 'Enterprise', price: '$99', features: ['SLA Guarantee', 'Dedicated Manager', 'Team Training'], ctaText: 'Contact Sales' },
        ] 
      },
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-type="pricing-section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-type': 'pricing-section' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Pricing);
  },
});
