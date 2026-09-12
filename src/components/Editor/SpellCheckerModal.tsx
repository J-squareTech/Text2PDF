import React from 'react';
import {
  Sparkles,
  CheckCircle,
  X,
  ArrowRight,
  SpellCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { TypoIssue } from '../../utils/spellChecker';

interface SpellCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: TypoIssue[];
  onFixSingle: (issue: TypoIssue) => void;
  onFixAll: () => void;
  onIgnore: (issueId: string) => void;
  onRescan: () => void;
}

export const SpellCheckerModal: React.FC<SpellCheckerModalProps> = ({
  isOpen,
  onClose,
  issues,
  onFixSingle,
  onFixAll,
  onIgnore,
  onRescan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border-t sm:border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs shrink-0">
              <SpellCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center space-x-2">
                <span>Spell & Grammar</span>
                {issues.length > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                    {issues.length}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 hidden xs:block">
                Detect and fix typos, misspellings, and duplicate words
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {issues.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">All clear! No errors found.</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Your document has no common spelling errors or duplicate words.
              </p>
              <button
                onClick={onRescan}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-scan document</span>
              </button>
            </div>
          ) : (
            <>
              {/* Batch Fix All Action Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    Found {issues.length} suggested {issues.length === 1 ? 'correction' : 'corrections'}
                  </span>
                  <span className="text-[11px] text-blue-700">
                    Apply all standard corrections in one click
                  </span>
                </div>
                <button
                  id="btn-fix-all-typos"
                  onClick={onFixAll}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fix All ({issues.length})</span>
                </button>
              </div>

              {/* Individual Issues List */}
              <div className="space-y-2.5 pt-1">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 shadow-2xs space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            issue.type === 'duplicate'
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {issue.type === 'duplicate' ? 'Duplicate' : 'Spelling'}
                        </span>
                        <span className="text-xs text-slate-500">{issue.reason}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onIgnore(issue.id)}
                          className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => onFixSingle(issue)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-2xs transition-colors flex items-center space-x-1"
                        >
                          <span>Fix</span>
                        </button>
                      </div>
                    </div>

                    {/* Word Replacement Preview */}
                    <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                      <span className="line-through text-red-600 font-mono font-medium">
                        {issue.original}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {issue.suggestion}
                      </span>
                    </div>

                    {/* Sentence Context */}
                    <p className="text-[11px] text-slate-500 italic bg-slate-50/60 p-1.5 rounded">
                      {issue.context}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            <span>Document changes update live in your editor</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
