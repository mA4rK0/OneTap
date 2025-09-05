"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import { User } from "@supabase/supabase-js";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Failed to get user:", error);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error getting user:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading };
}
