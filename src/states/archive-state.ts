import { create } from "zustand";

interface IArchiveState {
  searchItem: string;
  setSearchItem: (value: string) => void;

  currentPage: number;
  setCurrentPage: (value: number) => void;

  // Item restore modal
  isRestoreConfirmOpen: boolean;
  setIsRestoreConfirmOpen: (value: boolean) => void;

  restoreSelectedItemId: string | null;
  setRestoreSelectedItemId: (id: string | null) => void;

  // Item details popup
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;

  isItemDetailsOpen: boolean;
  setIsItemDetailsOpen: (value: boolean) => void;

  // Item delete modal
  isDeleteConfirmOpen: boolean;
  setIsDeleteItemConfirmOpen: (value: boolean) => void;

  deleteSelectedId: string | null;
  setDeleteSelectedId: (id: string | null) => void;

  // User restore modal
  isUserRestoreConfirmOpen: boolean;
  setIsUserRestoreConfirmOpen: (value: boolean) => void;

  userRestoreSelectedId: string | null;
  setUserRestoreSelectedId: (id: string | null) => void;

  // User delete modal
  isUserDeleteConfirmOpen: boolean;
  setIsUserDeleteConfirmOpen: (value: boolean) => void;

  userDeleteSelectedId: string | null;
  setUserDeleteSelectedId: (id: string | null) => void;

  // Student credentials popup
  isStudentCredentialsOpen: boolean;
  setIsStudentCredentialsOpen: (value: boolean) => void;

  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  // Teacher credentials popup
  isTeacherCredentialsOpen: boolean;
  setIsTeacherCredentialsOpen: (value: boolean) => void;

  selectedTeacherId: string | null;
  setSelectedTeacherId: (id: string | null) => void;
}

const archiveStore = create<IArchiveState>((set) => ({
  searchItem: "",
  setSearchItem: (value) => set(() => ({ searchItem: value })),

  currentPage: 1,
  setCurrentPage: (value) => set(() => ({ currentPage: value })),

  isRestoreConfirmOpen: false,
  setIsRestoreConfirmOpen: (value) => set(() => ({ isRestoreConfirmOpen: value })),

  restoreSelectedItemId: null,
  setRestoreSelectedItemId: (id) => set(() => ({ restoreSelectedItemId: id })),

  selectedItemId: null,
  setSelectedItemId: (id) => set(() => ({ selectedItemId: id })),

  isItemDetailsOpen: false,
  setIsItemDetailsOpen: (value) => set(() => ({ isItemDetailsOpen: value })),

  isDeleteConfirmOpen: false,
  setIsDeleteItemConfirmOpen: (value) => set(() => ({ isDeleteConfirmOpen: value })),

  deleteSelectedId: null,
  setDeleteSelectedId: (id) => set(() => ({ deleteSelectedId: id })),

  isUserRestoreConfirmOpen: false,
  setIsUserRestoreConfirmOpen: (value) => set(() => ({ isUserRestoreConfirmOpen: value })),

  userRestoreSelectedId: null,
  setUserRestoreSelectedId: (id) => set(() => ({ userRestoreSelectedId: id })),

  isUserDeleteConfirmOpen: false,
  setIsUserDeleteConfirmOpen: (value) => set(() => ({ isUserDeleteConfirmOpen: value })),

  userDeleteSelectedId: null,
  setUserDeleteSelectedId: (id) => set(() => ({ userDeleteSelectedId: id })),

  isStudentCredentialsOpen: false,
  setIsStudentCredentialsOpen: (value) => set(() => ({ isStudentCredentialsOpen: value })),

  selectedStudentId: null,
  setSelectedStudentId: (id) => set(() => ({ selectedStudentId: id })),

  isTeacherCredentialsOpen: false,
  setIsTeacherCredentialsOpen: (value) => set(() => ({ isTeacherCredentialsOpen: value })),

  selectedTeacherId: null,
  setSelectedTeacherId: (id) => set(() => ({ selectedTeacherId: id })),
}));

