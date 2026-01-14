import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsClient from "./TicketsClient";

export default async function TicketsPage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/login");

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 12 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>My Tickets</h1>
        <a href="/api/auth/signout">Logout</a>
      </header>

      <TicketsClient />
    </div>
  );
}
