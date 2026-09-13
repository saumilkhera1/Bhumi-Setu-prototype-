import React from 'react';
import { X, Command, CornerDownLeft, ArrowRight, CheckSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Tab', desc: 'Navigate to next extracted field in workspace' },
    { key: 'Shift + Tab', desc: 'Navigate to previous extracted field' },
    { key: 'Enter', desc: 'Confirm & save currently edited field correction' },
    { key: 'Esc', desc: 'Cancel editing or close open modal / side pane' },
    { key: 'Ctrl / ⌘ + S', desc: 'Save all pending field corrections' },
    { key: 'Alt + A', desc: 'Approve land record & commit sovereign seal' },
    { key: 'Alt + R', desc: 'Reject or flag record for discrepancy resurvey' },
    { key: 'Space', desc: 'Toggle high-contrast / binarized document filter' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Command className="w-4 h-4 text-slate-700" />
            <span>Officer Verification Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 my-3">
          Designed for high-speed rapid clerical validation of scanned cadastral folios without mouse reliance.
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2 flex items-center justify-between">
              <span className="text-slate-600">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-800 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0f172a] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
