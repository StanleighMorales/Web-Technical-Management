import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TbPackages } from "react-icons/tb";
import { CheckCircle, XCircle, Loader2, CreditCard } from "lucide-react";
import { useCreateBorrowSession, useCancelBorrowSession } from "../hooks/itemHooks";
import { getBorrowSessionApi, cancelBorrowSessionApi } from "../api/item_api";
import type { TBorrowSession } from "../@types/types";

interface Props {
  onClose: () => void;
}

type ModalStatus = "starting" | "pending" | "completed" | "failed";

const SESSION_DURATION_SEC = 300; // 5 minutes

export default function BorrowSessionModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const { mutate: createSession } = useCreateBorrowSession();
  const { mutate: cancelSession } = useCancelBorrowSession();

  const [status, setStatus] = useState<ModalStatus>("starting");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<TBorrowSession | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start session on mount; cancel on unmount if still pending
  useEffect(() => {
    startSession();
    return () => {
      cleanup();
      // If the component unmounts while a session is pending (e.g. route change),
      // fire the delete so the ESP32 doesn't pick up a ghost session.
      const id = sessionIdRef.current;
      const currentStatus = statusRef.current;
      if (id && currentStatus === "pending") {
        cancelBorrowSessionApi(id).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer while pending
  useEffect(() => {
    if (status !== "pending") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
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
          err?.response?.data?.message ?? err?.message ?? "Failed to start borrow session."
        );
      },
    });
  }

  function startPolling(id: string) {
    pollRef.current = setInterval(async () => {
      try {
        const session = await getBorrowSessionApi(id);
        if (session.status === "Completed") {
          setResult(session);
          setStatus("completed");
          cleanup();
          queryClient.invalidateQueries({ queryKey: ["lentItems"] });
        } else if (session.status === "Failed") {
          setStatus("failed");
          setErrorMessage(session.errorMessage ?? "Borrow failed on the device.");
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

  // Ref so handleClose always sees the latest sessionId and status
  const sessionIdRef = useRef<string | null>(null);
  const statusRef = useRef<ModalStatus>("starting");

  // Keep refs in sync
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { statusRef.current = status; }, [status]);

  function cleanup() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  /**
   * Single close handler for every exit path.
   * Calls DELETE only when the session is still Pending — no point
   * cancelling a session that already Completed, Failed, or was never created.
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
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100">
            <TbPackages className="text-xl text-blue-600" />
          </span>
          <h2 className="text-base font-semibold text-slate-800">Start Borrow Session</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col items-center text-center gap-4">

          {/* Starting */}
          {status === "starting" && (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-slate-600 font-medium">Creating session...</p>
            </>
          )}

          {/* Pending — waiting for ESP32 */}
          {status === "pending" && (
            <>
              <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-60" />
                <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </span>
              </div>

              <div>
                <p className="text-slate-700 font-semibold text-base">
                  Waiting for RFID scan...
                </p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs">
                  Ask the student to tap their <strong>ID card</strong>, then the <strong>item tag</strong> on the RFID station.
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
                  className="h-full rounded-full bg-blue-500 transition-all duration-1000"
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
                <p className="text-slate-800 font-semibold text-base">Borrow request submitted!</p>
                <p className="text-slate-400 text-sm mt-1">The item is now pending approval.</p>
              </div>

              <div className="w-full rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-100 text-sm text-left">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Student</span>
                  <span className="font-medium text-slate-800">{result.studentName ?? "—"}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Item</span>
                  <span className="font-medium text-slate-800">{result.itemName ?? "—"}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-emerald-600">Pending approval</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
