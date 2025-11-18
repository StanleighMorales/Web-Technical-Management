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
          flex flex-col flex-nowrap items-center justify-center
          p-8
          rounded-2xl
          bg-white/60 backdrop-blur-md
          border
          shadow-sm
          transition-all duration-300
          cursor-pointer
          w-full min-w-[140px] max-w-[350px]

          hover:shadow-lg hover:-translate-y-1

          ${
            isSelected
              ? "border-[#2563eb] shadow-md"
              : "border-[#e5e7eb]"
          }
        `}
      >
        <h2
          className={`
            text-base font-medium
            ${isSelected ? "text-[#1e40af]" : "text-[#475569]"}
            transition-colors
          `}
        >
          {name}
        </h2>

        <p
          className={`
            mt-4 text-5xl font-extrabold tracking-tight
            ${isSelected ? "text-[#1e3a8a]" : "text-[#2563eb]"}
            transition-colors
          `}
        >
          {total}
        </p>
      </div>
    );
  }
);
