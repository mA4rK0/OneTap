import { useState, useRef } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { v4 as uuidv4 } from "uuid";

export const useAvatar = (userId?: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteExistingAvatar = async (currentAvatarUrl: string) => {
    if (!currentAvatarUrl || !userId) return;

    try {
      const urlParts = currentAvatarUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${userId}/${fileName}`;

      await supabase.storage.from("avatars").remove([filePath]);
    } catch (error) {
      console.warn("Failed to delete old avatar:", error);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.[0] || !userId) return;

    try {
      setUploading(true);

      if (avatarUrl) {
        await deleteExistingAvatar(avatarUrl);
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!avatarUrl || !userId) return;

    try {
      const urlParts = avatarUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${userId}/${fileName}`;

      await supabase.storage.from("avatars").remove([filePath]);

      await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("user_id", userId);

      setAvatarUrl(null);
    } catch (error) {
      console.error("Error removing avatar:", error);
      alert("Error removing avatar");
    }
  };

  return {
    avatarUrl,
    uploading,
    fileInputRef,
    handleAvatarUpload,
    removeAvatar,
    setAvatarUrl,
  };
};
