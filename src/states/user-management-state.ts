import { create } from "zustand";

interface IUserManagement {
    isAddUserOpen: boolean
    setIsAddUserOpen: (value: boolean) => void
    isEditUserOpen: boolean
    setIsEditUserOpen: (value: boolean) => void
    isViewCredentialsOpen: boolean
    setIsViewCredentialsOpen: (value: boolean) => void
    isArchiveModalOpen: boolean
    setIsArchiveModalOpen: (value: boolean) => void
    selectedUserId: string
    setSelectedUserId: (id: string) => void
    archiveUserId: string
    setArchiveUserId: (id: string) => void
}

const UserManagementStore = create<IUserManagement>((set) => ({
    isAddUserOpen: false,
    setIsAddUserOpen: (value) => set(() => ({
        isAddUserOpen: value
    })),
    isEditUserOpen: false,
    setIsEditUserOpen: (value) => set(() => ({
        isEditUserOpen: value
    })),
    isViewCredentialsOpen: false,
    setIsViewCredentialsOpen: (value) => set(() => ({
        isViewCredentialsOpen: value
    })),
    isArchiveModalOpen: false,
    setIsArchiveModalOpen: (value) => set(() => ({
        isArchiveModalOpen: value
    })),
    selectedUserId: "",
    setSelectedUserId: (id) => set(() => ({
        selectedUserId: id
    })),
    archiveUserId: "",
    setArchiveUserId: (id) => set(() => ({
        archiveUserId: id
    }))
}))

export const useAllUsersManagementState = () => {
    const isAddUserOpen = UserManagementStore((state) => state.isAddUserOpen)
    const setIsAddUserOpen = UserManagementStore((state) => state.setIsAddUserOpen)
    const isEditUserOpen = UserManagementStore((state) => state.isEditUserOpen)
    const setIsEditUserOpen = UserManagementStore((state) => state.setIsEditUserOpen)
    const isViewCredentialsOpen = UserManagementStore((state) => state.isViewCredentialsOpen)
    const setIsViewCredentialsOpen = UserManagementStore((state) => state.setIsViewCredentialsOpen)
    const isArchiveModalOpen = UserManagementStore((state) => state.isArchiveModalOpen)
    const setIsArchiveModalOpen = UserManagementStore((state) => state.setIsArchiveModalOpen)
    const selectedUserId = UserManagementStore((state) => state.selectedUserId)
    const setSelectedUserId = UserManagementStore((state) => state.setSelectedUserId)
    const archiveUserId = UserManagementStore((state) => state.archiveUserId)
    const setArchiveUserId = UserManagementStore((state) => state.setArchiveUserId)

    return {
        isAddUserOpen,
        setIsAddUserOpen,
        isEditUserOpen,
        setIsEditUserOpen,
        isViewCredentialsOpen,
        setIsViewCredentialsOpen,
        isArchiveModalOpen,
        setIsArchiveModalOpen,
        selectedUserId,
        setSelectedUserId,
        archiveUserId,
        setArchiveUserId,
    }
}