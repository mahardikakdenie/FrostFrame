# LANDO STUDIO - Project Rules & Guidelines

## 1. Architectural Standards (Tiptap + React)
- **Hierarchy:** Canvas must follow a strict `doc > layoutRow > layoutColumn > [Basic Elements]` structure.
- **Node Isolation:** Basic elements (Headline, Badge, etc.) must use `isolating: true` in their schema to prevent accidental merging or deletion during inline editing.
- **Attributes:** Favor responsive attributes (objects with `desktop`, `tablet`, `mobile` keys) over scalar values for layout properties like `gridCols`, `padding`, and `minHeight`.
- **Persistence:** Use `IndexedDB` (via Dexie.js) for all editor state. The legacy LocalStorage data must be migrated on first load.
- **Typing Constraints:** Only nodes listed in the `TEXT_NODES` registry (within `Editor.tsx`) should allow character insertion. Prevent typing in layout containers to maintain structural integrity.
- **Visual Feedback:** All drag-and-drop operations must provide clear visual indicators: a **Line** for top/bottom insertion and a **Ghost Box** for "inside" drops (empty containers).

## 2. UI/UX Principles (Ecomiq Inspired)
- **Floating Labels:** Element tooltips/labels must be positioned at the **Top-Right** corner (`-top-7 right-0`) with a "glass" backdrop-blur effect.
- **Interaction:** 
  - **Single-Click:** Selects the element and opens the sidebar.
  - **Double-Click:** Selects the element and provides instant focus for editing.
  - **Trash Icon:** Must be present on the floating label for quick removal.
- **Responsive Preview:** The editor stage supports three viewports: Desktop (1280px), Tablet (768px), and Mobile (375px).
- **Inspect Mode:** Use the "Inspect" toggle to disable `contenteditable` and hide builder UI (toolbars/guides) for a clean preview of the layout.
- **Drag Ghost:** Utilize the custom glassmorphism drag ghost (`setDragImage`) to provide premium feedback during element movement.

## 3. Theming & Styling
- **Global Theme Store:** Use the centralized `useThemeStore` (Zustand) for brand identity.
- **CSS Variables:** Never hardcode colors or fonts. Use CSS variables like `var(--primary-color)` and `var(--font-heading)` mapped via `ThemeProvider.tsx`.
- **Color Modes:** Support both **Light** and **Dark** modes globally.
- **Presets:** Maintain and extend theme presets (Frosted, GenZ, Bootstrap, etc.) to allow instant visual pivots.
- **Slanted Aesthetic:** Maintain the "Lando Studio" energy with subtle skews (`skew-x-[-2deg]`) and bold, italicized typography for headlines.

## 4. Development Workflow
- **Linting:** Always run `npm run lint` (TypeScript check) after making changes to the UI or extensions.
- **Smart Drops:** The `handleDrop` and `resolveSmartDropPosition` logic in `Editor.tsx` / `editorHelpers.ts` is the brain of the builder. It handles both external drops and internal moves with collision detection.
- **Auto-Save:** Implement debounced auto-save (1500ms) to IndexedDB and display clear "System Status" notifications to the user.
- **Standard Layouts:** When dropping elements at the root (`doc`), automatically wrap them in a `layoutRow` and `layoutColumn` to preserve the hierarchy.
