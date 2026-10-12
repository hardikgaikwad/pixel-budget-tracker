import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Pixel Confirmation Modal for destructive actions (Delete, Reset).
 * Completely opaque with crisp retro arcade window frame.
 */
export default function PixelModal({
  isOpen,
  title = 'CONFIRM ACTION',
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  isDanger = false,
  onConfirm,
  onCancel
}) {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
    >
      <div
        className={`w-full max-w-md bg-[#0c0c0c] p-6 border-2 ${
          isDanger ? 'border-expense' : 'border-yellow'
        } shadow-[0_0_40px_rgba(0,0,0,0.95)] relative`}
      >
        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={16}
              className={isDanger ? 'text-expense' : 'text-yellow'}
            />
            <h3
              className={`font-arcade text-xs md:text-sm font-bold tracking-wider uppercase ${
                isDanger ? 'text-expense' : 'text-yellow'
              }`}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-text-muted hover:text-white p-1 hover:bg-[#1a1a1a] transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Body */}
        <div className="py-2 mb-6">
          <p className="font-mono text-sm text-text-main leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
          <button
            onClick={onCancel}
            className="pixel-btn-secondary px-3 py-1.5 text-xs font-arcade"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-xs font-arcade font-bold border transition-all ${
              isDanger
                ? 'bg-expense text-black border-expense hover:bg-red-400'
                : 'bg-yellow text-black border-yellow hover:bg-yellow-light'
            }`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
