/**
 * AppToast — centralised toast helper
 *
 * Every call produces a rich notification that matches the design:
 *   ┌──────────────────────────────────────┐
 *   │ [icon]  Title                    [x] │
 *   │  ●  Detail message                   │
 *   │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ │
 *   └──────────────────────────────────────┘
 *
 * Usage:
 *   import { showToast } from "../components/AppToast";
 *
 *   showToast.success("Reservation Approved", "Your request has been approved!");
 *   showToast.error("Action Failed", "Could not process the request.");
 *   showToast.warning("Reservation Expired", "The reservation window has passed.");
 *   showToast.info("New Request", "A new borrow request is waiting.");
 */

import { toast, type ToastOptions } from "react-toastify";
import { CheckSquare, XCircle, AlertTriangle, Bell } from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────

const THEMES = {
  success: {
    bg: "#f0fdf4",
    border: "#16a34a",
    titleColor: "#15803d",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    progressColor: "#16a34a",
    Icon: CheckSquare,
    animation: "none",
  },
  error: {
    bg: "#fef2f2",
    border: "#dc2626",
    titleColor: "#b91c1c",
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    progressColor: "#dc2626",
    Icon: XCircle,
    animation: "none",
  },
  warning: {
    bg: "#fffbeb",
    border: "#d97706",
    titleColor: "#b45309",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    progressColor: "#d97706",
    Icon: AlertTriangle,
    animation: "none",
  },
  info: {
    bg: "#eff6ff",
    border: "#2563eb",
    titleColor: "#1d4ed8",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    progressColor: "#2563eb",
    Icon: Bell,
    animation: "pulse",
  },
} as const;

type ToastVariant = keyof typeof THEMES;

// ── Toast body component ──────────────────────────────────────────────────────

interface ToastBodyProps {
  title: string;
  detail?: string;
  variant: ToastVariant;
}

function ToastBody({ title, detail, variant }: ToastBodyProps) {
  const theme = THEMES[variant];
  const { Icon } = theme;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "2px 0" }}>
      {/* Circle icon with animation for info variant */}
      <div
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: theme.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
          animation: theme.animation === "pulse" ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
        }}
      >
        <Icon size={17} color={theme.iconColor} strokeWidth={2.5} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 700,
            color: theme.titleColor,
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
        {detail && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: "#374151",
              lineHeight: 1.45,
            }}
          >
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Shared toast options builder ──────────────────────────────────────────────

function buildOptions(
  variant: ToastVariant,
  overrides?: Partial<ToastOptions>,
): ToastOptions {
  const theme = THEMES[variant];
  return {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: theme.bg,
      border: `1.5px solid ${theme.border}`,
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      padding: "12px 14px",
    },
    progressClassName: "!bg-[" + theme.progressColor + "]",
    ...overrides,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export const showToast = {
  success(title: string, detail?: string, options?: Partial<ToastOptions>) {
    toast.success(
      <ToastBody title={title} detail={detail} variant="success" />,
      buildOptions("success", options),
    );
  },

  error(title: string, detail?: string, options?: Partial<ToastOptions>) {
    toast.error(
      <ToastBody title={title} detail={detail} variant="error" />,
      buildOptions("error", options),
    );
  },

  warning(title: string, detail?: string, options?: Partial<ToastOptions>) {
    toast.warning(
      <ToastBody title={title} detail={detail} variant="warning" />,
      buildOptions("warning", options),
    );
  },

  info(title: string, detail?: string, options?: Partial<ToastOptions>) {
    toast.info(
      <ToastBody title={title} detail={detail} variant="info" />,
      buildOptions("info", options),
    );
  },
};
