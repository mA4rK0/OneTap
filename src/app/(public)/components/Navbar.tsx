"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="glass p-4 flex justify-between items-center rounded-lg shadow-lg sticky top-4 mx-4 mt-4 z-50">
      <div className="text-xl font-bold gradient-text">OneTap</div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="px-4 py-2 text-sm font-medium">
              Welcome, {user.email}
            </span>
            <button onClick={handleSignOut} className="btn-primary">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="btn-secondary">Log in</button>
            </Link>

            <Link href="/signup">
              <button className="btn-primary">Sign up for free</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
