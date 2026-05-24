import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Testimonial } from '../components/sections/Testimonial';

export const TestimonialSection = Node.create({
  name: 'testimonialSection',
  group: 'block levelThreeElement',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      quote: { default: 'This page builder transformed our entire workflow. We now launch landing pages in hours instead of weeks. Absolute game changer for our marketing team.' },
      author: { 
        default: { 
          name: 'Sarah Connor', 
          role: 'Head of Marketing @ Cyberdyne Systems',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1974'
        } 
      },
      rating: { default: 5 },
      logos: { default: ['GITHUB', 'VERCEL', 'STRIPE', 'AIRBNB'] },
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-type="testimonial-section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-type': 'testimonial-section' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Testimonial);
  },
});
