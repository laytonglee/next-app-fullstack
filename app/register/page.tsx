"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || "Register failed");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create account
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Register to start creating and tracking tickets.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 pb-6 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">Name</label>
              <input
                name="name"
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 "
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80">
                Password
              </label>
              <input
                name="password"
                placeholder="Minimum 6 characters"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40"
              />
              <p className="text-xs text-white/40">
                Use at least 6 characters.
              </p>
            </div>

            {/* Error */}
            {err && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {err}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/40">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Footer link */}
            <p className="text-center text-sm text-white/60">
              Have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
