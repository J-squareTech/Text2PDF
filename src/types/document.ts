export type PaperSize = 'a4' | 'letter' | 'legal';
export type Orientation = 'portrait' | 'landscape';
export type MarginSize = 'compact' | 'normal' | 'relaxed';
export type FontFamily =
  | 'sans'
  | 'inter'
  | 'arial'
  | 'trebuchet'
  | 'serif'
  | 'georgia'
  | 'garamond'
  | 'merriweather'
  | 'mono'
  | 'courier'
  | 'display'
  | 'playfair'
  | 'script';

export interface PageSetup {
  paperSize: PaperSize;
  orientation: Orientation;
  margin: MarginSize;
  fontFamily: FontFamily;
  fontSize: number; // pt (10, 11, 12, 14)
  lineHeight: number; // 1.2, 1.5, 1.8, 2.0
  headerText: string;
  footerText: string;
  showPageNumbers: boolean;
  accentColor: string;
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  label: string;
  content: string;
  wordCount: number;
}

export interface DocumentModel {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  category: 'business' | 'personal' | 'education' | 'professional' | 'legal';
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  pageSetup: PageSetup;
  versions: DocumentVersion[];
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  documentCount?: number;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'business' | 'personal' | 'education' | 'professional' | 'legal';
  description: string;
  badge?: string;
  defaultSettings?: Partial<PageSetup>;
  content: string;
}

export type ExportFormat = 'pdf' | 'print' | 'markdown' | 'html' | 'txt' | 'json';
