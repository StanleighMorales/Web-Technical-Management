import { create } from "zustand";
import type { TRecentBorrowItemProps } from "../@types/types";

interface IActiveBorrowedItemsState {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  currentPage: number;
  setCurrentPage: (value: number) => void;

  selectedBorrowId: string | null;
  setSelectedBorrowId: (id: string | null) => void;

  itemToReturn: TRecentBorrowItemProps | null;
  setItemToReturn: (item: TRecentBorrowItemProps | null) => void;
}

const activeBorrowedItemsStore = create<IActiveBorrowedItemsState>((set) => ({
  searchTerm: "",
  setSearchTerm: (value) => set(() => ({ searchTerm: value })),

  currentPage: 1,
  setCurrentPage: (value) => set(() => ({ currentPage: value })),

  selectedBorrowId: null,
  setSelectedBorrowId: (id) => set(() => ({ selectedBorrowId: id })),

  itemToReturn: null,
  setItemToReturn: (item) => set(() => ({ itemToReturn: item })),
}));

export const useActiveBorrowedItemsState = () => {
  const searchTerm = activeBorrowedItemsStore((state) => state.searchTerm);
  const setSearchTerm = activeBorrowedItemsStore((state) => state.setSearchTerm);

  const currentPage = activeBorrowedItemsStore((state) => state.currentPage);
  const setCurrentPage = activeBorrowedItemsStore((state) => state.setCurrentPage);

  const selectedBorrowId = activeBorrowedItemsStore((state) => state.selectedBorrowId);
  const setSelectedBorrowId = activeBorrowedItemsStore((state) => state.setSelectedBorrowId);

  const itemToReturn = activeBorrowedItemsStore((state) => state.itemToReturn);
  const setItemToReturn = activeBorrowedItemsStore((state) => state.setItemToReturn);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    selectedBorrowId,
    setSelectedBorrowId,
    itemToReturn,
    setItemToReturn,
  };
};
