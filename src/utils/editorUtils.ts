/**
 * Robust selection and caret preservation utilities for contentEditable
 */

let savedRange: Range | null = null;

/**
 * Save current text selection / caret range in the editor
 */
export function saveEditorSelection(): Range | null {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0).cloneRange();
    return savedRange;
  }
  return null;
}

/**
 * Restore saved selection range, or place cursor at the end of the document if no selection exists
 * NEVER places cursor at the beginning (line 1) unless the document is completely empty!
 */
export function restoreEditorSelection(fallbackElement?: HTMLElement | null): boolean {
  const sel = window.getSelection();
  if (!sel) return false;

  if (savedRange) {
    sel.removeAllRanges();
    sel.addRange(savedRange);
    return true;
  }

  if (fallbackElement) {
    fallbackElement.focus();
    const range = document.createRange();
    range.selectNodeContents(fallbackElement);
    range.collapse(false); // Place caret at the END, preventing jumping to line 1
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  }

  return false;
}

/**
 * Apply inline font size in points to selected text, or return false if no text selected
 */
export function applyInlineFontSize(sizePt: number, fallbackElement?: HTMLElement | null): boolean {
  restoreEditorSelection(fallbackElement);
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = `${sizePt}pt`;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      range.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(range);
      saveEditorSelection();
      return true;
    } catch {
      return document.execCommand('fontSize', false, '3');
    }
  }
  return false;
}
