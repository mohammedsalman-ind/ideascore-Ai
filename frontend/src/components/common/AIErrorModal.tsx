import React from 'react';
import { AlertCircle, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface AIErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export const AIErrorModal: React.FC<AIErrorModalProps> = ({
  isOpen,
  errorMessage,
  onRetry,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121620] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">AI Result Unavailable</h3>
              <p className="text-xs text-zinc-400 font-mono">Evaluation Service Alert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#222a3a] text-xs text-zinc-300 space-y-2">
          <p className="font-medium text-zinc-200">
            We couldn't fetch the AI-generated results right now. Please try again.
          </p>
          {errorMessage && (
            <p className="text-[11px] text-zinc-400 font-mono break-words bg-black/40 p-2 rounded border border-zinc-800">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1a2130] hover:bg-[#232d42] text-zinc-300 border border-[#2c3750] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center space-x-1.5 shadow-glow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
