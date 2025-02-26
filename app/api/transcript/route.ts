import { YoutubeTranscript } from "@/app/transcript";
import { extractVideoId } from "@/app/util";
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { parse } from "node-html-parser";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    console.log("Received URL:", url); // Log the received URL

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const { transcript, title } = await YoutubeTranscript.fetchTranscript(
      videoId
    );

    const sanitizedTranscript = transcript.map((item) => ({
      ...item,
      text: parse(sanitizeHtml(item.text)).textContent,
    }));

    return NextResponse.json({ transcript: sanitizedTranscript, title });
  } catch (error) {
    console.error("Detailed API error:", error); // Log the detailed error
    return NextResponse.json(
      {
        error:
          "Failed to fetch transcript. Please make sure the video exists and has captions available.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
