import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Minus,
  PenTool,
  Columns,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { FontFamily } from '../../types/document';

interface ToolbarProps {
  onInsertMarkdown: (prefix: string, suffix?: string, defaultText?: string) => void;
  fontFamily: FontFamily;
  onChangeFontFamily: (font: FontFamily) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  viewMode: 'split' | 'preview' | 'editor';
  onChangeViewMode: (mode: 'split' | 'preview' | 'editor') => void;
  zoomLevel: number;
  onChangeZoomLevel: (zoom: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onInsertMarkdown,
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  viewMode,
  onChangeViewMode,
  zoomLevel,
  onChangeZoomLevel,
}) => {
  const insertTable = () => {
    const tableTemplate = `\n| Item / Deliverable | Description | Qty | Unit Price | Total |\n| :--- | :--- | :--- | :--- | :--- |\n| Phase 1 Deployment | Initial core infrastructure setup | 1 | $1,200.00 | $1,200.00 |\n| Quality Assurance | End-to-end reliability verification | 1 | $450.00 | $450.00 |\n`;
    onInsertMarkdown(tableTemplate, '');
  };

  const insertSignatureBlock = () => {
    const sigTemplate = `\n\n---\n### Document Authorization & Signatures\n\n| Initiator / Authorized Officer | Approving Authority |\n| :--- | :--- |\n| **Signature:** *A. Tanle* | **Signature:** ___________________ |\n| **Name:** Alex Tanle | **Name:** Marcus Vance |\n| **Title:** Managing Director | **Title:** Chief Technology Officer |\n| **Date:** September 11, 2026 | **Date:** September 11, 2026 |\n`;
    onInsertMarkdown(sigTemplate, '');
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs text-slate-700 select-none shadow-2xs">
      {/* Group 1: Typography & Heading */}
      <div className="flex items-center space-x-1 shrink-0">
        {/* Heading selector */}
        <select
          id="select-heading-type"
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'h1') onInsertMarkdown('# ', '');
            if (val === 'h2') onInsertMarkdown('## ', '');
            if (val === 'h3') onInsertMarkdown('### ', '');
            e.target.value = 'p';
          }}
          defaultValue="p"
          className="h-8 border border-slate-200 rounded-md bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1 (#)</option>
          <option value="h2">Heading 2 (##)</option>
          <option value="h3">Heading 3 (###)</option>
        </select>

        {/* Font Family selector */}
        <select
          id="select-font-family"
          value={fontFamily}
          onChange={(e) => onChangeFontFamily(e.target.value as FontFamily)}
          className="h-8 border border-slate-200 rounded-md bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="sans">Modern Sans (Plus Jakarta)</option>
          <option value="serif">Editorial Serif (Lora)</option>
          <option value="mono">Code Monospace (Fira)</option>
          <option value="display">Classical Display (Cinzel)</option>
        </select>

        {/* Font Size */}
        <select
          id="select-font-size"
          value={fontSize}
          onChange={(e) => onChangeFontSize(Number(e.target.value))}
          className="h-8 border border-slate-200 rounded-md bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value={9.5}>9.5 pt (Dense)</option>
          <option value={10.5}>10.5 pt (Standard)</option>
          <option value={11}>11 pt (Document)</option>
          <option value={12}>12 pt (Large)</option>
          <option value={14}>14 pt (Presentation)</option>
        </select>
      </div>

      <div className="h-4 w-px bg-slate-200 shrink-0" />

      {/* Group 2: Inline Styles */}
      <div className="flex items-center space-x-0.5 shrink-0">
        <button
          id="btn-format-bold"
          onClick={() => onInsertMarkdown('**', '**', 'bold text')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-italic"
          onClick={() => onInsertMarkdown('*', '*', 'italic text')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-underline"
          onClick={() => onInsertMarkdown('<u>', '</u>', 'underlined')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-strike"
          onClick={() => onInsertMarkdown('~~', '~~', 'strikethrough')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-code"
          onClick={() => onInsertMarkdown('`', '`', 'code')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 shrink-0" />

      {/* Group 3: Lists & Quotes */}
      <div className="flex items-center space-x-0.5 shrink-0">
        <button
          id="btn-format-bullet-list"
          onClick={() => onInsertMarkdown('\n- ', '', 'List item')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-numbered-list"
          onClick={() => onInsertMarkdown('\n1. ', '', 'Numbered step')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-quote"
          onClick={() => onInsertMarkdown('\n> ', '', 'Key insight or blockquote')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 shrink-0" />

      {/* Group 4: Insert Objects (Table, Rule, Signature) */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          id="btn-insert-table"
          onClick={insertTable}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          title="Insert Data Table"
        >
          <TableIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Table</span>
        </button>

        <button
          id="btn-insert-divider"
          onClick={() => onInsertMarkdown('\n\n---\n\n', '')}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          title="Horizontal Rule / Page Break"
        >
          <Minus className="w-3.5 h-3.5 text-slate-500" />
          <span>Divider</span>
        </button>

        <button
          id="btn-insert-signature"
          onClick={insertSignatureBlock}
          className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          title="Insert Legal / Approval Signature Block"
        >
          <PenTool className="w-3.5 h-3.5 text-indigo-600" />
          <span>Signatures</span>
        </button>
      </div>

      {/* Group 5: View Mode & Zoom controls */}
      <div className="flex items-center space-x-2 shrink-0 ml-auto">
        {/* Zoom */}
        <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5">
          <button
            id="btn-zoom-out"
            onClick={() => onChangeZoomLevel(Math.max(0.65, zoomLevel - 0.1))}
            className="p-1 hover:text-blue-600 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-mono text-slate-600 min-w-[32px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            id="btn-zoom-in"
            onClick={() => onChangeZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
            className="p-1 hover:text-blue-600 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* View Mode */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            id="btn-mode-split"
            onClick={() => onChangeViewMode('split')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'split' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Split Editor & Preview"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-mode-editor"
            onClick={() => onChangeViewMode('editor')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'editor' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Editor Focus Mode"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-mode-preview"
            onClick={() => onChangeViewMode('preview')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'preview' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Full Page Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
