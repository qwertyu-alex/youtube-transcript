"use client";

import type React from "react";

import { previousTranscriptsAtom, transcriptAtom } from "@/app/atoms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";

export default function TranscriptForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousTranscripts, setPreviousTranscripts] = useAtom(
    previousTranscriptsAtom
  );
  const setTranscript = useSetAtom(transcriptAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url || !url.includes("youtube.com")) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const jsonResponse = await response.json(); // Get the raw text response

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (jsonResponse.transcript) {
        setTranscript({
          url: url,
          transcript: jsonResponse.transcript,
          title: jsonResponse.title,
          createdAt: Date.now(),
        });
        setPreviousTranscripts([
          ...previousTranscripts,
          {
            url: url,
            transcript: jsonResponse.transcript,
            title: jsonResponse.title,
            createdAt: Date.now(),
          },
        ]);
      } else {
        throw new Error("No transcript data received");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          required
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Transcript"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
