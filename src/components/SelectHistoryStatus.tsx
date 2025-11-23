import { useState } from "react";

type SelectStatusProps = {
    onChangeStatus: (value: string) => void;
    options?: { value: string; label: string }[];
};

const defaultOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "borrowed", label: "Borrowed" },
    { value: "returned", label: "Returned" },
    { value: "denied", label: "Denied" },
    { value: "canceled", label: "Canceled" },
];

export const SelectHistoryStatus = ({
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
        <div className="flex flex-row items-center justify-center px-2 py-0 -mt-6">
            <select
                id="status-select"
                className="bg-gradient-to-r text-gray-600 border border-gray-300 font-bold px-2 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#2563eb] transition-all duration-200 cursor-pointer text-lg"
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
