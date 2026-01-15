import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center text-white/70">
          Loading...
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
