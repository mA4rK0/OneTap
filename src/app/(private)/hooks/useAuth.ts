"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { User } from "@supabase/supabase-js";
import type { Profile } from "@/app/(private)/types";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAuthData = async () => {
      try {
        // Get user authentication data
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) {
          console.error("Failed to get user:", authError);
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (!authData.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(authData.user);

        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, category")
          .eq("user_id", authData.user.id)
          .single();

        if (profileError) {
          // Handle case where profile doesn't exist yet
          if (profileError.code === "PGRST116") {
            setProfile(null);
          } else {
            console.error("Failed to get profile:", profileError);
            setError(profileError.message);
          }
        } else {
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Unexpected error in getAuthData:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    getAuthData();
  }, []);

  return { user, profile, loading, error };
}
