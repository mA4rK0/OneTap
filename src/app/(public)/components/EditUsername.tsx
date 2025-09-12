"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import RestrictedAccess from "../components/RestrictedAccess";

export default function UpdateUsername() {
  const { user, profile, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [loading2, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    const getUsername = async () => {
      if (loading) return;

      if (!user) {
        return;
      }

      if (profile?.username) {
        setCurrentUsername(profile.username);
      }
    };

    getUsername();
  }, [user, profile, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RestrictedAccess />;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!username.trim()) {
      setMessage("Username can't be empty");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setMessage("Username minimum 3 characters");
      setLoading(false);
      return;
    }

    try {
      // Update username
      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        // Handle error constraint unique
        if (error.code === "23505") {
          throw new Error("Username already exists");
        }
        throw error;
      }

      setMessage("Username successfully updated!");
      setCurrentUsername(username.trim());
      setUsername("");
    } catch (error) {
      console.error("Error updating username:", error);
      if (error instanceof Error) setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Username</h2>

      {currentUsername && (
        <p className="mb-4 text-gray-600">
          Current Username:{" "}
          <span className="font-semibold">{currentUsername}</span>
        </p>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            New Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            pattern="[a-zA-Z0-9_]+"
            title="Username can only contain letters, numbers, and underscores"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your new username"
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum 3 characters, letters, numbers and underscores only
          </p>
        </div>

        <button
          type="submit"
          disabled={loading2 || !username.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading2 ? "Updating..." : "Username Updated"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
