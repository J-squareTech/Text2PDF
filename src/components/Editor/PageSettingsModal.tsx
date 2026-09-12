import React from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { PageSetup, PaperSize, Orientation, MarginSize } from '../../types/document';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSetup: PageSetup;
  onUpdatePageSetup: (updated: Partial<PageSetup>) => void;
}

const ACCENT_COLORS = [
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Executive Slate', hex: '#1e293b' },
  { name: 'Classic Navy', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Sky Cyan', hex: '#0284c7' },
  { name: 'Emerald Teal', hex: '#0f766e' },
  { name: 'Forest Pine', hex: '#166534' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Burnt Orange', hex: '#ea580c' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Rose Ruby', hex: '#e11d48' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Deep Indigo', hex: '#4338ca' },
];

export const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
  isOpen,
  onClose,
  pageSetup,
  onUpdatePageSetup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Page Setup & Layout</h2>
              <p className="text-[11px] text-slate-500 hidden xs:block">Configure dimensions, margins, and running headers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs text-slate-700">
          {/* Paper Size & Orientation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Paper Format</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['a4', 'letter', 'legal'] as PaperSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onUpdatePageSetup({ paperSize: size })}
                    className={`py-1.5 text-center font-medium rounded capitalize transition-all ${
                      pageSetup.paperSize === size
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Orientation</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['portrait', 'landscape'] as Orientation[]).map((orient) => (
                  <button
                    key={orient}
                    type="button"
                    onClick={() => onUpdatePageSetup({ orientation: orient })}
                    className={`py-1.5 text-center font-medium rounded capitalize transition-all ${
                      pageSetup.orientation === orient
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {orient}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Margins</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', title: 'Compact', desc: '15mm (More room)' },
                { id: 'normal', title: 'Normal', desc: '20mm (Standard A4)' },
                { id: 'relaxed', title: 'Relaxed', desc: '28mm (Editorial)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onUpdatePageSetup({ margin: m.id as MarginSize })}
                  className={`p-2.5 text-left border rounded-lg transition-all ${
                    pageSetup.margin === m.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">{m.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Running Header */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Top Running Header
            </label>
            <input
              type="text"
              value={pageSetup.headerText}
              onChange={(e) => onUpdatePageSetup({ headerText: e.target.value })}
              placeholder="e.g. Company Name • Confidential"
              className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Appears at the top of every printed page</p>
          </div>

          {/* Running Footer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bottom Running Footer
            </label>
            <input
              type="text"
              value={pageSetup.footerText}
              onChange={(e) => onUpdatePageSetup({ footerText: e.target.value })}
              placeholder="e.g. Confidential & Proprietary"
              className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Page Numbers Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <div className="font-semibold text-xs text-slate-800">Automatic Page Numbering</div>
              <div className="text-[10px] text-slate-400">Renders 'Page X of Y' in bottom right corner</div>
            </div>
            <input
              type="checkbox"
              checked={pageSetup.showPageNumbers}
              onChange={(e) => onUpdatePageSetup({ showPageNumbers: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Primary Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Document Accent Theme</label>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onUpdatePageSetup({ accentColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-2xs cursor-pointer ${
                    c.hex === '#ffffff' ? 'border-2 border-slate-300 text-slate-800' : 'text-white border border-black/10'
                  }`}
                  title={c.name}
                >
                  {pageSetup.accentColor === c.hex && (
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${c.hex === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
