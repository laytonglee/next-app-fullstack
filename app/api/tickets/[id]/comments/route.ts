import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const schema = z.object({
  body: z.string().min(1).max(2000),
});

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
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
  });
  if (!ticket)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const comment = await prisma.comment.create({
    data: { body: parsed.data.body.trim(), ticketId: id, userId: user.id },
  });

  return NextResponse.json(comment, { status: 201 });
}
