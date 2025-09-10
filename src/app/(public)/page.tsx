"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, category")
            .eq("user_id", data.user.id)
            .single();

          if (profile?.username && profile?.category) {
            router.push("/dashboard");
          } else if (profile?.username) {
            router.push("/category");
          } else {
            router.push("/linkusername");
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold gradient-text mb-6">
          Selamat Datang di OneTap
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Solusi autentikasi modern dengan teknologi terdepan untuk pengalaman
          pengguna yang seamless dan aman.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/signup")}
            className="btn-primary"
          >
            Mulai Sekarang
          </button>
          <button
            onClick={() => router.push("/login")}
            className="btn-secondary"
          >
            Pelajari Lebih Lanjut
          </button>
        </div>
      </main>
    </div>
  );
}
