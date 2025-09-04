"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <main className="min-h-screen p-4">
      <div className="card max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold gradient-text mb-6">
          Welcome, {user.email}!
        </h1>

        <button
          onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          className="btn-primary flex items-center justify-center gap-2 mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-5 h-5"
          >
            <path d="M12 10V8H6V6h6V4l4 3-4 3z" />
            <path d="M10 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6v-2H4V4h6V2z" />
          </svg>
          log out
        </button>
      </div>
    </main>
  );
}
