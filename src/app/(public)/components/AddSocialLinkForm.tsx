"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS } from "@/app/(private)/constants/socialPlatforms";
import type {
  SocialPlatform,
  AddSocialLinkFormProps,
} from "@/app/(private)/types";

export default function AddSocialLinkForm({
  onAddLink,
  onCancel,
}: AddSocialLinkFormProps) {
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("instagram");
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const platformConfig = SOCIAL_PLATFORMS[selectedPlatform];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsAdding(true);
    try {
      let finalUrl = url.trim();

      // Add base URL if not already present and platform has baseUrl
      if (platformConfig.baseUrl && !finalUrl.startsWith("http")) {
        finalUrl = platformConfig.baseUrl + finalUrl;
      }

      // Special handling for specific platforms
      if (selectedPlatform === "email" && !finalUrl.startsWith("mailto:")) {
        finalUrl = "mailto:" + finalUrl;
      }

      onAddLink(selectedPlatform, finalUrl);
      setUrl("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Add Social Link</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            value={selectedPlatform}
            onChange={(e) =>
              setSelectedPlatform(e.target.value as SocialPlatform)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
              <option key={key} value={key}>
                {platform.icon} {platform.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {SOCIAL_PLATFORMS[selectedPlatform].name} URL or Username
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={platformConfig.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {platformConfig.baseUrl && (
            <p className="text-xs text-gray-500 mt-1">
              Will be converted to: {platformConfig.baseUrl}...
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isAdding || !url.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? "Adding..." : "Add Link"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
