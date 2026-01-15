import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsClient from "./TicketsClient";

export default async function TicketsPage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Top Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              My Tickets
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Create, track, and update your support tickets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
              Signed in as{" "}
              <span className="font-semibold text-white">
                {session.user.name}
              </span>
            </div>

            <a
              href="/api/auth/signout"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              Logout
            </a>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-base font-semibold text-white">
              Ticket Dashboard
            </h2>
            <p className="mt-1 text-sm text-white/60">
              View your latest tickets and add new requests.
            </p>
          </div>

          <div className="px-6 py-6">
            <TicketsClient />
          </div>
        </div>
      </div>
    </div>
  );
}
