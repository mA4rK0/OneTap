"use client";

import { useRef } from "react";
import ThemeSelector from "./ThemeSelector";
import AvatarUploader from "./AvatarUploader";
import type { ButtonStyle } from "@/app/(private)/constants/themes";
import type { AppearanceFormProps } from "@/app/(private)/types";

export default function AppearanceForm({
  avatarUrl,
  uploading,
  selectedTheme,
  appearanceState,
  onAvatarUpload,
  onAvatarRemove,
  onThemeChange,
  onAppearanceChange,
  onSave,
  onCancel,
}: AppearanceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full space-y-6">
      <div>
        <AvatarUploader
          avatarUrl={avatarUrl}
          uploading={uploading}
          onAvatarUpload={onAvatarUpload}
          onAvatarRemove={onAvatarRemove}
          onButtonClick={() => fileInputRef.current?.click()}
        />
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Theme
        </label>
        <ThemeSelector
          selectedTheme={selectedTheme}
          onThemeChange={onThemeChange}
        />
      </div>
      {/* Button Style */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Style
        </label>
        <select
          value={appearanceState.buttonStyle}
          onChange={(e) =>
            onAppearanceChange({
              buttonStyle: e.target.value as ButtonStyle,
            })
          }
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="rounded-full">Rounded Full</option>
          <option value="rounded-lg">Rounded Large</option>
        </select>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Save Appearance
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onAvatarUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
