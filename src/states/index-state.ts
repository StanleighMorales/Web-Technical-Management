import { create } from "zustand";

interface ICommonState {
    showSuccessAlert: boolean,
    setShowSuccessAlert: (value: boolean) => void
    showErrorAlert: boolean
    setShowErrorAlert: (value: boolean) => void
    showSuccessMessage: string
    setShowSuccessMessage: (value: string) => void
    showErrorMessage: string
    setShowErrorMessage: (value: string) => void 
}

const CommonState = create<ICommonState>((set) => ({
    showSuccessAlert: false,
    setShowSuccessAlert: (value) => set(() => ({
        showSuccessAlert: value
    })),
    showErrorAlert: false,
    setShowErrorAlert: (value) => set(() => ({
        showErrorAlert: value
    })),
    showSuccessMessage: "",
    setShowSuccessMessage: (value) => set(() => ({
        showSuccessMessage: value
    })),
    showErrorMessage: "",
    setShowErrorMessage: (value) => set(() => ({
        showErrorMessage: value
    }))
}))


export const useCommonState = () => {
    const showSuccessAlert = CommonState((state) => state.showSuccessAlert)
    const setShowSuccessAlert = CommonState((state) => state.setShowSuccessAlert)
    const showErrorAlert = CommonState((state) => state.showErrorAlert)
    const setShowErrorAlert = CommonState((state) => state.setShowErrorAlert)
    const showSuccessMessage = CommonState((state) => state.showSuccessMessage)
    const setShowSuccessMessage = CommonState((state) => state.setShowSuccessMessage)
    const showErrorMessage = CommonState((state) => state.showErrorMessage)
    const setShowErrorMessage = CommonState((state) => state.setShowErrorMessage)
    return {
        showSuccessAlert,
        setShowSuccessAlert,
        showErrorAlert,
        setShowErrorAlert,
        showSuccessMessage,
        setShowSuccessMessage,
        showErrorMessage,
        setShowErrorMessage
    }
}