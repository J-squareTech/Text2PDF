import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Eye } from 'lucide-react';
import { DocumentModel } from '../../types/document';
import { paginateContent } from '../../utils/pagination';
import { saveEditorSelection, FONT_FAMILY_DEFINITIONS } from '../../utils/editorUtils';
import {
  ActiveTableContext,
  getActiveTableContext,
  insertRowAbove,
  insertRowBelow,
  deleteCurrentRow,
  insertColumnLeft,
  insertColumnRight,
  deleteCurrentColumn,
  deleteTable,
  handleTableTabNavigation,
} from '../../utils/tableUtils';
import { TableControlsBar } from './TableControlsBar';
import { TablePropertiesModal } from './TablePropertiesModal';

interface WordEditorProps {
  doc: DocumentModel;
  onChangeContent: (content: string) => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onInsertPageBreak?: () => void;
  onOpenPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  doc,
  onChangeContent,
  editorRef,
  onOpenPreview,
  onUndo,
  onRedo,
}) => {
  const pagination = paginateContent(doc.content, doc.pageSetup);
  const lastLoadedDocIdRef = useRef<string | null>(null);

  // Active table context state
  const [tableContext, setTableContext] = useState<ActiveTableContext>({
    table: null,
    row: null,
    cell: null,
    rowIndex: -1,
    colIndex: -1,
    totalRows: 0,
    totalCols: 0,
  });

  const [isTablePropertiesOpen, setIsTablePropertiesOpen] = useState(false);

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
      // Update table context if cursor is in table
      const ctx = getActiveTableContext(editorRef.current);
      setTableContext(ctx);
    }
  }, [editorRef, onChangeContent]);

  // Track selection and active table whenever the user clicks, types, or moves the cursor
  const handleSelectionTracking = () => {
    saveEditorSelection();
    if (editorRef.current) {
      const ctx = getActiveTableContext(editorRef.current);
      setTableContext(ctx);
    }
  };

  // Table action callbacks
  const handleInsertRowAbove = () => {
    if (tableContext.cell) {
      insertRowAbove(tableContext.cell);
      handleInput();
    }
  };

  const handleInsertRowBelow = () => {
    if (tableContext.cell) {
      insertRowBelow(tableContext.cell);
      handleInput();
    }
  };

  const handleDeleteRow = () => {
    if (tableContext.cell) {
      deleteCurrentRow(tableContext.cell);
      handleInput();
    }
  };

  const handleInsertColLeft = () => {
    if (tableContext.cell) {
      insertColumnLeft(tableContext.cell);
      handleInput();
    }
  };

  const handleInsertColRight = () => {
    if (tableContext.cell) {
      insertColumnRight(tableContext.cell);
      handleInput();
    }
  };

  const handleDeleteCol = () => {
    if (tableContext.cell) {
      deleteCurrentColumn(tableContext.cell);
      handleInput();
    }
  };

  const handleDeleteTable = () => {
    if (tableContext.table) {
      deleteTable(tableContext.table);
      handleInput();
      setTableContext({
        table: null,
        row: null,
        cell: null,
        rowIndex: -1,
        colIndex: -1,
        totalRows: 0,
        totalCols: 0,
      });
    }
  };

  // Handle special keys (Tab, Ctrl+Enter, Ctrl+Z, Ctrl+Y, Ctrl+U, Ctrl+B, Ctrl+I)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Undo shortcut (Ctrl+Z or Cmd+Z)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      onUndo?.();
      return;
    }

    // Redo shortcut (Ctrl+Y, Cmd+Y, or Ctrl+Shift+Z, Cmd+Shift+Z)
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
    ) {
      e.preventDefault();
      onRedo?.();
      return;
    }

    // Underline shortcut (Ctrl+U or Cmd+U)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      document.execCommand('underline', false);
      saveEditorSelection();
      handleInput();
      return;
    }

    // Bold shortcut (Ctrl+B or Cmd+B)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      document.execCommand('bold', false);
      saveEditorSelection();
      handleInput();
      return;
    }

    // Italic shortcut (Ctrl+I or Cmd+I)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      document.execCommand('italic', false);
      saveEditorSelection();
      handleInput();
      return;
    }

    // Tab key -> indent or navigate table cells
    if (e.key === 'Tab') {
      e.preventDefault();
      // If cursor is inside a table, navigate cells or auto-insert new row
      if (tableContext.cell) {
        const handled = handleTableTabNavigation(tableContext.cell, e.shiftKey);
        if (handled) {
          handleInput();
          return;
        }
      }
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
  const fontStyle =
    FONT_FAMILY_DEFINITIONS[doc.pageSetup.fontFamily]?.fontClass || "font-['Plus_Jakarta_Sans',sans-serif]";

  const accentHex = doc.pageSetup.accentColor || '#1e3a8a';

  return (
    <div className="flex-1 flex flex-col bg-slate-100/90 overflow-hidden relative">
      {/* Interactive Table Editing Tools - Pops up whenever user selects or clicks inside a table */}
      {tableContext.table && (
        <TableControlsBar
          tableContext={tableContext}
          onInsertRowAbove={handleInsertRowAbove}
          onInsertRowBelow={handleInsertRowBelow}
          onDeleteRow={handleDeleteRow}
          onInsertColLeft={handleInsertColLeft}
          onInsertColRight={handleInsertColRight}
          onDeleteCol={handleDeleteCol}
          onDeleteTable={handleDeleteTable}
          onOpenTableProperties={() => setIsTablePropertiesOpen(true)}
          onClose={() =>
            setTableContext((prev) => ({
              ...prev,
              table: null,
            }))
          }
        />
      )}

      {/* Table Editor & Design Presets Modal */}
      {tableContext.table && (
        <TablePropertiesModal
          isOpen={isTablePropertiesOpen}
          onClose={() => setIsTablePropertiesOpen(false)}
          tableContext={tableContext}
          accentColor={accentHex}
          onTableUpdated={handleInput}
        />
      )}

      {/* Scrollable Document Canvas */}
      <div className="flex-1 overflow-y-auto bg-slate-100/70 p-2 sm:p-6 lg:p-8 flex justify-center">
        {/* Document Paper Sheet */}
        <div
          className={`w-full max-w-3xl bg-white shadow-md rounded-xs border border-slate-300/80 min-h-[92vh] flex flex-col transition-all relative ${fontStyle}`}
          style={{
            fontSize: `${doc.pageSetup.fontSize || 11}pt`,
            lineHeight: doc.pageSetup.lineHeight || 1.6,
            '--doc-accent': accentHex,
          } as React.CSSProperties}
        >
          {/* Paper Top Margin Header */}
          <div className="px-5 sm:px-12 pt-6 sm:pt-8 pb-3 border-b border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400 select-none">
            <span className="truncate max-w-[280px]">
              {doc.pageSetup.headerText || 'Header (Set in Page Setup)'}
            </span>
            {doc.pageSetup.showPageNumbers && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: `${accentHex}15`,
                  color: accentHex,
                }}
              >
                Page 1
              </span>
            )}
          </div>

          {/* Main Visual WYSIWYG Writing Area */}
          <div
            className="flex-1 px-5 sm:px-12 pt-6 pb-20 document-canvas overflow-x-auto"
            style={{ '--doc-accent': accentHex } as React.CSSProperties}
          >
            <div
              ref={editorRef}
              id="wysiwyg-document-editor"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onClick={handleSelectionTracking}
              onFocus={handleSelectionTracking}
              onKeyUp={handleSelectionTracking}
              onMouseUp={handleSelectionTracking}
              onTouchEnd={handleSelectionTracking}
              onSelect={handleSelectionTracking}
              className="w-full min-h-[750px] focus:outline-none text-slate-800"
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

          {onOpenPreview && (
            <>
              <span className="text-slate-300">•</span>
              <button
                id="btn-statusbar-preview"
                onClick={onOpenPreview}
                className="flex items-center space-x-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded border border-blue-200 transition-colors cursor-pointer"
                title="View Live Paginated PDF Preview"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Live Preview</span>
              </button>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400">
          <span>Shortcuts: <strong>Ctrl+B</strong> (Bold) • <strong>Ctrl+Enter</strong> (Page Break)</span>
        </div>
      </div>

      {/* Floating Quick Preview Trigger for Mobile / Small Screens */}
      {onOpenPreview && (
        <button
          id="btn-floating-mobile-preview"
          onClick={onOpenPreview}
          className="md:hidden fixed bottom-12 right-4 z-30 flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-lg border border-white/20 active:scale-95 transition-all cursor-pointer"
          title="Open Live PDF Preview"
        >
          <Eye className="w-4 h-4" />
          <span>Preview PDF</span>
          <span className="bg-blue-800/80 text-blue-100 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
            {pagination.totalPages}p
          </span>
        </button>
      )}
    </div>
  );
};
