import { create } from "zustand";

type TPageTab = "staff" | "registered";

interface IUserManagement {
  activeTab: TPageTab;
  setActiveTab: (value: TPageTab) => void;
  isAddUserOpen: boolean;
  setIsAddUserOpen: (value: boolean) => void;
  isEditUserOpen: boolean;
  setIsEditUserOpen: (value: boolean) => void;
  isViewCredentialsOpen: boolean;
  setIsViewCredentialsOpen: (value: boolean) => void;
  isArchiveModalOpen: boolean;
  setIsArchiveModalOpen: (value: boolean) => void;
  isBlockModalOpen: boolean;
  setIsBlockModalOpen: (value: boolean) => void;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  archiveUserId: string;
  setArchiveUserId: (id: string) => void;
  blockUserId: string;
  setBlockUserId: (id: string) => void;
}

const UserManagementStore = create<IUserManagement>((set) => ({
  activeTab: "staff",
  setActiveTab: (value) => set(() => ({ activeTab: value })),

  isAddUserOpen: false,
  setIsAddUserOpen: (value) => set(() => ({ isAddUserOpen: value })),

  isEditUserOpen: false,
  setIsEditUserOpen: (value) => set(() => ({ isEditUserOpen: value })),

  isViewCredentialsOpen: false,
  setIsViewCredentialsOpen: (value) => set(() => ({ isViewCredentialsOpen: value })),

  isArchiveModalOpen: false,
  setIsArchiveModalOpen: (value) => set(() => ({ isArchiveModalOpen: value })),

  isBlockModalOpen: false,
  setIsBlockModalOpen: (value) => set(() => ({ isBlockModalOpen: value })),

  selectedUserId: "",
  setSelectedUserId: (id) => set(() => ({ selectedUserId: id })),

  archiveUserId: "",
  setArchiveUserId: (id) => set(() => ({ archiveUserId: id })),

  blockUserId: "",
  setBlockUserId: (id) => set(() => ({ blockUserId: id })),
}));

export const useAllUsersManagementState = () => {
  const activeTab = UserManagementStore((state) => state.activeTab);
  const setActiveTab = UserManagementStore((state) => state.setActiveTab);

  const isAddUserOpen = UserManagementStore((state) => state.isAddUserOpen);
  const setIsAddUserOpen = UserManagementStore((state) => state.setIsAddUserOpen);

  const isEditUserOpen = UserManagementStore((state) => state.isEditUserOpen);
  const setIsEditUserOpen = UserManagementStore((state) => state.setIsEditUserOpen);

  const isViewCredentialsOpen = UserManagementStore((state) => state.isViewCredentialsOpen);
  const setIsViewCredentialsOpen = UserManagementStore((state) => state.setIsViewCredentialsOpen);

  const isArchiveModalOpen = UserManagementStore((state) => state.isArchiveModalOpen);
  const setIsArchiveModalOpen = UserManagementStore((state) => state.setIsArchiveModalOpen);

  const isBlockModalOpen = UserManagementStore((state) => state.isBlockModalOpen);
  const setIsBlockModalOpen = UserManagementStore((state) => state.setIsBlockModalOpen);

  const selectedUserId = UserManagementStore((state) => state.selectedUserId);
  const setSelectedUserId = UserManagementStore((state) => state.setSelectedUserId);

  const archiveUserId = UserManagementStore((state) => state.archiveUserId);
  const setArchiveUserId = UserManagementStore((state) => state.setArchiveUserId);

  const blockUserId = UserManagementStore((state) => state.blockUserId);
  const setBlockUserId = UserManagementStore((state) => state.setBlockUserId);

  return {
    activeTab,
    setActiveTab,
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    isViewCredentialsOpen,
    setIsViewCredentialsOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    isBlockModalOpen,
    setIsBlockModalOpen,
    selectedUserId,
    setSelectedUserId,
    archiveUserId,
    setArchiveUserId,
    blockUserId,
    setBlockUserId,
  };
};
