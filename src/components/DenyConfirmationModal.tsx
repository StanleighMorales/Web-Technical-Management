import type { THistoryBorrwedItems } from "../@types/types";

type DenyConfirmationModalProps = {
    isOpen: boolean;
    item: THistoryBorrwedItems | null;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
};

export default function DenyConfirmationModal({
    isOpen,
    item,
    onConfirm,
    onCancel,
    isLoading = false,
}: DenyConfirmationModalProps) {
    if (!isOpen || !item) return null;

    const isReservation = item.status === "Reserved";
    const title = isReservation ? "Cancel Reservation" : "Deny Borrow Request";
    const description = isReservation
        ? "Are you sure you want to cancel this reservation?"
        : "Are you sure you want to deny this borrow request?";
    const confirmText = isReservation ? "Confirm Cancellation" : "Confirm Denial";
    const loadingText = isReservation ? "Canceling..." : "Denying...";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideIn">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600">
                        {description}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
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
                    {isReservation && item.reservedFor && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Reserved For:</span>
                            <span className="text-gray-900">{new Date(item.reservedFor).toLocaleString()}</span>
                        </div>
                    )}
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
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? loadingText : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
