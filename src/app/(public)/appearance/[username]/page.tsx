"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import RestrictedAccess from "../../components/RestrictedAccess";
import { useAppearance } from "@/app/(private)/hooks/useAppearance";
import { useAvatar } from "@/app/(private)/hooks/useAvatar";
import { ButtonStyle, THEMES } from "@/app/(private)/constants/themes";
import AppearanceForm from "@/app/(public)/components/AppearanceForm";
import Preview from "@/app/(public)/components/Preview";

export default function AppearancePage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    appearanceState,
    selectedTheme,
    updateAppearance,
    setSelectedTheme,
    loadSettings,
  } = useAppearance();

  const { avatarUrl, uploading, handleAvatarUpload, removeAvatar } = useAvatar(
    user?.id
  );

  useEffect(() => {
    if (params.username) {
      loadSettings(params.username as string).finally(() => setLoading(false));
    }
  }, [params.username, loadSettings]);

  const handleThemeChange = (themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) {
      setSelectedTheme(themeId);
      updateAppearance({
        background: theme.background,
        buttonColor: theme.buttonColor,
        textColor: theme.textColor,
        buttonStyle: theme.buttonStyle as ButtonStyle,
      });
    }
  };

  const saveAppearanceSettings = async () => {
    if (!user) return;

    try {
      // Save logic would be implemented in useAppearance hook
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving appearance settings:", error);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RestrictedAccess />;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-6 text-center">
          Customize Your Link Page
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <AppearanceForm
            avatarUrl={avatarUrl}
            uploading={uploading}
            selectedTheme={selectedTheme}
            appearanceState={appearanceState}
            onAvatarUpload={handleAvatarUpload}
            onAvatarRemove={removeAvatar}
            onThemeChange={handleThemeChange}
            onAppearanceChange={updateAppearance}
            onSave={saveAppearanceSettings}
            onCancel={() => router.push("/dashboard")}
          />

          <Preview
            username={params.username as string}
            avatarUrl={avatarUrl}
            appearanceState={appearanceState}
            selectedTheme={selectedTheme}
          />
        </div>
      </div>
    </div>
  );
}
