import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Table as TableIcon,
  Minus,
  SeparatorHorizontal,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Palette,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { FontFamily } from '../../types/document';
import { createTableHtml } from '../../utils/tableUtils';

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
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Prevent button clicks from stealing focus from contentEditable
  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const colors = [
    { label: 'Black', value: '#0f172a' },
    { label: 'Navy Blue', value: '#1e3a8a' },
    { label: 'Crimson', value: '#b91c1c' },
    { label: 'Emerald', value: '#047857' },
    { label: 'Purple', value: '#6d28d9' },
  ];

  const themeAccents = [
    { label: 'Navy Blue', value: '#1e3a8a' },
    { label: 'Crimson Red', value: '#b91c1c' },
    { label: 'Emerald Green', value: '#047857' },
    { label: 'Royal Purple', value: '#6d28d9' },
    { label: 'Amber Gold', value: '#d97706' },
    { label: 'Slate Charcoal', value: '#334155' },
  ];

  const highlighters = [
    { label: 'Yellow', value: '#fef08a' },
    { label: 'Green', value: '#bbf7d0' },
    { label: 'Cyan', value: '#bae6fd' },
    { label: 'Pink', value: '#fbcfe8' },
    { label: 'None', value: 'transparent' },
  ];

  const handleCreateChosenTable = (rows: number, cols: number) => {
    const html = createTableHtml(rows, cols, true, accentColor);
    onInsertCustomTable(html);
    setShowTablePicker(false);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-2 sm:px-4 py-1.5 flex items-center overflow-x-auto no-scrollbar space-x-1 sm:space-x-2 shadow-2xs select-none shrink-0 text-slate-700 text-xs z-20">
      {/* 1. History (Undo / Redo) */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-toolbar-undo"
          onMouseDown={preventBlur}
          onClick={onUndo}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-toolbar-redo"
          onMouseDown={preventBlur}
          onClick={onRedo}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Font Family & Size */}
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

        <select
          id="select-font-size"
          value={fontSize}
          onChange={(e) => onChangeFontSize(Number(e.target.value))}
          className="h-7 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value={10}>10 pt</option>
          <option value={11}>11 pt</option>
          <option value={12}>12 pt</option>
          <option value={14}>14 pt</option>
          <option value={16}>16 pt</option>
          <option value={18}>18 pt</option>
          <option value={22}>22 pt</option>
        </select>
      </div>

      {/* 3. Text Styles / Paragraph Hierarchy */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-format-normal"
          onMouseDown={preventBlur}
          onClick={() => onFormatBlock('<p>')}
          className="px-2 py-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
          title="Normal Paragraph"
        >
          Normal
        </button>
        <button
          id="btn-format-title"
          onMouseDown={preventBlur}
          onClick={() => onFormatBlock('<h1>')}
          className="px-2 py-1 rounded hover:bg-slate-100 text-xs font-bold text-slate-900 transition-colors"
          title="Heading 1"
        >
          Title
        </button>
        <button
          id="btn-format-h2"
          onMouseDown={preventBlur}
          onClick={() => onFormatBlock('<h2>')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Heading 2"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-h3"
          onMouseDown={preventBlur}
          onClick={() => onFormatBlock('<h3>')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Heading 3"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Bold, Italic, Underline, Strike */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-bold"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('bold')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors font-bold"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
        <button
          id="btn-italic"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('italic')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors italic"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-underline"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('underline')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-strike"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('strikeThrough')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-800 transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. Colors & Highlighting */}
      <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 relative shrink-0">
        {/* Text Color */}
        <div className="relative">
          <button
            id="btn-color-picker-toggle"
            onMouseDown={preventBlur}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlighterPicker(false);
              setShowTablePicker(false);
            }}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-0.5"
            title="Text Color"
          >
            <Palette className="w-3.5 h-3.5 text-blue-600" />
          </button>

          {showColorPicker && (
            <div
              className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 flex items-center space-x-1.5"
              onMouseLeave={() => setShowColorPicker(false)}
            >
              {colors.map((c) => (
                <button
                  key={c.value}
                  onMouseDown={preventBlur}
                  onClick={() => {
                    onFormatInline('foreColor', c.value);
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlighter */}
        <div className="relative">
          <button
            id="btn-highlight-picker-toggle"
            onMouseDown={preventBlur}
            onClick={() => {
              setShowHighlighterPicker(!showHighlighterPicker);
              setShowColorPicker(false);
              setShowTablePicker(false);
            }}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-0.5"
            title="Highlight Text"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
          </button>

          {showHighlighterPicker && (
            <div
              className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 flex items-center space-x-1.5"
              onMouseLeave={() => setShowHighlighterPicker(false)}
            >
              {highlighters.map((h) => (
                <button
                  key={h.value}
                  onMouseDown={preventBlur}
                  onClick={() => {
                    onFormatInline('hiliteColor', h.value);
                    setShowHighlighterPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition-transform flex items-center justify-center text-[9px]"
                  style={{ backgroundColor: h.value }}
                  title={h.label}
                >
                  {h.value === 'transparent' ? '✕' : ''}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Alignment & Lists */}
      <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-align-left"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyLeft')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-align-center"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyCenter')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-align-right"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('justifyRight')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-list-bullet"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Bulleted List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-list-number"
          onMouseDown={preventBlur}
          onClick={() => onFormatInline('insertOrderedList')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7. Editable Table with Custom Row/Column Picker */}
      <div className="relative shrink-0 pr-1.5 border-r border-slate-200">
        <button
          id="btn-insert-table"
          onMouseDown={preventBlur}
          onClick={() => {
            setShowTablePicker(!showTablePicker);
            setShowColorPicker(false);
            setShowHighlighterPicker(false);
          }}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-700 transition-colors font-medium"
          title="Insert Editable Table"
        >
          <TableIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Table</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showTablePicker && (
          <div
            className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 w-56 text-slate-800"
            onMouseLeave={() => setShowTablePicker(false)}
          >
            <div className="text-xs font-bold text-slate-700 mb-2">Insert Table</div>
            
            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(2, 2)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-[11px] text-center font-medium transition-colors"
              >
                2 × 2 Table
              </button>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(3, 3)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-[11px] text-center font-medium transition-colors"
              >
                3 × 3 Table
              </button>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(4, 3)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-[11px] text-center font-medium transition-colors"
              >
                4 × 3 Table
              </button>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(5, 4)}
                className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-[11px] text-center font-medium transition-colors"
              >
                5 × 4 Table
              </button>
            </div>

            {/* Custom Rows/Cols Input */}
            <div className="border-t border-slate-100 pt-2 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span>Rows:</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, Number(e.target.value)))}
                  className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs"
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Cols:</span>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, Number(e.target.value)))}
                  className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs"
                />
              </div>
              <button
                onMouseDown={preventBlur}
                onClick={() => handleCreateChosenTable(tableRows, tableCols)}
                className="w-full mt-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              >
                Create {tableRows} × {tableCols} Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8. Inserts: Line & Page Break */}
      <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-200 shrink-0">
        <button
          id="btn-insert-divider"
          onMouseDown={preventBlur}
          onClick={onInsertDivider}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Horizontal Divider"
        >
          <Minus className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Line</span>
        </button>

        <button
          id="btn-insert-pagebreak"
          onMouseDown={preventBlur}
          onClick={onInsertPageBreak}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors font-semibold"
          title="Insert Page Break (Creates next page)"
        >
          <SeparatorHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Page Break</span>
        </button>
      </div>

      {/* 9. Document Theme Color Quick Switcher */}
      {onChangeAccentColor && (
        <div className="relative shrink-0 pr-1.5 border-r border-slate-200">
          <button
            id="btn-toolbar-theme-toggle"
            onMouseDown={preventBlur}
            onClick={() => {
              setShowThemePicker(!showThemePicker);
              setShowColorPicker(false);
              setShowHighlighterPicker(false);
              setShowTablePicker(false);
            }}
            className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-slate-100 text-slate-700 transition-colors font-medium"
            title="Document Accent Theme"
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
              className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl p-2.5 z-50 w-48 text-slate-800"
              onMouseLeave={() => setShowThemePicker(false)}
            >
              <div className="text-[11px] font-bold text-slate-700 mb-1.5">Document Theme</div>
              <div className="space-y-1">
                {themeAccents.map((item) => (
                  <button
                    key={item.value}
                    onMouseDown={preventBlur}
                    onClick={() => {
                      onChangeAccentColor(item.value);
                      setShowThemePicker(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-xs transition-colors ${
                      accentColor.toLowerCase() === item.value.toLowerCase()
                        ? 'bg-slate-100 font-bold text-slate-900'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: item.value }}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. Auto Spell & Grammar Checker */}
      <div className="flex items-center shrink-0">
        <button
          id="btn-auto-spell-checker"
          onMouseDown={preventBlur}
          onClick={onOpenSpellChecker}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all font-semibold ${
            typoCount > 0
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
          title="Auto Spell & Grammar Checker"
        >
          <Sparkles className={`w-3.5 h-3.5 ${typoCount > 0 ? 'text-amber-600' : 'text-blue-600'}`} />
          <span>Spell Check</span>
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
