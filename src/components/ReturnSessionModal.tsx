import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { CheckCircle, XCircle, Loader2, ScanLine } from "lucide-react";
import { useCreateReturnSession, useCancelReturnSession } from "../hooks/itemHooks";
import { getReturnSessionApi, cancelReturnSessionApi } from "../api/item_api";
import type { TReturnSession } from "../@types/types";

interface Props {
  onClose: () => void;
}

type ModalStatus = "starting" | "pending" | "completed" | "failed";

const SESSION_DURATION_SEC = 300; // 5 minutes

export default function ReturnSessionModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const { mutate: createSession } = useCreateReturnSession();
  const { mutate: cancelSession } = useCancelReturnSession();

  const [status, setStatus] = useState<ModalStatus>("starting");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<TReturnSession | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs so handleClose always sees the latest values even from stale closures
  const sessionIdRef = useRef<string | null>(null);
  const statusRef = useRef<ModalStatus>("starting");

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Start session on mount; cancel on unmount if still pending
  useEffect(() => {
    startSession();
    return () => {
      cleanup();
      const id = sessionIdRef.current;
      const currentStatus = statusRef.current;
      if (id && currentStatus === "pending") {
        cancelReturnSessionApi(id).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer while pending
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
    setResult(null);
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
          err?.response?.data?.message ?? err?.message ?? "Failed to start return session."
        );
      },
    });
  }

  function startPolling(id: string) {
    pollRef.current = setInterval(async () => {
      try {
        const session = await getReturnSessionApi(id);
        if (session.status === "Completed") {
          setResult(session);
          setStatus("completed");
          cleanup();
          queryClient.invalidateQueries({ queryKey: ["lentItems"] });
        } else if (session.status === "Failed") {
          setStatus("failed");
          setErrorMessage(session.errorMessage ?? "Return failed on the device.");
          cleanup();
        } else if (session.status === "Cancelled") {
          setStatus("failed");
          setErrorMessage("Session was cancelled.");
          cleanup();
        }
      } catch {
        // network hiccup — keep polling
      }
    }, 2000);
  }

  function cleanup() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  /**
   * Single exit handler for every close path.
   * Only fires DELETE when the session is still Pending.
   */
  function handleClose() {
    cleanup();
    const id = sessionIdRef.current;
    const currentStatus = statusRef.current;
    if (id && currentStatus === "pending") {
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100">
            <MdOutlineKeyboardReturn className="text-xl text-emerald-600" />
          </span>
          <h2 className="text-base font-semibold text-slate-800">Start Return Session</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col items-center text-center gap-4">

          {/* Starting */}
          {status === "starting" && (
            <>
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="text-slate-600 font-medium">Creating session...</p>
            </>
          )}

          {/* Pending — waiting for ESP32 */}
          {status === "pending" && (
            <>
              <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-60" />
                <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                  <ScanLine className="w-8 h-8 text-emerald-600" />
                </span>
              </div>

              <div>
                <p className="text-slate-700 font-semibold text-base">
                  Waiting for item scan...
                </p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs">
                  Ask the student to tap the <strong>item NFC tag</strong> on the RFID return station.
                </p>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100">
                <span className="text-slate-500 text-sm">Expires in</span>
                <span className={`text-lg font-bold tabular-nums ${timeLeft <= 60 ? "text-red-500" : "text-slate-700"}`}>
                  {minutes}:{String(seconds).padStart(2, "0")}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${(timeLeft / SESSION_DURATION_SEC) * 100}%` }}
                />
              </div>

              <button
                onClick={handleClose}
                className="mt-2 px-5 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {/* Completed */}
          {status === "completed" && result && (
            <>
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </span>
              <div>
                <p className="text-slate-800 font-semibold text-base">Item returned successfully!</p>
                <p className="text-slate-400 text-sm mt-1">The item has been marked as returned.</p>
              </div>

              <div className="w-full rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-100 text-sm text-left">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Item</span>
                  <span className="font-medium text-slate-800">{result.itemName ?? "—"}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Returned by</span>
                  <span className="font-medium text-slate-800">{result.borrowerName ?? "—"}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-emerald-600">Returned</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            </>
          )}

          {/* Failed */}
          {status === "failed" && (
            <>
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                <XCircle className="w-9 h-9 text-red-500" />
              </span>
              <div>
                <p className="text-slate-800 font-semibold text-base">Session failed</p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs">{errorMessage}</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={startSession}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
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
