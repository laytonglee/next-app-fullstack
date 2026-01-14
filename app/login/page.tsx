"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
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
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Login</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, marginTop: 14 }}
      >
        <input name="email" placeholder="Email" type="email" required />
        <input
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>
      <p style={{ marginTop: 10 }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
