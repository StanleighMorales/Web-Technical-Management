import { useState } from "react";
import type React from "react";
import { FaWifi } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import BorrowSessionModal from "./BorrowSessionModal";
import ReturnSessionModal from "./ReturnSessionModal";

type ActiveMode = "borrow" | "return" | null;
type ModeColor = "blue" | "green";

export default function RfidControllerModule() {
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const modes: { key: NonNullable<ActiveMode>; label: string; description: string; icon: React.ElementType; color: ModeColor }[] = [
    {
      key: "borrow",
      label: "Borrow",
      description: "Scan RFID tag to register a borrow transaction.",
      icon: TbPackages,
      color: "blue",
    },
    {
      key: "return",
      label: "Return",
      description: "Scan RFID tag to process an item return.",
      icon: MdOutlineKeyboardReturn,
      color: "green",
    },
  ];

  const colorMap: Record<ModeColor, { btn: string; activeBorder: string; badge: string; icon: string; iconBg: string }> = {
    blue: {
      btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
      activeBorder: "border-blue-500 ring-2 ring-blue-200",
      badge: "bg-blue-100 text-blue-700",
      icon: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    green: {
      btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      icon: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  };

  const active = modes.find((m) => m.key === activeMode);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-100">
          <FaWifi className="text-2xl text-blue-600" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Scan Controller</h1>
          <p className="text-sm text-slate-500">Select a mode to begin scanning</p>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {modes.map((mode) => {
          const c = colorMap[mode.color];
          const isActive = activeMode === mode.key;
          return (
            <button
              key={mode.key}
              onClick={() => {
                if (mode.key === "borrow") {
                  setShowBorrowModal(true);
                  setActiveMode("borrow");
                } else if (mode.key === "return") {
                  setShowReturnModal(true);
                  setActiveMode("return");
                }
              }}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 cursor-pointer w-full sm:w-52
                ${isActive ? c.activeBorder : "border-slate-200 hover:border-slate-300 hover:shadow-md"}`}
            >
              <span className={`flex items-center justify-center w-14 h-14 rounded-2xl ${c.iconBg}`}>
                <mode.icon className={`text-3xl ${c.icon}`} />
              </span>
              <span className="text-base font-semibold text-slate-700">{mode.label}</span>
              {isActive && (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${c.badge}`}>
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Mode Panel */}
      {active ? (
        <div
          className={`rounded-2xl border-2 bg-white shadow-sm p-8 flex flex-col items-center gap-4 text-center transition-all duration-300 ${colorMap[active.color].activeBorder}`}
        >
          <span className={`flex items-center justify-center w-16 h-16 rounded-2xl ${colorMap[active.color].iconBg}`}>
            <active.icon className={`text-4xl ${colorMap[active.color].icon}`} />
          </span>
          <h2 className="text-lg font-semibold text-slate-700">{active.label} Mode</h2>
          <p className="text-slate-400 max-w-sm text-sm">{active.description}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Waiting for RFID scan...
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 flex flex-col items-center gap-3 text-center min-h-[180px] justify-center">
          <FaWifi className="text-4xl text-slate-300" />
          <p className="text-slate-400 text-sm">Select a mode above to activate the RFID scanner.</p>
        </div>
      )}

      {/* Borrow Session Modal */}
      {showBorrowModal && (
        <BorrowSessionModal
          onClose={() => {
            setShowBorrowModal(false);
            setActiveMode(null);
          }}
        />
      )}

      {/* Return Session Modal */}
      {showReturnModal && (
        <ReturnSessionModal
          onClose={() => {
            setShowReturnModal(false);
            setActiveMode(null);
          }}
        />
      )}
    </div>
  );
}
