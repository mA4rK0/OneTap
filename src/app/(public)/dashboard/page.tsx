"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import useAuth from "@/app/(private)/hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import RestrictedAccess from "../components/RestrictedAccess";

export default function Dashboard() {
  const { user, profile, loading, error } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      return;
    }

    if (!profile?.username && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/linkusername");
      return;
    }

    if (!profile?.category && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/category");
      return;
    }
  }, [user, profile, loading, router, isRedirecting]);

  if (loading || isRedirecting) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <RestrictedAccess />;
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
        <p className="text-lg text-gray-600 mb-8">
          Username: {profile?.username || "Not set"} | Category:{" "}
          {profile?.category || "Not set"}
        </p>

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
          Log out
        </button>
      </div>
    </main>
  );
}
