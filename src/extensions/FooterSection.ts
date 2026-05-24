import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Footer } from '../components/sections/Footer';

export const FooterSection = Node.create({
  name: 'footerSection',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      logo: { default: 'LANDO' },
      description: { default: 'The high-performance landing page builder for modern teams.' },
      links: { 
        default: [
          { title: 'Product', items: [{ label: 'Features', link: '#' }, { label: 'Pricing', link: '#' }, { label: 'Templates', link: '#' }] },
          { title: 'Company', items: [{ label: 'About', link: '#' }, { label: 'Blog', link: '#' }, { label: 'Careers', link: '#' }] },
          { title: 'Legal', items: [{ label: 'Privacy', link: '#' }, { label: 'Terms', link: '#' }] },
        ] 
      },
      copyright: { default: '© 2026 Lando Inc. Engineered by Visionaries.' },
    };
  },

  parseHTML() {
    return [{ tag: 'footer[data-type="footer-section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['footer', mergeAttributes(HTMLAttributes, { 'data-type': 'footer-section' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Footer);
  },
});
