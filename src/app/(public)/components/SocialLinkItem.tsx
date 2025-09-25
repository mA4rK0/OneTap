"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS } from "@/app/(private)/constants/socialPlatforms";
import type { SocialLinkItemProps } from "@/app/(private)/types";

export default function SocialLinkItem({
  link,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: SocialLinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(link.url);
  const [isUpdating, setIsUpdating] = useState(false);

  const platformConfig = SOCIAL_PLATFORMS[link.platform];

  const handleSave = async () => {
    if (!editedUrl.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(link.id, { url: editedUrl });
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedUrl(link.url);
    setIsEditing(false);
  };

  const getDisplayUrl = (url: string) => {
    if (url.startsWith("mailto:")) return url.replace("mailto:", "");
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 border rounded-lg bg-white group hover:shadow-md transition-all ${
        isDragging ? "opacity-50 border-blue-500" : "border-gray-200"
      }`}
      draggable
      onDragStart={() => onDragStart(link.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(link.id);
      }}
      onDrop={onDrop}
      onDragEnd={onDrop}
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-gray-400 hover:text-gray-600">⁞⁞</div>

      {/* Platform Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${platformConfig.color}`}
      >
        <span className="text-lg">{platformConfig.icon}</span>
      </div>

      {/* Link Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Enter URL..."
          />
        ) : (
          <>
            <div className="font-medium text-sm">{platformConfig.name}</div>
            <div className="text-gray-600 text-sm truncate">
              {getDisplayUrl(link.url)}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(link.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
