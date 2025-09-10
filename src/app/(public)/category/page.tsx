"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { useRouter } from "next/navigation";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import RestrictedAccess from "../components/RestrictedAccess";
import type { ProfileCategory } from "@/app/(private)/types";

export default function CategorySelection() {
  const { user, profile, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    ProfileCategory | ""
  >("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      return;
    }

    if (profile?.category) {
      router.push("/dashboard");
      return;
    }

    if (!profile?.username) {
      router.push("/linkusername");
      return;
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RestrictedAccess />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    if (!selectedCategory || !user) {
      setFormError("Please select a category");
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          category: selectedCategory,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        setFormError(error.message);
        setSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      setFormError("An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to OneTap
          </h1>
          <p className="text-gray-600">Choose your interest category</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={(e) => {
                setSelectedCategory(e.target.value as ProfileCategory);
                setFormError(null);
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                formError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              required
              disabled={submitting}
            >
              <option value="">Select a category</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
              <option value="music">Music</option>
              <option value="art">Art</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="food_&_beverage">Food & Beverage</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
              <option value="health">Health</option>
              <option value="government_&_politics">
                Government & Politics
              </option>
              <option value="fashion_&_beauty">Fashion & Beauty</option>
            </select>
            {formError && (
              <p className="text-red-500 text-sm mt-2">{formError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
