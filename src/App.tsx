import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { WordToolbar } from './components/Editor/WordToolbar';
import { WordEditor } from './components/Editor/WordEditor';
import { CompactPagePreview } from './components/Editor/CompactPagePreview';
import { PageSettingsModal } from './components/Editor/PageSettingsModal';
import { WorkspaceModal } from './components/Workspace/WorkspaceModal';
import { TemplatesModal } from './components/Workspace/TemplatesModal';
import { SpellCheckerModal } from './components/Editor/SpellCheckerModal';
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
import {
  scanForTypos,
  applyTypoFix,
  autoCorrectAllTypos,
  TypoIssue,
} from './utils/spellChecker';

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
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  // Active preview page index (0-indexed: 0 is Page 1, 1 is Page 2, etc.)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Modals state
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [isSpellCheckerOpen, setIsSpellCheckerOpen] = useState(false);
  const [ignoredTypoIds, setIgnoredTypoIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const editorDivRef = useRef<HTMLDivElement | null>(null);

  // Calculate current pagination for header & status
  const pagination = paginateContent(currentDoc.content, currentDoc.pageSetup);

  // Scan for typos & grammar issues
  const detectedTypos = useMemo(() => {
    const allIssues = scanForTypos(currentDoc.content);
    return allIssues.filter((iss) => !ignoredTypoIds.has(iss.id));
  }, [currentDoc.content, ignoredTypoIds]);

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

  const handleInsertCustomTable = (tableHtml: string) => {
    const editor = editorDivRef.current;
    if (!editor) return;

    restoreEditorSelection(editor);
    const sel = window.getSelection();
    let inserted = false;
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      inserted = document.execCommand('insertHTML', false, tableHtml);
    }

    if (!inserted) {
      // Fallback: append safely to editor contents
      const tempWrapper = document.createElement('div');
      tempWrapper.innerHTML = tableHtml;
      while (tempWrapper.firstChild) {
        editor.appendChild(tempWrapper.firstChild);
      }
    }
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

  // Spell Checker handlers
  const handleFixSingleTypo = (issue: TypoIssue) => {
    const fixed = applyTypoFix(currentDoc.content, issue);
    handleUpdateContent(fixed);
    if (editorDivRef.current) {
      editorDivRef.current.innerHTML = fixed;
    }
  };

  const handleFixAllTypos = () => {
    const { updatedHtml } = autoCorrectAllTypos(currentDoc.content, detectedTypos);
    handleUpdateContent(updatedHtml);
    if (editorDivRef.current) {
      editorDivRef.current.innerHTML = updatedHtml;
    }
    setIsSpellCheckerOpen(false);
  };

  const handleIgnoreTypo = (id: string) => {
    setIgnoredTypoIds((prev) => new Set([...prev, id]));
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

  // Template select: creates new document and switches view appropriately
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

    // If currently in preview mode, switch to split so user can immediately see and edit the template
    if (viewMode === 'preview') {
      setViewMode('split');
    }

    setTimeout(() => {
      if (editorDivRef.current) {
        editorDivRef.current.innerHTML = template.content;
      }
    }, 20);
  };

  const handleApplyTemplateToCurrent = (template: DocumentTemplate) => {
    if (viewMode === 'preview') {
      setViewMode('split');
    }
    handleUpdateContent(template.content);
    if (template.defaultSettings) {
      handleUpdatePageSetup(template.defaultSettings);
    }
    setTimeout(() => {
      if (editorDivRef.current) {
        editorDivRef.current.innerHTML = template.content;
      }
    }, 20);
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
          onInsertCustomTable={handleInsertCustomTable}
          onInsertPageBreak={handleInsertPageBreak}
          onInsertDivider={handleInsertDivider}
          fontFamily={currentDoc.pageSetup.fontFamily}
          onChangeFontFamily={(f: FontFamily) => handleUpdatePageSetup({ fontFamily: f })}
          fontSize={currentDoc.pageSetup.fontSize}
          onChangeFontSize={(s: number) => handleUpdatePageSetup({ fontSize: s })}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onOpenSpellChecker={() => setIsSpellCheckerOpen(true)}
          typoCount={detectedTypos.length}
          accentColor={currentDoc.pageSetup.accentColor || '#1e3a8a'}
          onChangeAccentColor={(color: string) => handleUpdatePageSetup({ accentColor: color })}
        />
      )}

      {/* 3. Main Workspace: Word Editor and/or Swappable Full-Sized PDF Preview */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* LEFT / MAIN: Word Document Editor */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div
            className={`flex flex-col h-full overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-300' : 'w-full'
            }`}
          >
            <WordEditor
              doc={currentDoc}
              onChangeContent={handleUpdateContent}
              editorRef={editorDivRef}
              onInsertPageBreak={handleInsertPageBreak}
              onOpenPreview={() => setViewMode(window.innerWidth < 768 ? 'preview' : 'split')}
            />
          </div>
        )}

        {/* RIGHT / PREVIEW: Full-Sized, Legible, Swappable PDF Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex flex-col h-full overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
            }`}
          >
            <CompactPagePreview
              doc={currentDoc}
              currentPageIndex={currentPageIndex}
              onSelectPage={setCurrentPageIndex}
              isMobile={viewMode === 'preview'}
              onClosePreview={() => setViewMode('editor')}
              isSplit={viewMode === 'split'}
              onToggleFullscreenPreview={() => setViewMode(viewMode === 'split' ? 'preview' : 'split')}
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
        onApplyToCurrent={handleApplyTemplateToCurrent}
      />

      <PageSettingsModal
        isOpen={isPageSettingsOpen}
        onClose={() => setIsPageSettingsOpen(false)}
        pageSetup={currentDoc.pageSetup}
        onUpdatePageSetup={handleUpdatePageSetup}
      />

      {/* Auto Spell Checker Modal */}
      <SpellCheckerModal
        isOpen={isSpellCheckerOpen}
        onClose={() => setIsSpellCheckerOpen(false)}
        issues={detectedTypos}
        onFixSingle={handleFixSingleTypo}
        onFixAll={handleFixAllTypos}
        onIgnore={handleIgnoreTypo}
        onRescan={() => setIgnoredTypoIds(new Set())}
      />
    </div>
  );
}
