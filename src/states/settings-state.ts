import { create } from "zustand";

interface ISettingsState {
  showEditProfile: boolean;
  setShowEditProfile: (value: boolean) => void;
}

const settingsStore = create<ISettingsState>((set) => ({
  showEditProfile: false,
  setShowEditProfile: (value) => set(() => ({ showEditProfile: value })),
}));

export const useSettingsState = () => {
  const showEditProfile = settingsStore((state) => state.showEditProfile);
  const setShowEditProfile = settingsStore((state) => state.setShowEditProfile);

  return {
    showEditProfile,
    setShowEditProfile,
  };
};
