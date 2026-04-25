import { useEffect, useMemo, useState } from "react";
import HistoryListSkeletonLoader from "../loader/HistoryListSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import type { THistoryBorrwedItems } from "../@types/types";
import PendingItemsTable from "../components/PendingItemsTable";
import ErrorTable from "../components/ErrorTables";
import ApproveConfirmationModal from "../components/ApproveConfirmationModal";
import DenyConfirmationModal from "../components/DenyConfirmationModal";
import MarkBorrowedConfirmationModal from "../components/MarkBorrowedConfirmationModal";
import { useUpdateLentItemStatusMutation } from "../query/patch/useUpdateLentItemStatusMutation";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import { LentItemDetailsModal } from "../components/LentItemDetailsModal";
import { useRecentlyBorrowItems } from "../hooks/itemHooks";

export default function PendingReservations() {
  const [activeTab, setActiveTab] = useState<"pending" | "reservations">("pending");
  const [searchItem, setSearchItem] = useState("");
  const [borrowedItem, setBorrowedItem] = useState<THistoryBorrwedItems[]>([]);

  // If navigated here from the due-soon dialog, open the Reservations tab directly
  useEffect(() => {
    const intent = sessionStorage.getItem("pendingReservationsTab");
    if (intent === "reservations") {
      setActiveTab("reservations");
      sessionStorage.removeItem("pendingReservationsTab");
    }
  }, []);

  // Modal state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [isMarkBorrowedModalOpen, setIsMarkBorrowedModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<THistoryBorrwedItems | null>(null);

  // Alert state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery(useRecentlyBorrowItems());
  const { mutate: approveLentItem, isPending: isApproving } = useUpdateLentItemStatusMutation();
  const { mutate: denyLentItem,   isPending: isDenying   } = useUpdateLentItemStatusMutation();
  const { mutate: borrowLentItem, isPending: isBorrowing } = useUpdateLentItemStatusMutation();

  useEffect(() => {
    if (data) setBorrowedItem(data);
  }, [data]);

  // Auto-dismiss alerts
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(null), 5000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  // ── Filtered lists ──────────────────────────────────────────────────────
  const pendingItems = useMemo(() => {
    return borrowedItem.filter((item) => {
      const matchesSearch =
        item.borrowerFullName?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.item.itemName?.toLowerCase().includes(searchItem.toLowerCase());
      return matchesSearch && item.status === "Pending";
    });
  }, [borrowedItem, searchItem]);

  const reservationItems = useMemo(() => {
    return borrowedItem.filter((item) => {
      const matchesSearch =
        item.borrowerFullName?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.item.itemName?.toLowerCase().includes(searchItem.toLowerCase());
      // Approved = reservation confirmed by admin, awaiting pickup
      return matchesSearch && item.status === "Approved";
    });
  }, [borrowedItem, searchItem]);

  const filteredItems = activeTab === "pending" ? pendingItems : reservationItems;

  // ── Approve ─────────────────────────────────────────────────────────────
  const handleApproveClick = (item: THistoryBorrwedItems) => {
    setSelectedItem(item);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedItem) { setErrorMessage("No item selected."); setIsApproveModalOpen(false); return; }

    approveLentItem(
      { id: selectedItem.id, lentItemsStatus: "Approved" },
      {
        onSuccess: () => {
          setSuccessMessage(`Reservation approved for ${selectedItem.item.itemName}`);
          setIsApproveModalOpen(false);
          setSelectedItem(null);
        },
        onError: (error) => {
          setErrorMessage(error.message || "Failed to approve reservation");
          setIsApproveModalOpen(false);
        },
      },
    );
  };

  // ── Deny / Cancel ────────────────────────────────────────────────────────
  const handleDenyClick = (item: THistoryBorrwedItems) => {
    setSelectedItem(item);
    setIsDenyModalOpen(true);
  };

  const handleConfirmDeny = () => {
    if (!selectedItem) { setErrorMessage("No item selected."); setIsDenyModalOpen(false); return; }

    // Approved reservations → "Canceled"; pending requests → "Denied"
    const statusToSet = selectedItem.status === "Approved" ? "Canceled" : "Denied";

    denyLentItem(
      { id: selectedItem.id, lentItemsStatus: statusToSet },
      {
        onSuccess: () => {
          const actionText = selectedItem.status === "Approved" ? "canceled reservation" : "denied borrow request";
          setSuccessMessage(`Successfully ${actionText} for ${selectedItem.item.itemName}`);
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

  // ── Mark as Borrowed (manual fallback) ───────────────────────────────────
  const handleMarkBorrowedClick = (item: THistoryBorrwedItems) => {
    setSelectedItem(item);
    setIsMarkBorrowedModalOpen(true);
  };

  const handleConfirmMarkBorrowed = () => {
    if (!selectedItem) { setErrorMessage("No item selected."); setIsMarkBorrowedModalOpen(false); return; }

    borrowLentItem(
      { id: selectedItem.id, lentItemsStatus: "Borrowed" },
      {
        onSuccess: () => {
          setSuccessMessage(`${selectedItem.item.itemName} marked as borrowed for ${selectedItem.borrowerFullName}`);
          setIsMarkBorrowedModalOpen(false);
          setSelectedItem(null);
          // Switch to pending tab so the user sees the updated state
          setActiveTab("reservations");
        },
        onError: (error) => {
          setErrorMessage(error.message || "Failed to mark item as borrowed");
          setIsMarkBorrowedModalOpen(false);
        },
      },
    );
  };

  // ── Details modal ────────────────────────────────────────────────────────
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
      {errorMessage   && <ErrorAlert   message={errorMessage}   />}

      <div className="w-full bg-white/90 rounded-2xl p-8 relative">
        {/* Title */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
              Pending & Reservations
            </h1>
            <span className="text-lg font-medium text-[#64748b]">
              Review and approve pending reservation requests and manage confirmed reservations.
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-semibold text-base transition-all duration-200 border-b-2 ${
              activeTab === "pending"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Reservations
            {pendingItems.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                {pendingItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-6 py-3 font-semibold text-base transition-all duration-200 border-b-2 ${
              activeTab === "reservations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Reservations
            {reservationItems.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                {reservationItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Table */}
        {isError ? (
          <ErrorTable />
        ) : (
          <PendingItemsTable
            items={filteredItems}
            onApprove={handleApproveClick}
            onDeny={handleDenyClick}
            onMarkBorrowed={handleMarkBorrowedClick}
            onRowClick={handleRowClick}
            searchValue={searchItem}
            onSearchChange={setSearchItem}
          />
        )}
      </div>

      {/* Modals */}
      <ApproveConfirmationModal
        isOpen={isApproveModalOpen}
        item={selectedItem}
        onConfirm={handleConfirmApprove}
        onCancel={() => { setIsApproveModalOpen(false); setSelectedItem(null); }}
        isLoading={isApproving}
      />

      <DenyConfirmationModal
        isOpen={isDenyModalOpen}
        item={selectedItem}
        onConfirm={handleConfirmDeny}
        onCancel={() => { setIsDenyModalOpen(false); setSelectedItem(null); }}
        isLoading={isDenying}
      />

      <MarkBorrowedConfirmationModal
        isOpen={isMarkBorrowedModalOpen}
        item={selectedItem}
        onConfirm={handleConfirmMarkBorrowed}
        onCancel={() => { setIsMarkBorrowedModalOpen(false); setSelectedItem(null); }}
        isLoading={isBorrowing}
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
