// components/SocialLinksManager.tsx
"use client";

import { useState, useEffect } from "react";
import { useSocialLinks } from "@/app/(private)/hooks/useSocialLinks";
import type {
  SocialPlatform,
  SocialLinksManagerProps,
} from "@/app/(private)/types";
import AddSocialLinkForm from "./AddSocialLinkForm";
import SocialLinkItem from "./SocialLinkItem";

export default function SocialLinksManager({
  userId,
  onLinksUpdate,
}: SocialLinksManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const {
    links,
    loading,
    error,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    refetch,
  } = useSocialLinks(userId);

  // Notify parent when links change
  useEffect(() => {
    if (onLinksUpdate) {
      onLinksUpdate(links);
    }
  }, [links, onLinksUpdate]);

  const handleAddLink = async (platform: SocialPlatform, url: string) => {
    const result = await addLink(platform, url);
    if (result) {
      setShowAddForm(false);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (id: string) => {
    setDragOverId(id);
  };

  const handleDrop = () => {
    if (draggingId && dragOverId && draggingId !== dragOverId) {
      const newLinks = [...links];
      const draggingIndex = newLinks.findIndex(
        (link) => link.id === draggingId
      );
      const dragOverIndex = newLinks.findIndex(
        (link) => link.id === dragOverId
      );

      const [draggedItem] = newLinks.splice(draggingIndex, 1);
      newLinks.splice(dragOverIndex, 0, draggedItem);

      reorderLinks(newLinks);
    }

    setDraggingId(null);
    setDragOverId(null);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2 text-sm">Loading links...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600 bg-red-50 rounded-lg">
        <p className="text-sm">Error loading links</p>
        <button
          onClick={refetch}
          className="mt-1 bg-blue-600 text-white px-3 py-1 rounded text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
          <p className="text-sm text-gray-600">
            Manage your social media links
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Add Link
        </button>
      </div>

      {showAddForm ? (
        <AddSocialLinkForm
          onAddLink={handleAddLink}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {links.map((link) => (
              <SocialLinkItem
                key={link.id}
                link={link}
                onUpdate={updateLink}
                onDelete={deleteLink}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggingId === link.id}
              />
            ))}
          </div>

          {links.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-3xl mb-2 opacity-50">🔗</div>
              <p className="text-gray-500 text-sm">No links added yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Add First Link
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
