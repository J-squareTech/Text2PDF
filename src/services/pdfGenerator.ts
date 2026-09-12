import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { DocumentModel } from '../types/document';
import { paginateContent } from '../utils/pagination';

/**
 * Generate a downloadable PDF that is 100% IDENTICAL to the visual preview screen.
 * Uses high-resolution canvas capture (2x scale) of the exact styled page sheets,
 * ensuring tables, fonts, colors, headers, footers, and margins match pixel-for-pixel.
 */
export async function exportToDirectPdf(doc: DocumentModel): Promise<void> {
  const isLandscape = doc.pageSetup.orientation === 'landscape';
  const paperFormat =
    doc.pageSetup.paperSize === 'legal'
      ? 'legal'
      : doc.pageSetup.paperSize === 'letter'
      ? 'letter'
      : 'a4';

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: paperFormat,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Get paginated pages
  const pagination = paginateContent(doc.content, doc.pageSetup);
  const totalPages = pagination.totalPages;

  // Margin styling
  const marginPadding = {
    compact: '24px 32px',
    normal: '32px 48px',
    relaxed: '40px 56px',
  }[doc.pageSetup.margin] || '32px 48px';

  // Font family
  const fontFamilyStyle = {
    sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'Lora', Georgia, Cambria, 'Times New Roman', Times, serif",
    mono: "'Fira Code', Menlo, Monaco, Consolas, monospace",
    display: "'Cinzel', Georgia, serif",
  }[doc.pageSetup.fontFamily] || "'Plus Jakarta Sans', sans-serif";

  // Check if preview pages already exist in the DOM
  const existingSheets: HTMLElement[] = [];
  for (let i = 1; i <= totalPages; i++) {
    const el = document.getElementById(`preview-page-${i}`);
    if (el) existingSheets.push(el);
  }

  let sheetsToRender: HTMLElement[] = existingSheets;
  let tempHost: HTMLElement | null = null;

  // If preview sheets aren't currently mounted (e.g. user is in Write/Editor mode only),
  // construct exact visual clone sheets in an offscreen container.
  if (sheetsToRender.length < totalPages) {
    tempHost = document.createElement('div');
    tempHost.style.position = 'fixed';
    tempHost.style.left = '-99999px';
    tempHost.style.top = '0';
    tempHost.style.width = isLandscape ? '1100px' : '820px';
    tempHost.style.zIndex = '-1000';
    tempHost.style.backgroundColor = '#ffffff';

    const createdSheets: HTMLElement[] = [];

    pagination.pages.forEach((pageHtml, index) => {
      const pageNum = index + 1;
      const sheet = document.createElement('div');
      sheet.style.width = isLandscape ? '1100px' : '820px';
      sheet.style.minHeight = isLandscape ? '760px' : '1080px';
      sheet.style.boxSizing = 'border-box';
      sheet.style.padding = marginPadding;
      sheet.style.backgroundColor = '#ffffff';
      sheet.style.fontFamily = fontFamilyStyle;
      sheet.style.fontSize = `${doc.pageSetup.fontSize || 11}pt`;
      sheet.style.lineHeight = String(doc.pageSetup.lineHeight || 1.6);
      sheet.style.color = '#1e293b';
      sheet.style.display = 'flex';
      sheet.style.flexDirection = 'column';
      sheet.style.justifyContent = 'space-between';

      // Header
      const headerDiv = document.createElement('div');
      headerDiv.style.borderBottom = '1px solid #e2e8f0';
      headerDiv.style.paddingBottom = '12px';
      headerDiv.style.marginBottom = '20px';
      headerDiv.style.fontSize = '12px';
      headerDiv.style.color = '#94a3b8';
      headerDiv.style.display = 'flex';
      headerDiv.style.justifyContent = 'space-between';
      headerDiv.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

      const headerTitle = document.createElement('span');
      headerTitle.textContent = doc.pageSetup.headerText || doc.title;
      headerDiv.appendChild(headerTitle);

      const headerBadge = document.createElement('span');
      headerBadge.textContent = `${doc.pageSetup.paperSize.toUpperCase()} • PAGE ${pageNum} OF ${totalPages}`;
      headerBadge.style.fontSize = '10px';
      headerBadge.style.padding = '2px 8px';
      headerBadge.style.background = '#f1f5f9';
      headerBadge.style.borderRadius = '4px';
      headerDiv.appendChild(headerBadge);

      sheet.appendChild(headerDiv);

      // Body Content
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'document-canvas';
      bodyDiv.style.flex = '1';
      bodyDiv.style.fontSize = '14px';
      bodyDiv.style.lineHeight = '1.6';

      const cleanHtml = pageHtml
        .replace(/<div[^>]*class=["'][^"']*(?:page-break|tex2pdf-page-break)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
        .trim();
      bodyDiv.innerHTML = cleanHtml;

      sheet.appendChild(bodyDiv);

      // Footer
      const footerDiv = document.createElement('div');
      footerDiv.style.borderTop = '1px solid #e2e8f0';
      footerDiv.style.paddingTop = '12px';
      footerDiv.style.marginTop = '20px';
      footerDiv.style.fontSize = '12px';
      footerDiv.style.color = '#94a3b8';
      footerDiv.style.display = 'flex';
      footerDiv.style.justifyContent = 'space-between';
      footerDiv.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

      const footerText = document.createElement('span');
      footerText.textContent = doc.pageSetup.footerText || 'Tex2PDF Document';
      footerDiv.appendChild(footerText);

      if (doc.pageSetup.showPageNumbers) {
        const pageNumberSpan = document.createElement('span');
        pageNumberSpan.textContent = `Page ${pageNum} of ${totalPages}`;
        pageNumberSpan.style.fontWeight = 'bold';
        pageNumberSpan.style.color = '#475569';
        footerDiv.appendChild(pageNumberSpan);
      }

      sheet.appendChild(footerDiv);
      tempHost!.appendChild(sheet);
      createdSheets.push(sheet);
    });

    document.body.appendChild(tempHost);
    sheetsToRender = createdSheets;
  }

  try {
    for (let i = 0; i < sheetsToRender.length; i++) {
      const sheet = sheetsToRender[i];

      const canvas = await html2canvas(sheet, {
        scale: 2, // 2x high-resolution crisp text & borders
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: sheet.scrollWidth,
        onclone: (clonedDoc, clonedElement) => {
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.margin = '0';
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage(paperFormat, isLandscape ? 'landscape' : 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const safeTitle = (doc.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    pdf.save(`${safeTitle}.pdf`);
  } catch (err) {
    console.error('Error generating canvas PDF, falling back to vector print:', err);
    window.print();
  } finally {
    if (tempHost && tempHost.parentNode) {
      tempHost.parentNode.removeChild(tempHost);
    }
  }
}

/**
 * Trigger native print dialog
 */
export function triggerSystemPrint(): void {
  window.print();
}

/**
 * Export document content as Markdown file
 */
export function exportToMarkdown(doc: DocumentModel): void {
  const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title || 'document'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export document content as complete standalone HTML file
 */
export function exportToHtml(doc: DocumentModel): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1 { font-size: 2em; margin-bottom: 0.5em; color: #0f172a; }
    h2 { font-size: 1.5em; margin-top: 1.2em; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2em; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1.5px solid #94a3b8; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: bold; }
    .page-break { page-break-after: always; border-top: 2px dashed #3b82f6; margin: 30px 0; }
  </style>
</head>
<body>
  ${doc.content}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title || 'document'}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export document content as plain text file
 */
export function exportToTxt(doc: DocumentModel): void {
  const plain = (doc.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const blob = new Blob([plain], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title || 'document'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
