import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, Bell, X, ArrowRight, AlertTriangle, User } from "lucide-react";

export interface ReservationDueSoonNotification {
  lentItemId: string;
  itemName: string;
  borrowerName: string;
  borrowerRole?: string;
  guestImageUrl?: string | null;
  frontStudentIdPictureUrl?: string | null;
  reservedFor: string;
  message: string;
}

interface Props {
  notifications: ReservationDueSoonNotification[];
  onDismiss: (lentItemId: string) => void;
  onDismissAll: () => void;
}

/**
 * Persistent full-viewport dialog for reservation due-soon alerts.
 *
 * - Backdrop click disabled — staff must explicitly dismiss.
 * - Shows guest photo or student ID picture when available.
 * - "View Reservations" opens the Reservations tab directly.
 */
export default function ReservationDueSoonDialog({
  notifications,
  onDismiss,
  onDismissAll,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [notifications.length]);

  if (notifications.length === 0) return null;

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  const formatFull = (iso: string) => {
    try {
      return new Date(iso).toLocaleString([], {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return iso; }
  };

  const handleViewReservations = () => {
    onDismissAll();
    // Signal PendingReservations to open on the Reservations tab
    sessionStorage.setItem("pendingReservationsTab", "reservations");
    window.location.href = "/home/pending-reservations";
  };

  const modal = (
    <div
      className={`fixed inset-0 z-99999 flex items-center justify-center p-4
        bg-black/75 backdrop-blur-sm transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="due-soon-title"
      aria-describedby="due-soon-desc"
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md
          transition-all duration-300
          ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pulsing amber accent bar */}
        <div className="h-2 w-full bg-amber-400 rounded-t-2xl animate-pulse" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="absolute inline-flex h-12 w-12 rounded-xl bg-amber-300 opacity-40 animate-ping" />
              <div className="relative h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Bell className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div>
              <h2
                id="due-soon-title"
                className="text-base font-bold text-slate-900 leading-tight flex items-center gap-1.5"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                Reservation Due Soon
              </h2>
              <p id="due-soon-desc" className="text-xs text-slate-500 mt-0.5">
                {notifications.length === 1
                  ? "1 reservation is due within 15 minutes — please prepare the item."
                  : `${notifications.length} reservations are due within 15 minutes.`}
              </p>
            </div>
          </div>

          {notifications.length > 1 && (
            <button
              onClick={onDismissAll}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors shrink-0 mt-0.5"
            >
              Dismiss all
            </button>
          )}
        </div>

        {/* Alert cards */}
        <div className="px-6 pb-3 space-y-3 max-h-[60vh] overflow-y-auto">
          {notifications.map((n) => {
            const photoUrl = n.guestImageUrl || n.frontStudentIdPictureUrl || null;
            const isGuest = n.borrowerRole?.toLowerCase() === "guest";
            const roleLabel = isGuest ? "Guest" : (n.borrowerRole ?? "");

            return (
              <div
                key={n.lentItemId}
                className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm"
              >
                {/* Photo or fallback avatar */}
                <div className="shrink-0">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={n.borrowerName}
                      className="h-14 w-14 rounded-xl object-cover border-2 border-amber-200 shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty("display", "flex");
                      }}
                    />
                  ) : null}
                  <div
                    className={`h-14 w-14 rounded-xl bg-amber-100 border-2 border-amber-200 items-center justify-center ${photoUrl ? "hidden" : "flex"}`}
                  >
                    <User className="h-6 w-6 text-amber-500" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 truncate">{n.itemName}</p>
                    {roleLabel && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isGuest
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {roleLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Borrower:{" "}
                    <span className="font-semibold text-slate-700">{n.borrowerName}</span>
                  </p>
                  <p className="text-xs font-bold text-amber-700 mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3 shrink-0" />
                    Due at {formatTime(n.reservedFor)}
                    <span className="text-slate-400 font-normal ml-1">
                      · {formatFull(n.reservedFor)}
                    </span>
                  </p>
                </div>

                {/* Per-card dismiss */}
                <button
                  onClick={() => onDismiss(n.lentItemId)}
                  className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400
                    hover:text-slate-600 hover:bg-amber-100 transition-colors shrink-0"
                  aria-label={`Dismiss alert for ${n.itemName}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="px-6 pb-1 text-center text-[11px] text-slate-400">
          This alert stays open until you dismiss it.
        </p>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={onDismissAll}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600
              text-sm font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all duration-150"
          >
            Dismiss
          </button>
          <button
            onClick={handleViewReservations}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
              active:scale-[0.98] text-white text-sm font-semibold
              transition-all duration-150 shadow-md shadow-amber-200
              flex items-center justify-center gap-2"
          >
            View Reservations
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
