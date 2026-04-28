import { useState } from "react";
import { X, ShieldAlert, Clock, Ban, Loader2 } from "lucide-react";

type BlockUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    isPermanent: boolean;
    blockedUntil?: string;
  }) => void;
  userName: string;
  isLoading?: boolean;
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 hover:bg-white focus:bg-white outline-none transition-all focus:ring-4 focus:border-rose-500 focus:ring-rose-500/10";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

export default function BlockUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}: BlockUserModalProps) {
  const [reason, setReason] = useState("");
  const [banType, setBanType] = useState<"temporary" | "permanent">("temporary");
  const [blockedUntil, setBlockedUntil] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      return;
    }

    if (banType === "temporary" && !blockedUntil) {
      return;
    }

    onConfirm({
      reason: reason.trim(),
      isPermanent: banType === "permanent",
      blockedUntil: banType === "temporary" ? blockedUntil : undefined,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      setBanType("temporary");
      setBlockedUntil("");
      onClose();
    }
  };

  // Get minimum datetime (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  // Get maximum datetime (7 days from now)
  const getMaxDateTime = () => {
    const max = new Date();
    max.setDate(max.getDate() + 365); // 1 year max
    return max.toISOString().slice(0, 16);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="h-1 w-full bg-rose-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Block User Account</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Restrict access for {userName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Warning Message */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold text-rose-700">Warning:</span> Blocking this user will prevent them from:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>Logging into the application</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>Borrowing or reserving any items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span>
                <span>Accessing their account and profile</span>
              </li>
            </ul>
          </div>

          {/* Ban Type Selection */}
          <div>
            <label className={labelClass}>
              Block Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBanType("temporary")}
                disabled={isLoading}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  banType === "temporary"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    banType === "temporary"
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-300"
                  }`}
                >
                  {banType === "temporary" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-900">Temporary</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Set an end date</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBanType("permanent")}
                disabled={isLoading}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  banType === "permanent"
                    ? "border-rose-500 bg-rose-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    banType === "permanent"
                      ? "border-rose-500 bg-rose-500"
                      : "border-slate-300"
                  }`}
                >
                  {banType === "permanent" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-semibold text-slate-900">Permanent</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">No expiration</p>
                </div>
              </button>
            </div>
          </div>

          {/* Temporary Ban End Date */}
          {banType === "temporary" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label htmlFor="blockedUntil" className={labelClass}>
                Block Until <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="blockedUntil"
                value={blockedUntil}
                onChange={(e) => setBlockedUntil(e.target.value)}
                min={getMinDateTime()}
                max={getMaxDateTime()}
                required={banType === "temporary"}
                disabled={isLoading}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1.5 ml-1">
                User will be automatically unblocked after this date and time
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label htmlFor="reason" className={labelClass}>
              Reason for Blocking <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for blocking this user account..."
              required
              maxLength={500}
              rows={4}
              disabled={isLoading}
              className={`${inputClass} resize-none`}
            />
            <div className="flex justify-between items-center mt-1.5 px-1">
              <p className="text-xs text-slate-400">
                This reason will be shown to the user when they try to log in
              </p>
              <p className="text-xs text-slate-400">
                {reason.length}/500
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim() || (banType === "temporary" && !blockedUntil)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all shadow-sm shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  Block User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
