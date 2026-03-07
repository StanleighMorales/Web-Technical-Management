import { create } from "zustand"
import type { TSummary } from "../types/types"

type SummaryStore = {
    dataSummary: TSummary,
    setSummary: (data: TSummary) => void,
    resetSummary: () => void
}

export const useSummaryStoreData = create<SummaryStore>((set) => ({
    dataSummary: {
        totalItems: 0,
        totalItemsCategories: 0,
        totalActiveUsers: 0,
        totalLentItems: 0
    },
    setSummary: (data) => set((state) => ({
        dataSummary: {
            ...state.dataSummary,
            ...data,
        }
    })),
    resetSummary: () => set({
        dataSummary: {
            totalItems: 0,
            totalItemsCategories: 0,
            totalActiveUsers: 0,
            totalLentItems: 0
        }
    })
}))