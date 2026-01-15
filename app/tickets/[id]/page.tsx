import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketDetailClient from "./TicketDetailClient";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/login");

  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Top Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/tickets"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              ← Back
            </a>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Ticket Details
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Review and update the ticket status, then add comments.
              </p>
            </div>
          </div>

          <a
            href="/api/auth/signout"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            Logout
          </a>
        </div>

        {/* Main Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-base font-semibold text-white">Ticket</h2>
            <p className="mt-1 text-sm text-white/60">
              Ticket ID: <span className="font-mono text-white/70">{id}</span>
            </p>
          </div>

          <div className="px-6 py-6">
            <TicketDetailClient id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
