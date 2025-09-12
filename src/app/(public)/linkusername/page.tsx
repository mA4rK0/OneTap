"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { useRouter } from "next/navigation";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import RestrictedAccess from "../components/RestrictedAccess";

export default function Username() {
  const { user, profile, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      return;
    }

    if (profile?.username && profile?.category) {
      router.push("/dashboard");
      return;
    }

    if (profile?.username) {
      router.push("/category");
      return;
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RestrictedAccess />;
  }

  const checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking username:", error);
      return false;
    }

    return data === null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!username.trim() || !user) return;

    setCheckingUsername(true);

    try {
      const isAvailable = await checkUsernameAvailability(username.trim());

      if (!isAvailable) {
        setFormError("Username is already taken. Please choose another one.");
        setCheckingUsername(false);
        return;
      }

      const { error } = await supabase.from("profiles").upsert({
        user_id: user.id,
        username: username.trim(),
        category: profile?.category || null,
      });

      if (error) {
        throw error;
      }

      router.push("/category");
    } catch (error) {
      console.error("Error saving username:", error);
      setFormError("An error occurred while saving your username.");
    } finally {
      setCheckingUsername(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to OneTap
          </h1>
          <p className="text-gray-600">Choose your unique username</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormError(null);
              }}
              placeholder="Your username..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                formError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
            />
            {formError && (
              <p className="text-red-500 text-sm mt-2">{formError}</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Username must be 3-20 characters long and can only contain
              letters, numbers, and underscores.
            </p>
          </div>

          <button
            type="submit"
            disabled={checkingUsername}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingUsername ? "Checking availability..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
