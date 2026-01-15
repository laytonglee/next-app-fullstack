"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  user: { email: string; name: string | null };
};

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  comments: Comment[];
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

export default function TicketDetailClient({ id }: { id: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<Ticket["status"]>("OPEN");
  const [saving, setSaving] = useState(false);

  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!id) return <p className="mt-4 text-white/70">Invalid ticket id.</p>;

  async function load() {
    setLoading(true);
    setMsg(null);

    const res = await fetch(`/api/tickets/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setTicket(data);
      setStatus(data.status);
    } else {
      setTicket(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateStatus() {
    setSaving(true);
    setMsg(null);

    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setSaving(false);

    if (!res.ok) {
      setMsg({ type: "error", text: "Failed to update status." });
      return;
    }

    setMsg({ type: "success", text: "Status updated." });
    await load();
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    setPosting(true);
    setMsg(null);

    const res = await fetch(`/api/tickets/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment }),
    });

    setPosting(false);

    if (!res.ok) {
      setMsg({ type: "error", text: "Failed to post comment." });
      return;
    }

    setComment("");
    setMsg({ type: "success", text: "Comment posted." });
    await load();
  }

  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        <div className="h-7 w-2/3 rounded-lg bg-white/10 animate-pulse" />
        <div className="h-16 rounded-xl bg-white/10 animate-pulse" />
        <div className="h-10 rounded-xl bg-white/10 animate-pulse" />
        <div className="h-40 rounded-2xl bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (!ticket) return <p className="mt-4 text-white/70">Ticket not found.</p>;

  return (
    <div className="space-y-6">
      {/* Ticket header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                {ticket.title}
              </h1>
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                  statusBadge(ticket.status),
                ].join(" ")}
              >
                {ticket.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70">{ticket.description}</p>

            <div className="mt-3 text-xs text-white/40">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Status control */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-white/70">
              Update status
            </div>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>

              <button
                onClick={updateStatus}
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>

        {/* message */}
        {msg && (
          <div
            className={[
              "mt-4 rounded-xl border px-4 py-3 text-sm",
              msg.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200",
            ].join(" ")}
          >
            {msg.text}
          </div>
        )}
      </div>

      {/* Comment form */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-base font-semibold text-white">Add a comment</h3>
        <p className="mt-1 text-sm text-white/60">
          Keep notes clear and professional.
        </p>

        <form onSubmit={postComment} className="mt-4 grid gap-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            required
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40"
          />

          <button
            disabled={posting}
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {posting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>

      {/* Comments list */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Comments</h3>
          <span className="text-xs text-white/40">
            {ticket.comments.length} total
          </span>
        </div>

        {ticket.comments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-white/70">No comments yet.</p>
            <p className="mt-1 text-sm text-white/50">
              Add the first comment above.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {ticket.comments.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">
                      {c.user?.name || c.user?.email}
                    </div>
                    <div className="mt-1 text-xs text-white/40">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-white/70 whitespace-pre-wrap">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
