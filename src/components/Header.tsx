import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Plus,
  LayoutTemplate,
  Sliders,
  Folder,
  Check,
  ChevronDown,
  Edit2,
  FileCode,
  Share2,
  Loader2,
  Columns,
  Eye,
  PenTool,
  Sparkles,
  MoreVertical,
  Undo2,
  Redo2,
} from 'lucide-react';
import { DocumentModel } from '../types/document';
import {
  exportToDirectPdf,
  triggerSystemPrint,
  exportToMarkdown,
  exportToHtml,
  exportToTxt,
} from '../services/pdfGenerator';

interface HeaderProps {
  currentDoc: DocumentModel;
  onUpdateTitle: (title: string) => void;
  onOpenWorkspace: () => void;
  onOpenTemplates: () => void;
  onOpenPageSettings: () => void;
  isSaving: boolean;
  viewMode: 'editor' | 'preview' | 'split';
  onChangeViewMode: (mode: 'editor' | 'preview' | 'split') => void;
  onCreateNew: () => void;
  currentPageNumber: number;
  totalPageCount: number;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenSpellChecker?: () => void;
  typoCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDoc,
  onUpdateTitle,
  onOpenWorkspace,
  onOpenTemplates,
  onOpenPageSettings,
  isSaving,
  viewMode,
  onChangeViewMode,
  onCreateNew,
  currentPageNumber,
  totalPageCount,
  onUndo,
  onRedo,
  onOpenSpellChecker,
  typoCount = 0,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDoc.title);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);

  // Synchronize title if document changes
  useEffect(() => {
    setTitleValue(currentDoc.title);
  }, [currentDoc.id, currentDoc.title]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
      if (mobileMoreRef.current && !mobileMoreRef.current.contains(e.target as Node)) {
        setShowMobileMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      setShowExportMenu(false);
      setShowMobileMore(false);
      await exportToDirectPdf(currentDoc);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      onUpdateTitle(titleValue.trim());
    } else {
      setTitleValue(currentDoc.title);
    }
  };

  return (
    <header className="relative z-40 h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shadow-2xs shrink-0 select-none">
      {/* LEFT: App Brand / Library / Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 mr-2">
        {/* Document Workspace / Library button */}
        <button
          id="btn-header-workspace"
          onClick={onOpenWorkspace}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1.5 shrink-0 border border-slate-200 shadow-2xs cursor-pointer"
          title="Document Library & Folders"
        >
          <Folder className="w-4 h-4 text-blue-600 stroke-[2.2]" />
          <span className="hidden md:inline text-xs font-semibold text-slate-700">Documents</span>
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 shrink-0 hidden sm:block" />

        {/* Document Title (tap/click to rename) */}
        <div className="min-w-0 flex-1 max-w-[200px] sm:max-w-[320px]">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="w-full px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border border-blue-500 rounded focus:outline-none"
            />
          ) : (
            <div
              onClick={() => {
                setTitleValue(currentDoc.title);
                setIsEditingTitle(true);
              }}
              className="flex flex-col cursor-pointer group py-0.5"
              title="Click to rename document"
            >
              <div className="flex items-center space-x-1">
                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors">
                  {currentDoc.title}
                </span>
                <Edit2 className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-medium">
                <span className={isSaving ? 'text-blue-600 font-semibold' : ''}>
                  {isSaving ? 'Saving...' : 'Saved to Cloud'}
                </span>
                <span>•</span>
                <span className="uppercase">{currentDoc.pageSetup.paperSize}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER / DESKTOP ACTIONS: Templates, Page Setup, Spell Check */}
      <div className="hidden lg:flex items-center space-x-1 shrink-0">
        <button
          id="btn-header-templates"
          onClick={onOpenTemplates}
          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          title="Document Templates"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-indigo-600" />
          <span>Templates</span>
        </button>

        <button
          id="btn-header-page-setup"
          onClick={onOpenPageSettings}
          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          title="Page Setup & Layout"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span>Page Setup</span>
        </button>

        {onOpenSpellChecker && (
          <button
            id="btn-header-spellcheck"
            onClick={onOpenSpellChecker}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              typoCount > 0
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Auto Spell & Grammar Check"
          >
            <Sparkles className={`w-3.5 h-3.5 ${typoCount > 0 ? 'text-amber-600' : 'text-slate-500'}`} />
            <span>Check</span>
            {typoCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {typoCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* RIGHT: View Mode Toggle (Editor | Split | Preview) & Export */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {/* VIEW MODE SELECTOR: Highly visible tabs on web and mobile */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          {/* 1. Editor Only */}
          <button
            id="tab-view-editor"
            onClick={() => onChangeViewMode('editor')}
            className={`px-2 sm:px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Focus on Writing Editor"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Edit</span>
          </button>

          {/* 2. Split Mode (Side-by-Side Editor + Live Preview) */}
          <button
            id="tab-view-split"
            onClick={() => onChangeViewMode('split')}
            className={`px-2 sm:px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Side-by-Side Editor & Live PDF Preview"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Split</span>
          </button>

          {/* 3. Preview Only (Full Paginated PDF Preview) */}
          <button
            id="tab-view-preview"
            onClick={() => onChangeViewMode('preview')}
            className={`px-2 sm:px-2.5 py-1 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                : 'text-blue-800 hover:text-blue-900 bg-blue-50/70 hover:bg-blue-100/70 font-semibold'
            }`}
            title="Full Paginated Print Preview"
          >
            <Eye className={`w-3.5 h-3.5 ${viewMode === 'preview' ? 'text-white' : 'text-blue-600'}`} />
            <span className="text-[11px] sm:text-xs">Preview</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                viewMode === 'preview'
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {currentPageNumber}/{totalPageCount}
            </span>
          </button>
        </div>

        {/* Quick Print Button (Desktop) */}
        <button
          id="btn-header-print"
          onClick={triggerSystemPrint}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors items-center justify-center cursor-pointer"
          title="Print Document (Ctrl+P)"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Primary Download / Export PDF Button with dropdown menu */}
        <div className="relative" ref={exportMenuRef}>
          <div className="flex items-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
            <button
              id="btn-header-download-pdf"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-70 cursor-pointer"
              title="Download as PDF"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[2.2]" />
              )}
              <span>{isExporting ? 'Exporting...' : 'PDF'}</span>
            </button>

            <button
              id="btn-header-export-menu"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 border-l border-blue-500/60 hover:bg-blue-800/40 rounded-r-lg transition-colors cursor-pointer"
              title="More Export Formats"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Dropdown Menu */}
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Export Options
              </div>
              <button
                onClick={handleDownloadPdf}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 text-blue-700 font-semibold flex items-center space-x-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Document</span>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  triggerSystemPrint();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Document</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  exportToMarkdown(currentDoc);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Markdown (.md)</span>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  exportToHtml(currentDoc);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Webpage (.html)</span>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  exportToTxt(currentDoc);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Plain Text (.txt)</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile More Options Menu (< lg screens) */}
        <div className="relative lg:hidden" ref={mobileMoreRef}>
          <button
            id="btn-header-mobile-more"
            onClick={() => setShowMobileMore(!showMobileMore)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMobileMore && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onOpenTemplates();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <LayoutTemplate className="w-4 h-4 text-indigo-600" />
                <span>Document Templates</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onOpenPageSettings();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-slate-600" />
                <span>Page Setup & Margins</span>
              </button>
              {onOpenSpellChecker && (
                <button
                  onClick={() => {
                    setShowMobileMore(false);
                    onOpenSpellChecker();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Spell & Grammar</span>
                  </div>
                  {typoCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {typoCount}
                    </span>
                  )}
                </button>
              )}
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onCreateNew();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>New Blank Document</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  triggerSystemPrint();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Document</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
