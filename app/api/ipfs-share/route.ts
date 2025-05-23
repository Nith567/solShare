// app/api/ipfs-share/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata"
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const FileId = searchParams.get("id");
  const base64Payment = searchParams.get("402base64");

  if (!FileId) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!base64Payment) {
    return NextResponse.json(
      { error: "Payment information base64 is not definirte required" },
      { status: 400 }
    );
  }

console.log(FileId, "and ", "id", FileId)
  try {

    const file = await prisma.fileShare.findUnique({
      where: { id: FileId },
    });
    if (!file || !file.cid) {
      return NextResponse.json({ error: "File or CID not found" }, { status: 404 });
    }
    const url = await pinata.gateways.private.createAccessLink({
      cid: file.cid,
      expires: 50
    });
    return NextResponse.redirect(url, 303);
    
  } catch (err) {
    console.error("Error fetching file by ID", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// http://localhost:3000/api/ipfs-share?id=GOwXDtDlolr0c6K-5fkCV&402base64=eyJ2ZXJzaW9uIjoxLCJzY2hlbWUiOiJleGFjdCIsIm5hbWVzcGFjZSI6InNvbGFuYSIsIm5ldHdvcmtJZCI6Im1haW5uZXQiLCJyZXNvdXJjZSI6InNvbGFuYS1pbWFnZS0xNzQ4MDMzNTQ5MDAzIiwicGF5bG9hZCI6eyJ0eXBlIjoidHJhbnNhY3Rpb24iLCJzaWduYXR1cmUiOiIyc1B1TkVxOEo3elBjOWlLREJINFZrWmZQRXF2OG44YUdWbk5TSlhvQXFHRVJhU0QzSGlkN0ZGR1BIU2lGYURoaDJtemF2MzhGMmFMSm9UVkZ1cnBxdkx4IiwibWVtbyI6InNvbGFuYS1pbWFnZS0xNzQ4MDMzNTQ5MDAzIn19