export const useArchiveState = () => {
  const searchItem = archiveStore((state) => state.searchItem);
  const setSearchItem = archiveStore((state) => state.setSearchItem);

  const currentPage = archiveStore((state) => state.currentPage);
  const setCurrentPage = archiveStore((state) => state.setCurrentPage);

  const isRestoreConfirmOpen = archiveStore((state) => state.isRestoreConfirmOpen);
  const setIsRestoreConfirmOpen = archiveStore((state) => state.setIsRestoreConfirmOpen);

  const restoreSelectedItemId = archiveStore((state) => state.restoreSelectedItemId);
  const setRestoreSelectedItemId = archiveStore((state) => state.setRestoreSelectedItemId);

  const selectedItemId = archiveStore((state) => state.selectedItemId);
  const setSelectedItemId = archiveStore((state) => state.setSelectedItemId);

  const isItemDetailsOpen = archiveStore((state) => state.isItemDetailsOpen);
  const setIsItemDetailsOpen = archiveStore((state) => state.setIsItemDetailsOpen);

  const isDeleteConfirmOpen = archiveStore((state) => state.isDeleteConfirmOpen);
  const setIsDeleteItemConfirmOpen = archiveStore((state) => state.setIsDeleteItemConfirmOpen);

  const deleteSelectedId = archiveStore((state) => state.deleteSelectedId);
  const setDeleteSelectedId = archiveStore((state) => state.setDeleteSelectedId);

  const isUserRestoreConfirmOpen = archiveStore((state) => state.isUserRestoreConfirmOpen);
  const setIsUserRestoreConfirmOpen = archiveStore((state) => state.setIsUserRestoreConfirmOpen);

  const userRestoreSelectedId = archiveStore((state) => state.userRestoreSelectedId);
  const setUserRestoreSelectedId = archiveStore((state) => state.setUserRestoreSelectedId);

  const isUserDeleteConfirmOpen = archiveStore((state) => state.isUserDeleteConfirmOpen);
  const setIsUserDeleteConfirmOpen = archiveStore((state) => state.setIsUserDeleteConfirmOpen);

  const userDeleteSelectedId = archiveStore((state) => state.userDeleteSelectedId);
  const setUserDeleteSelectedId = archiveStore((state) => state.setUserDeleteSelectedId);

  const isStudentCredentialsOpen = archiveStore((state) => state.isStudentCredentialsOpen);
  const setIsStudentCredentialsOpen = archiveStore((state) => state.setIsStudentCredentialsOpen);

  const selectedStudentId = archiveStore((state) => state.selectedStudentId);
  const setSelectedStudentId = archiveStore((state) => state.setSelectedStudentId);

  const isTeacherCredentialsOpen = archiveStore((state) => state.isTeacherCredentialsOpen);
  const setIsTeacherCredentialsOpen = archiveStore((state) => state.setIsTeacherCredentialsOpen);

  const selectedTeacherId = archiveStore((state) => state.selectedTeacherId);
  const setSelectedTeacherId = archiveStore((state) => state.setSelectedTeacherId);

  return {
    searchItem,
    setSearchItem,
    currentPage,
    setCurrentPage,
    isRestoreConfirmOpen,
    setIsRestoreConfirmOpen,
    restoreSelectedItemId,
    setRestoreSelectedItemId,
    selectedItemId,
    setSelectedItemId,
    isItemDetailsOpen,
    setIsItemDetailsOpen,
    isDeleteConfirmOpen,
    setIsDeleteItemConfirmOpen,
    deleteSelectedId,
    setDeleteSelectedId,
    isUserRestoreConfirmOpen,
    setIsUserRestoreConfirmOpen,
    userRestoreSelectedId,
    setUserRestoreSelectedId,
    isUserDeleteConfirmOpen,
    setIsUserDeleteConfirmOpen,
    userDeleteSelectedId,
    setUserDeleteSelectedId,
    isStudentCredentialsOpen,
    setIsStudentCredentialsOpen,
    selectedStudentId,
    setSelectedStudentId,
    isTeacherCredentialsOpen,
    setIsTeacherCredentialsOpen,
    selectedTeacherId,
    setSelectedTeacherId,
  };
};
