import React, { useState } from 'react';
import { X, LayoutTemplate, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../data/templates';
import { DocumentTemplate } from '../../types/document';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Document Template Library</h2>
              <p className="text-xs text-slate-500">Kickstart your document with battle-tested professional frameworks</p>
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
        <div className="px-6 py-2.5 border-b border-slate-200 bg-slate-50/80 flex items-center space-x-2 overflow-x-auto text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
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
        <div className="flex-1 flex overflow-hidden">
          {/* Left Grid */}
          <div className="w-1/2 overflow-y-auto p-5 space-y-3 border-r border-slate-200 bg-slate-50/20">
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
                </div>
              );
            })}
          </div>

          {/* Right Live Preview Pane */}
          <div className="w-1/2 overflow-y-auto p-6 flex flex-col justify-between bg-slate-50/40">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{previewTemplate.title}</h4>
                  <p className="text-xs text-slate-500">{previewTemplate.description}</p>
                </div>
                <button
                  id="btn-apply-template"
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Document Sample Preview Box */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg font-mono text-[11px] leading-relaxed text-slate-700 max-h-[50vh] overflow-y-auto whitespace-pre-wrap shadow-inner">
                {previewTemplate.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pre-configured typography & margins</span>
              </div>
              <button
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  onClose();
                }}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Create Document Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
