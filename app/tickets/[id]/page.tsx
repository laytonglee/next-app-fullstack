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
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 12 }}>
      <a href="/tickets">← Back</a>
      <TicketDetailClient id={id} />
    </div>
  );
}
