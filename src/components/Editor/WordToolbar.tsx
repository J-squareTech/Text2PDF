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
} from 'lucide-react';
import { FontFamily } from '../../types/document';

interface WordToolbarProps {
  onFormatBlock: (tag: string) => void;
  onFormatInline: (command: string, value?: string) => void;
  onInsertTable: () => void;
  onInsertPageBreak: () => void;
  onInsertDivider: () => void;
  fontFamily: FontFamily;
  onChangeFontFamily: (font: FontFamily) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const WordToolbar: React.FC<WordToolbarProps> = ({
  onFormatBlock,
  onFormatInline,
  onInsertTable,
  onInsertPageBreak,
  onInsertDivider,
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  onUndo,
  onRedo,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlighterPicker, setShowHighlighterPicker] = useState(false);

  // Prevent button clicks from stealing focus from contentEditable!
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

  const highlighters = [
    { label: 'Yellow', value: '#fef08a' },
    { label: 'Green', value: '#bbf7d0' },
    { label: 'Cyan', value: '#bae6fd' },
    { label: 'Pink', value: '#fbcfe8' },
    { label: 'None', value: 'transparent' },
  ];

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

      {/* 3. Text Styles / Hierarchy */}
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
          title="Title"
        >
          Title
        </button>
        <button
          id="btn-format-h2"
          onMouseDown={preventBlur}
          onClick={() => onFormatBlock('<h2>')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-h3"
          onMouseDown={preventBlur}
          onClick={() => onFormatBlock('<h3>')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
          title="Heading 2"
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

      {/* 7. Inserts: Table, Line, and Page Break */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          id="btn-insert-table"
          onMouseDown={preventBlur}
          onClick={onInsertTable}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-700 transition-colors font-medium"
          title="Insert Editable Table"
        >
          <TableIcon className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Table</span>
        </button>

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

        {/* The Page Break Button */}
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
    </div>
  );
};
