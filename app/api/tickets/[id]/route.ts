import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const patchSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const ticket = await prisma.ticket.findFirst({
    where: { id, userId: user.id },
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { email: true, name: true } } },
      },
    },
  });

  if (!ticket)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(ticket);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const updated = await prisma.ticket.updateMany({
    where: { id, userId: user.id },
    data: { status: parsed.data.status },
  });

  if (updated.count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
