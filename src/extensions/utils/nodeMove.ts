/**
 * Shared drag-and-drop move utility for all element extensions.
 *
 * Every draggable element uses the same "swap with sibling" logic.
 * Centralising it here eliminates ~15 lines of duplicated code per extension.
 */
import type { Editor } from '@tiptap/core';
import type { Node as ProsemirrorNode } from '@tiptap/pm/model';

export type MoveDirection = 'up' | 'down';

/**
 * Move a PM node one step up or down within its parent container.
 *
 * Strategy (atomic single transaction):
 *
 * MOVE UP:
 *   Before: [..., prevSibling(pos-T, T), thisNode(pos, S), ...]
 *   1. Insert thisNode BEFORE prevSibling  → at (pos - T)
 *   2. thisNode shifts right by S, so old thisNode is now at (pos + S)
 *   3. Delete old thisNode at (pos + S)
 *
 * MOVE DOWN:
 *   Before: [..., thisNode(pos, S), nextSibling(pos+S, T), ...]
 *   1. Delete thisNode at [pos, pos+S]
 *   2. nextSibling is now at pos, size T
 *   3. Insert thisNode at (pos + T)  →  tr.mapping.map(pos + S + T) = pos + T ✓
 */
export function moveNode(
  editor: Editor,
  node: ProsemirrorNode,
  getPos: () => number | undefined,
  direction: MoveDirection
): void {
  const pos = getPos();
  if (typeof pos !== 'number') return;

  const { doc } = editor.state;
  const $pos = doc.resolve(pos);
  const parent = $pos.parent;
  const index = $pos.index();

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= parent.childCount) return;

  const otherNode = parent.child(targetIndex);
  const { tr } = editor.state;

  if (direction === 'up') {
    // Insert before the sibling above, then delete the original
    const insertPos = pos - otherNode.nodeSize;
    tr.insert(insertPos, node);
    // After the insert, original pos shifted by +nodeSize
    const deleteFrom = pos + node.nodeSize;
    tr.delete(deleteFrom, deleteFrom + node.nodeSize);
  } else {
    // Delete this node first, then insert after the next sibling
    tr.delete(pos, pos + node.nodeSize);
    // nextSibling is now at pos; we want to insert AFTER it → pos + otherNode.nodeSize
    // The pre-deletion position of that slot was pos + node.nodeSize + otherNode.nodeSize
    const preDeletionEnd = pos + node.nodeSize + otherNode.nodeSize;
    const insertPos = tr.mapping.map(preDeletionEnd);
    tr.insert(insertPos, node);
  }

  editor.view.dispatch(tr);
}

/**
 * React handler factory — wraps moveNode in a stopPropagation guard.
 */
export function createMoveHandler(
  editor: Editor,
  node: ProsemirrorNode,
  getPos: () => number | undefined,
  direction: MoveDirection
) {
  return (e: React.MouseEvent) => {
    e.stopPropagation();
    moveNode(editor, node, getPos, direction);
  };
}
