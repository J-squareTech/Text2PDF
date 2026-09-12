import React, { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  RemoveFormatting,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Table as TableIcon,
  Minus,
  SeparatorHorizontal,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
  Sparkles,
  ChevronDown,
  Quote,
  Check,
} from 'lucide-react';
import { FontFamily } from '../../types/document';
import { createTableHtml } from '../../utils/tableUtils';
import { applyInlineFontSize } from '../../utils/editorUtils';

interface WordToolbarProps {
  onFormatBlock: (tag: string) => void;
  onFormatInline: (command: string, value?: string) => void;
  onInsertCustomTable: (tableHtml: string) => void;
  onInsertPageBreak: () => void;
  onInsertDivider: () => void;
  fontFamily: FontFamily;
  onChangeFontFamily: (font: FontFamily) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenSpellChecker: () => void;
  typoCount: number;
  accentColor?: string;
  onChangeAccentColor?: (color: string) => void;
}

export const WordToolbar: React.FC<WordToolbarProps> = ({
  onFormatBlock,
  onFormatInline,
  onInsertCustomTable,
  onInsertPageBreak,
  onInsertDivider,
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  onUndo,
  onRedo,
  onOpenSpellChecker,
  typoCount,
  accentColor = '#1e3a8a',
  onChangeAccentColor,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlighterPicker, setShowHighlighterPicker] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Close any open toolbar popovers when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.toolbar-dropdown-anchor')) {
        setShowColorPicker(false);
        setShowHighlighterPicker(false);
        setShowTablePicker(false);
        setShowThemePicker(false);
        setShowHeadingPicker(false);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

  // Prevent button clicks from stealing focus from contentEditable
  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Font sizes: Complete range starting from 2, 3, 4, 5, 6, 7, 8... up to 96
  const FONT_SIZES = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72, 96,
  ];

  const handleFontSizeSelect = (newSize: number) => {
    onChangeFontSize(newSize);
    applyInlineFontSize(newSize);
  };

  const handleStepFontSize = (delta: number) => {
    const currentIdx = FONT_SIZES.findIndex((s) => s >= fontSize);
    let nextIdx = currentIdx !== -1 ? currentIdx + delta : 7; // default around 11
    nextIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, nextIdx));
    const newSize = FONT_SIZES[nextIdx];
    handleFontSizeSelect(newSize);
  };

  // Full Rich Palette: Includes Pure Black, Pure White, Grays, Blues, Greens, Warm, Reds, Purples
  const textColors = [
    { label: 'Pure Black', value: '#000000' },
    { label: 'Charcoal Slate', value: '#1e293b' },
    { label: 'Medium Slate', value: '#475569' },
    { label: 'Cool Gray', value: '#94a3b8' },
    { label: 'Pure White', value: '#ffffff' },
    { label: 'Classic Navy', value: '#1e3a8a' },
    { label: 'Royal Blue', value: '#2563eb' },
    { label: 'Sky Blue', value: '#0284c7' },
    { label: 'Cyan', value: '#0891b2' },
    { label: 'Teal', value: '#0d9488' },
    { label: 'Forest Green', value: '#15803d' },
    { label: 'Emerald Green', value: '#059669' },
    { label: 'Lime Olive', value: '#65a30d' },
    { label: 'Amber Gold', value: '#d97706' },
    { label: 'Burnt Orange', value: '#ea580c' },
    { label: 'Warm Bronze', value: '#78350f' },
    { label: 'Crimson Red', value: '#dc2626' },
    { label: 'Ruby Red', value: '#b91c1c' },
    { label: 'Rose Pink', value: '#e11d48' },
    { label: 'Royal Purple', value: '#7c3aed' },
    { label: 'Deep Indigo', value: '#4338ca' },
  ];

  // Document Theme Accents: Includes Black & White + Vibrant Tones
  const themeAccents = [
    { label: 'Pure Black', value: '#000000' },
    { label: 'Charcoal Slate', value: '#1e293b' },
    { label: 'Pure White', value: '#ffffff' },
    { label: 'Classic Navy', value: '#1e3a8a' },
    { label: 'Royal Blue', value: '#2563eb' },
    { label: 'Sky Cyan', value: '#0284c7' },
    { label: 'Emerald Green', value: '#047857' },
    { label: 'Forest Pine', value: '#166534' },
    { label: 'Crimson Red', value: '#b91c1c' },
    { label: 'Rose Ruby', value: '#e11d48' },
    { label: 'Amber Gold', value: '#d97706' },
    { label: 'Burnt Orange', value: '#ea580c' },
    { label: 'Royal Purple', value: '#6d28d9' },
    { label: 'Deep Indigo', value: '#4338ca' },
  ];

  // Highlighters: Includes black, white, translucent and neon pastels
  const highlighters = [
    { label: 'Yellow Neon', value: '#fef08a' },
    { label: 'Mint Green', value: '#bbf7d0' },
    { label: 'Sky Cyan', value: '#bae6fd' },
    { label: 'Soft Pink', value: '#fbcfe8' },
    { label: 'Peach Orange', value: '#fed7aa' },
    { label: 'Lavender', value: '#e9d5ff' },
    { label: 'Pure Black', value: '#000000' },
    { label: 'Pure White', value: '#ffffff' },
    { label: 'Clear / None', value: 'transparent' },
  ];

  const handleCreateChosenTable = (rows: number, cols: number) => {
    const html = createTableHtml(rows, cols, true, accentColor);
    onInsertCustomTable(html);
    setShowTablePicker(false);
  };

  return (
    <div className="relative z-30 bg-white border-b border-slate-200 px-2 sm:px-3 py-1.5 flex flex-wrap items-center gap-y-1.5 gap-x-1 sm:gap-x-1.5 shadow-2xs select-none shrink-0 text-slate-700 text-xs">
      {/* 1. History (Undo / Redo) */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-toolbar-undo"
          onMouseDown={preventBlur}
          onClick={onUndo}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-toolbar-redo"
          onMouseDown={preventBlur}
          onClick={onRedo}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Font Family */}
      <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 shrink-0">
        <select
          id="select-font-family"
          value={fontFamily}
          onChange={(e) => onChangeFontFamily(e.target.value as FontFamily)}
          className="h-7 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="sans">Calibri / Sans</option>
          <option value="serif">Times / Serif</option>
          <option value="mono">Courier / Code</option>
          <option value="display">Georgia / Elegant</option>
        </select>
      </div>

      {/* 3. Comprehensive Font Sizes: 2, 3, 4, 5, 6, 7, 8... 96 + Stepper */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-font-size-decrease"
          onMouseDown={preventBlur}
          onClick={() => handleStepFontSize(-1)}
          className="px-1.5 h-7 rounded hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
          title="Decrease Font Size (A-)"
        >
          A-
        </button>

        <select
          id="select-font-size"
          value={fontSize}
          onChange={(e) => handleFontSizeSelect(Number(e.target.value))}
          className="h-7 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[54px] text-center"
          title="Font Size in Points"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} pt
            </option>
          ))}
        </select>

        <button
          id="btn-font-size-increase"
          onMouseDown={preventBlur}
          onClick={() => handleStepFontSize(1)}
          className="px-1.5 h-7 rounded hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
          title="Increase Font Size (A+)"
        >
          A+
        </button>
      </div>

      {/* 4. Text Styles / Paragraph Hierarchy Dropdown */}
      <div className="relative shrink-0 pr-1.5 border-r border-slate-200 toolbar-dropdown-anchor">
        <button
          id="btn-styles-dropdown"
          onMouseDown={preventBlur}
          onClick={() => {
            setShowHeadingPicker(!showHeadingPicker);
            setShowColorPicker(false);
            setShowHighlighterPicker(false);
            setShowTablePicker(false);
            setShowThemePicker(false);
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors font-medium cursor-pointer ${
            showHeadingPicker
              ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-300'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Paragraph and Heading Styles"
        >
          <span>Styles</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showHeadingPicker && (
          <div
            className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 z-50 w-44 text-slate-800 ring-1 ring-black/5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onMouseDown={preventBlur}
              onClick={() => {
                onFormatBlock('<p>');
                setShowHeadingPicker(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded text-xs text-slate-700 transition-colors"
            >
              Normal Text
            </button>
            <button
              onMouseDown={preventBlur}
              onClick={() => {
                onFormatBlock('<h1>');
                setShowHeadingPicker(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded text-sm font-bold text-slate-900 transition-colors"
            >
              Heading 1 (Title)
            </button>
            <button
              onMouseDown={preventBlur}
              onClick={() => {
                onFormatBlock('<h2>');
                setShowHeadingPicker(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded text-xs font-bold text-slate-800 transition-colors"
            >
              Heading 2
            </button>
            <button
              onMouseDown={preventBlur}
              onClick={() => {
                onFormatBlock('<h3>');
                setShowHeadingPicker(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 transition-colors"
            >
              Heading 3
            </button>
            <button
              onMouseDown={preventBlur}
              onClick={() => {
                onFormatBlock('<blockquote>');
                setShowHeadingPicker(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded text-xs italic text-slate-600 transition-colors flex items-center space-x-1.5"
            >
              <Quote className="w-3 h-3" />
              <span>Quote Block</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Bold, Italic, Underline, Strike, Sub, Super, Code, Clear */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-bold"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('bold')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors font-bold cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
        <button
          id="btn-italic"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('italic')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors italic cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-underline"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('underline')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-strike"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('strikeThrough')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-subscript"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('subscript')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          title="Subscript (X₂)"
        >
          <Subscript className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-superscript"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('superscript')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          title="Superscript (X²)"
        >
          <Superscript className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-inline-code"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('formatBlock', '<pre>')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <button
          id="btn-clear-formatting"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('removeFormat')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* 6. Colors: Text Color & Highlighter (Black, White & Full Range) */}
      <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 shrink-0">
        {/* Text Color */}
        <div className="relative toolbar-dropdown-anchor">
          <button
            id="btn-color-picker-toggle"
            onMouseDown={preventBlur}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlighterPicker(false);
              setShowTablePicker(false);
              setShowThemePicker(false);
              setShowHeadingPicker(false);
            }}
            className={`p-1.5 rounded transition-colors flex items-center space-x-0.5 cursor-pointer ${
              showColorPicker
                ? 'bg-blue-100 text-blue-900 ring-1 ring-blue-400'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Text Color (Includes Black & White)"
          >
            <Palette className="w-3.5 h-3.5 text-blue-600" />
          </button>

          {showColorPicker && (
            <div
              className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-2xl p-2.5 z-50 w-64 ring-1 ring-black/5"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-bold text-slate-700 mb-2">Text Color Palette</div>
              <div className="grid grid-cols-7 gap-1.5">
                {textColors.map((c) => (
                  <button
                    key={c.value}
                    onMouseDown={preventBlur}
                    onClick={() => {
                      onFormatInline('foreColor', c.value);
                      setShowColorPicker(false);
                    }}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 shrink-0 cursor-pointer ${
                      c.value === '#ffffff' ? 'border-2 border-slate-300 shadow-2xs' : 'border border-black/10'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlighter */}
        <div className="relative toolbar-dropdown-anchor">
          <button
            id="btn-highlight-picker-toggle"
            onMouseDown={preventBlur}
            onClick={() => {
              setShowHighlighterPicker(!showHighlighterPicker);
              setShowColorPicker(false);
              setShowTablePicker(false);
              setShowThemePicker(false);
              setShowHeadingPicker(false);
            }}
            className={`p-1.5 rounded transition-colors flex items-center space-x-0.5 cursor-pointer ${
              showHighlighterPicker
                ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Highlight Text Background"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
          </button>

          {showHighlighterPicker && (
            <div
              className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-2xl p-2.5 z-50 w-56 ring-1 ring-black/5"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-bold text-slate-700 mb-2">Highlighter Color</div>
              <div className="grid grid-cols-5 gap-1.5">
                {highlighters.map((h) => (
                  <button
                    key={h.value}
                    onMouseDown={preventBlur}
                    onClick={() => {
                      onFormatInline('hiliteColor', h.value);
                      setShowHighlighterPicker(false);
                    }}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0 cursor-pointer ${
                      h.value === '#ffffff'
                        ? 'border-2 border-slate-300'
                        : h.value === 'transparent'
                        ? 'border border-dashed border-slate-400 bg-slate-100'
                        : 'border border-black/10'
                    }`}
                    style={{ backgroundColor: h.value }}
                    title={h.label}
                  >
                    {h.value === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. Alignment, Lists & Indents */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-align-left"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyLeft')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-align-center"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyCenter')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-align-right"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyRight')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-align-justify"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyFull')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Justify Full"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-list-bullet"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Bulleted List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-list-number"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('insertOrderedList')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-indent"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('indent')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Increase Indent"
        >
          <Indent className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-outdent"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('outdent')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Decrease Indent"
        >
          <Outdent className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 8. Reduced & Tidy Table Feature Insertion Picker */}
      <div className="relative shrink-0 pr-1.5 border-r border-slate-200 toolbar-dropdown-anchor">
        <button
          id="btn-insert-table"
          onMouseDown={preventBlur}
          onClick={() => {
            setShowTablePicker(!showTablePicker);
            setShowColorPicker(false);
            setShowHighlighterPicker(false);
            setShowThemePicker(false);
            setShowHeadingPicker(false);
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors font-medium cursor-pointer ${
            showTablePicker
              ? 'bg-blue-100 text-blue-900 ring-1 ring-blue-400'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Insert Compact Table"
        >
          <TableIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Table</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showTablePicker && (
          <div
            className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 w-56 text-slate-800 ring-1 ring-black/5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Insert Table</span>
              <span className="text-[10px] text-slate-400">Compact</span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-1.5 mb-2.5">
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(2, 2)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-xs text-center font-medium transition-colors cursor-pointer"
              >
                2 × 2
              </button>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(3, 3)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-xs text-center font-medium transition-colors cursor-pointer"
              >
                3 × 3
              </button>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(4, 3)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-xs text-center font-medium transition-colors cursor-pointer"
              >
                4 × 3
              </button>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(4, 4)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-xs text-center font-medium transition-colors cursor-pointer"
              >
                4 × 4
              </button>
            </div>

            {/* Custom Rows/Cols Input */}
            <div className="border-t border-slate-100 pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Rows:</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, Math.min(12, Number(e.target.value))))}
                  className="w-12 px-1.5 py-0.5 border border-slate-300 rounded text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Cols:</span>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, Math.min(8, Number(e.target.value))))}
                  className="w-12 px-1.5 py-0.5 border border-slate-300 rounded text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(tableRows, tableCols)}
                className="w-full mt-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Insert Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 9. Inserts: Line & Page Break */}
      <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-insert-divider"
          onMouseDown={preventBlur}
          onClick={onInsertDivider}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title="Horizontal Divider Line"
        >
          <Minus className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Line</span>
        </button>

        <button
          id="btn-insert-pagebreak"
          onMouseDown={preventBlur}
          onClick={onInsertPageBreak}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors font-semibold cursor-pointer"
          title="Insert Page Break (Creates next page)"
        >
          <SeparatorHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Page Break</span>
        </button>
      </div>

      {/* 10. Document Theme Color Quick Switcher (Includes Black & White) */}
      {onChangeAccentColor && (
        <div className="relative shrink-0 pr-1.5 border-r border-slate-200 toolbar-dropdown-anchor">
          <button
            id="btn-toolbar-theme-toggle"
            onMouseDown={preventBlur}
            onClick={() => {
              setShowThemePicker(!showThemePicker);
              setShowColorPicker(false);
              setShowHighlighterPicker(false);
              setShowTablePicker(false);
              setShowHeadingPicker(false);
            }}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-colors font-medium cursor-pointer ${
              showThemePicker
                ? 'bg-slate-200 text-slate-900 ring-1 ring-slate-400'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Theme Accent Color (Includes Black & White)"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span className="hidden sm:inline">Theme</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showThemePicker && (
            <div
              className="absolute right-0 sm:left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-2xl p-2.5 z-50 w-56 text-slate-800 ring-1 ring-black/5"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-bold text-slate-800 mb-2 px-1">Theme Palette (Inc. B&W)</div>
              <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
                {themeAccents.map((item) => (
                  <button
                    key={item.value}
                    onMouseDown={preventBlur}
                    onClick={() => {
                      onChangeAccentColor(item.value);
                      setShowThemePicker(false);
                    }}
                    className={`flex items-center space-x-2 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                      accentColor.toLowerCase() === item.value.toLowerCase()
                        ? 'bg-slate-100 font-bold text-slate-900 border border-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                        item.value === '#ffffff' ? 'border-2 border-slate-400' : 'border border-black/10'
                      }`}
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="truncate text-[11px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 11. Auto Spell & Grammar Checker */}
      <div className="flex items-center shrink-0">
        <button
          id="btn-auto-spell-checker"
          onMouseDown={preventBlur}
          onClick={onOpenSpellChecker}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-all font-semibold cursor-pointer ${
            typoCount > 0
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
          title="Auto Spell & Grammar Checker"
        >
          <Sparkles className={`w-3.5 h-3.5 ${typoCount > 0 ? 'text-amber-600' : 'text-blue-600'}`} />
          <span className="hidden xs:inline">Spell</span>
          {typoCount > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {typoCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
