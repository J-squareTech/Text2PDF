import React, { useState } from 'react';
import { X, LayoutTemplate, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../data/templates';
import { DocumentTemplate } from '../../types/document';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
  onApplyToCurrent?: (template: DocumentTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onApplyToCurrent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate>(DOCUMENT_TEMPLATES[0]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'business', label: 'Business & Finance' },
    { id: 'personal', label: 'Personal & Career' },
    { id: 'education', label: 'Education & Research' },
    { id: 'legal', label: 'Legal & Contracts' },
    { id: 'professional', label: 'Professional & Reports' },
  ];

  const filtered = selectedCategory === 'all'
    ? DOCUMENT_TEMPLATES
    : DOCUMENT_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (tmpl: DocumentTemplate) => {
    onSelectTemplate(tmpl);
    onClose();
  };

  const handleApplyCurrent = (tmpl: DocumentTemplate) => {
    if (onApplyToCurrent) {
      onApplyToCurrent(tmpl);
    } else {
      onSelectTemplate(tmpl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-5 animate-in fade-in duration-150 select-none">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Template Library</h2>
              <p className="text-[11px] text-slate-500 hidden xs:block">Pick a professional template to load into your document</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="px-4 sm:px-6 py-2 border-b border-slate-200 bg-slate-50/80 flex items-center space-x-1.5 overflow-x-auto text-xs shrink-0 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-all ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Main: Templates Grid + Live Preview Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Grid */}
          <div className="w-full md:w-5/12 overflow-y-auto p-3 sm:p-4 space-y-2.5 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/30">
            {filtered.map((tmpl) => {
              const isSelected = previewTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setPreviewTemplate(tmpl)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                    {tmpl.badge && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mb-1">{tmpl.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tmpl.description}</p>
                  
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Click to inspect</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(tmpl);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs flex items-center space-x-1 shadow-xs transition-colors"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Live Preview Pane */}
          <div className="w-full md:w-7/12 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between bg-slate-50/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{previewTemplate.title}</h4>
                  <p className="text-xs text-slate-500">{previewTemplate.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    id="btn-apply-template"
                    onClick={() => handleUseTemplate(previewTemplate)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Formatted Document Sample Preview Box */}
              <div className="p-5 bg-white border border-slate-300/90 rounded-xl shadow-xs max-h-[48vh] overflow-y-auto document-canvas text-slate-800 text-[13px] leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                  className="pointer-events-none select-text"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mt-4">
              <div className="flex items-center space-x-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pre-configured typography, tables & page setup</span>
              </div>
              <div className="flex items-center space-x-3">
                {onApplyToCurrent && (
                  <button
                    onClick={() => handleApplyCurrent(previewTemplate)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
                  >
                    Apply to current document
                  </button>
                )}
                <button
                  onClick={() => handleUseTemplate(previewTemplate)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Create New Document &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
