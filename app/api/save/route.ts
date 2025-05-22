import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      metadata,
      price,
      owner,
      cid
    } = body;

    const fileShare = await prisma.fileShare.create({
      data: {
        title,
        metadata,
        price,
        owner,
        cid
      },
    });
    console.log("fileShare", fileShare);
    return NextResponse.json({ id: fileShare.id }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "error creating the file share entry" },
      { status: 500 }
    );
  }
}
