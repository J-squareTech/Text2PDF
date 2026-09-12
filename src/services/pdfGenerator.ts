import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { DocumentModel } from '../types/document';
import { paginateContent } from '../utils/pagination';
import { FONT_FAMILY_DEFINITIONS } from '../utils/editorUtils';

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
  const fontFamilyStyle =
    FONT_FAMILY_DEFINITIONS[doc.pageSetup.fontFamily]?.css || "'Plus Jakarta Sans', sans-serif";

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

      if (doc.pageSetup.showPageNumbers) {
        const headerBadge = document.createElement('span');
        headerBadge.textContent = `Page ${pageNum} of ${totalPages}`;
        headerBadge.style.fontSize = '10px';
        headerBadge.style.padding = '2px 8px';
        headerBadge.style.background = '#f1f5f9';
        headerBadge.style.borderRadius = '4px';
        headerBadge.style.color = '#64748b';
        headerDiv.appendChild(headerBadge);
      }

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
      footerText.textContent = doc.pageSetup.footerText || '';
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

/**
 * Export document content as a formatted Microsoft Word file (.doc format)
 * Preserves headings, fonts, colors, text alignment, margins, borders, and tables.
 */
export function exportToWord(doc: DocumentModel): void {
  const accentHex = doc.pageSetup.accentColor || '#1e3a8a';
  const fontFamilyDef =
    FONT_FAMILY_DEFINITIONS[doc.pageSetup.fontFamily]?.css || 'Calibri, Arial, sans-serif';
  const isLandscape = doc.pageSetup.orientation === 'landscape';

  const marginInches =
    {
      compact: '0.6in',
      normal: '1.0in',
      relaxed: '1.2in',
    }[doc.pageSetup.margin] || '1.0in';

  const wordContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${doc.title || 'Document'}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: ${isLandscape ? '11.0in 8.5in' : '8.5in 11.0in'};
      margin: ${marginInches} ${marginInches} ${marginInches} ${marginInches};
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: ${fontFamilyDef};
      font-size: ${doc.pageSetup.fontSize || 11}pt;
      line-height: ${doc.pageSetup.lineHeight || 1.5};
      color: #1e293b;
      background-color: #ffffff;
    }
    h1 {
      font-size: 20pt;
      font-weight: bold;
      color: ${accentHex};
      margin-top: 18pt;
      margin-bottom: 6pt;
    }
    h2 {
      font-size: 15pt;
      font-weight: bold;
      color: ${accentHex};
      margin-top: 14pt;
      margin-bottom: 4pt;
      border-bottom: 1pt solid #cbd5e1;
      padding-bottom: 2pt;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      color: #334155;
      margin-top: 10pt;
      margin-bottom: 3pt;
    }
    p {
      margin-top: 0;
      margin-bottom: 8pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    th, td {
      border: 1pt solid #cbd5e1;
      padding: 6pt 8pt;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
      color: ${accentHex};
      border-bottom: 2pt solid ${accentHex};
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    u, [style*="underline"] {
      text-decoration: underline !important;
    }
    s, strike, del {
      text-decoration: line-through !important;
    }
    blockquote {
      border-left: 3pt solid ${accentHex};
      padding-left: 10pt;
      margin: 10pt 0;
      color: #475569;
      font-style: italic;
    }
    hr {
      border: none;
      border-top: 1pt solid #cbd5e1;
      margin: 14pt 0;
    }
    pre {
      background-color: #f1f5f9;
      padding: 8pt;
      border: 1pt solid #e2e8f0;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9.5pt;
    }
    code {
      background-color: #f1f5f9;
      padding: 2pt 4pt;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9.5pt;
    }
    .page-break {
      page-break-before: always;
      mso-special-character: line-break;
    }
  </style>
</head>
<body>
  <div class="Section1">
    ${doc.content}
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title || 'document'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export document content as high-resolution PNG image(s) (2x Retina scale)
 */
export async function exportToImage(doc: DocumentModel): Promise<void> {
  const isLandscape = doc.pageSetup.orientation === 'landscape';
  const pagination = paginateContent(doc.content, doc.pageSetup);
  const totalPages = Math.max(1, pagination.totalPages);

  const marginPadding =
    {
      compact: '24px 32px',
      normal: '32px 48px',
      relaxed: '40px 56px',
    }[doc.pageSetup.margin] || '32px 48px';

  const fontFamilyStyle =
    FONT_FAMILY_DEFINITIONS[doc.pageSetup.fontFamily]?.css || "'Plus Jakarta Sans', sans-serif";

  // Check if preview sheets already exist in the DOM
  const existingSheets: HTMLElement[] = [];
  for (let i = 1; i <= totalPages; i++) {
    const el = document.getElementById(`preview-page-${i}`);
    if (el) existingSheets.push(el);
  }

  let sheetsToRender: HTMLElement[] = existingSheets;
  let tempHost: HTMLElement | null = null;

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
      headerDiv.innerHTML = `<span>${doc.pageSetup.headerText || ''}</span>${
        doc.pageSetup.showPageNumbers
          ? `<span style="font-family: monospace; font-size: 11px; font-weight: 600; color: ${
              doc.pageSetup.accentColor || '#1e3a8a'
            }">Page ${pageNum}</span>`
          : ''
      }`;
      sheet.appendChild(headerDiv);

      // Body
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'document-canvas';
      bodyDiv.style.flex = '1';
      bodyDiv.style.color = '#1e293b';
      bodyDiv.innerHTML = pageHtml;
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
      footerDiv.innerHTML = `<span>${doc.pageSetup.footerText || ''}</span>${
        doc.pageSetup.showPageNumbers
          ? `<span style="font-size: 11px">Page ${pageNum} of ${totalPages}</span>`
          : ''
      }`;
      sheet.appendChild(footerDiv);

      tempHost.appendChild(sheet);
      createdSheets.push(sheet);
    });

    document.body.appendChild(tempHost);
    sheetsToRender = createdSheets;
  }

  try {
    for (let i = 0; i < sheetsToRender.length; i++) {
      const sheet = sheetsToRender[i];
      const pageNum = i + 1;
      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const pageSuffix = totalPages > 1 ? `-page-${pageNum}` : '';
        a.download = `${doc.title || 'document'}${pageSuffix}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  } finally {
    if (tempHost && tempHost.parentNode) {
      tempHost.parentNode.removeChild(tempHost);
    }
  }
}
