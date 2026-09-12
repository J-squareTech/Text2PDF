import { DocumentModel, Folder } from '../types/document';
import { DOCUMENT_TEMPLATES } from '../data/templates';

const STORAGE_KEY_DOCS = 'tex2pdf_documents_v2';
const STORAGE_KEY_FOLDERS = 'tex2pdf_folders_v2';
const STORAGE_KEY_ACTIVE_DOC = 'tex2pdf_active_doc_id_v2';

export const DEFAULT_FOLDERS: Folder[] = [
  { id: 'f_academic', name: 'Academic & School', color: '#8b5cf6' },
  { id: 'f_personal', name: 'Personal & Career', color: '#f59e0b' },
  { id: 'f_proposals', name: 'Proposals & Projects', color: '#3b82f6' },
  { id: 'f_finance', name: 'Finance & Invoices', color: '#10b981' },
];

export function getInitialDocuments(): DocumentModel[] {
  const essayTmpl = DOCUMENT_TEMPLATES[0];
  const resumeTmpl = DOCUMENT_TEMPLATES[1];
  const proposalTmpl = DOCUMENT_TEMPLATES[2];
  const invoiceTmpl = DOCUMENT_TEMPLATES[3];

  const now = new Date().toISOString();

  return [
    {
      id: 'doc_academic_paper',
      title: 'Academic Essay & Research Paper',
      content: essayTmpl.content,
      folderId: 'f_academic',
      category: 'education',
      tags: ['research', 'essay', 'school'],
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
      pageSetup: {
        paperSize: 'a4',
        orientation: 'portrait',
        margin: 'normal',
        fontFamily: 'serif',
        fontSize: 12,
        lineHeight: 1.6,
        accentColor: '#1e3a8a',
        headerText: 'Academic Research • University Submission',
        footerText: 'Department of Science & Humanities',
        showPageNumbers: true,
      },
      versions: [],
    },
    {
      id: 'doc_student_resume',
      title: 'Student & Graduate Resume',
      content: resumeTmpl.content,
      folderId: 'f_personal',
      category: 'personal',
      tags: ['resume', 'cv', 'career'],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      pageSetup: {
        paperSize: 'a4',
        orientation: 'portrait',
        margin: 'compact',
        fontFamily: 'sans',
        fontSize: 10.5,
        lineHeight: 1.45,
        accentColor: '#0f766e',
        headerText: 'Alex Morgan • Curriculum Vitae',
        footerText: '',
        showPageNumbers: false,
      },
      versions: [],
    },
    {
      id: 'doc_commercial_proposal',
      title: 'Commercial Business Proposal',
      content: proposalTmpl.content,
      folderId: 'f_proposals',
      category: 'business',
      tags: ['business', 'proposal'],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      pageSetup: {
        paperSize: 'a4',
        orientation: 'portrait',
        margin: 'normal',
        fontFamily: 'sans',
        fontSize: 11,
        lineHeight: 1.5,
        accentColor: '#1e3a8a',
        headerText: 'AgriGrowth Enterprises • Commercial Proposal',
        footerText: 'Confidential & Proprietary',
        showPageNumbers: true,
      },
      versions: [],
    },
  ];
}

export function loadDocuments(): DocumentModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOCS);
    if (!raw) {
      const initial = getInitialDocuments();
      saveDocuments(initial);
      return initial;
    }
    const parsed: DocumentModel[] = JSON.parse(raw);
    // Sanitize any legacy cached documents removing "References Available Upon Request" or old references
    const cleaned = parsed.map((doc) => {
      let content = doc.content || '';
      content = content.replace(/<h2>\s*References\s*&amp;\s*Works Cited\s*<\/h2>[\s\S]*?<\/ol>/gi, '');
      content = content.replace(/<p[^>]*>\s*References Available Upon Request\s*<\/p>/gi, '');
      content = content.replace(/References Available Upon Request/gi, '');

      const pageSetup = { ...doc.pageSetup };
      if (pageSetup.footerText && pageSetup.footerText.includes('References Available Upon Request')) {
        pageSetup.footerText = '';
      }
      return {
        ...doc,
        content,
        pageSetup,
      };
    });
    return cleaned;
  } catch (err) {
    console.error('Failed to load documents from storage:', err);
    return getInitialDocuments();
  }
}

export function saveDocuments(docs: DocumentModel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
  } catch (err) {
    console.error('Failed to save documents to storage:', err);
  }
}

export function loadFolders(): Folder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (!raw) {
      saveFolders(DEFAULT_FOLDERS);
      return DEFAULT_FOLDERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FOLDERS;
  }
}

export function saveFolders(folders: Folder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  } catch (err) {
    console.error('Failed to save folders:', err);
  }
}

export function getActiveDocId(): string | null {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_DOC);
}

export function setActiveDocId(id: string): void {
  localStorage.setItem(STORAGE_KEY_ACTIVE_DOC, id);
}
