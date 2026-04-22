import { useEffect, useMemo, useState } from "react";
import HistoryListSkeletonLoader from "../loader/HistoryListSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import type { THistoryBorrwedItems } from "../@types/types";
import PendingItemsTable from "../components/PendingItemsTable";
import ErrorTable from "../components/ErrorTables";
import ApproveConfirmationModal from "../components/ApproveConfirmationModal";
import DenyConfirmationModal from "../components/DenyConfirmationModal";
import { useScanLentItemMutation } from "../query/patch/useScanLentItemMutation";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import { LentItemDetailsModal } from "../components/LentItemDetailsModal";
import { useRecentlyBorrowItems } from "../hooks/itemHooks";

export default function PendingReservations() {
  const [activeTab, setActiveTab] = useState<"pending" | "reservations">(
    "pending",
  );
  const [searchItem, setSearchItem] = useState("");
  const [borrowedItem, setBorrowedItem] = useState<THistoryBorrwedItems[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<THistoryBorrwedItems | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery(useRecentlyBorrowItems());
  const { mutate: approveLentItem, isPending: isApproving } =
    useScanLentItemMutation();
  const { mutate: denyLentItem, isPending: isDenying } =
    useScanLentItemMutation();

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
      const matchesSearch =
        item.borrowerFullName
          ?.toLowerCase()
          .includes(searchItem.toLowerCase()) ||
        item.item.itemName?.toLowerCase().includes(searchItem.toLowerCase());
      return matchesSearch && item.status === "Pending";
    });
  }, [borrowedItem, searchItem]);

  const reservationItems = useMemo(() => {
    return borrowedItem.filter((item) => {
      const matchesSearch =
        item.borrowerFullName
          ?.toLowerCase()
          .includes(searchItem.toLowerCase()) ||
        item.item.itemName?.toLowerCase().includes(searchItem.toLowerCase());
      // Only show Reserved items that are still pending (not yet approved/denied)
      return matchesSearch && item.status === "Reserved";
    });
  }, [borrowedItem, searchItem]);

  const filteredItems =
    activeTab === "pending" ? pendingItems : reservationItems;

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

    // Use the LENT ITEM's barcode (format: LENT-YYYYMMDD-XXX)
    const barcodeValue = selectedItem.barcode;

    if (!barcodeValue) {
      setErrorMessage("Lent item barcode is missing. Cannot approve.");
      setIsModalOpen(false);
      return;
    }

    approveLentItem(
      {
        barcode: barcodeValue,
        lentItemsStatus: "Approved",
      },
      {
        onSuccess: () => {
          setSuccessMessage(
            `Successfully approved borrow request for ${selectedItem.item.itemName}`,
          );
          setIsModalOpen(false);
          setSelectedItem(null);
        },
        onError: (error) => {
          setErrorMessage(error.message || "Failed to approve borrow request");
          setIsModalOpen(false);
        },
      },
    );
  };

  const handleCancelApprove = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDenyClick = (item: THistoryBorrwedItems) => {
    setSelectedItem(item);
    setIsDenyModalOpen(true);
  };

  const handleConfirmDeny = () => {
    if (!selectedItem) {
      setErrorMessage("No item selected. Cannot deny.");
      setIsDenyModalOpen(false);
      return;
    }

    // Use the LENT ITEM's barcode (format: LENT-YYYYMMDD-XXX)
    const barcodeValue = selectedItem.barcode;

    if (!barcodeValue) {
      setErrorMessage("Lent item barcode is missing. Cannot deny.");
      setIsDenyModalOpen(false);
      return;
    }

    // For reservations, use "Canceled" status; for pending, use "Denied"
    const statusToSet =
      selectedItem.status === "Reserved" ? "Canceled" : "Denied";

    denyLentItem(
      {
        barcode: barcodeValue,
        lentItemsStatus: statusToSet,
      },
      {
        onSuccess: () => {
          const actionText =
            selectedItem.status === "Reserved"
              ? "canceled reservation"
              : "denied borrow request";
          setSuccessMessage(
            `Successfully ${actionText} for ${selectedItem.item.itemName}`,
          );
          setIsDenyModalOpen(false);
          setSelectedItem(null);
        },
        onError: (error) => {
          setErrorMessage(error.message || "Failed to process request");
          setIsDenyModalOpen(false);
        },
      },
    );
  };

  const handleCancelDeny = () => {
    setIsDenyModalOpen(false);
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
              Review and approve pending borrow requests and manage
              reservations.
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

        {/* Table Card */}
        {isError ? (
          <ErrorTable />
        ) : (
          <PendingItemsTable
            items={filteredItems}
            onApprove={handleApproveClick}
            onDeny={handleDenyClick}
            onRowClick={handleRowClick}
            searchValue={searchItem}
            onSearchChange={setSearchItem}
          />
        )}
      </div>

      <ApproveConfirmationModal
        isOpen={isModalOpen}
        item={selectedItem}
        onConfirm={handleConfirmApprove}
        onCancel={handleCancelApprove}
        isLoading={isApproving}
      />

      <DenyConfirmationModal
        isOpen={isDenyModalOpen}
        item={selectedItem}
        onConfirm={handleConfirmDeny}
        onCancel={handleCancelDeny}
        isLoading={isDenying}
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
