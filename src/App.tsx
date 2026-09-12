import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { WordToolbar } from './components/Editor/WordToolbar';
import { WordEditor } from './components/Editor/WordEditor';
import { CompactPagePreview } from './components/Editor/CompactPagePreview';
import { PageSettingsModal } from './components/Editor/PageSettingsModal';
import { WorkspaceModal } from './components/Workspace/WorkspaceModal';
import { TemplatesModal } from './components/Workspace/TemplatesModal';
import {
  DocumentModel,
  DocumentTemplate,
  FontFamily,
  PageSetup,
} from './types/document';
import {
  loadDocuments,
  saveDocuments,
  loadFolders,
  getActiveDocId,
  setActiveDocId,
} from './services/storage';
import { paginateContent } from './utils/pagination';
import { restoreEditorSelection } from './utils/editorUtils';

export default function App() {
  const [documents, setDocuments] = useState<DocumentModel[]>(() => loadDocuments());
  const [folders, setFolders] = useState(() => loadFolders());

  const [activeDocId, setActiveDocIdState] = useState<string>(() => {
    const saved = getActiveDocId();
    const initialDocs = loadDocuments();
    if (saved && initialDocs.some((d) => d.id === saved)) {
      return saved;
    }
    return initialDocs[0]?.id || 'doc_academic_paper';
  });

  const currentDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  // View mode: 'editor' (Word write mode), 'preview' (compact paginated PDF preview), or 'split' (side-by-side)
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>(() => {
    // Default to split on desktop (width >= 1024), editor on mobile/tablet
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'editor';
    }
    return 'split';
  });

  // Active preview page index (0-indexed: 0 is Page 1, 1 is Page 2, etc.)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Modals state
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editorDivRef = useRef<HTMLDivElement | null>(null);

  // Calculate current pagination for header & status
  const pagination = paginateContent(currentDoc.content, currentDoc.pageSetup);

  // Auto-save effect
  useEffect(() => {
    setIsSaving(true);
    const timeout = setTimeout(() => {
      saveDocuments(documents);
      setActiveDocId(activeDocId);
      setIsSaving(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [documents, activeDocId]);

  // Content mutator
  const handleUpdateContent = (newContent: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === activeDocId
          ? {
              ...d,
              content: newContent,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const handleUpdateTitle = (newTitle: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === activeDocId
          ? {
              ...d,
              title: newTitle,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const handleUpdatePageSetup = (updatedSetup: Partial<PageSetup>) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === activeDocId
          ? {
              ...d,
              pageSetup: {
                ...d.pageSetup,
                ...updatedSetup,
              },
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  };

  // WYSIWYG ExecCommand Handlers with Safe Selection Restoration
  const syncFromEditor = () => {
    if (editorDivRef.current) {
      handleUpdateContent(editorDivRef.current.innerHTML);
    }
  };

  const handleFormatBlock = (tag: string) => {
    restoreEditorSelection(editorDivRef.current);
    document.execCommand('formatBlock', false, tag);
    syncFromEditor();
  };

  const handleFormatInline = (command: string, value?: string) => {
    restoreEditorSelection(editorDivRef.current);
    document.execCommand(command, false, value);
    syncFromEditor();
  };

  const handleInsertTable = () => {
    restoreEditorSelection(editorDivRef.current);
    const tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;"><thead><tr style="background-color: #f8fafc;"><th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: 600;">Item</th><th style="border: 1px solid #cbd5e1; padding: 10px; text-align: center; font-weight: 600;">Qty</th><th style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-weight: 600;">Price</th></tr></thead><tbody><tr><td style="border: 1px solid #cbd5e1; padding: 10px;">Sample Description</td><td style="border: 1px solid #cbd5e1; padding: 10px; text-align: center;">1</td><td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">$50.00</td></tr><tr><td style="border: 1px solid #cbd5e1; padding: 10px;">Second Item</td><td style="border: 1px solid #cbd5e1; padding: 10px; text-align: center;">2</td><td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">$100.00</td></tr></tbody></table><p><br/></p>`;
    document.execCommand('insertHTML', false, tableHtml);
    syncFromEditor();
  };

  const handleInsertPageBreak = () => {
    restoreEditorSelection(editorDivRef.current);
    const pageBreakHtml = `<div class="page-break" style="margin: 28px 0; padding: 10px 14px; background: #eff6ff; border: 1.5px dashed #3b82f6; border-radius: 6px; text-align: center; font-size: 11px; color: #1d4ed8; font-weight: 600; user-select: none;" contenteditable="false">✂️ --- Page Break (Page 2 begins below) ---</div><p><br/></p>`;
    document.execCommand('insertHTML', false, pageBreakHtml);
    syncFromEditor();
  };

  const handleInsertDivider = () => {
    restoreEditorSelection(editorDivRef.current);
    document.execCommand(
      'insertHTML',
      false,
      '<hr style="margin: 20px 0; border: none; border-top: 1px solid #cbd5e1;" /><p><br/></p>'
    );
    syncFromEditor();
  };

  const handleUndo = () => {
    restoreEditorSelection(editorDivRef.current);
    document.execCommand('undo');
    syncFromEditor();
  };

  const handleRedo = () => {
    restoreEditorSelection(editorDivRef.current);
    document.execCommand('redo');
    syncFromEditor();
  };

  // New Blank Document
  const handleCreateBlankDocument = () => {
    const newId = `doc_${Date.now()}`;
    const newDoc: DocumentModel = {
      id: newId,
      title: 'Untitled Document',
      content: '<h1>Untitled Document</h1><p>Start typing your document or paste your text here...</p>',
      category: 'personal',
      tags: ['draft'],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pageSetup: {
        paperSize: 'a4',
        orientation: 'portrait',
        margin: 'normal',
        fontFamily: 'sans',
        fontSize: 11,
        lineHeight: 1.6,
        headerText: '',
        footerText: '',
        showPageNumbers: true,
        accentColor: '#1e3a8a',
      },
      versions: [],
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocIdState(newId);
    setCurrentPageIndex(0);
  };

  // Template select
  const handleSelectTemplate = (template: DocumentTemplate) => {
    const newId = `doc_${Date.now()}`;
    const newDoc: DocumentModel = {
      id: newId,
      title: template.title,
      content: template.content,
      category: template.category,
      tags: [template.category, 'template'],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pageSetup: {
        paperSize: 'a4',
        orientation: 'portrait',
        margin: 'normal',
        fontFamily: 'sans',
        fontSize: 11,
        lineHeight: 1.6,
        headerText: '',
        footerText: '',
        showPageNumbers: true,
        accentColor: '#1e3a8a',
        ...template.defaultSettings,
      },
      versions: [],
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocIdState(newId);
    setCurrentPageIndex(0);
  };

  const handleDuplicateDocument = (doc: DocumentModel) => {
    const newId = `doc_${Date.now()}`;
    const duplicated: DocumentModel = {
      ...doc,
      id: newId,
      title: `${doc.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [],
    };
    setDocuments((prev) => [duplicated, ...prev]);
    setActiveDocIdState(newId);
  };

  const handleDeleteDocument = (id: string) => {
    if (documents.length <= 1) return;
    const remaining = documents.filter((d) => d.id !== id);
    setDocuments(remaining);
    if (activeDocId === id) {
      setActiveDocIdState(remaining[0].id);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-['Plus_Jakarta_Sans'] text-slate-900">
      {/* 1. Top Header */}
      <Header
        currentDoc={currentDoc}
        onUpdateTitle={handleUpdateTitle}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenPageSettings={() => setIsPageSettingsOpen(true)}
        isSaving={isSaving}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onCreateNew={handleCreateBlankDocument}
        currentPageNumber={currentPageIndex + 1}
        totalPageCount={pagination.totalPages}
      />

      {/* 2. Visual WYSIWYG Ribbon Toolbar (Shows in Editor or Split Mode) */}
      {(viewMode === 'editor' || viewMode === 'split') && (
        <WordToolbar
          onFormatBlock={handleFormatBlock}
          onFormatInline={handleFormatInline}
          onInsertTable={handleInsertTable}
          onInsertPageBreak={handleInsertPageBreak}
          onInsertDivider={handleInsertDivider}
          fontFamily={currentDoc.pageSetup.fontFamily}
          onChangeFontFamily={(f: FontFamily) => handleUpdatePageSetup({ fontFamily: f })}
          fontSize={currentDoc.pageSetup.fontSize}
          onChangeFontSize={(s: number) => handleUpdatePageSetup({ fontSize: s })}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      )}

      {/* 3. Main Workspace: Word Editor and/or Swappable Full-Sized PDF Preview */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* LEFT / MAIN: Word Document Editor */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div
            className={`flex flex-col h-full overflow-hidden ${
              viewMode === 'split' ? 'w-full lg:w-1/2 border-r border-slate-300' : 'w-full'
            }`}
          >
            <WordEditor
              doc={currentDoc}
              onChangeContent={handleUpdateContent}
              editorRef={editorDivRef}
              onInsertPageBreak={handleInsertPageBreak}
            />
          </div>
        )}

        {/* RIGHT / PREVIEW: Full-Sized, Legible, Swappable PDF Preview (Pages 1, 2, 3, 4...) */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex flex-col h-full overflow-hidden ${
              viewMode === 'split' ? 'hidden lg:flex lg:w-1/2' : 'w-full'
            }`}
          >
            <CompactPagePreview
              doc={currentDoc}
              currentPageIndex={currentPageIndex}
              onSelectPage={setCurrentPageIndex}
              isMobile={viewMode === 'preview'}
            />
          </div>
        )}
      </main>

      {/* 4. Modals */}
      <WorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        documents={documents}
        folders={folders}
        activeDocId={activeDocId}
        onSelectDocument={(id) => {
          setActiveDocIdState(id);
          setCurrentPageIndex(0);
        }}
        onCreateBlankDocument={handleCreateBlankDocument}
        onDuplicateDocument={handleDuplicateDocument}
        onDeleteDocument={handleDeleteDocument}
        onToggleFavorite={handleToggleFavorite}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <PageSettingsModal
        isOpen={isPageSettingsOpen}
        onClose={() => setIsPageSettingsOpen(false)}
        pageSetup={currentDoc.pageSetup}
        onUpdatePageSetup={handleUpdatePageSetup}
      />
    </div>
  );
}
