# Specification

## Summary
**Goal:** Build a custom merchandise design app (DesignCraft Studio) where users can visually design products like t-shirts, shirts, cups, and jugs by placing text and shapes on a canvas, then save and reload their designs.

**Planned changes:**
- Product selector panel with four product types (t-shirt, shirt, cup, jug), each rendered using its outline illustration as the canvas base
- Interactive design canvas supporting draggable, resizable, and deletable text and shape (rectangle, circle, triangle) elements
- Color picker for changing the product base color and selected element colors
- Design toolbar with Select, Add Text, Add Shape, and Color tools; active tool visually indicated
- Save Design feature: persists product type, base color, and all element properties to the backend; lists and reloads saved designs
- Backend Motoko actor with `saveDesign`, `getDesign`, `listDesigns`, and `deleteDesign` functions using stable storage
- Bold artisan workshop visual theme: warm off-white and charcoal palette with amber/coral accent, sidebar + canvas two-panel layout, clean sans-serif typography

**User-visible outcome:** Users can select a product, customize its color, add and arrange text and shapes on the canvas, save their design, and later retrieve and continue editing it — all within a cohesive artisan-styled interface.
