import React, { useState } from 'react';
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
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDoc.title);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
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
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shadow-2xs z-30 shrink-0">
      {/* Left: Brand + Document Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
        {/* App Logo */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <FileText className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight hidden md:inline">
            Tex<span className="text-blue-600">2</span>PDF
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Document Title (Click to Edit) */}
        <div className="flex items-center space-x-1.5 truncate">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border border-blue-500 rounded focus:outline-none max-w-[180px] sm:max-w-[240px]"
            />
          ) : (
            <div
              onClick={() => {
                setTitleValue(currentDoc.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer group max-w-[160px] sm:max-w-[240px] truncate"
              title="Click to rename document"
            >
              <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {currentDoc.title}
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
            </div>
          )}

          {/* Auto-save Status */}
          <span className="text-[10px] text-slate-400 hidden lg:inline">
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
        </div>
      </div>

      {/* Center: View Switcher (Word Editor vs Paginated PDF Preview) */}
      <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200 text-xs font-semibold">
        <button
          id="tab-view-editor"
          onClick={() => onChangeViewMode('editor')}
          className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
            viewMode === 'editor'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Write</span>
        </button>

        {/* Split View button on Desktop */}
        <button
          id="tab-view-split"
          onClick={() => onChangeViewMode('split')}
          className={`hidden md:flex px-2.5 sm:px-3 py-1 rounded-md transition-all items-center space-x-1 ${
            viewMode === 'split'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Split</span>
        </button>

        <button
          id="tab-view-preview"
          onClick={() => onChangeViewMode('preview')}
          className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
            viewMode === 'preview'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Preview</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-mono">
            {currentPageNumber}/{totalPageCount}
          </span>
        </button>
      </div>

      {/* Right Actions: Workspace, Page Setup, Download PDF */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Workspace Documents */}
        <button
          id="btn-open-workspace"
          onClick={onOpenWorkspace}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
          title="My Documents"
        >
          <Folder className="w-4 h-4 text-slate-600" />
          <span className="hidden xl:inline">Documents</span>
        </button>

        {/* Templates */}
        <button
          id="btn-open-templates"
          onClick={onOpenTemplates}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
          title="Templates"
        >
          <LayoutTemplate className="w-4 h-4 text-slate-600" />
          <span className="hidden xl:inline">Templates</span>
        </button>

        {/* Page Setup */}
        <button
          id="btn-page-setup"
          onClick={onOpenPageSettings}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
          title="Page Layout & Setup"
        >
          <Sliders className="w-4 h-4 text-slate-600" />
          <span className="hidden lg:inline">Page Setup</span>
        </button>

        {/* Quick Print */}
        <button
          id="btn-header-print"
          onClick={triggerSystemPrint}
          className="hidden sm:flex p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Print Document"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Primary Action: Download PDF */}
        <div className="relative">
          <div className="flex items-center rounded-lg bg-blue-600 shadow-xs hover:bg-blue-700 transition-colors">
            <button
              id="btn-main-download-pdf"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 text-white text-xs font-bold flex items-center space-x-1.5 disabled:opacity-75"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? 'Creating...' : 'PDF'}</span>
            </button>

            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 text-blue-200 hover:text-white border-l border-blue-500"
              title="More export options"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Dropdown Menu */}
          {showExportMenu && (
            <div
              className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-100"
              onClick={() => setShowExportMenu(false)}
            >
              <button
                disabled={isExporting}
                onClick={handleDownloadPdf}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>{isExporting ? 'Generating PDF...' : 'Download as PDF'}</span>
              </button>

              <button
                onClick={triggerSystemPrint}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Document</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => exportToMarkdown(currentDoc)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Markdown (.md)</span>
              </button>

              <button
                onClick={() => exportToHtml(currentDoc)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Webpage (.html)</span>
              </button>

              <button
                onClick={() => exportToTxt(currentDoc)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Plain Text (.txt)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
