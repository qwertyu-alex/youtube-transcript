import { tryMethodB } from "@/app/methods/tryMethodB";
import { TranscriptSegment } from "@/app/types";
import { extractVideoId } from "@/app/util";
import { NextResponse } from "next/server";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";

export async function POST(request: Request) {
  const { url } = await request.json();
  console.log("Received URL:", url); // Log the received URL

  const videoId = extractVideoId(url);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  const videoPageResponse = await fetch(
    `https://www.youtube.com/watch?v=${videoId}`,
    {
      mode: "no-cors",
      headers: {
        "User-Agent": USER_AGENT,
      },
    }
  );
  const videoPageBody = await videoPageResponse.text();

  const transcriptContent = await tryMethodB(videoPageBody);

  return NextResponse.json({
    transcriptContent,
  });
}
