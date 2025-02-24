"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TranscriptResponse } from "@/app/transcript";

export default function TranscriptForm(props: {
  onTranscriptFetched: (transcript: TranscriptResponse[]) => void;
}) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !url.includes("youtube.com")) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    try {
      console.log("Submitting URL:", url); // Log the URL being submitted

      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      console.log("Response status:", response.status); // Log the response status

      let data;
      const textResponse = await response.text(); // Get the raw text response
      console.log("Raw response:", textResponse); // Log the raw response

      const decoded = new DOMParser().parseFromString(textResponse, "text/html")
        .documentElement.textContent;

      try {
        data = JSON.parse(decoded || "");
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        throw new Error(`Invalid JSON response: ${decoded}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.transcript) {
        props.onTranscriptFetched(data.transcript);
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
