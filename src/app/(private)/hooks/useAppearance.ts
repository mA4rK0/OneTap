import { useState } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import type { AppearanceState } from "@/app/(private)/constants/themes";
import useAppearanceStore from "@/app/(private)/hooks/store/appearance";

export const useAppearance = () => {
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [loading, setLoading] = useState(false);

  const store = useAppearanceStore();

  const appearanceState: AppearanceState = {
    background: store.background,
    buttonStyle: store.buttonStyle,
    buttonColor: store.buttonColor,
    textColor: store.textColor,
  };

  const updateAppearance = (updates: Partial<AppearanceState>) => {
    if (updates.background) store.setBackground(updates.background);
    if (updates.buttonStyle) store.setButtonStyle(updates.buttonStyle);
    if (updates.buttonColor) store.setButtonColor(updates.buttonColor);
    if (updates.textColor) store.setTextColor(updates.textColor);
  };

  const loadSettings = async (username: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("appearance_settings")
        .eq("username", username)
        .single();

      if (error) throw error;

      if (data?.appearance_settings) {
        const settings = data.appearance_settings;
        updateAppearance(settings);
      }
    } catch (error) {
      console.error("Error loading appearance settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    appearanceState,
    selectedTheme,
    loading,
    updateAppearance,
    setSelectedTheme,
    loadSettings,
  };
};
