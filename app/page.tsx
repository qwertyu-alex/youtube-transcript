"use client";

import { useState } from "react";
import TranscriptForm from "@/components/TranscriptForm";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import { TranscriptResponse } from "./transcript";

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptResponse[] | null>(
    null
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">YouTube Transcript Generator</h1>
      <TranscriptForm onTranscriptFetched={setTranscript} />
      {transcript && <TranscriptDisplay transcript={transcript} />}
    </main>
  );
}
