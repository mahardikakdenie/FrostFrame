# LANDO STUDIO - Project Rules & Guidelines

## 1. Architectural Standards (Tiptap + React)
- **Hierarchy:** Canvas must follow a strict `doc > layoutRow > layoutColumn > [Basic Elements]` structure.
- **Node Isolation:** Basic elements (Headline, Badge, etc.) must use `isolating: true` in their schema to prevent accidental merging or deletion during inline editing.
- **Attributes:** Favor responsive attributes (objects with `desktop`, `tablet`, `mobile` keys) over scalar values for layout properties like `gridCols`, `padding`, and `minHeight`.

## 2. UI/UX Principles (Ecomiq Inspired)
- **Floating Labels:** Element tooltips/labels must be positioned at the **Top-Right** corner (`-top-7 right-0`) with a "glass" backdrop-blur effect.
- **Interaction:** 
  - **Single-Click:** Selects the element and opens the sidebar.
  - **Double-Click:** Selects the element and provides instant focus for editing.
  - **Trash Icon:** Must be present on the floating label for quick removal.
- **Placeholders:** Every empty container (Row/Column) must display a clear "DROP HERE" visual placeholder with a dashed border and themed icon.

## 3. Theming & Styling
- **Global Theme Store:** Use the centralized `useThemeStore` (Zustand) for brand identity.
- **CSS Variables:** Never hardcode colors or fonts. Use CSS variables like `var(--primary-color)` and `var(--font-heading)` mapped via `ThemeProvider.tsx`.
- **Slanted Aesthetic:** Maintain the "Lando Studio" energy with subtle skews (`skew-x-[-2deg]`) and bold, italicized typography for headlines.

## 4. Development Workflow
- **Linting:** Always run `npm run lint` (TypeScript check) after making changes to the UI or extensions.
- **Persistence:** Ensure all critical editor state is synced to `LocalStorage` via the "Save as Draft" mechanism in `App.tsx`.
- **Smart Drops:** The `handleDrop` logic in `Editor.tsx` is the brain of the builder; all drops (external or internal) must pass through the "Smart Redirect" logic to ensure correct nesting within Columns.
