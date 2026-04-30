import { useState } from "react";
import { ChevronDown } from "lucide-react";

type SelectStatusProps = {
  onChangeStatus: (value: string) => void;
  options?: { value: string; label: string }[];
};

const defaultOptions = [
  { value: "all", label: "All" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

export const SelectUserStatus = ({
  onChangeStatus,
  options = defaultOptions,
}: SelectStatusProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(options[0].value);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedStatus(value);
    onChangeStatus(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedStatus)?.label || "Filter";

  return (
    <div className="relative">
      {/* Dropdown button matching role filter style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all duration-200"
      >
        <span className="text-slate-500 font-medium">Filter:</span>
        <span className="text-slate-900">{selectedLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-slate-200 shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    selectedStatus === opt.value
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
