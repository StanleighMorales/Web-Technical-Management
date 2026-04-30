import { create } from "zustand";

interface IInventoryList {
    currentPage: number
    setCurrentPage: (value: number) => void
    isAddItemFormOpen: boolean
    setIsAddItemFormOpen: (value: boolean) => void
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

const inventoryListState = create<IInventoryList>((set) => ({
    currentPage: 1,
    setCurrentPage: (value) => set(() => ({
        currentPage: value
    })),
    isAddItemFormOpen: false,
    setIsAddItemFormOpen: (value) => set(() => ({
        isAddItemFormOpen: value
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

export const useInventoryListState = () => {
    const currentPage = inventoryListState((state) => state.currentPage)
    const setCurrentPage = inventoryListState((state) => state.setCurrentPage)
    const isAddItemFormOpen = inventoryListState((state) => state.isAddItemFormOpen)
    const setIsAddItemFormOpen = inventoryListState((state) => state.setIsAddItemFormOpen)
    const isImporting = inventoryListState((state) => state.isImporting)
    const setIsImporting = inventoryListState((state) => state.setIsImporting)
    const isExporting = inventoryListState((state) => state.isExporting)
    const setIsExporting = inventoryListState((state) => state.setIsExporting)
    const isMoreMenuOpen = inventoryListState((state) => state.isMoreMenuOpen)
    const setIsMoreMenuOpen = inventoryListState((state) => state.setIsMoreMenuOpen)
    const showPrintBarcodeModal = inventoryListState((state) => state.showPrintBarcodeModal)
    const setShowPrintBarcodeModal = inventoryListState((state) => state.setShowPrintBarcodeModal)
    const printCurrentPage = inventoryListState((state) => state.printCurrentPage)
    const setPrintCurrentPage = inventoryListState((state) => state.setPrintCurrentPage)
    const isGeneratingPDF = inventoryListState((state) => state.isGeneratingPDF)
    const setIsGeneratingPDF = inventoryListState((state) => state.setIsGeneratingPDF)

    return {
        currentPage,
        setCurrentPage,
        isAddItemFormOpen,
        setIsAddItemFormOpen,
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
