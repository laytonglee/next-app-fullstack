"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/tickets";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res?.ok) {
      setErr("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="px-6 pt-6 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Sign in to manage your tickets.
            </p>
          </div>

          <form onSubmit={onSubmit} className="px-6 pb-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">Email</label>
              <input
                name="email"
                placeholder="you@example.com"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">
                Password
              </label>
              <input
                name="password"
                placeholder="Your password"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40"
              />
            </div>

            {err && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {err}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-center text-sm text-white/60">
              No account?{" "}
              <a
                href="/register"
                className="font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
