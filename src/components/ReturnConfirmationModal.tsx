import type { TRecentBorrowItemProps } from "../@types/types";

type ReturnConfirmationModalProps = {
    isOpen: boolean;
    item: TRecentBorrowItemProps | null;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
};

export default function ReturnConfirmationModal({
    isOpen,
    item,
    onConfirm,
    onCancel,
    isLoading = false,
}: ReturnConfirmationModalProps) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideIn">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                        <svg
                            className="h-8 w-8 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Return Item
                    </h3>
                    <p className="text-gray-600">
                        Are you sure you want to manually return this item? This action will mark the item as returned and make it available for borrowing.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Item:</span>
                        <span className="text-gray-900 font-semibold">{item.item.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Serial Number:</span>
                        <span className="text-gray-900 font-mono text-sm">{item.item.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Borrower:</span>
                        <span className="text-gray-900">{item.borrowerFullName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Room:</span>
                        <span className="text-gray-900">{item.room || "-"}</span>
                    </div>
                    {item.lentAt && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Borrowed Since:</span>
                            <span className="text-gray-900">
                                {new Date(item.lentAt).toLocaleString([], {
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

                <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                    ℹ️ Use this manual return when the RFID scan is unavailable or fails. The item will be marked as returned immediately.
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Returning..." : "Confirm Return"}
                    </button>
                </div>
            </div>
        </div>
    );
}
