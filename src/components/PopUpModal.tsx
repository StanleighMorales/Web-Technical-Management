import { ArchiveRestore, X, Loader2 } from "lucide-react";

type PopUpModalProps = {
  title: string;
  label: string;
  noun: string;
  destination?: string;
  onHandleCancelAction: () => void;
  onHandleConfirmAction: () => void;
  isLoading?: boolean;
};

export default function PopUpModal({
  title,
  label,
  noun,
  destination,
  onHandleCancelAction,
  onHandleConfirmAction,
  isLoading = false,
}: PopUpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onHandleCancelAction}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-amber-500" />

        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <ArchiveRestore className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {destination ? `Can be reversed from ${destination}` : "Confirm this action"}
                </p>
              </div>
            </div>
            <button
              onClick={onHandleCancelAction}
              className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to{" "}
              <span className="font-semibold text-amber-700">{label}</span> this{" "}
              <span className="font-semibold text-amber-700">{noun}</span>?{" "}
              {destination && (
                <>
                  This action can be reversed from the{" "}
                  <span className="font-semibold text-slate-700">{destination}</span>.
                </>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onHandleCancelAction}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No, cancel
            </button>
            <button
              type="button"
              onClick={onHandleConfirmAction}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-amber-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArchiveRestore className="h-4 w-4" />
                  Yes, {label}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
