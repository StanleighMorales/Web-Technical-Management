import { create } from "zustand";

interface IBorrowItemFormState {
  showReservationModal: boolean;
  setShowReservationModal: (value: boolean) => void;

  reservationDate: string;
  setReservationDate: (value: string) => void;

  reservationTime: string;
  setReservationTime: (value: string) => void;

  /** Resets modal + reservation fields back to their initial values */
  resetReservation: () => void;
}

const borrowItemFormStore = create<IBorrowItemFormState>((set) => ({
  showReservationModal: false,
  setShowReservationModal: (value) => set(() => ({ showReservationModal: value })),

  reservationDate: "",
  setReservationDate: (value) => set(() => ({ reservationDate: value })),

  reservationTime: "07:30",
  setReservationTime: (value) => set(() => ({ reservationTime: value })),

  resetReservation: () =>
    set(() => ({
      showReservationModal: false,
      reservationDate: "",
      reservationTime: "07:30",
    })),
}));

export const useBorrowItemFormState = () => {
  const showReservationModal = borrowItemFormStore((state) => state.showReservationModal);
  const setShowReservationModal = borrowItemFormStore((state) => state.setShowReservationModal);

  const reservationDate = borrowItemFormStore((state) => state.reservationDate);
  const setReservationDate = borrowItemFormStore((state) => state.setReservationDate);

  const reservationTime = borrowItemFormStore((state) => state.reservationTime);
  const setReservationTime = borrowItemFormStore((state) => state.setReservationTime);

  const resetReservation = borrowItemFormStore((state) => state.resetReservation);

  return {
    showReservationModal,
    setShowReservationModal,
    reservationDate,
    setReservationDate,
    reservationTime,
    setReservationTime,
    resetReservation,
  };
};
