import React, { useState, useEffect } from 'react';
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
  FileSpreadsheet,
} from 'lucide-react';
import { DocumentModel } from '../../types/document';
import { paginateContent } from '../../utils/pagination';
import { exportToDirectPdf, triggerSystemPrint } from '../../services/pdfGenerator';

interface CompactPagePreviewProps {
  doc: DocumentModel;
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  isMobile?: boolean;
}

export const CompactPagePreview: React.FC<CompactPagePreviewProps> = ({
  doc,
  currentPageIndex,
  onSelectPage,
  isMobile = false,
}) => {
  // Zoom scale: 1.0 (100% true readable size) by default
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  // Display mode: 'continuous' (all pages stacked) or 'paged' (single page swapper)
  const [displayLayout, setDisplayLayout] = useState<'continuous' | 'paged'>('continuous');

  // Compute paginated pages whenever doc content or setup changes
  const pagination = paginateContent(doc.content, doc.pageSetup);
  const totalPages = pagination.totalPages;

  // Ensure current page index is valid
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), totalPages - 1);

  // Synchronize with parent if out of range
  useEffect(() => {
    if (currentPageIndex >= totalPages && totalPages > 0) {
      onSelectPage(totalPages - 1);
    }
  }, [totalPages, currentPageIndex, onSelectPage]);

  // Margin styling
  const marginClasses = {
    compact: 'p-6 sm:p-8',
    normal: 'p-8 sm:p-12',
    relaxed: 'p-10 sm:p-14',
  }[doc.pageSetup.margin] || 'p-8 sm:p-12';

  // Font family class
  const fontClass = {
    sans: "font-['Plus_Jakarta_Sans',sans-serif]",
    serif: "font-['Lora',serif]",
    mono: "font-['Fira_Code',monospace]",
    display: "font-['Cinzel',serif]",
  }[doc.pageSetup.fontFamily] || "font-['Plus_Jakarta_Sans']";

  // Renders a single printable page sheet
  const renderPageSheet = (pageContent: string, pageNum: number) => {
    const cleanHtml = pageContent
      .replace(/<div[^>]*class=["'][^"']*(?:page-break|tex2pdf-page-break)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
      .trim();

    return (
      <div
        key={`preview-page-${pageNum}`}
        id={`preview-page-${pageNum}`}
        style={{
          transform: zoomScale !== 1.0 ? `scale(${zoomScale})` : undefined,
          transformOrigin: 'top center',
          fontSize: `${doc.pageSetup.fontSize || 11}pt`,
          lineHeight: doc.pageSetup.lineHeight || 1.6,
        }}
        className={`w-full max-w-2xl bg-white shadow-xl rounded-xs border border-slate-300/90 text-slate-800 flex flex-col justify-between transition-transform duration-100 min-h-[920px] mb-8 select-text ${fontClass} ${marginClasses}`}
      >
        {/* Running Top Header */}
        <div className="border-b border-slate-200 pb-3 mb-6 text-xs text-slate-400 tracking-wider flex items-center justify-between font-sans shrink-0 select-none">
          <span className="truncate max-w-[320px] font-medium">
            {doc.pageSetup.headerText || doc.title}
          </span>
          <span className="uppercase text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {doc.pageSetup.paperSize.toUpperCase()} • PAGE {pageNum} OF {totalPages}
          </span>
        </div>

        {/* Rendered WYSIWYG Page Content - Clean, full-bleed, overflow-safe */}
        <div className="flex-1 document-canvas text-slate-800 space-y-3 overflow-x-auto">
          {cleanHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
              className="max-w-none text-slate-800 text-[14px] sm:text-[15px] leading-relaxed"
            />
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-300 text-sm italic">
              (Page is blank or text continues on next page)
            </div>
          )}
        </div>

        {/* Running Bottom Footer */}
        <div className="border-t border-slate-200 pt-3 mt-6 text-xs text-slate-400 flex items-center justify-between font-sans shrink-0 select-none">
          <span className="truncate max-w-[260px]">
            {doc.pageSetup.footerText || 'Tex2PDF Document'}
          </span>
          {doc.pageSetup.showPageNumbers && (
            <span className="font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Page {pageNum} of {totalPages}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/90 border-l border-slate-300 overflow-hidden select-none">
      {/* Top Banner: Explicit Read-Only Notice + Layout Toggle + Zoom & Export */}
      <div className="bg-white px-3 sm:px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0 z-10">
        {/* Left: Indicator & Mode Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Final Preview</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Read-Only
            </span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Continuous vs Paged Mode Selector */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setDisplayLayout('continuous')}
              className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
                displayLayout === 'continuous'
                  ? 'bg-white text-blue-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Continuous view: Stack all pages vertically"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">All Pages</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1 rounded-sm ml-0.5">
                {totalPages}
              </span>
            </button>

            <button
              onClick={() => setDisplayLayout('paged')}
              className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
                displayLayout === 'paged'
                  ? 'bg-white text-blue-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Single page view: Flip through individual pages"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Single Page</span>
            </button>
          </div>

          {/* Page Swapper Pills (Shows when in Paged Mode or on click) */}
          {displayLayout === 'paged' && (
            <div className="flex items-center space-x-1 pl-1">
              <button
                id="btn-prev-page"
                disabled={safePageIndex === 0}
                onClick={() => onSelectPage(safePageIndex - 1)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-1 overflow-x-auto max-w-[120px] sm:max-w-[160px] py-0.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    id={`page-pill-${i + 1}`}
                    onClick={() => onSelectPage(i)}
                    className={`min-w-[24px] h-5 px-1 text-[11px] font-bold rounded transition-all flex items-center justify-center ${
                      safePageIndex === i
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                id="btn-next-page"
                disabled={safePageIndex >= totalPages - 1}
                onClick={() => onSelectPage(safePageIndex + 1)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Zoom Controls & PDF Export */}
        <div className="flex items-center space-x-1.5">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded p-0.5 text-slate-700">
            <button
              onClick={() => setZoomScale((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
              className="p-1 hover:text-slate-950 hover:bg-slate-200 rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1.0)}
              className="text-[11px] font-semibold px-2 py-0.5 hover:bg-slate-200 rounded transition-colors"
              title="Reset to 100% reading size"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              className="p-1 hover:text-slate-950 hover:bg-slate-200 rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="btn-preview-download-pdf"
            onClick={() => exportToDirectPdf(doc)}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center space-x-1 shadow-xs transition-colors"
            title="Download PDF File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            id="btn-preview-print"
            onClick={triggerSystemPrint}
            className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded transition-colors"
            title="Print"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Canvas: Scrollable Sheet View */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
        {displayLayout === 'continuous' ? (
          // Continuous Mode: Every page stacked in order, perfectly legible
          <div className="w-full flex flex-col items-center">
            {pagination.pages.map((pageHtml, index) => renderPageSheet(pageHtml, index + 1))}
          </div>
        ) : (
          // Paged Mode: Single page flip
          <div className="w-full flex flex-col items-center">
            {renderPageSheet(pagination.pages[safePageIndex] || '', safePageIndex + 1)}
          </div>
        )}

        {/* Bottom Helper Info */}
        <div className="mt-2 mb-6 flex items-center space-x-3 text-xs text-slate-500 bg-white/95 px-4 py-1.5 rounded-full border border-slate-300 shadow-sm select-none">
          <span className="font-semibold text-slate-700">
            {totalPages} {totalPages === 1 ? 'Page' : 'Pages'} Total
          </span>
          <span className="text-slate-300">•</span>
          <span>{pagination.wordCount} words</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">Edits in left panel update here live</span>
        </div>
      </div>
    </div>
  );
};
