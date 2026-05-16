---
name: lando-studio-builder
description: Guidance for building, modifying, and styling Lando Studio landing page blocks and sections using Tiptap and React. Use when creating new UI components, adjusting layout schemas, or maintaining the Brutalist aesthetic.
---

# Lando Studio Builder Skill

This skill provides expert procedural guidance for extending and maintaining the Lando Studio WebBuilder.

## Block Creation Workflow

When adding a new block or section, follow these steps:

### 1. Define the Tiptap Extension
Create a new file in `src/extensions/[ElementName].tsx`.
- Use `Node.create()` and set `group: 'block'`.
- Define attributes for all editable properties (colors, text, alignment).
- Set `isolating: true` to prevent accidental merges.
- Define `parseHTML` and `renderHTML` for persistence.
- Add `addNodeView()` using `ReactNodeViewRenderer`.

### 2. Implement the Node View Component
- Use `NodeViewWrapper` and `NodeViewContent`.
- Implement double-click selection: `editor.commands.setNodeSelection(getPos())`.
- Add a floating badge at `-top-10 right-0`.
- Maintain the **Lando Aesthetic**: use `skew-x-[-2deg]`, `italic`, and `font-black`.

### 3. Create the Sidebar Config
- Add a new config component in `src/components/builder/configs/[ElementName]Config.tsx`.
- Integrate it into `src/components/builder/configs/index.ts`.
- Update `src/components/builder/PreviewSidebar.tsx` to render the config when the node is focused.

### 4. Register the Block
- Add the block to `src/lib/blockVariants.ts` to show it in the library.
- Add the extension to the `extensions` array in `src/components/builder/Editor.tsx`.

## Layout & Responsive Standards

- **Hierarchy**: Always maintain `doc > layoutSection > layoutRow > layoutColumn > [Element]`.
- **Responsive Attributes**: Store attributes as objects: `{ desktop: '...', tablet: '...', mobile: '...' }`.
- **Spacing**: Use Tailwind classes for padding and margins (e.g., `py-12`, `px-6`).

## Smart Drop Logic

If the new block is a section or row, ensure `handleDrop` in `Editor.tsx` handles it correctly.
- Sections should go at the `doc` level.
- Elements should be redirected into the nearest `layoutColumn`.

## Visual Guidelines

- **Typography**: `font-black`, `uppercase`, `italic`, `tracking-tighter`.
- **Skews**: Primary headlines should have `skew-x-[-2deg]`.
- **Borders**: Bold borders (2px-4px) with high contrast.
- **Glassmorphism**: Use `backdrop-blur-md` and `bg-white/10` for overlays.
