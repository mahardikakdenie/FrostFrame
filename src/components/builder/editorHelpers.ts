import { EditorView } from '@tiptap/pm/view';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Selection } from '@tiptap/pm/state';

/**
 * Builds a hierarchical path (breadcrumbs) for the current selection.
 * Optimized for performance by reducing Regex and array allocations.
 */
export const buildSelectionPath = (doc: ProsemirrorNode, selection: Selection) => {
  const path: { id: string; type: string; label: string }[] = [];
  const resolved = doc.resolve(selection.from);
  
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
 */
export const resolveSmartDropPosition = (view: EditorView, pos: number, type: string) => {
  const resolvedPos = view.state.doc.resolve(pos);
  
  // Find nearest valid ancestor
  let ancestorNode = null;
  let ancestorPos = -1;
  let ancestorDepth = -1;

  for (let depth = resolvedPos.depth; depth >= 0; depth--) {
    const node = resolvedPos.node(depth);
    const name = node.type.name.toLowerCase();
    if (name.includes('column') || name.includes('row') || name.includes('section') || name.includes('media') || name === 'doc') {
      ancestorNode = node;
      ancestorPos = depth === resolvedPos.depth ? pos : resolvedPos.after(depth + 1);
      ancestorDepth = depth;
      break;
    }
  }

  if (!ancestorNode) return { parentType: 'doc', insertPos: pos };

  let parentType = ancestorNode.type.name;
  let insertPos = ancestorPos;

  const isRow = type.toLowerCase().includes('row');
  const isElement = [
    'heroHeadline', 'heroSubheadline', 'heroBadge', 'heroButtonGroup', 
    'heroMedia', 'featureCard', 'paragraphElement', 'iconElement', 
    'dividerElement', 'imageElement', 'videoElement', 'spacerElement'
  ].includes(type);

  // 🚀 SMART DROP REDIRECT
  if ((isElement || isRow) && (parentType === 'layoutRow' || parentType === 'layoutSection')) {
      let targetRowNode = null;
      let targetRowPos = -1;

      if (parentType === 'layoutSection') {
        ancestorNode.forEach((child, offset) => {
            if (child.type.name === 'layoutRow') {
              const childStart = insertPos + 1 + offset;
              if (pos >= childStart && pos <= childStart + child.nodeSize) {
                  targetRowNode = child;
                  targetRowPos = childStart;
              }
            }
        });
        if (!targetRowNode && ancestorNode.childCount > 0) {
            targetRowNode = ancestorNode.child(0);
            targetRowPos = insertPos + 1;
        }
      } else {
        targetRowNode = ancestorNode;
        targetRowPos = insertPos;
      }

      if (targetRowNode && targetRowNode.childCount > 0) {
        const targetColNode = targetRowNode.child(0);
        parentType = 'layoutColumn';
        // Insert at the end of the first column
        insertPos = targetRowPos + 1 + targetColNode.nodeSize - 1;
      }
  }

  return { parentType, insertPos };
};
