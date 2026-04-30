import { useEffect, useRef, useState } from "react";
import type { TStudentRfidSession } from "../@types/types";
import {
  useCreateStudentRfidSession,
  useCancelStudentRfidSession,
} from "../hooks/userHooks";
import { getStudentRfidSessionApi } from "../api/user_api";
import { showToast } from "./AppToast";
import {
  X,
  Wifi,
  CheckCircle2,
  XCircle,
  Loader2,
  CreditCard,
} from "lucide-react";

type RfidStatus = "idle" | "starting" | "pending" | "completed" | "failed" | "cancelled";

type RegisterStudentRfidModalProps = {
  studentId: string;
  studentName: string;
  existingRfidCode?: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export const RegisterStudentRfidModal = ({
  studentId,
  studentName,
  existingRfidCode,
  onClose,
  onSuccess,
}: RegisterStudentRfidModalProps) => {
  const [status, setStatus] = useState<RfidStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState<TStudentRfidSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutate: createSession } = useCreateStudentRfidSession();
  const { mutate: cancelSession } = useCancelStudentRfidSession();

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, []);

  // Countdown timer while pending
  useEffect(() => {
    if (status !== "pending") return;
    setTimeLeft(300);
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

  const cleanup = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startPolling = (sessionId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const s: TStudentRfidSession = await getStudentRfidSessionApi(sessionId);
        setSession(s);
        if (s.status === "Completed") {
          cleanup();
          setStatus("completed");
          showToast.success("RFID Registered", `RFID card assigned to ${studentName} successfully!`);
          onSuccess();
        } else if (s.status === "Failed") {
          cleanup();
          setStatus("failed");
          setErrorMessage(s.errorMessage || "Registration failed.");
        } else if (s.status === "Cancelled" || s.status === "Expired") {
          cleanup();
          setStatus("cancelled");
        }
      } catch {
        // Network hiccup — keep polling
      }
    }, 2000);
  };

  const handleStart = () => {
    setStatus("starting");
    setErrorMessage("");
    createSession(studentId, {
      onSuccess: (s: TStudentRfidSession) => {
        setSession(s);
        setStatus("pending");
        startPolling(s.id);
      },
      onError: (err: any) => {
        setStatus("failed");
        setErrorMessage(err?.response?.data?.message || "Failed to start session.");
      },
    });
  };

  const handleCancel = () => {
    cleanup();
    if (session?.id) {
      cancelSession(session.id);
    }
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Register RFID Card</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate max-w-[180px]">{studentName}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center gap-5 text-center">

          {/* Existing RFID badge */}
          {existingRfidCode && status !== "completed" && (
            <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
              <CreditCard className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-amber-700">Current RFID</p>
                <p className="text-xs text-amber-600 font-mono truncate">{existingRfidCode}</p>
              </div>
            </div>
          )}

          {/* Status icon */}
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
            status === "completed" ? "bg-green-100" :
            status === "failed" || status === "cancelled" ? "bg-rose-100" :
            status === "pending" || status === "starting" ? "bg-violet-100" :
            "bg-slate-100"
          }`}>
            {status === "completed" ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : status === "failed" || status === "cancelled" ? (
              <XCircle className="h-8 w-8 text-rose-500" />
            ) : status === "pending" || status === "starting" ? (
              <Wifi className="h-8 w-8 text-violet-600 animate-pulse" />
            ) : (
              <CreditCard className="h-8 w-8 text-slate-400" />
            )}
          </div>

          {/* Status message */}
          {status === "idle" && (
            <>
              <p className="text-sm font-semibold text-slate-700">Ready to register</p>
              <p className="text-xs text-slate-500 max-w-xs">
                {existingRfidCode
                  ? "Click below to replace the current RFID card."
                  : "Click below to start the session, then ask the student to tap their RFID card on the reader."}
              </p>
            </>
          )}

          {status === "starting" && (
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Starting session…
            </p>
          )}

          {status === "pending" && session && (
            <>
              <p className="text-sm font-semibold text-slate-700">Waiting for card tap…</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Ask the student to tap their RFID card on the registration reader.
              </p>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-slate-800 tabular-nums">
                  {minutes}:{String(seconds).padStart(2, "0")}
                </span>
                <span className="text-xs text-slate-400">remaining</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />
                <span className="text-xs text-violet-600">Polling for scan…</span>
              </div>
            </>
          )}

          {status === "completed" && (
            <>
              <p className="text-sm font-semibold text-green-700">RFID card registered!</p>
              <p className="text-xs text-slate-500">The card has been assigned to this student.</p>
            </>
          )}

          {status === "failed" && (
            <>
              <p className="text-sm font-semibold text-rose-600">Registration failed</p>
              <p className="text-xs text-slate-500 max-w-xs">{errorMessage || "Something went wrong. Try again."}</p>
            </>
          )}

          {status === "cancelled" && (
            <>
              <p className="text-sm font-semibold text-rose-600">Session expired or cancelled</p>
              <p className="text-xs text-slate-500">The session timed out. Start a new one.</p>
            </>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center w-full">
            {(status === "idle" || status === "failed" || status === "cancelled") && (
              <button
                type="button"
                onClick={handleStart}
                className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-violet-700 transition-colors"
              >
                {status === "idle"
                  ? existingRfidCode ? "Replace RFID Card" : "Start Session"
                  : "Try Again"}
              </button>
            )}
            {status === "pending" && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 text-sm font-semibold rounded-xl hover:bg-rose-100 transition-colors"
              >
                Cancel
              </button>
            )}
            {status === "completed" && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            )}
            {(status === "idle" || status === "failed" || status === "cancelled") && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
