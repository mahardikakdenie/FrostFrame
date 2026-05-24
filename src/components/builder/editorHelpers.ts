import { EditorView } from '@tiptap/pm/view';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Selection } from '@tiptap/pm/state';

/**
 * Builds a hierarchical path (breadcrumbs) for the current selection.
 * Optimized for performance by reducing Regex and array allocations.
 */
export const buildSelectionPath = (doc: ProsemirrorNode, selection: Selection) => {
  const path: { id: string; type: string; label: string }[] = [];
  
  // 🛡️ Guard: Ensure selection is within current doc range
  const safeFrom = Math.min(selection.from, doc.content.size);
  const resolved = doc.resolve(safeFrom);
  
  // Cache for label formatting to avoid repetitive regex
  const formatLabel = (name: string) => name.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

  for (let depth = 0; depth <= resolved.depth; depth++) {
    const node = resolved.node(depth);
    if (node && node.type.name !== 'doc') {
      const pos = resolved.before(depth);
      const id = node.attrs?.id || pos.toString();
      
      path.push({
        id,
        type: node.type.name,
        label: formatLabel(node.type.name)
      });
    }
  }

  // Handle selected node explicitly for NodeSelection
  const selectedNode = (selection as any).node;
  if (selectedNode && selectedNode.type.name !== 'doc') {
    const id = selectedNode.attrs?.id || selection.from.toString();
    // Only add if not already the last item (leaf)
    if (path.length === 0 || path[path.length - 1].id !== id) {
      path.push({
        id,
        type: selectedNode.type.name,
        label: formatLabel(selectedNode.type.name)
      });
    }
  }

  return path;
};

/**
 * Resolves the smart drop position based on the component type and target parent.
 * Ensures elements are correctly nested within columns.
 *
 * 🔑 DEFINITIVE APPROACH — learned from Tiptap ReactNodeViewRenderer source:
 *
 * Tiptap's ReactNodeViewRenderer creates two separate DOM elements:
 *  - `renderer.element` → the React wrapper div (class="node-X") — this is what
 *    `view.nodeDOM(pos)` returns. It hosts the NodeViewWrapper React component.
 *  - `contentDOMElement` → a SEPARATE div (dataset.nodeViewContentReact='') created
 *    via document.createElement. This is where ProseMirror renders the children.
 *    It is NOT a React child — it's appended into the NodeViewContent element AFTER
 *    React renders, via the `nodeViewContentRef` callback.
 *
 * So `querySelector('[data-node-view-content-react]')` finds the actual PM content host.
 *
 * Strategy:
 *  1. Find the container (layoutColumn) and its absolute position.
 *  2. Get the container's DOM via view.nodeDOM() → renderer.element.
 *  3. Find the PM content host via querySelector('[data-node-view-content-react]').
 *  4. Its CHILDREN are the renderer.element divs of the child nodes (heroHeadline, etc.)
 *     — BUT those are NOT at the root of content-react; instead they live inside another
 *     wrapper. So we also try iterating children of [data-node-view-content].
 *  5. AS A RELIABLE FALLBACK: call view.nodeDOM(childAbsPos) for each child directly.
 *     This gives us the child's renderer.element directly, with the correct rect.
 *  6. Use runningOffset arithmetic for PM positions — no DOM↔PM translation.
 */
