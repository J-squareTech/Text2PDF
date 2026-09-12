import React, { useState } from 'react';
import {
  X,
  Table as TableIcon,
  Plus,
  Trash2,
  Palette,
  LayoutGrid,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  ActiveTableContext,
  applyTableStyle,
  insertRowAbove,
  insertRowBelow,
  deleteCurrentRow,
  insertColumnLeft,
  insertColumnRight,
  deleteCurrentColumn,
  deleteTable,
} from '../../utils/tableUtils';

interface TablePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableContext: ActiveTableContext;
  accentColor: string;
  onTableUpdated: () => void;
}

export const TablePropertiesModal: React.FC<TablePropertiesModalProps> = ({
  isOpen,
  onClose,
  tableContext,
  accentColor,
  onTableUpdated,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'modern' | 'striped' | 'bordered' | 'minimal' | 'accent'>('modern');
  const [padding, setPadding] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [fullWidth, setFullWidth] = useState(true);

  if (!isOpen || !tableContext.table) return null;

  const handleApplyStyle = (themeName: 'modern' | 'striped' | 'bordered' | 'minimal' | 'accent') => {
    setSelectedTheme(themeName);
    if (tableContext.table) {
      applyTableStyle(tableContext.table, {
        theme: themeName,
        accentColor,
        padding,
        fullWidth,
      });
      onTableUpdated();
    }
  };

  const handleApplyPadding = (pad: 'compact' | 'normal' | 'relaxed') => {
    setPadding(pad);
    if (tableContext.table) {
      applyTableStyle(tableContext.table, {
        theme: selectedTheme,
        accentColor,
        padding: pad,
        fullWidth,
      });
      onTableUpdated();
    }
  };

  const handleToggleWidth = (isFull: boolean) => {
    setFullWidth(isFull);
    if (tableContext.table) {
      applyTableStyle(tableContext.table, {
        theme: selectedTheme,
        accentColor,
        padding,
        fullWidth: isFull,
      });
      onTableUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <TableIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Table Editor & Design</h3>
              <p className="text-[11px] text-slate-500">
                {tableContext.totalRows} rows × {tableContext.totalCols} columns (Cursor at Row {tableContext.rowIndex + 1}, Col {tableContext.colIndex + 1})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick Row & Column Operations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Rows & Columns Quick Actions</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (tableContext.cell) {
                    insertRowAbove(tableContext.cell);
                    onTableUpdated();
                  }
                }}
                className="p-2 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 text-slate-700 flex items-center space-x-2 transition-colors font-medium"
              >
                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Insert Row Above</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (tableContext.cell) {
                    insertRowBelow(tableContext.cell);
                    onTableUpdated();
                  }
                }}
                className="p-2 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 text-slate-700 flex items-center space-x-2 transition-colors font-medium"
              >
                <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Insert Row Below</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (tableContext.cell) {
                    insertColumnLeft(tableContext.cell);
                    onTableUpdated();
                  }
                }}
                className="p-2 border border-slate-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 flex items-center space-x-2 transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Insert Column Left</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (tableContext.cell) {
                    insertColumnRight(tableContext.cell);
                    onTableUpdated();
                  }
                }}
                className="p-2 border border-slate-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 flex items-center space-x-2 transition-colors font-medium"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>Insert Column Right</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (tableContext.cell) {
                    deleteCurrentRow(tableContext.cell);
                    onTableUpdated();
                  }
                }}
                className="p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-700 flex items-center space-x-2 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Delete Active Row</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (tableContext.cell) {
                    deleteCurrentColumn(tableContext.cell);
                    onTableUpdated();
                  }
                }}
                className="p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-700 flex items-center space-x-2 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Delete Active Column</span>
              </button>
            </div>
          </div>

          {/* Table Design Styles */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Table Visual Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'modern', label: 'Default Clean', desc: 'Standard business style' },
                { id: 'accent', label: 'Theme Accent', desc: 'Colored header background' },
                { id: 'striped', label: 'Zebra Striped', desc: 'Alternating row colors' },
                { id: 'bordered', label: 'Grid Boxed', desc: 'Full solid boundaries' },
                { id: 'minimal', label: 'Minimal Clean', desc: 'Horizontal rules only' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleApplyStyle(th.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedTheme === th.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{th.label}</span>
                    {selectedTheme === th.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{th.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cell Padding & Layout */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cell Padding</label>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                {(['compact', 'normal', 'relaxed'] as const).map((pad) => (
                  <button
                    key={pad}
                    type="button"
                    onClick={() => handleApplyPadding(pad)}
                    className={`flex-1 py-1 text-center capitalize rounded transition-all ${
                      padding === pad ? 'bg-white font-bold text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {pad}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Table Width</label>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleWidth(true)}
                  className={`flex-1 py-1 text-center rounded transition-all ${
                    fullWidth ? 'bg-white font-bold text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  100% Full
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleWidth(false)}
                  className={`flex-1 py-1 text-center rounded transition-all ${
                    !fullWidth ? 'bg-white font-bold text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  85% Centered
                </button>
              </div>
            </div>
          </div>

          {/* Destructive Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to remove the entire table?</span>
            <button
              type="button"
              onClick={() => {
                if (tableContext.table) {
                  deleteTable(tableContext.table);
                  onTableUpdated();
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Delete Entire Table</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Done Editing Table
          </button>
        </div>
      </div>
    </div>
  );
};
