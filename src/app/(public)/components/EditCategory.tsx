"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { useRouter } from "next/navigation";
import type { ProfileCategory, EditCategoryProps } from "@/app/(private)/types";

export default function EditCategory({
  currentCategory,
  onSuccess,
}: EditCategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ProfileCategory | ""
  >((currentCategory as ProfileCategory) || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const categories: { value: ProfileCategory; label: string }[] = [
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" },
    { value: "music", label: "Music" },
    { value: "art", label: "Art" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "food_&_beverage", label: "Food & Beverage" },
    { value: "travel", label: "Travel" },
    { value: "other", label: "Other" },
    { value: "health", label: "Health" },
    { value: "government_&_politics", label: "Government & Politics" },
    { value: "fashion_&_beauty", label: "Fashion & Beauty" },
  ];

  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory as ProfileCategory);
    }
  }, [currentCategory]);

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      setMessage({ type: "error", text: "Please select a category" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      // Update category in database
      const { error } = await supabase
        .from("profiles")
        .update({
          category: selectedCategory,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setMessage({ type: "success", text: "Category updated successfully!" });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage({ type: "error", text: "Failed to update category" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Edit Category</h2>

      <form onSubmit={handleUpdateCategory} className="space-y-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select a category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as ProfileCategory)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedCategory}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
