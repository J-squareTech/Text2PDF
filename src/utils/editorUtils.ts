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
