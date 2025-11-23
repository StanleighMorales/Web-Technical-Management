import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import { SelectHistoryStatus } from "../components/SelectHistoryStatus";
import HistoryListSkeletonLoader from "../loader/HistoryListSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";
import type { THistoryBorrwedItems } from "../types/types";
import PendingItemsTable from "../components/PendingItemsTable";
import ErrorTable from "../components/ErrorTables";
import ApproveConfirmationModal from "../components/ApproveConfirmationModal";
import { useScanLentItemMutation } from "../query/patch/useScanLentItemMutation";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import { LentItemDetailsModal } from "../components/LentItemDetailsModal";

export default function PendingReservations() {
    const [activeTab, setActiveTab] = useState<"pending" | "reservations">("pending");
    const [searchItem, setSearchItem] = useState("");
    const [borrowedItem, setBorrowedItem] = useState<THistoryBorrwedItems[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<THistoryBorrwedItems | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const { data, isPending, isError } = useQuery(useBorrowedItemsQuery());
    const { mutate: approveLentItem, isPending: isApproving } = useScanLentItemMutation();

    useEffect(() => {
        if (data) setBorrowedItem(data);
    }, [data]);

    // Auto-dismiss success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Auto-dismiss error message after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const pendingItems = useMemo(() => {
        return borrowedItem.filter((item) => {
            const matchesSearch = item.borrowerFullName?.toLowerCase().includes(searchItem.toLowerCase()) ||
                item.item.itemName?.toLowerCase().includes(searchItem.toLowerCase());
            const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
            return matchesSearch && matchesStatus && item.status === "Pending";
        });
    }, [borrowedItem, searchItem, selectedStatus]);

    const reservationItems = useMemo(() => {
        return borrowedItem.filter((item) => {
            const matchesSearch = item.borrowerFullName?.toLowerCase().includes(searchItem.toLowerCase()) ||
                item.item.itemName?.toLowerCase().includes(searchItem.toLowerCase());
            const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
            // Reservations are items with status "Reserved" or future scheduled items
            return matchesSearch && matchesStatus && (item.status === "Reserved" || item.status === "Scheduled");
        });
    }, [borrowedItem, searchItem, selectedStatus]);

    const filteredItems = activeTab === "pending" ? pendingItems : reservationItems;

    const handleApproveClick = (item: THistoryBorrwedItems) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleConfirmApprove = () => {
        if (!selectedItem) {
            setErrorMessage("No item selected. Cannot approve.");
            setIsModalOpen(false);
            return;
        }

        // Use barcode if available, otherwise use serialNumber or item ID
        const barcodeValue = selectedItem.item.barcode || selectedItem.item.serialNumber || selectedItem.item.id;

        if (!barcodeValue) {
            setErrorMessage("Item identifier is missing. Cannot approve.");
            setIsModalOpen(false);
            return;
        }

        approveLentItem(
            {
                barcode: barcodeValue,
                lentItemsStatus: "Borrowed",
            },
            {
                onSuccess: () => {
                    setSuccessMessage(`Successfully approved borrow request for ${selectedItem.item.itemName}`);
                    setIsModalOpen(false);
                    setSelectedItem(null);
                },
                onError: (error) => {
                    setErrorMessage(error.message || "Failed to approve borrow request");
                    setIsModalOpen(false);
                },
            }
        );
    };

    const handleCancelApprove = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedItemId(null);
    };

    if (isPending) return <HistoryListSkeletonLoader />;

    return (
        <div className="relative flex flex-col items-center py-10 px-2 w-full min-h-screen lg:h-full bg-gradient-to-br animate-fadeIn from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
            {successMessage && <SuccessAlert message={successMessage} />}
            {errorMessage && <ErrorAlert message={errorMessage} />}

            <div className="w-full bg-white/90 rounded-2xl p-8 relative">
                {/* Title */}
                <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
                            Pending & Reservations
                        </h1>
                        <span className="text-lg font-medium text-[#64748b]">
                            Review and approve pending borrow requests and manage reservations.
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-6 py-3 font-semibold text-base transition-all duration-200 border-b-2 ${activeTab === "pending"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Pending Requests
                        {pendingItems.length > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                {pendingItems.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("reservations")}
                        className={`px-6 py-3 font-semibold text-base transition-all duration-200 border-b-2 ${activeTab === "reservations"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Reservations
                        {reservationItems.length > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                {reservationItems.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-row gap-2 justify-end mb-6 flex-wrap">
                    <SelectHistoryStatus onChangeStatus={setSelectedStatus} />
                    <SearchBar
                        onChangeValue={setSearchItem}
                        name="Search Pending"
                        placeholder="Search by borrower or item"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl shadow-lg h-[50vh] md:h-[60vh] bg-white/95">
                    {isError ? (
                        <ErrorTable />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    {[
                                        "Serial Number",
                                        "Image",
                                        "Item",
                                        "Borrower",
                                        "Teacher",
                                        "Room",
                                        "Remarks",
                                        "Request Date",
                                        "Status",
                                        "Action",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="sticky bg-white top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="py-8 text-center text-gray-500">
                                            {activeTab === "pending"
                                                ? "No pending requests found."
                                                : "No reservations found."}
                                        </td>
                                    </tr>
                                ) : (
                                    <PendingItemsTable
                                        items={filteredItems}
                                        onApprove={handleApproveClick}
                                        onRowClick={handleRowClick}
                                    />
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <p className="mt-6 text-sm text-center text-[#64748b]">
                    <span className="font-semibold">Note:</span> {activeTab === "pending"
                        ? "Click on any row to view full details including borrower information. Click 'Approve' to confirm and process pending borrow requests."
                        : "Click on any row to view full details. Reservations are scheduled future borrows that can be approved when ready."}
                </p>
            </div>

            <ApproveConfirmationModal
                isOpen={isModalOpen}
                item={selectedItem}
                onConfirm={handleConfirmApprove}
                onCancel={handleCancelApprove}
                isLoading={isApproving}
            />

            {selectedItemId && (
                <LentItemDetailsModal
                    itemId={selectedItemId}
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                />
            )}
        </div>
    );
}
