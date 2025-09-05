"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { useRouter } from "next/navigation";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import RestrictedAccess from "../components/RestrictedAccess";

type ProfileCategory =
  | "sports"
  | "technology"
  | "music"
  | "art"
  | "business"
  | "education"
  | "entertainment"
  | "food_&_beverage"
  | "travel"
  | "other"
  | "health"
  | "government_&_politics"
  | "fashion_&_beauty";

export default function CategorySelection() {
  const { user, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    ProfileCategory | ""
  >("");
  const [formError, setFormError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const formatCategoryLabel = (value: string): string => {
    return value
      .split("_")
      .map((word) => {
        if (word === "&") return "&";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ")
      .replace(/\b&\b/g, "&");
  };

  const categories = (
    [
      "sports",
      "technology",
      "music",
      "art",
      "business",
      "education",
      "entertainment",
      "food_&_beverage",
      "travel",
      "other",
      "health",
      "government_&_politics",
      "fashion_&_beauty",
    ] as ProfileCategory[]
  ).map((value) => ({
    value,
    label: formatCategoryLabel(value),
  }));

  useEffect(() => {
    const checkUserAndProfile = async () => {
      try {
        setProfileLoading(true);

        if (authLoading) {
          return;
        }

        if (!user) {
          setProfileLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, category")
          .eq("user_id", user.id)
          .single();

        if (profileData) {
          setUsername(profileData.username);

          if (profileData.category) {
            router.push("/tes");
            return;
          }
        }

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error checking profile:", profileError);
        }

        const tempUsername = localStorage.getItem("tempUsername");
        if (!tempUsername) {
          router.push("/linkusername");
          return;
        }

        setUsername(tempUsername);
      } catch (err) {
        console.error("Error in checkUserAndProfile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    checkUserAndProfile();
  }, [user, authLoading, router]);

  const loading = authLoading || profileLoading;

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

    const tempUsername = localStorage.getItem("tempUsername");
    if (!tempUsername) {
      setFormError(
        "Username not found. Please go back and enter your username again."
      );
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        username: tempUsername,
        category: selectedCategory,
      });

      if (error) {
        console.error("Error inserting profile:", error);

        if (error.code === "23505") {
          setFormError(
            "This username is no longer available. Please go back and choose a different username."
          );
          localStorage.removeItem("tempUsername");
        } else {
          setFormError(error.message);
        }

        setSubmitting(false);
        return;
      }

      localStorage.removeItem("tempUsername");
      router.push("/tes");
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
            Welcome{username ? `, ${username}` : ""} to OneTap
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
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
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
            {submitting ? "Creating your profile..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
