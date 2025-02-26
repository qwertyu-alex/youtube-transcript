import { TranscriptResponse } from "./types";

export function extractVideoId(url: string): string | null {
  const parsedUrl = new URL(url);
  const videoId = parsedUrl.searchParams.get("v");
  return videoId || null;
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function getTranscriptWithoutTimestamps(
  transcript: TranscriptResponse[]
) {
  return transcript
    .map((segment) => segment.text)
    .join("\n")
    .trim();
}

export function getTranscriptWithTimestamps(transcript: TranscriptResponse[]) {
  return transcript
    .map((segment) => {
      const timestamp = formatTimestamp(segment.offsetInSec);
      return `[${timestamp}]\t${segment.text}`;
    })
    .join("\n")
    .trim();
}

export function formatTimestamp(seconds: number): string {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}
