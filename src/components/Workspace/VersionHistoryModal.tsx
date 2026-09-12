import React, { useState } from 'react';
import { X, History, RotateCcw, Plus, Calendar, FileText, Check } from 'lucide-react';
import { DocumentModel, DocumentVersion } from '../../types/document';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentModel;
  onRestoreVersion: (version: DocumentVersion) => void;
  onCreateSnapshot: (label: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  document,
  onRestoreVersion,
  onCreateSnapshot,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(
    document.versions.length > 0 ? document.versions[document.versions.length - 1] : null
  );

  if (!isOpen) return null;

  const handleCreateSnapshot = () => {
    if (!newLabel.trim()) return;
    onCreateSnapshot(newLabel.trim());
    setNewLabel('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">Version History & Snapshots</h2>
              <p className="text-xs text-slate-500">Track iterations and safely roll back edits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Snapshots List */}
          <div className="w-72 bg-slate-50/50 border-r border-slate-200 p-4 flex flex-col justify-between text-xs">
            <div className="space-y-3 overflow-y-auto">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Snapshots ({document.versions.length})
              </span>

              {document.versions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                  <p>No snapshots yet</p>
                  <p className="text-[11px]">Create a snapshot below</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {document.versions.map((v) => {
                    const isSelected = selectedVersion?.id === v.id;
                    const dateStr = new Date(v.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVersion(v)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-slate-800 text-xs line-clamp-1">{v.label}</div>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span>{v.wordCount} words</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Create Snapshot Form */}
            <div className="pt-3 border-t border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Save Current Version</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Before AI Polish"
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleCreateSnapshot}
                  disabled={!newLabel.trim()}
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md transition-colors"
                  title="Create Snapshot"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Selected Version Content Preview & Restore */}
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-slate-50/30 text-xs">
            {selectedVersion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{selectedVersion.label}</h3>
                    <p className="text-xs text-slate-400">
                      Recorded on {new Date(selectedVersion.timestamp).toLocaleString()} • {selectedVersion.wordCount} words
                    </p>
                  </div>

                  <button
                    id="btn-restore-version"
                    onClick={() => {
                      onRestoreVersion(selectedVersion);
                      onClose();
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore This Version</span>
                  </button>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg font-mono text-[11px] leading-relaxed text-slate-700 max-h-[50vh] overflow-y-auto whitespace-pre-wrap shadow-inner">
                  {selectedVersion.content}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Select a version on the left to preview content
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
