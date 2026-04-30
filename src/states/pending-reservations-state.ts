import { create } from "zustand";
import type { THistoryBorrwedItems } from "../@types/types";

type ActiveTab = "pending" | "reservations";

interface IPendingReservationsState {
  activeTab: ActiveTab;
  setActiveTab: (value: ActiveTab) => void;

  searchItem: string;
  setSearchItem: (value: string) => void;

  // Approve modal
  isApproveModalOpen: boolean;
  setIsApproveModalOpen: (value: boolean) => void;

  // Deny modal
  isDenyModalOpen: boolean;
  setIsDenyModalOpen: (value: boolean) => void;

  // Mark-as-borrowed modal
  isMarkBorrowedModalOpen: boolean;
  setIsMarkBorrowedModalOpen: (value: boolean) => void;

  // Shared selected item for action modals
  selectedItem: THistoryBorrwedItems | null;
  setSelectedItem: (item: THistoryBorrwedItems | null) => void;

  // Details modal
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (value: boolean) => void;

  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

const pendingReservationsStore = create<IPendingReservationsState>((set) => ({
  activeTab: "pending",
  setActiveTab: (value) => set(() => ({ activeTab: value })),

  searchItem: "",
  setSearchItem: (value) => set(() => ({ searchItem: value })),

  isApproveModalOpen: false,
  setIsApproveModalOpen: (value) => set(() => ({ isApproveModalOpen: value })),

  isDenyModalOpen: false,
  setIsDenyModalOpen: (value) => set(() => ({ isDenyModalOpen: value })),

  isMarkBorrowedModalOpen: false,
  setIsMarkBorrowedModalOpen: (value) =>
    set(() => ({ isMarkBorrowedModalOpen: value })),

  selectedItem: null,
  setSelectedItem: (item) => set(() => ({ selectedItem: item })),

  isDetailsModalOpen: false,
  setIsDetailsModalOpen: (value) => set(() => ({ isDetailsModalOpen: value })),

  selectedItemId: null,
  setSelectedItemId: (id) => set(() => ({ selectedItemId: id })),
}));

export const usePendingReservationsState = () => {
  const activeTab = pendingReservationsStore((state) => state.activeTab);
  const setActiveTab = pendingReservationsStore((state) => state.setActiveTab);

  const searchItem = pendingReservationsStore((state) => state.searchItem);
  const setSearchItem = pendingReservationsStore((state) => state.setSearchItem);

  const isApproveModalOpen = pendingReservationsStore(
    (state) => state.isApproveModalOpen,
  );
  const setIsApproveModalOpen = pendingReservationsStore(
    (state) => state.setIsApproveModalOpen,
  );

  const isDenyModalOpen = pendingReservationsStore(
    (state) => state.isDenyModalOpen,
  );
  const setIsDenyModalOpen = pendingReservationsStore(
    (state) => state.setIsDenyModalOpen,
  );

  const isMarkBorrowedModalOpen = pendingReservationsStore(
    (state) => state.isMarkBorrowedModalOpen,
  );
  const setIsMarkBorrowedModalOpen = pendingReservationsStore(
    (state) => state.setIsMarkBorrowedModalOpen,
  );

  const selectedItem = pendingReservationsStore((state) => state.selectedItem);
  const setSelectedItem = pendingReservationsStore(
    (state) => state.setSelectedItem,
  );

  const isDetailsModalOpen = pendingReservationsStore(
    (state) => state.isDetailsModalOpen,
  );
  const setIsDetailsModalOpen = pendingReservationsStore(
    (state) => state.setIsDetailsModalOpen,
  );

  const selectedItemId = pendingReservationsStore(
    (state) => state.selectedItemId,
  );
  const setSelectedItemId = pendingReservationsStore(
    (state) => state.setSelectedItemId,
  );

  return {
    activeTab,
    setActiveTab,
    searchItem,
    setSearchItem,
    isApproveModalOpen,
    setIsApproveModalOpen,
    isDenyModalOpen,
    setIsDenyModalOpen,
    isMarkBorrowedModalOpen,
    setIsMarkBorrowedModalOpen,
    selectedItem,
    setSelectedItem,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedItemId,
    setSelectedItemId,
  };
};
