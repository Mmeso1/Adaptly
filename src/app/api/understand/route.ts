import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();
  console.log("Received text:", text);

  // Simulate some processing
  const processedText = text.toUpperCase();

  return NextResponse.json({ processedText });
}
