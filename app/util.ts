import { TranscriptResponse } from "./transcript";

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
    .join(" ")
    .trim();
}

export function getTranscriptWithTimestamps(transcript: TranscriptResponse[]) {
  return transcript
    .map((segment) => {
      const timestamp = formatTimestamp(segment.offset);
      return `[${timestamp}] ${segment.text}`;
    })
    .join("\n")
    .trim();
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  }
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}
