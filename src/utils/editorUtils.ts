import { FontFamily } from '../types/document';

/**
 * Robust selection and caret preservation utilities for contentEditable
 */

let savedRange: Range | null = null;

export const FONT_FAMILY_DEFINITIONS: Record<
  FontFamily,
  { label: string; category: string; css: string; fontClass: string }
> = {
  sans: {
    label: 'Plus Jakarta Sans / Calibri',
    category: 'Sans-Serif',
    css: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontClass: "font-['Plus_Jakarta_Sans',sans-serif]",
  },
  inter: {
    label: 'Inter (Clean & Modern)',
    category: 'Sans-Serif',
    css: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontClass: "font-['Inter',sans-serif]",
  },
  arial: {
    label: 'Arial / Standard Business',
    category: 'Sans-Serif',
    css: "Arial, Helvetica, sans-serif",
    fontClass: "font-['Arial',sans-serif]",
  },
  trebuchet: {
    label: 'Trebuchet MS (Contemporary)',
    category: 'Sans-Serif',
    css: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
    fontClass: "font-['Trebuchet_MS',sans-serif]",
  },
  serif: {
    label: 'Lora / Times New Roman',
    category: 'Serif',
    css: "'Lora', Georgia, 'Times New Roman', Times, serif",
    fontClass: "font-['Lora',serif]",
  },
  georgia: {
    label: 'Georgia (Warm Editorial)',
    category: 'Serif',
    css: "Georgia, 'Times New Roman', serif",
    fontClass: "font-['Georgia',serif]",
  },
  garamond: {
    label: 'EB Garamond (Classic Elegance)',
    category: 'Serif',
    css: "'EB Garamond', Garamond, 'Baskerville', serif",
    fontClass: "font-['EB_Garamond',serif]",
  },
  merriweather: {
    label: 'Merriweather (Literary Serif)',
    category: 'Serif',
    css: "'Merriweather', Georgia, serif",
    fontClass: "font-['Merriweather',serif]",
  },
  mono: {
    label: 'Fira Code / Consolas',
    category: 'Monospace',
    css: "'Fira Code', Consolas, Monaco, monospace",
    fontClass: "font-['Fira_Code',monospace]",
  },
  courier: {
    label: 'Courier New (Typewriter)',
    category: 'Monospace',
    css: "'Courier New', Courier, monospace",
    fontClass: "font-['Courier_New',monospace]",
  },
  display: {
    label: 'Cinzel (Formal & Diploma)',
    category: 'Display & Formal',
    css: "'Cinzel', Georgia, serif",
    fontClass: "font-['Cinzel',serif]",
  },
  playfair: {
    label: 'Playfair Display (Luxury Serif)',
    category: 'Display & Formal',
    css: "'Playfair Display', Georgia, serif",
    fontClass: "font-['Playfair_Display',serif]",
  },
  script: {
    label: 'Caveat (Handwritten / Signature)',
    category: 'Creative & Script',
    css: "'Caveat', cursive, sans-serif",
    fontClass: "font-['Caveat',cursive]",
  },
};

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

  // Crucial: ensure the contentEditable element has DOM focus before restoring selection
  if (
    fallbackElement &&
    document.activeElement !== fallbackElement &&
    !fallbackElement.contains(document.activeElement)
  ) {
    fallbackElement.focus();
  }

  if (savedRange) {
    // Verify savedRange is within fallbackElement if provided
    if (!fallbackElement || fallbackElement.contains(savedRange.commonAncestorContainer)) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
      return true;
    }
  }

  if (fallbackElement) {
    const range = document.createRange();
    range.selectNodeContents(fallbackElement);
    range.collapse(false); // Place caret at the END, preventing jumping to line 1
    sel.removeAllRanges();
    sel.addRange(range);
    saveEditorSelection();
    return true;
  }

  return false;
}

export interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  subscript: boolean;
  superscript: boolean;
  code: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  justifyFull: boolean;
  insertUnorderedList: boolean;
  insertOrderedList: boolean;
  headingTag: string | null;
}

