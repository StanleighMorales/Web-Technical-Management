import { useState } from "react";
import { FaWifi } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import { MdOutlineKeyboardReturn, MdLocationOn } from "react-icons/md";

type ActiveMode = "borrow" | "return" | "location" | null;

export default function RfidControllerModule() {
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);

  const modes = [
    {
      key: "borrow" as const,
      label: "Borrow",
      description: "Scan RFID tag to register a borrow transaction.",
      icon: TbPackages,
      color: "blue",
    },
    {
      key: "return" as const,
      label: "Return",
      description: "Scan RFID tag to process an item return.",
      icon: MdOutlineKeyboardReturn,
      color: "green",
    },
    {
      key: "location" as const,
      label: "Location",
      description: "Scan RFID tag to track or update item location.",
      icon: MdLocationOn,
      color: "orange",
    },
  ];

  const colorMap = {
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
    orange: {
      btn: "bg-orange-500 hover:bg-orange-600 shadow-orange-400/30",
      activeBorder: "border-orange-400 ring-2 ring-orange-200",
      badge: "bg-orange-100 text-orange-700",
      icon: "text-orange-500",
      iconBg: "bg-orange-50",
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
          <h1 className="text-2xl font-bold text-slate-800">RFID Controller</h1>
          <p className="text-sm text-slate-500">Select a mode to begin scanning</p>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {modes.map((mode) => {
          const c = colorMap[mode.color];
          const isActive = activeMode === mode.key;
          return (
            <button
              key={mode.key}
              onClick={() => setActiveMode(isActive ? null : mode.key)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 cursor-pointer
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
    </div>
  );
}
