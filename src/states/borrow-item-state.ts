import { create } from "zustand";
import type { TRecentBorrowItemProps } from "../@types/types";

type ActiveTab = "guest" | "reserve";

type TLentItemDetail = TRecentBorrowItemProps & {
  studentIdNumber?: string | null;
  frontStudentIdPicture?: string | null;
  itemName?: string;
};

interface IBorrowItemState {
  activeTab: ActiveTab;
  setActiveTab: (value: ActiveTab) => void;

  scannedLentItem: TLentItemDetail | null;
  setScannedLentItem: (item: TLentItemDetail | null) => void;

  showReturnModal: boolean;
  setShowReturnModal: (value: boolean) => void;

  returnBarcode: string;
  setReturnBarcode: (value: string) => void;

  returnError: string;
  setReturnError: (value: string) => void;

  showFloatingMenu: boolean;
  setShowFloatingMenu: (value: boolean) => void;

  menuOpenedByClick: boolean;
  setMenuOpenedByClick: (value: boolean) => void;
}

const borrowItemStore = create<IBorrowItemState>((set) => ({
  activeTab: "guest",
  setActiveTab: (value) => set(() => ({ activeTab: value })),

  scannedLentItem: null,
  setScannedLentItem: (item) => set(() => ({ scannedLentItem: item })),

  showReturnModal: false,
  setShowReturnModal: (value) => set(() => ({ showReturnModal: value })),

  returnBarcode: "",
  setReturnBarcode: (value) => set(() => ({ returnBarcode: value })),

  returnError: "",
  setReturnError: (value) => set(() => ({ returnError: value })),

  showFloatingMenu: false,
  setShowFloatingMenu: (value) => set(() => ({ showFloatingMenu: value })),

  menuOpenedByClick: false,
  setMenuOpenedByClick: (value) => set(() => ({ menuOpenedByClick: value })),
}));

export const useBorrowItemState = () => {
  const activeTab = borrowItemStore((state) => state.activeTab);
  const setActiveTab = borrowItemStore((state) => state.setActiveTab);

  const scannedLentItem = borrowItemStore((state) => state.scannedLentItem);
  const setScannedLentItem = borrowItemStore((state) => state.setScannedLentItem);

  const showReturnModal = borrowItemStore((state) => state.showReturnModal);
  const setShowReturnModal = borrowItemStore((state) => state.setShowReturnModal);

  const returnBarcode = borrowItemStore((state) => state.returnBarcode);
  const setReturnBarcode = borrowItemStore((state) => state.setReturnBarcode);

  const returnError = borrowItemStore((state) => state.returnError);
  const setReturnError = borrowItemStore((state) => state.setReturnError);

  const showFloatingMenu = borrowItemStore((state) => state.showFloatingMenu);
  const setShowFloatingMenu = borrowItemStore((state) => state.setShowFloatingMenu);

  const menuOpenedByClick = borrowItemStore((state) => state.menuOpenedByClick);
  const setMenuOpenedByClick = borrowItemStore((state) => state.setMenuOpenedByClick);

  return {
    activeTab,
    setActiveTab,
    scannedLentItem,
    setScannedLentItem,
    showReturnModal,
    setShowReturnModal,
    returnBarcode,
    setReturnBarcode,
    returnError,
    setReturnError,
    showFloatingMenu,
    setShowFloatingMenu,
    menuOpenedByClick,
    setMenuOpenedByClick,
  };
};
