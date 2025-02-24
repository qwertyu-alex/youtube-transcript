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
    console.log("Extracted video ID:", videoId); // Log the extracted video ID

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log("Transcript fetched successfully"); // Log success

    const sanitizedTranscript = transcript.map((item) => ({
      ...item,
      text: parse(sanitizeHtml(item.text)).textContent,
    }));

    return NextResponse.json({ transcript: sanitizedTranscript });
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
