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
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={`
          group
          flex flex-row items-center gap-3
          px-4 py-2
          m-2
          rounded-2xl
          bg-white/80 backdrop-blur-md
          border-2
          shadow-sm
          transition-all duration-200 ease-out
          cursor-pointer
          min-w-fit
          whitespace-nowrap
          outline-none
          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400

          hover:shadow-lg hover:scale-[1.02]

          ${isSelected
            ? "border-blue-500 bg-blue-50/90 shadow-md ring-2 ring-blue-200/50"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
          }
        `}
      >
        <span
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
            text-lg font-bold tabular-nums
            transition-colors
            ${isSelected
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600 group-hover:bg-blue-200/80"
            }
          `}
        >
          {total}
        </span>

        <h2
          className={`
            text-sm font-semibold tracking-tight
            ${isSelected ? "text-slate-800" : "text-slate-600"}
            transition-colors
          `}
        >
          {name}
        </h2>
      </div>
    );
  }
);
