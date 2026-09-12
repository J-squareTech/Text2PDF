import React, { useState } from 'react';
import {
  X,
  Search,
  Plus,
  Folder as FolderIcon,
  Star,
  Copy,
  Trash2,
  FileDown,
  Calendar,
  FileText,
  Tag,
} from 'lucide-react';
import { DocumentModel, Folder } from '../../types/document';
import { exportToDirectPdf } from '../../services/pdfGenerator';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentModel[];
  folders: Folder[];
  activeDocId: string;
  onSelectDocument: (id: string) => void;
  onCreateBlankDocument: () => void;
  onDuplicateDocument: (doc: DocumentModel) => void;
  onDeleteDocument: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  documents,
  folders,
  activeDocId,
  onSelectDocument,
  onCreateBlankDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  if (!isOpen) return null;

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder = selectedFolderId ? doc.folderId === selectedFolderId : true;
    const matchesFav = onlyFavorites ? doc.isFavorite : true;

    return matchesSearch && matchesFolder && matchesFav;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-4xl h-[92vh] sm:h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <FolderIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">My Documents</h2>
              <p className="text-[11px] text-slate-500 hidden xs:block">Organize, search, and manage your documents</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-workspace-new-doc"
              onClick={() => {
                onCreateBlankDocument();
                onClose();
              }}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Doc</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Filters Bar (< sm screens) */}
        <div className="sm:hidden px-3 py-2 border-b border-slate-200 bg-slate-50/50 space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                setSelectedFolderId(null);
                setOnlyFavorites(false);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                !selectedFolderId && !onlyFavorites
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              All ({documents.length})
            </button>
            <button
              onClick={() => {
                setSelectedFolderId(null);
                setOnlyFavorites(true);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors flex items-center space-x-1 ${
                onlyFavorites
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Favorites</span>
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  setSelectedFolderId(folder.id);
                  setOnlyFavorites(false);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors flex items-center space-x-1 ${
                  selectedFolderId === folder.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color }} />
                <span>{folder.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content: Left Folders + Right Documents List */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Folders & Filters (Tablet/Desktop) */}
          <div className="hidden sm:block w-56 bg-slate-50/80 border-r border-slate-200 p-3 space-y-4 text-xs select-none shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Navigation Lists */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedFolderId(null);
                  setOnlyFavorites(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  !selectedFolderId && !onlyFavorites
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>All Documents</span>
                </div>
                <span className="text-[10px] text-slate-400">{documents.length}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFolderId(null);
                  setOnlyFavorites(true);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  onlyFavorites
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Favorites</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {documents.filter((d) => d.isFavorite).length}
                </span>
              </button>
            </div>

            {/* Folders */}
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block px-2 mb-1.5">
                Folders
              </span>
              <div className="space-y-1">
                {folders.map((folder) => {
                  const count = documents.filter((d) => d.folderId === folder.id).length;
                  const isSelected = selectedFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setSelectedFolderId(folder.id);
                        setOnlyFavorites(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                        isSelected ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: folder.color }}
                        />
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-1">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main: Document Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50/30">
            {filteredDocs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 p-4">
                <FileText className="w-10 h-10 stroke-1 text-slate-300" />
                <p className="text-sm font-medium">No documents found</p>
                <p className="text-xs text-slate-400">Try adjusting your search query or folder filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredDocs.map((doc) => {
                  const isCurrent = doc.id === activeDocId;
                  const wordCount = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;
                  const updatedDate = new Date(doc.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative ${
                        isCurrent ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Top: Folder badge & star */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {doc.category}
                          </span>
                          <button
                            onClick={() => onToggleFavorite(doc.id)}
                            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                doc.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Document Title */}
                        <h3
                          onClick={() => {
                            onSelectDocument(doc.id);
                            onClose();
                          }}
                          className="font-bold text-sm text-slate-800 group-hover:text-blue-600 cursor-pointer line-clamp-1 mb-1"
                        >
                          {doc.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {doc.content.replace(/[#*`_|-]/g, '').slice(0, 140)}...
                        </p>

                        {/* Tags */}
                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100 flex items-center space-x-0.5"
                              >
                                <Tag className="w-2.5 h-2.5 text-slate-400" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer: Stats & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{updatedDate}</span>
                          </span>
                          <span>•</span>
                          <span>{wordCount} words</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => exportToDirectPdf(doc)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Quick Download PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateDocument(doc)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                            title="Duplicate Document"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {documents.length > 1 && (
                            <button
                              onClick={() => onDeleteDocument(doc.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
