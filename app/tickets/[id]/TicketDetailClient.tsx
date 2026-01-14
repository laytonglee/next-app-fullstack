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

export default function TicketDetailClient({ id }: { id: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<Ticket["status"]>("OPEN");
  const [saving, setSaving] = useState(false);

  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  if (!id) return <p style={{ marginTop: 14 }}>Invalid ticket id.</p>;

  async function load() {
    setLoading(true);
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
    await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    await load();
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    setPosting(true);
    await fetch(`/api/tickets/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment }),
    });
    setPosting(false);
    setComment("");
    await load();
  }

  if (loading) return <p style={{ marginTop: 14 }}>Loading...</p>;
  if (!ticket) return <p style={{ marginTop: 14 }}>Ticket not found.</p>;

  return (
    <div style={{ marginTop: 14 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>{ticket.title}</h1>
      <p style={{ color: "#555" }}>{ticket.description}</p>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <strong>Status:</strong>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <button onClick={updateStatus} disabled={saving}>
          {saving ? "Saving..." : "Update"}
        </button>
      </div>

      <form
        onSubmit={postComment}
        style={{ marginTop: 18, display: "grid", gap: 8 }}
      >
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          required
        />
        <button disabled={posting} type="submit">
          {posting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div style={{ marginTop: 18 }}>
        <h3 style={{ fontWeight: 700 }}>Comments</h3>
        {ticket.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {ticket.comments.map((c) => (
              <div
                key={c.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{c.user?.name || c.user?.email}</strong>
                  <span style={{ color: "#777" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ marginTop: 6 }}>{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
