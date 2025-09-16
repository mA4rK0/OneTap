import { supabase } from "@/app/(private)/lib/supa-client-init";
import { notFound } from "next/navigation";

export default async function PublicPage({
  params,
}: {
  params: { username: string };
}) {
  // Fetch user profile based on username
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, appearance_settings")
    .eq("username", params.username)
    .single();

  if (error || !profile) {
    notFound();
  }

  return (
    <div
      className="min-h-screen p-4 flex items-center justify-center"
      style={{
        backgroundColor: profile.appearance_settings?.background || "#ffffff",
      }}
    >
      <div className="max-w-md w-full text-center">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: profile.appearance_settings?.textColor || "#000000" }}
        >
          @{profile.username}
        </h1>

        <div className="space-y-4">
          {/* Contoh tautan - nanti bisa diganti dengan data dinamis */}
          <a
            href="#"
            className={`block py-3 px-4 ${
              profile.appearance_settings?.buttonStyle || "rounded-full"
            } hover:opacity-90 transition-opacity`}
            style={{
              backgroundColor:
                profile.appearance_settings?.buttonColor || "#000000",
              color: profile.appearance_settings?.textColor || "#ffffff",
            }}
          >
            Example Link
          </a>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  return {
    title: `${params.username} - My Links`,
  };
}
