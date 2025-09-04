"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/(private)/lib/supa-client-init";
import Navbar from "./components/Navbar";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        if (data.user) {
          router.replace("/tes");
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <div className="spinner"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
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
