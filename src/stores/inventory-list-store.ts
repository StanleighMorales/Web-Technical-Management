import { create } from "zustand";

interface IInventoryList {
    currentPage: number
    setCurrentPage: (value: number) => void
    showAlert: boolean
    setShowAlert: (value: boolean) => void
    showMessage: string
    setShowMessage: (value: string) => void
    isAddItemFormOpen: boolean
    setIsAddItemFormOpen: (value: boolean) => void
    showAlertSuccess: boolean
    setShowAlertSuccess: (value: boolean) => void
    showAlertFailed: boolean
    setShowAlertFailed: (value: boolean) => void
    isImporting: boolean
    setIsImporting: (value: boolean) => void
    isExporting: boolean
    setIsExporting: (value: boolean) => void
    isMoreMenuOpen: boolean
    setIsMoreMenuOpen: (value: boolean) => void
    showPrintBarcodeModal: boolean,
    setShowPrintBarcodeModal: (value: boolean) => void
    printCurrentPage: number
    setPrintCurrentPage: (value: number) => void
    isGeneratingPDF: boolean
    setIsGeneratingPDF: (value: boolean) => void
}

const inventoryListStore = create<IInventoryList>((set) => ({
    currentPage: 1,
    setCurrentPage: (value) => set(() => ({
        currentPage: value
    })),
    showAlert: false,
    setShowAlert: (value) => set(() => ({
        showAlert: value
    })),
    showMessage: "",
    setShowMessage: (value) => set(() => ({
        showMessage: value
    })),
    isAddItemFormOpen: false,
    setIsAddItemFormOpen: (value) => set(() => ({
        isAddItemFormOpen: value
    })),
    showAlertSuccess: false,
    setShowAlertSuccess: (value) => set(() => ({
        showAlertSuccess: value
    })),
    showAlertFailed: false,
    setShowAlertFailed: (value) => set(() => ({
        showAlertFailed: value
    })),
    isImporting: false,
    setIsImporting: (value) => set(() => ({
        isImporting: value
    })),
    isExporting: false,
    setIsExporting: (value) => set(() => ({
        isExporting: value
    })),
    isMoreMenuOpen: false,
    setIsMoreMenuOpen: (value) => set(() => ({
        isMoreMenuOpen: value
    })),
    showPrintBarcodeModal: false,
    setShowPrintBarcodeModal: (value) => set(() => ({
        showPrintBarcodeModal: value
    })),
    printCurrentPage: 1,
    setPrintCurrentPage: (value) => set(() => ({
        printCurrentPage: value
    })),
    isGeneratingPDF: false,
    setIsGeneratingPDF:  (value) => set(() => ({
        isGeneratingPDF: value
    })),
}))

export const useInventoryListStore = () => {
    const currentPage = inventoryListStore((state) => state.currentPage)
    const setCurrentPage = inventoryListStore((state) => state.setCurrentPage)
    const showAlert = inventoryListStore((state) => state.showAlert)
    const setShowAlert = inventoryListStore((state) => state.setShowAlert)
    const showMessage = inventoryListStore((state) => state.showMessage)
    const setShowMessage = inventoryListStore((state) => state.setShowMessage)
    const isAddItemFormOpen = inventoryListStore((state) => state.isAddItemFormOpen)
    const setIsAddItemFormOpen = inventoryListStore((state) => state.setIsAddItemFormOpen)
    const showAlertSuccess = inventoryListStore((state) => state.showAlertSuccess)
    const setShowAlertSuccess = inventoryListStore((state) => state.setShowAlertSuccess)
    const showAlertFailed = inventoryListStore((state) => state.showAlertFailed)
    const setShowAlertFailed = inventoryListStore((state) => state.setShowAlertFailed)
    const isImporting = inventoryListStore((state) => state.isImporting)
    const setIsImporting = inventoryListStore((state) => state.setIsImporting)
    const isExporting = inventoryListStore((state) => state.isExporting)
    const setIsExporting = inventoryListStore((state) => state.setIsExporting)
    const isMoreMenuOpen = inventoryListStore((state) => state.isMoreMenuOpen)
    const setIsMoreMenuOpen = inventoryListStore((state) => state.setIsMoreMenuOpen)
    const showPrintBarcodeModal = inventoryListStore((state) => state.showPrintBarcodeModal)
    const setShowPrintBarcodeModal = inventoryListStore((state) => state.setShowPrintBarcodeModal)
    const printCurrentPage = inventoryListStore((state) => state.printCurrentPage)
    const setPrintCurrentPage = inventoryListStore((state) => state.setPrintCurrentPage)
    const isGeneratingPDF = inventoryListStore((state) => state.isGeneratingPDF)
    const setIsGeneratingPDF = inventoryListStore((state) => state.setIsGeneratingPDF)

    return {
        currentPage,
        setCurrentPage,
        showAlert,
        setShowAlert,
        showMessage,
        setShowMessage,
        isAddItemFormOpen,
        setIsAddItemFormOpen,
        showAlertSuccess,
        setShowAlertSuccess,
        showAlertFailed,
        setShowAlertFailed,
        isImporting,
        isExporting,
        setIsImporting,
        setIsExporting,
        isMoreMenuOpen,
        setIsMoreMenuOpen,
        showPrintBarcodeModal,
        setShowPrintBarcodeModal,
        printCurrentPage,
        setPrintCurrentPage,
        isGeneratingPDF,
        setIsGeneratingPDF
    };
};
