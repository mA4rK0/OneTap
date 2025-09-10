import { create } from "zustand";

type AppearanceState = {
  background: string;
  buttonStyle: "rounded-lg" | "rounded-full";
  buttonColor: string;
  textColor: string;
};

type AppearanceActions = {
  setBackground: (newBg: string) => void;
  setButtonStyle: (newStyle: AppearanceState["buttonStyle"]) => void;
  setButtonColor: (newColor: string) => void;
  setTextColor: (newColor: string) => void;
};

type AppearanceStore = AppearanceState & AppearanceActions;

const useAppearanceStore = create<AppearanceStore>((set) => ({
  // Default State
  background: "#ffffff",
  buttonStyle: "rounded-full",
  buttonColor: "#000000",
  textColor: "#ffffff",

  // Actions
  setBackground: (newBg) => set({ background: newBg }),
  setButtonStyle: (newStyle) => set({ buttonStyle: newStyle }),
  setButtonColor: (newColor) => set({ buttonColor: newColor }),
  setTextColor: (newColor) => set({ textColor: newColor }),
}));

export default useAppearanceStore;
