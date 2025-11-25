import { useState, useRef, useEffect } from "react";

interface SelectItemStatusProps {
    onStatusChange: (status: string) => void;
    selectedStatus: string;
    statusCounts: {
        all: number;
        available: number;
        borrowed: number;
        maintenance: number;
    };
}

export default function SelectItemStatus({
    onStatusChange,
    selectedStatus,
    statusCounts,
}: SelectItemStatusProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const statuses = [
        { value: "", label: "All Status", count: statusCounts.all },
        { value: "Available", label: "Available", count: statusCounts.available },
        { value: "Borrowed", label: "Borrowed", count: statusCounts.borrowed },
        { value: "Maintenance", label: "Maintenance", count: statusCounts.maintenance },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        onStatusChange(value);
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        const selected = statuses.find((s) => s.value === selectedStatus);
        return selected ? selected.label : "All Status";
    };

    const getSelectedCount = () => {
        const selected = statuses.find((s) => s.value === selectedStatus);
        return selected ? selected.count : statusCounts.all;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px]"
            >
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getSelectedLabel()}
                    <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {getSelectedCount()}
                    </span>
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        {statuses.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => handleSelect(status.value)}
                                className={`flex items-center justify-between w-full px-4 py-2 text-sm transition-colors ${selectedStatus === status.value
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {status.label}
                                    {selectedStatus === status.value && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                                    {status.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
