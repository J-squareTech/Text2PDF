import React, { useRef, useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { DocumentModel } from '../../types/document';

interface DocumentCanvasProps {
  doc: DocumentModel;
  onChangeContent: (content: string) => void;
  viewMode: 'split' | 'preview' | 'editor';
  zoomLevel: number;
  onOpenQuickAI: (selectedText: string) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  doc,
  onChangeContent,
  viewMode,
  zoomLevel,
  onOpenQuickAI,
  editorRef,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // Calculate statistics
  const textWords = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;
  const textChars = doc.content.length;
  const estimatedPages = Math.max(1, Math.ceil(textWords / 450));
  const readingTimeMinutes = Math.max(1, Math.ceil(textWords / 200));

  // Determine font classes based on setup
  const getFontFamilyClass = () => {
    switch (doc.pageSetup.fontFamily) {
      case 'serif':
        return 'font-serif font-["Lora"]';
      case 'mono':
        return 'font-mono font-["Fira_Code"]';
      case 'display':
        return 'font-["Cinzel"]';
      case 'sans':
      default:
        return 'font-sans font-["Plus_Jakarta_Sans"]';
    }
  };

  // Determine margin classes in millimeters/pixels for page representation
  const getMarginStyle = () => {
    switch (doc.pageSetup.margin) {
      case 'compact':
        return { padding: '15mm' };
      case 'relaxed':
        return { padding: '28mm' };
      case 'normal':
      default:
        return { padding: '20mm' };
    }
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start !== end) {
      const selected = target.value.substring(start, end).trim();
      if (selected.length > 5) {
        setSelectedText(selected);
      } else {
        setSelectedText('');
      }
    } else {
      setSelectedText('');
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100/90 relative">
      {/* LEFT: Markdown Raw Editor (Visible in 'split' or 'editor' mode) */}
      {(viewMode === 'split' || viewMode === 'editor') && (
        <div
          className={`flex flex-col bg-white border-r border-slate-200 transition-all ${
            viewMode === 'editor' ? 'w-full' : 'w-1/2'
          }`}
        >
          {/* Editor sub-header */}
          <div className="h-8 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between text-[11px] text-slate-500 select-none">
            <span className="font-semibold uppercase tracking-wider text-slate-400">Markdown Document Source</span>
            <div className="flex items-center space-x-2">
              <button
                id="btn-copy-source"
                onClick={handleCopyMarkdown}
                className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 transition-colors"
                title="Copy raw markdown"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Editor Textarea with Line Numbers simulation */}
          <div className="flex-1 relative flex overflow-hidden">
            <textarea
              id="document-editor-textarea"
              ref={editorRef}
              value={doc.content}
              onChange={(e) => onChangeContent(e.target.value)}
              onSelect={handleTextareaSelect}
              placeholder="Start typing your document or paste text here..."
              spellCheck="false"
              className="w-full h-full p-4 resize-none border-none focus:outline-none font-mono text-sm leading-relaxed text-slate-800 bg-transparent overflow-y-auto selection:bg-blue-100"
            />

            {/* Floating Selection Tool (Quick AI Rewrite button) */}
            {selectedText && (
              <div className="absolute bottom-6 right-6 z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  id="btn-quick-ai-transform"
                  onClick={() => onOpenQuickAI(selectedText)}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Polish Selected</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RIGHT: Live High-Fidelity Page Preview (Visible in 'split' or 'preview' mode) */}
      {(viewMode === 'split' || viewMode === 'preview') && (
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col items-center justify-start transition-all relative ${
            viewMode === 'preview' ? 'w-full' : ''
          }`}
        >
          {/* Simulated Printed Paper Canvas */}
          <div
            id="printable-document-page"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              width: doc.pageSetup.orientation === 'landscape' ? '297mm' : '210mm',
              minHeight: doc.pageSetup.orientation === 'landscape' ? '210mm' : '297mm',
              ...getMarginStyle(),
            }}
            className={`bg-white text-slate-900 shadow-xl rounded-xs transition-transform duration-100 flex flex-col justify-between relative mb-12 border border-slate-200/80 ${getFontFamilyClass()}`}
          >
            {/* Top Running Header */}
            <div>
              {doc.pageSetup.headerText ? (
                <div className="pb-3 mb-6 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-400 tracking-wider uppercase select-none">
                  <span>{doc.pageSetup.headerText}</span>
                  <span className="text-[10px] text-slate-300">Tex2PDF Engine</span>
                </div>
              ) : null}

              {/* Document Body Formatted Content */}
              <div
                style={{
                  fontSize: `${doc.pageSetup.fontSize}pt`,
                  lineHeight: doc.pageSetup.lineHeight,
                }}
                className="document-body space-y-4 text-slate-800"
              >
                {renderFormattedContent(doc.content, doc.pageSetup.accentColor)}
              </div>
            </div>

            {/* Bottom Running Footer */}
            <div className="pt-4 mt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <span>{doc.pageSetup.footerText || ''}</span>
              {doc.pageSetup.showPageNumbers && (
                <span className="font-medium text-slate-500">
                  Page 1 of {estimatedPages}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Status Bar */}
      <div className="absolute bottom-2 left-4 right-4 h-7 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg px-3 flex items-center justify-between text-[11px] text-slate-500 shadow-xs z-10 select-none">
        <div className="flex items-center space-x-3">
          <span><strong>{textWords}</strong> words</span>
          <span className="text-slate-300">•</span>
          <span><strong>{textChars}</strong> characters</span>
          <span className="text-slate-300">•</span>
          <span>~{readingTimeMinutes} min read</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="capitalize">{doc.pageSetup.paperSize.toUpperCase()} ({doc.pageSetup.orientation})</span>
          <span className="text-slate-300">•</span>
          <span>Est. <strong>{estimatedPages}</strong> {estimatedPages === 1 ? 'page' : 'pages'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * High-fidelity Markdown to React elements renderer for the paper canvas
 */
function renderFormattedContent(content: string, accentColor?: string): React.ReactNode[] {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let tableRows: string[] = [];
  let inTable = false;

  const flushTable = (keyIndex: number) => {
    if (tableRows.length === 0) return null;
    const headerLine = tableRows[0];
    const dataLines = tableRows.slice(1).filter((l) => !/^\|?\s*:?-+:?\s*\|?/.test(l));

    const parseCells = (line: string) =>
      line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

    const headers = parseCells(headerLine);

    const tableNode = (
      <div key={`table-${keyIndex}`} className="my-4 overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-200 text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((h, i) => (
                <th key={i} className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">
                  {renderInlineFormatting(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataLines.map((row, rIdx) => {
              const cells = parseCells(row);
              return (
                <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-slate-600 border-r border-slate-100 last:border-r-0">
                      {renderInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );

    tableRows = [];
    inTable = false;
    return tableNode;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trimEnd();

    // Check table row
    if (raw.startsWith('|') && raw.endsWith('|')) {
      inTable = true;
      tableRows.push(raw);
      continue;
    } else if (inTable) {
      const tbl = flushTable(i);
      if (tbl) nodes.push(tbl);
    }

    // Empty line
    if (!raw.trim()) {
      nodes.push(<div key={`gap-${i}`} className="h-2" />);
      continue;
    }

    // Headings
    if (raw.startsWith('# ')) {
      nodes.push(
        <h1
          key={`h1-${i}`}
          style={{ color: accentColor || '#0f172a' }}
          className="text-2xl font-bold tracking-tight pb-1 border-b border-slate-200 mt-2 mb-3"
        >
          {renderInlineFormatting(raw.replace(/^#\s+/, ''))}
        </h1>
      );
      continue;
    }

    if (raw.startsWith('## ')) {
      nodes.push(
        <h2
          key={`h2-${i}`}
          className="text-lg font-bold text-slate-800 tracking-tight mt-4 mb-1.5"
        >
          {renderInlineFormatting(raw.replace(/^##\s+/, ''))}
        </h2>
      );
      continue;
    }

    if (raw.startsWith('### ')) {
      nodes.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold text-slate-700 tracking-tight mt-3 mb-1">
          {renderInlineFormatting(raw.replace(/^###\s+/, ''))}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (raw === '---' || raw === '***') {
      nodes.push(<hr key={`hr-${i}`} className="border-t border-slate-200 my-4" />);
      continue;
    }

    // Blockquote
    if (raw.startsWith('> ')) {
      nodes.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-3 border-blue-600 pl-3 py-1 my-2 text-slate-600 italic bg-blue-50/30 rounded-r text-sm"
        >
          {renderInlineFormatting(raw.replace(/^>\s+/, ''))}
        </blockquote>
      );
      continue;
    }

    // Bullet item
    if (raw.startsWith('- ') || raw.startsWith('* ')) {
      nodes.push(
        <li key={`li-${i}`} className="ml-5 list-disc text-slate-700 py-0.5">
          {renderInlineFormatting(raw.replace(/^[-*]\s+/, ''))}
        </li>
      );
      continue;
    }

    // Numbered item
    const numMatch = raw.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      nodes.push(
        <li key={`num-${i}`} className="ml-5 list-decimal text-slate-700 py-0.5">
          {renderInlineFormatting(numMatch[2])}
        </li>
      );
      continue;
    }

    // Standard Paragraph
    nodes.push(
      <p key={`p-${i}`} className="text-slate-700">
        {renderInlineFormatting(raw)}
      </p>
    );
  }

  if (inTable) {
    const tbl = flushTable(lines.length);
    if (tbl) nodes.push(tbl);
  }

  return nodes;
}

/**
 * Parses bold (**text**), italic (*text*), underline (<u>text</u>), inline code (`code`), etc.
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Quick regex replacements for bold and italic
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
