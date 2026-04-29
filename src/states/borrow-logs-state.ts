import { create } from "zustand";
import type { TBorrowingLogs } from "../@types/types";

interface IBorrowLogsState {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  statusFilter: string;
  setStatusFilter: (value: string) => void;

  currentPage: number;
  setCurrentPage: (value: number) => void;

  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (value: boolean) => void;

  selectedLog: TBorrowingLogs | null;
  setSelectedLog: (log: TBorrowingLogs | null) => void;
}

const borrowLogsStore = create<IBorrowLogsState>((set) => ({
  searchTerm: "",
  setSearchTerm: (value) => set(() => ({ searchTerm: value })),

  statusFilter: "All",
  setStatusFilter: (value) => set(() => ({ statusFilter: value })),

  currentPage: 1,
  setCurrentPage: (value) => set(() => ({ currentPage: value })),

  isDetailModalOpen: false,
  setIsDetailModalOpen: (value) => set(() => ({ isDetailModalOpen: value })),

  selectedLog: null,
  setSelectedLog: (log) => set(() => ({ selectedLog: log })),
}));

export const useBorrowLogsState = () => {
  const searchTerm = borrowLogsStore((state) => state.searchTerm);
  const setSearchTerm = borrowLogsStore((state) => state.setSearchTerm);

  const statusFilter = borrowLogsStore((state) => state.statusFilter);
  const setStatusFilter = borrowLogsStore((state) => state.setStatusFilter);

  const currentPage = borrowLogsStore((state) => state.currentPage);
  const setCurrentPage = borrowLogsStore((state) => state.setCurrentPage);

  const isDetailModalOpen = borrowLogsStore((state) => state.isDetailModalOpen);
  const setIsDetailModalOpen = borrowLogsStore((state) => state.setIsDetailModalOpen);

  const selectedLog = borrowLogsStore((state) => state.selectedLog);
  const setSelectedLog = borrowLogsStore((state) => state.setSelectedLog);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedLog,
    setSelectedLog,
  };
};
