"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
};

export default function TicketsClient() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

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
      setMsg(data.error || "Create failed");
      return;
    }

    setTitle("");
    setDescription("");
    setMsg("Created!");
    await loadTickets();
  }

  return (
    <div style={{ marginTop: 16 }}>
      <form onSubmit={createTicket} style={{ display: "grid", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ticket title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
          required
          rows={4}
        />
        <button disabled={creating} type="submit">
          {creating ? "Creating..." : "Create Ticket"}
        </button>
        {msg && <p>{msg}</p>}
      </form>

      <div style={{ marginTop: 20 }}>
        {loadingList ? (
          <p>Loading...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {tickets.map((t) => (
              <a
                key={t.id}
                href={`/tickets/${t.id}`}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{t.title}</strong>
                  <span>{t.status}</span>
                </div>
                <p style={{ marginTop: 6, color: "#555" }}>
                  {t.description.slice(0, 120)}
                  {t.description.length > 120 ? "..." : ""}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
