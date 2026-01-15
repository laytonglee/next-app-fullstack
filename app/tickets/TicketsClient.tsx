"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
};

function statusBadge(status: Ticket["status"]) {
  switch (status) {
    case "OPEN":
      return "bg-emerald-500/10 text-emerald-200 border-emerald-500/20";
    case "IN_PROGRESS":
      return "bg-amber-500/10 text-amber-200 border-amber-500/20";
    case "RESOLVED":
      return "bg-sky-500/10 text-sky-200 border-sky-500/20";
    default:
      return "bg-white/10 text-white/70 border-white/10";
  }
}

export default function TicketsClient() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function loadTickets() {
    setLoadingList(true);
    const res = await fetch("/api/tickets", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setTickets(data);
    }
    setLoadingList(false);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setCreating(true);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setCreating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg({ type: "error", text: data.error || "Create failed" });
      return;
    }

    setTitle("");
    setDescription("");
    setMsg({ type: "success", text: "Ticket created successfully." });
    await loadTickets();
  }

  return (
    <div className="space-y-6">
      {/* Create Ticket */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">
              Create a ticket
            </h3>
            <p className="mt-1 text-sm text-white/60">
              Describe the issue clearly for faster support.
            </p>
          </div>
          <span className="hidden sm:inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            Tip: include steps to reproduce
          </span>
        </div>

        <form onSubmit={createTicket} className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-white/80">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Internet is slow"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue... (location, time, screenshots, etc.)"
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40"
            />
            <div className="text-xs text-white/40">
              {description.length}/5000
            </div>
          </div>

          {msg && (
            <div
              className={[
                "rounded-xl border px-4 py-3 text-sm",
                msg.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/30 bg-red-500/10 text-red-200",
              ].join(" ")}
            >
              {msg.text}
            </div>
          )}

          <button
            disabled={creating}
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Ticket"}
          </button>
        </form>
      </div>

      {/* Tickets List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Your tickets</h3>
          <button
            onClick={loadTickets}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            type="button"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4">
          {loadingList ? (
            <div className="space-y-3">
              <div className="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
              <div className="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
              <div className="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-white/70">No tickets yet.</p>
              <p className="mt-1 text-sm text-white/50">
                Create your first ticket above.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {tickets.map((t) => (
                <a
                  key={t.id}
                  href={`/tickets/${t.id}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white group-hover:text-white">
                          {t.title}
                        </h4>
                        <span
                          className={[
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                            statusBadge(t.status),
                          ].join(" ")}
                        >
                          {t.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/60">
                        {t.description.slice(0, 140)}
                        {t.description.length > 140 ? "..." : ""}
                      </p>
                    </div>

                    <div className="hidden sm:block text-xs text-white/40">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                    <span>Open details →</span>
                    <span className="sm:hidden">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
