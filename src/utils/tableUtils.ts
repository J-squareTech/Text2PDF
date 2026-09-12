/**
 * Utilities for manipulating HTML tables in contentEditable WYSIWYG editor
 */

export interface ActiveTableContext {
  table: HTMLTableElement | null;
  row: HTMLTableRowElement | null;
  cell: HTMLTableCellElement | null;
  rowIndex: number;
  colIndex: number;
  totalRows: number;
  totalCols: number;
}

/**
 * Detect whether current cursor / selection is inside a table within the editor
 */
export function getActiveTableContext(editorEl: HTMLElement | null): ActiveTableContext {
  const result: ActiveTableContext = {
    table: null,
    row: null,
    cell: null,
    rowIndex: -1,
    colIndex: -1,
    totalRows: 0,
    totalCols: 0,
  };

  if (!editorEl) return result;

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return result;

  let node: Node | null = sel.anchorNode;
  if (!node) return result;

  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  const element = node as HTMLElement;
  if (!element || !editorEl.contains(element)) return result;

  const cell = element.closest('td, th') as HTMLTableCellElement | null;
  if (!cell) return result;

  const row = cell.closest('tr') as HTMLTableRowElement | null;
  const table = cell.closest('table') as HTMLTableElement | null;

  if (!table || !editorEl.contains(table)) return result;

  result.table = table;
  result.row = row;
  result.cell = cell;
  result.rowIndex = row ? row.rowIndex : -1;
  result.colIndex = cell.cellIndex;
  result.totalRows = table.rows.length;
  result.totalCols = row ? row.cells.length : 0;

  return result;
}

/**
 * Generate standard clean table HTML with specified rows & cols
 */
export function createTableHtml(rows: number = 3, cols: number = 3, withHeader: boolean = true): string {
  const rCount = Math.max(1, Math.min(rows, 12));
  const cCount = Math.max(1, Math.min(cols, 8));

  let html = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1.5px solid #94a3b8; font-size: 0.95em;">`;

  if (withHeader) {
    html += `<thead><tr style="background-color: #f1f5f9;">`;
    for (let c = 0; c < cCount; c++) {
      html += `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-weight: 700; color: #0f172a;">Header ${c + 1}</th>`;
    }
    html += `</tr></thead>`;
  }

  html += `<tbody>`;
  const bodyRows = withHeader ? rCount - 1 : rCount;
  for (let r = 0; r < Math.max(1, bodyRows); r++) {
    const bg = r % 2 === 1 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;';
    html += `<tr style="${bg}">`;
    for (let c = 0; c < cCount; c++) {
      html += `<td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; color: #334155;">Data</td>`;
    }
    html += `</tr>`;
  }
  html += `</tbody></table><p><br/></p>`;

  return html;
}

/**
 * Insert a row above the current cell
 */
export function insertRowAbove(cell: HTMLTableCellElement): void {
  const row = cell.closest('tr');
  const table = cell.closest('table');
  if (!row || !table) return;

  const colCount = Math.max(1, row.cells.length);
  const newRow = document.createElement('tr');
  newRow.style.backgroundColor = '#ffffff';

  for (let i = 0; i < colCount; i++) {
    const td = document.createElement('td');
    td.style.border = '1px solid #cbd5e1';
    td.style.padding = '8px 12px';
    td.style.color = '#334155';
    td.innerHTML = '<br/>';
    newRow.appendChild(td);
  }

  row.parentNode?.insertBefore(newRow, row);
}

/**
 * Insert a row below the current cell
 */
export function insertRowBelow(cell: HTMLTableCellElement): void {
  const row = cell.closest('tr');
  const table = cell.closest('table');
  if (!row || !table) return;

  const colCount = Math.max(1, row.cells.length);
  const newRow = document.createElement('tr');
  newRow.style.backgroundColor = '#ffffff';

  for (let i = 0; i < colCount; i++) {
    const td = document.createElement('td');
    td.style.border = '1px solid #cbd5e1';
    td.style.padding = '8px 12px';
    td.style.color = '#334155';
    td.innerHTML = '<br/>';
    newRow.appendChild(td);
  }

  if (row.nextSibling) {
    row.parentNode?.insertBefore(newRow, row.nextSibling);
  } else {
    row.parentNode?.appendChild(newRow);
  }
}

/**
 * Delete current row
 */
export function deleteCurrentRow(cell: HTMLTableCellElement): void {
  const row = cell.closest('tr');
  const table = cell.closest('table');
  if (!row || !table) return;

  if (table.rows.length <= 1) {
    table.remove();
    return;
  }

  row.remove();
}

/**
 * Insert a column to the left of the current cell
 */
export function insertColumnLeft(cell: HTMLTableCellElement): void {
  const table = cell.closest('table');
  if (!table) return;

  const colIndex = cell.cellIndex;

  for (let i = 0; i < table.rows.length; i++) {
    const r = table.rows[i];
    const isHeader = r.parentElement?.tagName.toLowerCase() === 'thead' || r.querySelector('th') !== null;
    const newCell = document.createElement(isHeader ? 'th' : 'td');

    newCell.style.border = '1px solid #cbd5e1';
    newCell.style.padding = '8px 12px';
    if (isHeader) {
      newCell.style.backgroundColor = '#f1f5f9';
      newCell.style.fontWeight = '700';
      newCell.style.color = '#0f172a';
      newCell.textContent = `Header`;
    } else {
      newCell.style.color = '#334155';
      newCell.innerHTML = '<br/>';
    }

    if (r.cells[colIndex]) {
      r.insertBefore(newCell, r.cells[colIndex]);
    } else {
      r.appendChild(newCell);
    }
  }
}

/**
 * Insert a column to the right of the current cell
 */
export function insertColumnRight(cell: HTMLTableCellElement): void {
  const table = cell.closest('table');
  if (!table) return;

  const colIndex = cell.cellIndex;

  for (let i = 0; i < table.rows.length; i++) {
    const r = table.rows[i];
    const isHeader = r.parentElement?.tagName.toLowerCase() === 'thead' || r.querySelector('th') !== null;
    const newCell = document.createElement(isHeader ? 'th' : 'td');

    newCell.style.border = '1px solid #cbd5e1';
    newCell.style.padding = '8px 12px';
    if (isHeader) {
      newCell.style.backgroundColor = '#f1f5f9';
      newCell.style.fontWeight = '700';
      newCell.style.color = '#0f172a';
      newCell.textContent = `Header`;
    } else {
      newCell.style.color = '#334155';
      newCell.innerHTML = '<br/>';
    }

    const nextCell = r.cells[colIndex + 1];
    if (nextCell) {
      r.insertBefore(newCell, nextCell);
    } else {
      r.appendChild(newCell);
    }
  }
}

/**
 * Delete current column across all rows
 */
export function deleteCurrentColumn(cell: HTMLTableCellElement): void {
  const table = cell.closest('table');
  if (!table) return;

  const colIndex = cell.cellIndex;

  for (let i = table.rows.length - 1; i >= 0; i--) {
    const r = table.rows[i];
    if (r.cells[colIndex]) {
      r.deleteCell(colIndex);
    }
  }

  // If table has no columns left, delete table
  if (table.rows.length > 0 && table.rows[0].cells.length === 0) {
    table.remove();
  }
}

/**
 * Delete entire table
 */
export function deleteTable(table: HTMLTableElement): void {
  table.remove();
}
