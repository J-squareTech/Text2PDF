import React, { useRef, useEffect, useCallback } from 'react';
import { DocumentModel } from '../../types/document';
import { paginateContent } from '../../utils/pagination';
import { saveEditorSelection } from '../../utils/editorUtils';

interface WordEditorProps {
  doc: DocumentModel;
  onChangeContent: (content: string) => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onInsertPageBreak?: () => void;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  doc,
  onChangeContent,
  editorRef,
}) => {
  const pagination = paginateContent(doc.content, doc.pageSetup);
  const lastLoadedDocIdRef = useRef<string | null>(null);

  // Initialize content when doc.id changes or if the editor element is freshly mounted
  useEffect(() => {
    if (editorRef.current) {
      if (lastLoadedDocIdRef.current !== doc.id || !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = doc.content || '';
        lastLoadedDocIdRef.current = doc.id;
      }
    }
  }, [doc.id, doc.content, editorRef]);

  // Handle typing inside contentEditable
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      saveEditorSelection();
      onChangeContent(html);
    }
  }, [editorRef, onChangeContent]);

  // Track selection whenever the user clicks, types, or moves the cursor
  const handleSelectionTracking = () => {
    saveEditorSelection();
  };

  // Handle special keys (Tab, Ctrl+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Tab key -> insert 4 spaces or indent cleanly
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      handleInput();
      return;
    }

    // Ctrl+Enter or Cmd+Enter -> Page Break
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      document.execCommand(
        'insertHTML',
        false,
        `<div class="page-break" style="margin: 28px 0; padding: 10px 14px; background: #eff6ff; border: 1.5px dashed #3b82f6; border-radius: 6px; text-align: center; font-size: 11px; color: #1d4ed8; font-weight: 600; user-select: none;" contenteditable="false">✂️ --- Page Break (Page 2 begins below) ---</div><p><br/></p>`
      );
      handleInput();
      return;
    }
  };

  // Font family class
  const fontStyle = {
    sans: "font-['Plus_Jakarta_Sans',sans-serif]",
    serif: "font-['Lora',serif]",
    mono: "font-['Fira_Code',monospace]",
    display: "font-['Cinzel',serif]",
  }[doc.pageSetup.fontFamily] || "font-['Plus_Jakarta_Sans']";

  return (
    <div className="flex-1 flex flex-col bg-slate-100/90 overflow-hidden relative">
      {/* Scrollable Document Canvas */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 lg:p-8 flex justify-center">
        {/* Document Paper Sheet */}
        <div
          className={`w-full max-w-3xl bg-white shadow-md rounded-xs border border-slate-300/80 min-h-[92vh] flex flex-col transition-all relative ${fontStyle}`}
          style={{
            fontSize: `${doc.pageSetup.fontSize || 11}pt`,
            lineHeight: doc.pageSetup.lineHeight || 1.6,
          }}
        >
          {/* Paper Top Margin Header */}
          <div className="px-5 sm:px-12 pt-6 sm:pt-8 pb-3 border-b border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400 select-none">
            <span className="truncate max-w-[280px]">
              {doc.pageSetup.headerText || 'Header (Set in Page Setup)'}
            </span>
            <span className="text-[10px] uppercase font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
              {doc.pageSetup.paperSize.toUpperCase()} Page
            </span>
          </div>

          {/* Main Visual WYSIWYG Writing Area with Generous Bottom Space */}
          <div className="flex-1 px-5 sm:px-12 pt-6 pb-40 document-canvas overflow-x-auto">
            <div
              ref={editorRef}
              id="wysiwyg-document-editor"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onKeyUp={handleSelectionTracking}
              onMouseUp={handleSelectionTracking}
              onTouchEnd={handleSelectionTracking}
              onSelect={handleSelectionTracking}
              className="w-full min-h-[750px] pb-24 focus:outline-none text-slate-800"
              spellCheck={true}
            />
          </div>

          {/* Paper Bottom Margin Footer */}
          <div className="px-5 sm:px-12 py-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400 select-none">
            <span className="truncate max-w-[240px]">
              {doc.pageSetup.footerText || 'Footer'}
            </span>
            <span>
              {doc.pageSetup.showPageNumbers ? 'Page numbering on' : 'No page numbers'}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Status Bar at Bottom */}
      <div className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-600 select-none shrink-0 shadow-2xs font-sans">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-blue-700">
            {pagination.totalPages} {pagination.totalPages === 1 ? 'Page' : 'Pages'}
          </span>
          <span className="text-slate-300">•</span>
          <span>{pagination.wordCount} words</span>
          <span className="text-slate-300">•</span>
          <span>{pagination.charCount} chars</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400">
          <span>Shortcuts: <strong>Ctrl+B</strong> (Bold) • <strong>Ctrl+Enter</strong> (Page Break)</span>
        </div>
      </div>
    </div>
  );
};
