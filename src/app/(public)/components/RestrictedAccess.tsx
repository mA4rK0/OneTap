"use client";

import { useRouter } from "next/navigation";

export default function RestrictedAccess() {
  const router = useRouter();

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
          <button onClick={() => router.push("/login")} className="btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
