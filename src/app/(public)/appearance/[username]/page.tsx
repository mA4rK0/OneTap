"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import RestrictedAccess from "../../components/RestrictedAccess";
import { useAppearance } from "@/app/(private)/hooks/useAppearance";
import { useAvatar } from "@/app/(private)/hooks/useAvatar";
import { useSocialLinks } from "@/app/(private)/hooks/useSocialLinks";
import { ButtonStyle, THEMES } from "@/app/(private)/constants/themes";
import AppearanceForm from "@/app/(public)/components/AppearanceForm";
import Preview from "@/app/(public)/components/Preview";
import SocialLinksManager from "@/app/(public)/components/SocialLinksManager";
import type { SocialLink } from "@/app/(private)/types";

export default function AppearancePage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

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

  const { links: fetchedLinks } = useSocialLinks(user?.id);

  // Sync social links between hook and local state
  useEffect(() => {
    setSocialLinks(fetchedLinks);
  }, [fetchedLinks]);

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
      // Save logic here
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving appearance settings:", error);
    }
  };

  const handleLinksUpdate = (links: SocialLink[]) => {
    setSocialLinks(links);
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RestrictedAccess />;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-8 text-center">
          Customize Your Link Page
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                  Page Customization
                </h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Appearance Settings
                  </h3>
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
                </div>

                {/* Social Links Section */}
                <div className="border-t pt-6">
                  <SocialLinksManager
                    userId={user.id}
                    appearanceState={{
                      buttonStyle: appearanceState.buttonStyle,
                      buttonColor: appearanceState.buttonColor,
                      textColor: appearanceState.textColor,
                    }}
                    onLinksUpdate={handleLinksUpdate}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Preview
              username={params.username as string}
              avatarUrl={avatarUrl}
              appearanceState={appearanceState}
              selectedTheme={selectedTheme}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
