import { useEffect, useRef, useState } from "react";
import { ScanLine, XCircle, Loader2 } from "lucide-react";
import { useCreateItemScanSession, useCancelItemScanSession } from "../hooks/itemHooks";
import { getItemScanSessionApi, cancelItemScanSessionApi } from "../api/item_api";

interface Props {
  onClose: () => void;
  /** Called with the raw RFID UID (use as TagUid) and item name when scan completes. */
  onScanned: (rfidUid: string, itemName: string) => void;
}

type ModalStatus = "starting" | "pending" | "failed";

const SESSION_DURATION_SEC = 300;

export default function ScanItemModal({ onClose, onScanned }: Props) {
  const { mutate: createSession } = useCreateItemScanSession();
  const { mutate: cancelSession } = useCancelItemScanSession();

  const [status, setStatus] = useState<ModalStatus>("starting");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs so handleClose always sees the latest values from stale closures
  const sessionIdRef = useRef<string | null>(null);
  const statusRef = useRef<ModalStatus>("starting");

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Start on mount; cancel on unmount only if still genuinely pending
  useEffect(() => {
    startSession();
    return () => {
      cleanup();
      const id = sessionIdRef.current;
      // Only cancel if still pending — not if completed/failed/cancelled
      if (id && (statusRef.current as string) === "pending") {
        cancelItemScanSessionApi(id).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown while pending
  useEffect(() => {
    if (status !== "pending") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [status]);

  function startSession() {
    setStatus("starting");
    setErrorMessage("");
    setTimeLeft(SESSION_DURATION_SEC);
    setSessionId(null);

    createSession(undefined, {
      onSuccess: (session) => {
        setSessionId(session.id);
        setStatus("pending");
        startPolling(session.id);
      },
      onError: (err: any) => {
        setStatus("failed");
        setErrorMessage(
          err?.response?.data?.message ?? err?.message ?? "Failed to start scan session."
        );
      },
    });
  }

  function startPolling(id: string) {
    pollRef.current = setInterval(async () => {
      try {
        const session = await getItemScanSessionApi(id);
        console.log("[ScanItemModal] poll response:", session);

        if (session.status === "Completed") {
          // Mark as completed BEFORE cleanup/close so the unmount guard
          // doesn't fire a spurious DELETE on an already-completed session.
          statusRef.current = "completed" as any;
          cleanup();
          // Guard: rfidUid is required for TagUid submission
          if (!session.rfidUid) {
            setStatus("failed");
            setErrorMessage("Scan completed but no RFID UID was returned. Check the ESP32 sketch sends rfidUid.");
            return;
          }
          onScanned(session.rfidUid, session.itemName ?? "Unknown Item");
          onClose();
        } else if (session.status === "Failed") {
          setStatus("failed");
          setErrorMessage(session.errorMessage ?? "Scan failed on the device.");
          cleanup();
        } else if (session.status === "Cancelled") {
          setStatus("failed");
          setErrorMessage("Session was cancelled.");
          cleanup();
        }
      } catch (err) {
        console.warn("[ScanItemModal] poll error:", err);
        // network hiccup — keep polling
      }
    }, 2000);
  }

  function cleanup() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleClose() {
    cleanup();
    const id = sessionIdRef.current;
    if (id && statusRef.current === "pending") {
      cancelSession(id);
    }
    onClose();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100">
              <ScanLine className="w-4 h-4 text-indigo-600" />
            </span>
            <h2 className="text-sm font-semibold text-slate-800">Scan Item Tag</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-7 flex flex-col items-center text-center gap-4">

          {/* Starting */}
          {status === "starting" && (
            <>
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-slate-600 text-sm font-medium">Creating session...</p>
            </>
          )}

          {/* Pending */}
          {status === "pending" && (
            <>
              <div className="relative flex items-center justify-center w-18 h-18">
                <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-50" />
                <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                  <ScanLine className="w-8 h-8 text-indigo-600" />
                </span>
              </div>

              <div>
                <p className="text-slate-700 font-semibold text-sm">Waiting for item tag...</p>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">
                  Tap the item's <strong>NFC tag</strong> on the RFID scanner. The item will be pre-filled in the form.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100">
                <span className="text-slate-500 text-xs">Expires in</span>
                <span className={`text-sm font-bold tabular-nums ${timeLeft <= 60 ? "text-red-500" : "text-slate-700"}`}>
                  {minutes}:{String(seconds).padStart(2, "0")}
                </span>
              </div>

              <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${(timeLeft / SESSION_DURATION_SEC) * 100}%` }}
                />
              </div>

              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {/* Failed */}
          {status === "failed" && (
            <>
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <XCircle className="w-8 h-8 text-red-500" />
              </span>
              <div>
                <p className="text-slate-800 font-semibold text-sm">Scan failed</p>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">{errorMessage}</p>
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={startSession}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
