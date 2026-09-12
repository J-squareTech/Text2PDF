import { jsPDF } from 'jspdf';
import { DocumentModel } from '../types/document';

/**
 * Generate a downloadable PDF file directly from rich document HTML using jsPDF
 */
export function exportToDirectPdf(doc: DocumentModel): void {
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

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Margins in mm
  const marginMm =
    doc.pageSetup.margin === 'compact'
      ? 14
      : doc.pageSetup.margin === 'relaxed'
      ? 26
      : 18;
  const contentWidth = pageWidth - marginMm * 2;

  let cursorY = marginMm + 8;
  let pageNumber = 1;

  const drawHeaderFooter = (currentPage: number) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(130, 140, 150);

    // Running Header
    if (doc.pageSetup.headerText) {
      pdf.text(doc.pageSetup.headerText, marginMm, marginMm - 4);
      pdf.setDrawColor(225, 230, 235);
      pdf.setLineWidth(0.2);
      pdf.line(marginMm, marginMm - 2, pageWidth - marginMm, marginMm - 2);
    }

    // Running Footer
    const footerY = pageHeight - marginMm + 6;
    if (doc.pageSetup.footerText) {
      const footerMsg = doc.pageSetup.footerText.replace('{page}', String(currentPage));
      pdf.text(footerMsg, marginMm, footerY);
    }

    if (doc.pageSetup.showPageNumbers) {
      const pageStr = `Page ${currentPage}`;
      pdf.text(pageStr, pageWidth - marginMm - pdf.getTextWidth(pageStr), footerY);
    }
  };

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - marginMm - 8) {
      drawHeaderFooter(pageNumber);
      pdf.addPage();
      pageNumber++;
      cursorY = marginMm + 8;
    }
  };

  // Parse HTML content
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(doc.content || '', 'text/html');
  const bodyNodes = Array.from(htmlDoc.body.children);

  if (bodyNodes.length === 0) {
    // If no HTML tags found, fallback to line-based rendering
    const rawLines = (doc.content || '').split('\n');
    for (const rawLine of rawLines) {
      if (!rawLine.trim()) {
        cursorY += 4;
        continue;
      }
      checkPageBreak(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10.5);
      pdf.setTextColor(30, 41, 59);
      const wrapped = pdf.splitTextToSize(rawLine.trim(), contentWidth);
      pdf.text(wrapped, marginMm, cursorY);
      cursorY += wrapped.length * 5.2 + 2;
    }
  } else {
    // Process HTML DOM Elements
    for (const node of bodyNodes) {
      const tagName = node.tagName.toLowerCase();

      // 1. Explicit Page Break
      if (
        node.classList.contains('page-break') ||
        node.classList.contains('tex2pdf-page-break') ||
        node.textContent?.includes('=== PAGE BREAK ===')
      ) {
        drawHeaderFooter(pageNumber);
        pdf.addPage();
        pageNumber++;
        cursorY = marginMm + 8;
        continue;
      }

      // 2. Heading 1 (Title)
      if (tagName === 'h1') {
        checkPageBreak(16);
        cursorY += 3;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(15, 23, 42);
        const text = node.textContent?.trim() || '';
        const wrapped = pdf.splitTextToSize(text, contentWidth);
        pdf.text(wrapped, marginMm, cursorY);
        cursorY += wrapped.length * 7.5 + 4;
        continue;
      }

      // 3. Heading 2 (Section)
      if (tagName === 'h2') {
        checkPageBreak(13);
        cursorY += 3;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13.5);
        pdf.setTextColor(30, 58, 138); // Navy blue
        const text = node.textContent?.trim() || '';
        const wrapped = pdf.splitTextToSize(text, contentWidth);
        pdf.text(wrapped, marginMm, cursorY);
        cursorY += wrapped.length * 6 + 3;
        continue;
      }

      // 4. Heading 3 (Subsection)
      if (tagName === 'h3') {
        checkPageBreak(10);
        cursorY += 2;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11.5);
        pdf.setTextColor(51, 65, 85);
        const text = node.textContent?.trim() || '';
        const wrapped = pdf.splitTextToSize(text, contentWidth);
        pdf.text(wrapped, marginMm, cursorY);
        cursorY += wrapped.length * 5.2 + 2;
        continue;
      }

      // 5. Horizontal Divider
      if (tagName === 'hr') {
        checkPageBreak(6);
        cursorY += 1;
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.3);
        pdf.line(marginMm, cursorY, pageWidth - marginMm, cursorY);
        cursorY += 5;
        continue;
      }

      // 6. Blockquote
      if (tagName === 'blockquote') {
        const quoteText = node.textContent?.trim() || '';
        checkPageBreak(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        const wrapped = pdf.splitTextToSize(quoteText, contentWidth - 8);
        const blockHeight = wrapped.length * 4.8 + 4;

        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(1);
        pdf.line(marginMm, cursorY - 1, marginMm, cursorY + blockHeight - 2);

        pdf.text(wrapped, marginMm + 5, cursorY + 3);
        cursorY += blockHeight + 2;
        continue;
      }

      // 7. Unordered List (Bullet Points)
      if (tagName === 'ul') {
        const items = Array.from(node.querySelectorAll('li'));
        for (const item of items) {
          checkPageBreak(6);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(30, 41, 59);

          // Dot
          pdf.setFillColor(71, 85, 105);
          pdf.circle(marginMm + 2, cursorY - 1, 0.7, 'F');

          const wrapped = pdf.splitTextToSize(item.textContent?.trim() || '', contentWidth - 8);
          pdf.text(wrapped, marginMm + 6, cursorY);
          cursorY += wrapped.length * 4.8 + 1.5;
        }
        cursorY += 2;
        continue;
      }

      // 8. Ordered List (Numbered)
      if (tagName === 'ol') {
        const items = Array.from(node.querySelectorAll('li'));
        items.forEach((item, idx) => {
          checkPageBreak(6);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(30, 41, 59);

          pdf.text(`${idx + 1}.`, marginMm, cursorY);
          const wrapped = pdf.splitTextToSize(item.textContent?.trim() || '', contentWidth - 8);
          pdf.text(wrapped, marginMm + 6, cursorY);
          cursorY += wrapped.length * 4.8 + 1.5;
        });
        cursorY += 2;
        continue;
      }

      // 9. Table Rendering
      if (tagName === 'table') {
        const rows = Array.from(node.querySelectorAll('tr'));
        if (rows.length > 0) {
          const colCount = Math.max(...rows.map((r) => r.children.length));
          const colWidth = contentWidth / (colCount || 1);

          for (let rIdx = 0; rIdx < rows.length; rIdx++) {
            const row = rows[rIdx];
            checkPageBreak(8);

            const isHeader = rIdx === 0 && row.querySelector('th') !== null;
            if (isHeader) {
              pdf.setFillColor(241, 245, 249);
              pdf.rect(marginMm, cursorY - 3.5, contentWidth, 7, 'F');
            }

            const cells = Array.from(row.children);
            cells.forEach((cell, cIdx) => {
              pdf.setFont('helvetica', isHeader ? 'bold' : 'normal');
              pdf.setFontSize(9);
              pdf.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);
              const cellText = cell.textContent?.trim() || '';
              const cellX = marginMm + cIdx * colWidth + 2;
              pdf.text(cellText, cellX, cursorY);
            });

            // Row bottom border
            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.2);
            pdf.line(marginMm, cursorY + 3.5, marginMm + contentWidth, cursorY + 3.5);
            cursorY += 7;
          }
          cursorY += 3;
          continue;
        }
      }

      // 10. Standard Paragraph (p, div, etc.)
      const text = node.textContent?.trim();
      if (text) {
        checkPageBreak(6);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10.5);
        pdf.setTextColor(30, 41, 59);
        const wrapped = pdf.splitTextToSize(text, contentWidth);
        pdf.text(wrapped, marginMm, cursorY);
        cursorY += wrapped.length * 5 + 2.5;
      } else {
        cursorY += 3;
      }
    }
  }

  // Draw header and footer on the final page
  drawHeaderFooter(pageNumber);

  // Trigger download
  const safeTitle = (doc.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  pdf.save(`${safeTitle}.pdf`);
}

/**
 * Trigger native print dialog (which produces 100% vector-sharp PDFs)
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
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; }
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
