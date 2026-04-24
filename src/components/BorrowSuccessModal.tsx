import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type BorrowSuccessModalProps = {
  /** "Borrow Completed", "Reservation Submitted", etc. */
  title?: string;
  message?: string;
  /** Called when the user dismisses or the auto-close fires */
  onClose: () => void;
  /** Auto-close after this many ms. Pass 0 to disable. Default: 4000 */
  autoCloseMs?: number;
};

/**
 * Full-screen overlay dialog rendered via React Portal directly into
 * document.body so it always covers the entire viewport — including the
 * page header, tabs, and sidebar — regardless of where it is used in the
 * component tree.
 */
export const BorrowSuccessModal = ({
  title = "Borrow Completed",
  message = "The item has been successfully recorded.",
  onClose,
  autoCloseMs = 4000,
}: BorrowSuccessModalProps) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Trigger entrance animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Progress bar + auto-close
  useEffect(() => {
    if (!autoCloseMs) return;

    const interval = 50;
    const step = (interval / autoCloseMs) * 100;

    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p - step;
        if (next <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoCloseMs, onClose]);

  const modal = (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4
        bg-black/60 backdrop-blur-sm
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrow-success-title"
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8
          flex flex-col items-center gap-5 text-center
          transition-all duration-300
          ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Animated checkmark ─────────────────────────────────────── */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-28 w-28 rounded-full bg-green-400 opacity-20 animate-ping" />
          <svg
            className="w-24 h-24"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 145,
                strokeDashoffset: 145,
                animation: "drawCircle 0.5s ease-out 0.1s forwards",
              }}
            />
            <polyline
              points="14,27 22,35 38,18"
              stroke="#22c55e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: 40,
                animation: "drawCheck 0.35s ease-out 0.55s forwards",
              }}
            />
          </svg>
        </div>

        {/* ── Text ───────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <h2
            id="borrow-success-title"
            className="text-2xl font-bold text-gray-900 tracking-tight"
          >
            {title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* ── Dismiss button ─────────────────────────────────────────── */}
        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600
            text-white font-semibold text-sm transition-colors focus:outline-none
            focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Done
        </button>

        {/* ── Auto-close progress bar ────────────────────────────────── */}
        {autoCloseMs > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden bg-gray-100">
            <div
              className="h-full bg-green-400 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes drawCircle { to { stroke-dashoffset: 0; } }
        @keyframes drawCheck  { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );

  return createPortal(modal, document.body);
};
