import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const file = await prisma.fileShare.findUnique({
      where: { id },
      select:{
        id: true,
        title: true,
        metadata: true,
        price: true,
        owner: true,
        cid:false,
      }
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (err) {
    console.error("Error fetching file by ID", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