export const resolveSmartDropPosition = (
  view: EditorView,
  pos: number,
  type: string,
  mouseX?: number,
  mouseY?: number,
  inside?: number  // kept for API compatibility
) => {
  const { state } = view;
  
  // 🛡️ Guard: Ensure pos is within current doc range
  const safePos = Math.min(Math.max(0, pos), state.doc.content.size);
  const resolvedPos = state.doc.resolve(safePos);

  // ── Step 1: Find nearest column / row / section / doc ──────────────────────
  let containerNode: ProsemirrorNode | null = null;
  let containerDepth = -1;
  let containerAbsPos = 0;

  for (let depth = resolvedPos.depth; depth >= 0; depth--) {
    const node = resolvedPos.node(depth);
    const name = node.type.name.toLowerCase();
    if (
      name.includes('column') ||
      name.includes('row') ||
      name.includes('section') ||
      name.includes('media') ||
      name === 'doc'
    ) {
      containerNode = node;
      containerDepth = depth;
      containerAbsPos = depth === 0 ? 0 : resolvedPos.before(depth);
      break;
    }
  }

  if (!containerNode) {
    return { parentType: 'doc', insertPos: pos, side: 'inside' as const, rect: null };
  }

  // ── Step 2: If container has children + mouse coords → find hovered child ──
  if (containerNode.childCount > 0 && mouseX !== undefined && mouseY !== undefined) {

    // 🔑 HIGH-PRECISION HIT TEST: Direct visual hit-testing using browser elementFromPoint API.
    // This instantly resolves React Node Views (like VideoElement and ImageElement) when the
    // cursor hovers directly over them, bypassing any virtual DOM coordinate resolving issues.
    try {
      const hitEl = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      if (hitEl) {
        const childEl = hitEl.closest('[data-node-view-wrapper]') as HTMLElement | null;
        const containerDomEl = view.nodeDOM(containerAbsPos) as HTMLElement | null;
        
        if (childEl && childEl !== containerDomEl) {
          const rect = childEl.getBoundingClientRect();
          if (rect.height > 0 && rect.width > 0) {
            // Map the DOM node to its ProseMirror document position
            const pmPos = view.posAtDOM(childEl, 0);
            if (pmPos !== null && pmPos !== undefined && pmPos >= 0) {
              const resolvedChildPos = state.doc.resolve(pmPos);
              const parentNode = resolvedChildPos.parent;
              
              if (parentNode.type.name === 'layoutColumn') {
                const isTopHalf = mouseY < rect.top + rect.height / 2;
                const nodeAfter = resolvedChildPos.nodeAfter;
                const nodeSize = nodeAfter ? nodeAfter.nodeSize : 0;
                
                return {
                  parentType: 'layoutColumn',
                  insertPos: isTopHalf ? pmPos : pmPos + nodeSize,
                  side: isTopHalf ? 'top' as const : 'bottom' as const,
                  rect,
                };
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('High-precision hit test bypassed:', e);
    }

    let bestIdx = -1;
    let bestRect: DOMRect | null = null;
    let isTopHalf = true;
    let minDistance = Infinity;

    // Resolve container DOM children once to have a highly reliable fallback for React Node Views
    const containerDomEl = view.nodeDOM(containerAbsPos) as HTMLElement | null;
    let domChildren: HTMLElement[] = [];
    if (containerDomEl) {
      const contentHost =
        containerDomEl.querySelector('[data-node-view-content-react]') as HTMLElement | null
        ?? containerDomEl.querySelector('[data-node-view-content]') as HTMLElement | null
        ?? containerDomEl;
      domChildren = Array.from(contentHost.children) as HTMLElement[];
    }

    let runOff = 0;

    for (let i = 0; i < containerNode.childCount; i++) {
      const child = containerNode.child(i);
      const childAbsPos = containerAbsPos + 1 + runOff;

      // Try view.nodeDOM first, fallback to container's DOM children if missing or unrendered (0x0 rect)
      let childDomEl = view.nodeDOM(childAbsPos) as HTMLElement | null;
      let rect: DOMRect | null = childDomEl ? childDomEl.getBoundingClientRect() : null;
      
      if ((!childDomEl || !rect || (rect.height === 0 && rect.width === 0)) && domChildren[i]) {
        childDomEl = domChildren[i];
        rect = childDomEl.getBoundingClientRect();
      }

      if (childDomEl && rect) {
        if (rect.height > 0 || rect.width > 0) {
          const centerY = rect.top + rect.height / 2;
          const distance = Math.abs(mouseY - centerY);

          if (distance < minDistance) {
            minDistance = distance;
            bestIdx = i;
            bestRect = rect;
            isTopHalf = mouseY < centerY;
          }
        }
      }

      runOff += child.nodeSize;
    }

    // ── FALLBACK B: coordsAtPos for children ──────────────────────────────
    // Absolute last resort: use Tiptap's coordinate mapping.
    if (bestIdx === -1) {
      let runOff2 = 0;
      for (let i = 0; i < containerNode.childCount; i++) {
        const child = containerNode.child(i);
        const childAbsPos = containerAbsPos + 1 + runOff2;
        try {
          const topCoords = view.coordsAtPos(childAbsPos + 1);
          const bottomCoords = view.coordsAtPos(childAbsPos + child.nodeSize - 1);
          const centerY = (topCoords.top + bottomCoords.bottom) / 2;
          const distance = Math.abs(mouseY - centerY);

          // Construct a synthetic rect
          const syntheticRect = new DOMRect(
            topCoords.left,
            topCoords.top,
            bottomCoords.right - topCoords.left,
            bottomCoords.bottom - topCoords.top
          );

          if (distance < minDistance) {
            minDistance = distance;
            bestIdx = i;
            bestRect = syntheticRect;
            isTopHalf = mouseY < centerY;
          }
        } catch { /* ignore */ }
        runOff2 += child.nodeSize;
      }
    }

    if (bestIdx !== -1 && bestRect !== null) {
      // Compute the absolute PM position for the best child
      let runOff3 = 0;
      for (let i = 0; i < bestIdx; i++) {
        runOff3 += containerNode.child(i).nodeSize;
      }
      const bestChildAbsPos = containerAbsPos + 1 + runOff3;
      const bestChild = containerNode.child(bestIdx);

      return {
        parentType: containerNode.type.name,
        insertPos: isTopHalf
          ? bestChildAbsPos                        // insert BEFORE child
          : bestChildAbsPos + bestChild.nodeSize,  // insert AFTER child
        side: isTopHalf ? 'top' as const : 'bottom' as const,
        rect: bestRect,
      };
    }
  }

  // ── Step 3: Fallback — empty container or all child lookups failed ──────────
  let side: 'top' | 'bottom' | 'inside' = 'inside';
  let targetNodeRect: DOMRect | null = null;
  let insertPos = pos;

  // Try to get a rect for the ghost-box indicator
  const fallbackDom = view.nodeDOM(containerAbsPos) as HTMLElement | null;
  if (fallbackDom) {
    targetNodeRect = fallbackDom.getBoundingClientRect();
  } else {
    try {
      const coords = view.coordsAtPos(containerAbsPos + 1);
      targetNodeRect = new DOMRect(coords.left, coords.top, 200, 60);
    } catch { /* ignore */ }
  }

  let parentType = containerNode.type.name;

  // ── Step 4: Smart redirect — element/row dropped onto Row/Section ──────────
  const safeType = type || 'paragraphElement';
  const isRow = safeType.toLowerCase().includes('row');
  const isElement = [
    'heroHeadline', 'heroSubheadline', 'heroBadge', 'heroButtonGroup',
    'heroMedia', 'featureCard', 'paragraphElement', 'iconElement',
    'dividerElement', 'imageElement', 'videoElement', 'spacerElement',
    'buttonElement', 'formElements', 'navigationElement'
  ].includes(safeType);

  if (side === 'inside' && (isElement || isRow) && (parentType === 'layoutRow' || parentType === 'layoutSection')) {
    let targetRowNode: ProsemirrorNode | null = null;
    let targetRowPos = -1;

    if (parentType === 'layoutSection') {
      let secOff = 0;
      for (let i = 0; i < containerNode.childCount; i++) {
        const ch = containerNode.child(i);
        const chStart = containerAbsPos + 1 + secOff;
        if (ch.type.name === 'layoutRow' && pos >= chStart && pos <= chStart + ch.nodeSize) {
          targetRowNode = ch;
          targetRowPos = chStart;
        }
        secOff += ch.nodeSize;
      }
      if (!targetRowNode && containerNode.childCount > 0) {
        targetRowNode = containerNode.child(0);
        targetRowPos = containerAbsPos + 2;
      }
    } else {
      targetRowNode = containerNode;
      targetRowPos = containerAbsPos;
    }

    if (targetRowNode && targetRowNode.childCount > 0) {
      let targetColNode = targetRowNode.child(0);
      let targetColPos = targetRowPos + 1;

      let colOff = 0;
      for (let ci = 0; ci < targetRowNode.childCount; ci++) {
        const col = targetRowNode.child(ci);
        const colStart = targetRowPos + 1 + colOff;
        if (col.type.name === 'layoutColumn' && pos >= colStart && pos <= colStart + col.nodeSize) {
          targetColNode = col;
          targetColPos = colStart;
        }
        colOff += col.nodeSize;
      }

      parentType = 'layoutColumn';
      insertPos = targetColPos + targetColNode.nodeSize - 1;
    }
  }

  return { parentType, insertPos, side, rect: targetNodeRect };
};
