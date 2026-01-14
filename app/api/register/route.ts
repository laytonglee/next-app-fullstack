import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(60).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email already used" }, { status: 409 });
  }

  const hash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name?.trim() || null,
      password: hash,
    },
  });

  return NextResponse.json({ ok: true });
}