export function queryActiveFormats(editorElement?: HTMLElement | null): ActiveFormats {
  const defaultFormats: ActiveFormats = {
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    subscript: false,
    superscript: false,
    code: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    headingTag: null,
  };

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return defaultFormats;

  // Check if selection is within editor
  if (editorElement && !editorElement.contains(sel.anchorNode)) {
    return defaultFormats;
  }

  let bold = false;
  let italic = false;
  let underline = false;
  let strikeThrough = false;
  let subscript = false;
  let superscript = false;
  let justifyLeft = false;
  let justifyCenter = false;
  let justifyRight = false;
  let justifyFull = false;
  let insertUnorderedList = false;
  let insertOrderedList = false;

  try {
    bold = document.queryCommandState('bold');
    italic = document.queryCommandState('italic');
    underline = document.queryCommandState('underline');
    strikeThrough = document.queryCommandState('strikeThrough');
    subscript = document.queryCommandState('subscript');
    superscript = document.queryCommandState('superscript');
    justifyLeft = document.queryCommandState('justifyLeft');
    justifyCenter = document.queryCommandState('justifyCenter');
    justifyRight = document.queryCommandState('justifyRight');
    justifyFull = document.queryCommandState('justifyFull');
    insertUnorderedList = document.queryCommandState('insertUnorderedList');
    insertOrderedList = document.queryCommandState('insertOrderedList');
  } catch {
    // Ignored in non-supporting contexts
  }

  // DOM node walk for tags: <u>, <s>, <strike>, <code>, <pre>, <h1>, <h2>, <h3>, <blockquote>
  let headingTag: string | null = null;
  let code = false;
  let currNode: Node | null = sel.anchorNode;
  while (currNode && currNode !== editorElement) {
    if (currNode.nodeType === Node.ELEMENT_NODE) {
      const el = currNode as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (!headingTag && ['h1', 'h2', 'h3', 'blockquote', 'p'].includes(tag)) {
        headingTag = tag;
      }
      if (tag === 'code' || tag === 'pre') {
        code = true;
      }
      if (
        tag === 'u' ||
        tag === 'ins' ||
        el.style.textDecoration?.includes('underline') ||
        el.style.textDecorationLine?.includes('underline')
      ) {
        underline = true;
      }
      if (
        tag === 's' ||
        tag === 'strike' ||
        tag === 'del' ||
        el.style.textDecoration?.includes('line-through') ||
        el.style.textDecorationLine?.includes('line-through')
      ) {
        strikeThrough = true;
      }
      if (
        tag === 'b' ||
        tag === 'strong' ||
        el.style.fontWeight === 'bold' ||
        Number(el.style.fontWeight) >= 600
      ) {
        bold = true;
      }
      if (tag === 'i' || tag === 'em' || el.style.fontStyle === 'italic') {
        italic = true;
      }
      if (tag === 'sub') {
        subscript = true;
      }
      if (tag === 'sup') {
        superscript = true;
      }
    }
    currNode = currNode.parentNode;
  }

  return {
    bold,
    italic,
    underline,
    strikeThrough,
    subscript,
    superscript,
    code,
    justifyLeft,
    justifyCenter,
    justifyRight,
    justifyFull,
    insertUnorderedList,
    insertOrderedList,
    headingTag,
  };
}

/**
 * Toggle inline <code> wrapping on selected text or insert code block
 */
export function toggleInlineCode(fallbackElement?: HTMLElement | null): boolean {
  restoreEditorSelection(fallbackElement);
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;

  const range = sel.getRangeAt(0);

  // Check if cursor is already inside <code>
  let node: Node | null = sel.anchorNode;
  while (node && node !== fallbackElement) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName.toLowerCase() === 'code') {
      const parent = node.parentNode;
      if (parent) {
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
        saveEditorSelection();
        return true;
      }
    }
    node = node.parentNode;
  }

  if (!sel.isCollapsed) {
    const codeEl = document.createElement('code');
    try {
      codeEl.appendChild(range.extractContents());
      range.insertNode(codeEl);
      range.selectNodeContents(codeEl);
      sel.removeAllRanges();
      sel.addRange(range);
      saveEditorSelection();
      return true;
    } catch {
      return document.execCommand('formatBlock', false, '<pre>');
    }
  } else {
    const codeEl = document.createElement('code');
    codeEl.textContent = 'code';
    range.insertNode(codeEl);
    range.selectNodeContents(codeEl);
    sel.removeAllRanges();
    sel.addRange(range);
    saveEditorSelection();
    return true;
  }
}

/**
 * Clear formatting on active selection
 */
export function clearAllFormatting(fallbackElement?: HTMLElement | null): void {
  restoreEditorSelection(fallbackElement);
  document.execCommand('removeFormat', false);
  document.execCommand('unlink', false);
  saveEditorSelection();
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

/**
 * Apply inline font family to selected text, or return false if no text selected
 */
export function applyInlineFontFamily(familyKey: FontFamily, fallbackElement?: HTMLElement | null): boolean {
  restoreEditorSelection(fallbackElement);
  const def = FONT_FAMILY_DEFINITIONS[familyKey];
  if (!def) return false;

  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontFamily = def.css;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      range.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(range);
      saveEditorSelection();
      return true;
    } catch {
      return document.execCommand('fontName', false, def.css);
    }
  }
  return false;
}
