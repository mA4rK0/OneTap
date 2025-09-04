import AuthForm from "../components/AuthForm";

export default function SignUp() {
  return <AuthForm mode="signup" />;
}

// "use client";

// import { useState } from "react";
// import { supabase } from "@/app/(private)/lib/supa-client-init";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Magic‑link
//   const handleEmailSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });
//     setMessage(error ? error.message : "Check your email for the login link.");
//     setLoading(false);
//   };

//   // Google OAuth
//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });
//     if (error) setMessage(error.message);
//     setLoading(false);
//   };

//   return (
//     <main style={{ padding: "2rem" }}>
//       <h1>Sign up / Sign in</h1>

//       {/* Email (Magic Link) */}
//       <form onSubmit={handleEmailSignIn}>
//         <input
//           type="email"
//           placeholder="email@example.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ padding: "0.5rem", width: "100%" }}
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
//         >
//           {loading ? "Please wait…" : "Email Magic Link"}
//         </button>
//       </form>

//       <hr style={{ margin: "2rem 0" }} />

//       {/* Google */}
//       <button
//         onClick={handleGoogleSignIn}
//         disabled={loading}
//         style={{
//           backgroundColor: "#4285F4",
//           color: "white",
//           border: "none",
//           padding: "0.6rem 1rem",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//       >
//         {loading ? "Please wait…" : "Continue with Google"}
//       </button>

//       {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
//     </main>
//   );
// }
