import React from 'react';
import {
  Trash2,
  Table as TableIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Palette,
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
  onOpenTableProperties?: () => void;
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
  onOpenTableProperties,
  onClose,
}) => {
  if (!tableContext.table) return null;

  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xs text-white px-2 sm:px-3 py-1 flex items-center justify-between shadow-md border-b border-slate-700/80 text-xs select-none shrink-0 z-20 overflow-x-auto no-scrollbar gap-1.5 animate-in fade-in duration-150">
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
        {/* Compact Table Badge */}
        <div className="flex items-center space-x-1 text-blue-400 font-semibold pr-1.5 border-r border-slate-700/80 text-[11px] shrink-0">
          <TableIcon className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Table</span>
          <span className="text-[10px] text-slate-300 font-mono bg-slate-800 px-1 py-0.2 rounded">
            {tableContext.rowIndex + 1},{tableContext.colIndex + 1}
          </span>
        </div>

        {/* Row Operations */}
        <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-700/80 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-0.5 hidden sm:inline">R:</span>
          <button
            onMouseDown={preventBlur}
            onClick={onInsertRowAbove}
            className="p-1 sm:px-1.5 sm:py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
            title="Insert row above"
          >
            <ArrowUp className="w-3 h-3 text-blue-400" />
            <span className="hidden md:inline">+Row</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onInsertRowBelow}
            className="p-1 sm:px-1.5 sm:py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
            title="Insert row below"
          >
            <ArrowDown className="w-3 h-3 text-blue-400" />
            <span className="hidden md:inline">+Row</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onDeleteRow}
            className="p-1 sm:px-1.5 sm:py-0.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded flex items-center space-x-0.5 transition-colors cursor-pointer text-[11px]"
            title="Delete this row"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span className="hidden md:inline">Row</span>
          </button>
        </div>

        {/* Column Operations */}
        <div className="flex items-center space-x-0.5 pr-1.5 border-r border-slate-700/80 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-0.5 hidden sm:inline">C:</span>
          <button
            onMouseDown={preventBlur}
            onClick={onInsertColLeft}
            className="p-1 sm:px-1.5 sm:py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
            title="Insert column left"
          >
            <ArrowLeft className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">+Col</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onInsertColRight}
            className="p-1 sm:px-1.5 sm:py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
            title="Insert column right"
          >
            <ArrowRight className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">+Col</span>
          </button>

          <button
            onMouseDown={preventBlur}
            onClick={onDeleteCol}
            className="p-1 sm:px-1.5 sm:py-0.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded flex items-center space-x-0.5 transition-colors cursor-pointer text-[11px]"
            title="Delete this column"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span className="hidden md:inline">Col</span>
          </button>
        </div>

        {/* Table Design & Theme Button */}
        {onOpenTableProperties && (
          <button
            onMouseDown={preventBlur}
            onClick={onOpenTableProperties}
            className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center space-x-1 transition-colors font-medium text-[11px] cursor-pointer shrink-0"
            title="Style & Presets"
          >
            <Palette className="w-3 h-3" />
            <span className="hidden xs:inline">Style</span>
          </button>
        )}

        {/* Delete Entire Table */}
        <button
          onMouseDown={preventBlur}
          onClick={onDeleteTable}
          className="p-1 sm:px-2 sm:py-0.5 bg-red-700/80 hover:bg-red-600 text-white rounded flex items-center space-x-1 transition-colors text-[11px] font-medium cursor-pointer shrink-0"
          title="Delete Table"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer ml-1 shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
