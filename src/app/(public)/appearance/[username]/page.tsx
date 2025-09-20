"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { v4 as uuidv4 } from "uuid";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import RestrictedAccess from "../../components/RestrictedAccess";
import useAppearanceStore from "@/app/(private)/hooks/store/appearance";

export default function AppearancePage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    background,
    buttonStyle,
    buttonColor,
    textColor,
    setBackground,
    setButtonStyle,
    setButtonColor,
    setTextColor,
  } = useAppearanceStore();

  useEffect(() => {
    if (params.username) {
      loadAppearanceSettings(params.username as string);
    }
  }, [params.username]);

  const loadAppearanceSettings = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("appearance_settings, avatar_url")
        .eq("username", username)
        .single();

      if (error) throw error;

      if (data) {
        const settings = data.appearance_settings || {};
        setBackground(settings.background || "#ffffff");
        setButtonStyle(settings.buttonStyle || "rounded-full");
        setButtonColor(settings.buttonColor || "#000000");
        setTextColor(settings.textColor || "#ffffff");

        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (error) {
      console.error("Error loading appearance settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingAvatar = async () => {
    if (!avatarUrl || !user) return;

    try {
      // Ekstrak path file dari URL avatar
      const urlParts = avatarUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      // Hapus file dari storage
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (deleteError) {
        console.warn("Failed to delete old avatar:", deleteError);
        // Lanjutkan proses upload meskipun gagal menghapus file lama
        return;
      }

      console.log("Old avatar deleted successfully");
    } catch (error) {
      console.error("Error deleting old avatar:", error);
      // Lanjutkan proses upload meskipun gagal menghapus file lama
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      if (avatarUrl) {
        await deleteExistingAvatar();
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload gambar ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Dapatkan URL publik
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Simpan URL avatar ke database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user?.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      alert("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      if (!avatarUrl || !user) return;

      // Ekstrak nama file dari URL
      const urlParts = avatarUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      // Hapus file dari storage
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (deleteError) {
        throw deleteError;
      }

      // Hapus URL avatar dari database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(null);
      alert("Avatar removed successfully!");
    } catch (error) {
      console.error("Error removing avatar:", error);
      alert("Error removing avatar");
    }
  };

  const saveAppearanceSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Mengambil state terkini dari Zustand store
      const currentSettings = {
        background,
        buttonStyle,
        buttonColor,
        textColor,
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          appearance_settings: currentSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      alert("Appearance settings saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      alert("Failed to save appearance settings");
    } finally {
      setSaving(false);
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
          {/* Form Settings - Kiri */}
          <div className="w-full lg:w-1/2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">
                Appearance Settings
              </h2>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">Photo</span>
                        )}
                      </div>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-secondary text-sm disabled:opacity-50"
                      >
                        {uploading
                          ? "Uploading..."
                          : avatarUrl
                          ? "Change Photo"
                          : "Upload Photo"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Button Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Button Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Style
                  </label>
                  <select
                    value={buttonStyle}
                    onChange={(e) =>
                      setButtonStyle(
                        e.target.value as "rounded-lg" | "rounded-full"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="rounded-full">Rounded Full</option>
                    <option value="rounded-lg">Rounded Large</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={saveAppearanceSettings}
                  disabled={saving}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Appearance"}
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Preview - Kanan */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="phone-mockup">
              <div className="phone-frame">
                <div
                  className="phone-screen"
                  style={{ backgroundColor: background }}
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Profile Section */}
                    <div className="text-center mb-8 mt-4">
                      <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">Photo</span>
                        )}
                      </div>
                      <h2
                        className="text-xl font-bold mb-2"
                        style={{ color: textColor }}
                      >
                        @{params.username}
                      </h2>
                      <p
                        className="text-sm opacity-80"
                        style={{ color: textColor }}
                      >
                        Bio description goes here
                      </p>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4 flex-1">
                      <div
                        className={`w-full py-3 px-4 ${buttonStyle} text-center`}
                        style={{
                          backgroundColor: buttonColor,
                          color: textColor,
                        }}
                      >
                        Website
                      </div>
                      <div
                        className={`w-full py-3 px-4 ${buttonStyle} text-center`}
                        style={{
                          backgroundColor: buttonColor,
                          color: textColor,
                        }}
                      >
                        Instagram
                      </div>
                      <div
                        className={`w-full py-3 px-4 ${buttonStyle} text-center`}
                        style={{
                          backgroundColor: buttonColor,
                          color: textColor,
                        }}
                      >
                        YouTube
                      </div>
                      <div
                        className={`w-full py-3 px-4 ${buttonStyle} text-center`}
                        style={{
                          backgroundColor: buttonColor,
                          color: textColor,
                        }}
                      >
                        TikTok
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                      <p
                        className="text-xs opacity-70"
                        style={{ color: textColor }}
                      >
                        Powered by OneTap
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tambahkan style untuk phone mockup */}
      <style jsx>{`
        .phone-mockup {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .phone-frame {
          width: 320px;
          height: 650px;
          background: #000;
          border-radius: 40px;
          padding: 14px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 4px #333,
            inset 0 0 0 8px #666;
          position: relative;
          transform: rotateX(5deg) rotateY(-5deg);
          transition: transform 0.3s ease;
        }

        .phone-frame:hover {
          transform: rotateX(0deg) rotateY(0deg);
        }

        .phone-screen {
          height: 100%;
          border-radius: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1024px) {
          .phone-frame {
            width: 300px;
            height: 600px;
          }
        }
      `}</style>
    </div>
  );
}
