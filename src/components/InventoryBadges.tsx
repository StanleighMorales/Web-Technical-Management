import { memo } from "react";

type InventoryBadgesProps = {
  name: string;
  total: number;
  onClick?: () => void;
  isSelected?: boolean;
};

export const InventoryBadges = memo(
  ({ name, total, onClick, isSelected = false }: InventoryBadgesProps) => {
    return (
      <div
        onClick={onClick}
        className={`
          group
          flex flex-row items-center gap-3
          px-4 py-2.5
          rounded-xl
          bg-white/70 backdrop-blur-sm
          border
          shadow-sm
          transition-all duration-200
          cursor-pointer
          min-w-fit
          whitespace-nowrap

          hover:shadow-md hover:scale-105

          ${isSelected
            ? "border-[#2563eb] bg-blue-50/80 shadow-md"
            : "border-[#e5e7eb] hover:border-[#cbd5e1]"
          }
        `}
      >
        <p
          className={`
            text-2xl font-bold
            ${isSelected ? "text-[#1e3a8a]" : "text-[#2563eb]"}
            transition-colors
          `}
        >
          {total}
        </p>

        <h2
          className={`
            text-sm font-semibold
            ${isSelected ? "text-[#1e40af]" : "text-[#64748b]"}
            transition-colors
          `}
        >
          {name}
        </h2>
      </div>
    );
  }
);
