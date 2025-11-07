import React, { useState } from "react";

type SelectStatusProps = {
  onChangeStatus: (value: string) => void;
  options?: { value: string; label: string }[];
};

const defaultOptions = [
  { value: "all", label: "All" },
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
];

export const SelectUserStatus = ({
  onChangeStatus,
  options = defaultOptions,
}: SelectStatusProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(options[0].value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onChangeStatus(value);
  };

  return (
    <div className="flex flex-row justify-center items-center py-0 px-2">
      <select
        id="status-select"
        className="py-3 px-2 text-lg font-bold text-gray-600 bg-gradient-to-r rounded-md border border-gray-300 transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-[#2563eb]"
        value={selectedStatus}
        onChange={handleChange}
      >
        {options.map((opt) => (
          <option className="text-black" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
