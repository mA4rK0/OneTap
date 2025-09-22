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
    <div className="w-full lg:w-1/2">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>

        <div className="space-y-6">
          <AvatarUploader
            avatarUrl={avatarUrl}
            uploading={uploading}
            onAvatarUpload={onAvatarUpload}
            onAvatarRemove={onAvatarRemove}
            onButtonClick={() => fileInputRef.current?.click()}
          />

          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={onThemeChange}
          />

          <div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="rounded-full">Rounded Full</option>
              <option value="rounded-lg">Rounded Large</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onSave}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Save Appearance
          </button>
          <button onClick={onCancel} className="btn-secondary">
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
    </div>
  );
}
