import { create } from "zustand";
import type { TRecentBorrowItemProps, TSummary } from "../@types/types";

type DashboardStore = {
  // Summary
  dataSummary: TSummary;
  setSummary: (data: TSummary) => void;
  resetSummary: () => void;

  // Recent borrow items
  borrowedItemData: TRecentBorrowItemProps[];
  setBorrowedItemData: (data: TRecentBorrowItemProps[]) => void;
  resetBorrowedItemData: () => void;

  // Modals / UI state
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  scannedLentItemId: string | null;
  setScannedLentItemId: (id: string | null) => void;

  showReturnModal: boolean;
  setShowReturnModal: (open: boolean) => void;

  returnBarcode: string;
  setReturnBarcode: (v: string) => void;

  returnError: string;
  setReturnError: (v: string) => void;

  showScanModal: boolean;
  setShowScanModal: (open: boolean) => void;

  scannedBarcode: string;
  setScannedBarcode: (v: string) => void;

  scanError: string;
  setScanError: (v: string) => void;
};

const defaultSummary: TSummary = {
  totalItems: 0,
  totalItemsCategories: 0,
  totalActiveUsers: 0,
  totalLentItems: 0,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  // Summary
  dataSummary: defaultSummary,
  setSummary: (data) =>
    set((state) => ({ dataSummary: { ...state.dataSummary, ...data } })),
  resetSummary: () => set({ dataSummary: defaultSummary }),

  // Recent borrow items
  borrowedItemData: [],
  setBorrowedItemData: (data) => set({ borrowedItemData: data }),
  resetBorrowedItemData: () => set({ borrowedItemData: [] }),

  // Modals / UI state
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  scannedLentItemId: null,
  setScannedLentItemId: (id) => set({ scannedLentItemId: id }),

  showReturnModal: false,
  setShowReturnModal: (open) => set({ showReturnModal: open }),

  returnBarcode: "",
  setReturnBarcode: (v) => set({ returnBarcode: v }),

  returnError: "",
  setReturnError: (v) => set({ returnError: v }),

  showScanModal: false,
  setShowScanModal: (open) => set({ showScanModal: open }),

  scannedBarcode: "",
  setScannedBarcode: (v) => set({ scannedBarcode: v }),

  scanError: "",
  setScanError: (v) => set({ scanError: v }),
}));
