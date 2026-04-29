import { create } from "zustand";

interface IActivityLogsState {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  currentPage: number;
  setCurrentPage: (value: number) => void;
}

const activityLogsStore = create<IActivityLogsState>((set) => ({
  searchTerm: "",
  setSearchTerm: (value) => set(() => ({ searchTerm: value })),

  currentPage: 1,
  setCurrentPage: (value) => set(() => ({ currentPage: value })),
}));

export const useActivityLogsState = () => {
  const searchTerm = activityLogsStore((state) => state.searchTerm);
  const setSearchTerm = activityLogsStore((state) => state.setSearchTerm);

  const currentPage = activityLogsStore((state) => state.currentPage);
  const setCurrentPage = activityLogsStore((state) => state.setCurrentPage);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
  };
};
