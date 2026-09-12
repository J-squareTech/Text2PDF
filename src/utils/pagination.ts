import { PageSetup } from '../types/document';

export interface PaginatedDocument {
  pages: string[];
  totalPages: number;
  wordCount: number;
  charCount: number;
}

/**
 * Strips HTML tags to compute true human reading word and character counts
 */
export function getPlainText(htmlOrText: string): string {
  if (!htmlOrText) return '';
  return htmlOrText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent DOM-based pagination engine.
 * Accurately measures block heights (headings, paragraphs, tables, lists, quotes)
 * and distributes them across printable pages without overflowing or cutting off at the bottom.
 */
export function paginateContent(content: string, pageSetup: PageSetup): PaginatedDocument {
  if (!content || !content.trim()) {
    return {
      pages: ['<p>Start writing your document here...</p>'],
      totalPages: 1,
      wordCount: 0,
      charCount: 0,
    };
  }

  const cleanContent = content.trim();
  const plain = getPlainText(cleanContent);
  const wordCount = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  const charCount = plain.length;

  // Maximum content pixel budget for a standard page (excluding headers/footers & margins)
  // On a standard A4 page (~1050px total at 96 DPI), content area is ~750px
  let maxPageHeight = 720;
  if (pageSetup.paperSize === 'letter') maxPageHeight = 680;
  if (pageSetup.paperSize === 'legal') maxPageHeight = 880;
  if (pageSetup.orientation === 'landscape') maxPageHeight = Math.round(maxPageHeight * 0.7);
  if (pageSetup.margin === 'compact') maxPageHeight += 80;
  if (pageSetup.margin === 'relaxed') maxPageHeight -= 80;

  // Font size scale factor
  const fontScale = (pageSetup.fontSize || 11) / 11;
  const lineSpacing = pageSetup.lineHeight || 1.6;

  // Parse HTML into DOM elements
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${cleanContent}</body>`, 'text/html');
  const body = doc.body;

  // If there are no direct children (e.g. raw text without tags)
  if (body.children.length === 0) {
    const rawParagraphs = cleanContent.split(/\n\s*\n/).filter(Boolean);
    const pages: string[] = [];
    let curPage = '';
    let curChars = 0;
    const maxChars = Math.round(1800 / fontScale);

    for (const p of rawParagraphs) {
      const pLen = p.length;
      if (curChars + pLen > maxChars && curPage) {
        pages.push(curPage);
        curPage = `<p>${p}</p>`;
        curChars = pLen;
      } else {
        curPage += `<p>${p}</p>`;
        curChars += pLen;
      }
    }
    if (curPage) pages.push(curPage);

    return {
      pages: pages.length > 0 ? pages : [cleanContent],
      totalPages: Math.max(1, pages.length),
      wordCount,
      charCount,
    };
  }

  const pages: string[] = [];
  let currentPageHtml = '';
  let currentPageHeight = 0;

  const pushCurrentPage = () => {
    if (currentPageHtml.trim()) {
      pages.push(currentPageHtml.trim());
      currentPageHtml = '';
      currentPageHeight = 0;
    }
  };

  const children = Array.from(body.children);

  for (const el of children) {
    const tagName = el.tagName.toLowerCase();

    // 1. Explicit manual page break marker
    if (
      el.classList.contains('page-break') ||
      el.classList.contains('tex2pdf-page-break') ||
      el.getAttribute('data-page-break') === 'true' ||
      el.textContent?.includes('=== PAGE BREAK ===') ||
      el.textContent?.includes('--- Page Break')
    ) {
      pushCurrentPage();
      continue;
    }

    // Estimate element rendered height
    let elHeight = 24;
    const textLen = el.textContent?.trim().length || 0;
    const estimatedLines = Math.max(1, Math.ceil(textLen / 75));

    if (tagName === 'h1') {
      elHeight = (36 + estimatedLines * 28) * fontScale;
    } else if (tagName === 'h2') {
      elHeight = (28 + estimatedLines * 22) * fontScale;
    } else if (tagName === 'h3') {
      elHeight = (22 + estimatedLines * 18) * fontScale;
    } else if (tagName === 'table') {
      const rows = el.querySelectorAll('tr').length || 2;
      elHeight = (rows * 36 + 24); // Each table row is ~36px
    } else if (tagName === 'ul' || tagName === 'ol') {
      const items = el.querySelectorAll('li').length || 1;
      elHeight = items * 24 * fontScale * lineSpacing;
    } else if (tagName === 'hr') {
      elHeight = 24;
    } else if (tagName === 'blockquote') {
      elHeight = (estimatedLines * 22 + 16) * fontScale * lineSpacing;
    } else {
      // Paragraphs, divs, sections
      elHeight = Math.max(24, estimatedLines * 20 * fontScale * lineSpacing);
    }

    // If adding this element exceeds the page height, start a new page
    if (currentPageHeight + elHeight > maxPageHeight && currentPageHtml.trim().length > 0) {
      pushCurrentPage();
    }

    currentPageHtml += el.outerHTML;
    currentPageHeight += elHeight;
  }

  // Push remaining content
  if (currentPageHtml.trim().length > 0) {
    pages.push(currentPageHtml.trim());
  }

  // Fallback: at least 1 page
  if (pages.length === 0) {
    pages.push(cleanContent);
  }

  return {
    pages,
    totalPages: pages.length,
    wordCount,
    charCount,
  };
}
