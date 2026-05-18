import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import Document from '@tiptap/extension-document';

import { LayoutSection } from './LayoutSection';
import { LayoutRow } from './LayoutRow';
import { LayoutColumn } from './LayoutColumn';
import { HeroHeadline } from './HeroHeadline';
import { HeroSubheadline } from './HeroSubheadline';
import { HeroBadge } from './HeroBadge';
import { HeroButtonGroup } from './HeroButtonGroup';
import { HeroMedia } from './HeroMedia';
import { PricingSection } from './PricingSection';
import { FeaturesSection } from './FeaturesSection';
import { SectionHeading } from './SectionHeading';
import { SectionGrid } from './SectionGrid';
import { FeatureCard } from './FeatureCard';
import { TestimonialSection } from './TestimonialSection';
import { FooterSection } from './FooterSection';
import { ImageElement } from './ImageElement';
import { VideoElement } from './VideoElement';
import { DividerElement } from './DividerElement';
import { SpacerElement } from './SpacerElement';
import { ParagraphElement } from './ParagraphElement';
import { IconElement } from './IconElement';
import { ButtonElement } from './ButtonElement';

export const BuilderExtensions = [
  StarterKit.configure({
    document: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
  }),
  Dropcursor.configure({
    color: 'var(--primary-color)',
    width: 2,
  }),
  Document.extend({
    content: 'block+', // Allow any block at root to prevent strict schema crashes
  }),
  TextStyle,
  Color,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'doc') return 'DRAG A ROW FROM SIDEBAR TO START...';
      if (node.type.name === 'heroHeadline') return 'ENTER HEADLINE...';
      if (node.type.name === 'heroSubheadline') return 'Enter subheadline description here...';
      if (node.type.name === 'heroBadge') return 'NEW RELEASE';
      return '';
    },
    showOnlyWhenEditable: true,
  }),
  LayoutSection,
  LayoutRow,
  LayoutColumn,
  HeroHeadline,
  HeroSubheadline,
  HeroBadge,
  HeroButtonGroup,
  HeroMedia,
  ImageElement,
  VideoElement,
  DividerElement,
  SpacerElement,
  PricingSection,
  FeaturesSection,
  SectionHeading,
  SectionGrid,
  FeatureCard,
  TestimonialSection,
  FooterSection,
  ParagraphElement,
  IconElement,
  ButtonElement,
];
