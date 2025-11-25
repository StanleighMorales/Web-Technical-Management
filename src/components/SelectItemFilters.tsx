import { useState, useRef, useEffect } from "react";

interface SelectItemFiltersProps {
    onStatusChange: (status: string) => void;
    onConditionChange: (condition: string) => void;
    selectedStatus: string;
    selectedCondition: string;
    statusCounts: {
        all: number;
        available: number;
        borrowed: number;
    };
}

export default function SelectItemFilters({
    onStatusChange,
    onConditionChange,
    selectedStatus,
    selectedCondition,
    statusCounts,
}: SelectItemFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const statuses = [
        { value: "", label: "All Status", count: statusCounts.all },
        { value: "Available", label: "Available", count: statusCounts.available },
        { value: "Borrowed", label: "Borrowed", count: statusCounts.borrowed },
    ];

    const conditions = [
        { value: "", label: "All Conditions" },
        { value: "New", label: "New" },
        { value: "Good", label: "Good" },
        { value: "Fair", label: "Fair" },
        { value: "Poor", label: "Poor" },
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

    const handleStatusSelect = (value: string) => {
        onStatusChange(value);
    };

    const handleConditionSelect = (value: string) => {
        onConditionChange(value);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (selectedStatus !== "") count++;
        if (selectedCondition !== "") count++;
        return count;
    };

    const getButtonLabel = () => {
        const activeCount = getActiveFiltersCount();
        if (activeCount === 0) return "Filters";
        if (activeCount === 1) {
            if (selectedStatus !== "") {
                const status = statuses.find(s => s.value === selectedStatus);
                return status?.label || "Filters";
            }
            if (selectedCondition !== "") {
                const condition = conditions.find(c => c.value === selectedCondition);
                return condition?.label || "Filters";
            }
        }
        return `${activeCount} Filters`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[120px] sm:min-w-[160px]"
            >
                <span className="flex items-center gap-1.5 sm:gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="truncate">{getButtonLabel()}</span>
                    {getActiveFiltersCount() > 0 && (
                        <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex-shrink-0">
                            {getActiveFiltersCount()}
                        </span>
                    )}
                </span>
                <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-[80vh] overflow-y-auto">
                    <div className="p-3 sm:p-4">
                        {/* Status Section */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Status
                                </label>
                                {selectedStatus !== "" && (
                                    <button
                                        onClick={() => handleStatusSelect("")}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1">
                                {statuses.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusSelect(status.value)}
                                        className={`flex items-center justify-between w-full px-2.5 sm:px-3 py-2 text-sm rounded-md transition-colors ${selectedStatus === status.value
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <span className="truncate">{status.label}</span>
                                            {selectedStatus === status.value && (
                                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full flex-shrink-0">
                                            {status.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-3"></div>

                        {/* Condition Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Condition
                                </label>
                                {selectedCondition !== "" && (
                                    <button
                                        onClick={() => handleConditionSelect("")}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1">
                                {conditions.map((condition) => (
                                    <button
                                        key={condition.value}
                                        onClick={() => handleConditionSelect(condition.value)}
                                        className={`flex items-center justify-between w-full px-2.5 sm:px-3 py-2 text-sm rounded-md transition-colors ${selectedCondition === condition.value
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <span className="truncate">{condition.label}</span>
                                            {selectedCondition === condition.value && (
                                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear All Button */}
                        {getActiveFiltersCount() > 0 && (
                            <>
                                <div className="border-t border-gray-200 my-3"></div>
                                <button
                                    onClick={() => {
                                        handleStatusSelect("");
                                        handleConditionSelect("");
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-2.5 sm:px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
