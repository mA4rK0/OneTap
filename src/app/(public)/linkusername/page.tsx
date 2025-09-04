"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { useRouter } from "next/navigation";

export default function Username() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          setError("Failed to get user");
          return;
        }

        if (!data.user) {
          setError(null);
          return;
        }

        setUser(data.user);
        setError(null);
      } catch (err) {
        setError("Error getting user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <div className="spinner"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <h2 className="text-2xl font-bold gradient-text mb-6">
            Restricted Access
          </h2>
          <p className="mb-8">
            You need to log in to access this page. Please log in or register
            first.
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => router.push("/signup")}
              className="btn-primary"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push("/login")}
              className="btn-primary"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <h2 className="text-2xl font-bold gradient-text mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full"
          >
            Try again later
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !user) return;
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id, // uuid from auth.users
      username: username.trim(),
    });
    if (error) {
      console.error("Gagal menyimpan username:", error);
      setError(error.message);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to OneTap
          </h1>
          <p className="text-gray-600">Choose your OneTap username</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Continue
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
