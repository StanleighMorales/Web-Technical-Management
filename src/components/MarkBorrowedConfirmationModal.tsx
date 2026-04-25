import type { THistoryBorrwedItems } from "../@types/types";

type MarkBorrowedConfirmationModalProps = {
    isOpen: boolean;
    item: THistoryBorrwedItems | null;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
};

/**
 * Manual fallback modal for marking an approved reservation as Borrowed.
 * Used when the RFID scan fails or is unavailable.
 */
export default function MarkBorrowedConfirmationModal({
    isOpen,
    item,
    onConfirm,
    onCancel,
    isLoading = false,
}: MarkBorrowedConfirmationModalProps) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideIn">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                        <svg
                            className="h-8 w-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Mark as Borrowed
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Use this when the borrower has physically collected the item but the RFID scan was not triggered. This will move the record to Active Borrowed Items.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Item:</span>
                        <span className="text-gray-900 font-semibold">{item.item.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Serial Number:</span>
                        <span className="text-gray-900">{item.item.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Borrower:</span>
                        <span className="text-gray-900">{item.borrowerFullName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Room:</span>
                        <span className="text-gray-900">{item.room || "-"}</span>
                    </div>
                    {item.reservedFor && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Was Scheduled:</span>
                            <span className="text-gray-900">
                                {new Date(item.reservedFor).toLocaleString([], {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mb-5 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                    📦 The item status will be set to <strong>Borrowed</strong> and the borrow time will be recorded as now.
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : "Confirm Borrowed"}
                    </button>
                </div>
            </div>
        </div>
    );
}
