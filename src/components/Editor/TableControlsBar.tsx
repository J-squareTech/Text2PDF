import React from 'react';
import {
  Plus,
  Trash2,
  Table as TableIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  X,
} from 'lucide-react';
import { ActiveTableContext } from '../../utils/tableUtils';

interface TableControlsBarProps {
  tableContext: ActiveTableContext;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onDeleteRow: () => void;
  onInsertColLeft: () => void;
  onInsertColRight: () => void;
  onDeleteCol: () => void;
  onDeleteTable: () => void;
  onClose?: () => void;
}

export const TableControlsBar: React.FC<TableControlsBarProps> = ({
  tableContext,
  onInsertRowAbove,
  onInsertRowBelow,
  onDeleteRow,
  onInsertColLeft,
  onInsertColRight,
  onDeleteCol,
  onDeleteTable,
  onClose,
}) => {
  if (!tableContext.table) return null;

  // Prevent button clicks from stealing editor focus
  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-slate-900 text-white px-3 py-1.5 flex items-center justify-between shadow-md border-b border-slate-700 text-xs select-none shrink-0 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {/* Table Badge */}
        <div className="flex items-center space-x-1 text-blue-400 font-semibold pr-2 border-r border-slate-700 shrink-0">
          <TableIcon className="w-3.5 h-3.5" />
          <span>Table Tools</span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
            Row {tableContext.rowIndex + 1}/{tableContext.totalRows}, Col {tableContext.colIndex + 1}/{tableContext.totalCols}
          </span>
        </div>

        {/* Row Operations */}
        <div className="flex items-center space-x-1 pr-2 border-r border-slate-700 shrink-0">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Rows:</span>
          <button
            onMouseDown={preventBlur}
            onClick={onInsertRowAbove}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors"
            title="Insert row above current row"
          >
            <ArrowUp className="w-3 h-3 text-blue-400" />
            <span>+ Above</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onInsertRowBelow}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors"
            title="Insert row below current row"
          >
            <ArrowDown className="w-3 h-3 text-blue-400" />
            <span>+ Below</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onDeleteRow}
            className="px-2 py-1 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded flex items-center space-x-1 transition-colors"
            title="Delete this row"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span>- Row</span>
          </button>
        </div>

        {/* Column Operations */}
        <div className="flex items-center space-x-1 pr-2 border-r border-slate-700 shrink-0">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Cols:</span>
          <button
            onMouseDown={preventBlur}
            onClick={onInsertColLeft}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors"
            title="Insert column to the left"
          >
            <ArrowLeft className="w-3 h-3 text-emerald-400" />
            <span>+ Left</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onInsertColRight}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors"
            title="Insert column to the right"
          >
            <ArrowRight className="w-3 h-3 text-emerald-400" />
            <span>+ Right</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onDeleteCol}
            className="px-2 py-1 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded flex items-center space-x-1 transition-colors"
            title="Delete this column"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span>- Col</span>
          </button>
        </div>

        {/* Delete Entire Table */}
        <div className="flex items-center shrink-0">
          <button
            onMouseDown={preventBlur}
            onClick={onDeleteTable}
            className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded flex items-center space-x-1 transition-colors font-semibold"
            title="Delete entire table"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete Table</span>
          </button>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors ml-2"
          title="Dismiss table tools"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
