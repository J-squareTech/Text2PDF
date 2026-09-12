import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  FileText,
  Eye,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Scan,
  FileDown,
  Image as ImageIcon,
} from 'lucide-react';
import { DocumentModel } from '../../types/document';
import { paginateContent } from '../../utils/pagination';
import {
  exportToDirectPdf,
  triggerSystemPrint,
  exportToWord,
  exportToImage,
} from '../../services/pdfGenerator';
import { FONT_FAMILY_DEFINITIONS } from '../../utils/editorUtils';

interface CompactPagePreviewProps {
  doc: DocumentModel;
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  isMobile?: boolean;
  onClosePreview?: () => void;
  isSplit?: boolean;
  onToggleFullscreenPreview?: () => void;
}

export const CompactPagePreview: React.FC<CompactPagePreviewProps> = ({
  doc,
  currentPageIndex,
  onSelectPage,
  isMobile = false,
  onClosePreview,
  isSplit = false,
  onToggleFullscreenPreview,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [displayLayout, setDisplayLayout] = useState<'continuous' | 'paged'>('continuous');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      await exportToDirectPdf(doc);
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = () => {
    exportToWord(doc);
  };

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      await exportToImage(doc);
    } catch (err) {
      console.error('Error exporting Image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Compute paginated pages whenever doc content or setup changes
  const pagination = paginateContent(doc.content, doc.pageSetup);
  const totalPages = Math.max(1, pagination.totalPages);

  // Ensure current page index is valid
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), totalPages - 1);

  // Synchronize with parent if out of range
  useEffect(() => {
    if (currentPageIndex >= totalPages && totalPages > 0) {
      onSelectPage(totalPages - 1);
    }
  }, [totalPages, currentPageIndex, onSelectPage]);

  // Scroll to selected page in continuous mode
  const handleScrollToPage = (index: number) => {
    const targetIdx = Math.max(0, Math.min(index, totalPages - 1));
    onSelectPage(targetIdx);
    if (displayLayout === 'continuous') {
      const pageEl = document.getElementById(`preview-page-${targetIdx + 1}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Responsive margin styling
  const marginClasses = {
    compact: 'p-3.5 sm:p-6',
    normal: 'p-4 sm:p-8',
    relaxed: 'p-5 sm:p-10',
  }[doc.pageSetup.margin] || 'p-4 sm:p-8';

  // Font family class
  const fontClass =
    FONT_FAMILY_DEFINITIONS[doc.pageSetup.fontFamily]?.fontClass || "font-['Plus_Jakarta_Sans',sans-serif]";

  // Renders a single printable page sheet
  const renderPageSheet = (pageContent: string, pageNum: number) => {
    const cleanHtml = (pageContent || '')
      .replace(/<div[^>]*class=["'][^"']*(?:page-break|tex2pdf-page-break)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
      .trim();

    return (
      <div
        key={`preview-page-${pageNum}`}
        id={`preview-page-${pageNum}`}
        style={{
          transform: !isAutoFit && zoomScale !== 1.0 ? `scale(${zoomScale})` : undefined,
          transformOrigin: 'top center',
          fontSize: `${doc.pageSetup.fontSize || 11}pt`,
          lineHeight: doc.pageSetup.lineHeight || 1.6,
          '--doc-accent': doc.pageSetup.accentColor || '#1e3a8a',
        } as React.CSSProperties}
        className={`w-full max-w-2xl bg-white shadow-xl rounded-xs border border-slate-300 text-slate-800 flex flex-col justify-between transition-all duration-150 min-h-[560px] sm:min-h-[820px] mb-6 sm:mb-8 select-text ring-1 ring-black/5 ${fontClass} ${marginClasses}`}
      >
        {/* Running Top Header */}
        <div className="border-b border-slate-200 pb-2.5 mb-4 text-xs text-slate-400 tracking-wider flex items-center justify-between font-sans shrink-0 select-none">
          <span className="truncate max-w-[240px] font-medium text-slate-500">
            {doc.pageSetup.headerText || doc.title}
          </span>
          {doc.pageSetup.showPageNumbers && (
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
              Page {pageNum} of {totalPages}
            </span>
          )}
        </div>

        {/* Rendered WYSIWYG Page Content */}
        <div
          className="flex-1 document-canvas text-slate-800 space-y-3 overflow-x-auto"
          style={{ '--doc-accent': doc.pageSetup.accentColor || '#1e3a8a' } as React.CSSProperties}
        >
          {cleanHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
              className="max-w-none text-slate-800 text-[13px] sm:text-[14.5px] leading-relaxed"
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-300 text-xs italic">
              (Page is blank or text continues on next page)
            </div>
          )}
        </div>

        {/* Running Bottom Footer */}
        <div className="border-t border-slate-200 pt-2.5 mt-4 text-xs text-slate-400 flex items-center justify-between font-sans shrink-0 select-none">
          <span className="truncate max-w-[220px]">
            {doc.pageSetup.footerText || ''}
          </span>
          {doc.pageSetup.showPageNumbers && (
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
              Page {pageNum} of {totalPages}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/90 border-l border-slate-300/80 overflow-hidden select-none">
      {/* Top Header Section: Clean, Adaptable, Solid 2-Bar Hierarchy */}
      <div className="bg-white border-b border-slate-200 shrink-0 z-20 shadow-2xs">
        {/* Tier 1: Status, View Mode, and Expand */}
        <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 min-w-0">
            {onClosePreview && (
              <button
                onClick={onClosePreview}
                className="p-1 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title="Return to Editor"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Live Preview</span>
            </div>

            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              Page {safePageIndex + 1} of {totalPages}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* View Mode Toggle: All vs 1-by-1 */}
            <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setDisplayLayout('continuous')}
                className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all cursor-pointer text-xs ${
                  displayLayout === 'continuous'
                    ? 'bg-white text-blue-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Stacked continuous page layout"
              >
                <Layers className="w-3 h-3" />
                <span className="hidden xs:inline">All</span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1 rounded-sm ml-0.5 font-bold">
                  {totalPages}
                </span>
              </button>

              <button
                onClick={() => setDisplayLayout('paged')}
                className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all cursor-pointer text-xs ${
                  displayLayout === 'paged'
                    ? 'bg-white text-blue-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Single page inspection view"
              >
                <FileText className="w-3 h-3" />
                <span className="hidden xs:inline">Single</span>
              </button>
            </div>

            {/* Toggle Fullscreen / Split Preview Button */}
            {onToggleFullscreenPreview && (
              <button
                onClick={onToggleFullscreenPreview}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                title={isSplit ? 'Maximize Preview' : 'Side-by-Side Split View'}
              >
                {isSplit ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Tier 2: Navigation, Zoom Controls, and Export Actions */}
        <div className="px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar bg-slate-50/70">
          {/* Page Jumper */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              id="btn-prev-page"
              disabled={safePageIndex === 0}
              onClick={() => handleScrollToPage(safePageIndex - 1)}
              className="px-1.5 py-1 rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-semibold flex items-center space-x-0.5"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Compact page buttons */}
            <div className="flex items-center space-x-1 overflow-x-auto max-w-[140px] px-0.5">
              {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => (
                <button
                  key={i}
                  id={`page-pill-${i + 1}`}
                  onClick={() => handleScrollToPage(i)}
                  className={`min-w-[22px] h-6 px-1.5 text-[11px] font-bold rounded transition-all flex items-center justify-center cursor-pointer border ${
                    safePageIndex === i
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={`Page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 8 && (
                <span className="text-[10px] text-slate-400 font-bold px-1">...{totalPages}</span>
              )}
            </div>

            <button
              id="btn-next-page"
              disabled={safePageIndex >= totalPages - 1}
              onClick={() => handleScrollToPage(safePageIndex + 1)}
              className="px-1.5 py-1 rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-semibold flex items-center space-x-0.5"
              title="Next Page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom & Document Action Group */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded p-0.5 text-slate-700 text-xs shadow-2xs">
              <button
                onClick={() => {
                  setIsAutoFit(true);
                  setZoomScale(1.0);
                }}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                  isAutoFit ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100'
                }`}
                title="Fit sheet width"
              >
                <Scan className="w-3 h-3" />
                <span className="hidden xs:inline">Fit</span>
              </button>

              <button
                onClick={() => {
                  setIsAutoFit(false);
                  setZoomScale((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))));
                }}
                className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  setIsAutoFit(false);
                  setZoomScale(1.0);
                }}
                className="text-[11px] font-semibold px-1 py-0.5 hover:bg-slate-100 rounded transition-colors cursor-pointer min-w-[36px] text-center"
                title="100% Zoom"
              >
                {isAutoFit ? '100%' : `${Math.round(zoomScale * 100)}%`}
              </button>

              <button
                onClick={() => {
                  setIsAutoFit(false);
                  setZoomScale((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))));
                }}
                className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Export PDF */}
            <button
              id="btn-preview-download-pdf"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center space-x-1 shadow-2xs transition-colors disabled:opacity-75 cursor-pointer shrink-0"
              title="Download PDF Document"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>PDF</span>
            </button>

            {/* Quick Export Word */}
            <button
              id="btn-preview-download-word"
              onClick={handleExportWord}
              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded flex items-center space-x-1 transition-colors cursor-pointer shrink-0"
              title="Export as Microsoft Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Word</span>
            </button>

            {/* Quick Export Image */}
            <button
              id="btn-preview-download-image"
              disabled={isExporting}
              onClick={handleExportImage}
              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded flex items-center space-x-1 transition-colors cursor-pointer shrink-0"
              title="Export as High-Resolution PNG Image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Image</span>
            </button>

            {/* Print */}
            <button
              id="btn-preview-print"
              onClick={triggerSystemPrint}
              className="p-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded transition-colors cursor-pointer shrink-0"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Canvas: Scrollable Sheet View */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 sm:p-5 lg:p-6 flex flex-col items-center justify-start bg-slate-200/80"
      >
        {displayLayout === 'continuous' ? (
          <div className="w-full flex flex-col items-center">
            {pagination.pages.map((pageHtml, index) => renderPageSheet(pageHtml, index + 1))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {renderPageSheet(pagination.pages[safePageIndex] || '', safePageIndex + 1)}
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div className="mt-2 mb-6 flex items-center space-x-3 text-xs text-slate-500 bg-white px-3.5 py-1 rounded-full border border-slate-200 shadow-2xs select-none">
          <span className="font-semibold text-slate-700">
            {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
          </span>
          <span className="text-slate-300">•</span>
          <span>{pagination.wordCount} words</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-medium flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Live Sync</span>
          </span>
        </div>
      </div>
    </div>
  );
};
