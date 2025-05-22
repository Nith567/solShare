import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const files = await prisma.fileShare.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(files);
  } catch (err) {
    console.error("DB fetch error", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
