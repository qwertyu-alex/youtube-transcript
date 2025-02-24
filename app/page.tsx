"use client";

import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import TranscriptForm from "@/components/TranscriptForm";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import { TranscriptResponseData } from "./types";
import Image from "next/image";
import { transcriptAtom } from "./atoms";

export default function Home() {
  const transcript = useAtomValue(transcriptAtom);

  return (
    <main className="container mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold text-center">
          📺 Free YouTube Transcript Generator
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Fastest way to get transcripts from Youtube videos. Don't believe me?
          Try it yourself!
        </p>
      </div>
      <TranscriptForm />
      {transcript && <TranscriptDisplay transcriptData={transcript} />}
      <footer className="mt-8 text-center text-gray-500">
        <a
          href="https://github.com/qwertyu-alex/youtube-transcript"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors flex items-center justify-center gap-2 hover:underline"
        >
          <p>Open source on GitHub</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block mr-2"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
        <a
          href="https://x.com/qwertyu_alex"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors flex items-center justify-center gap-1 hover:underline"
        >
          <p>Follow me on</p>
          <Image
            src="/x-logo.svg"
            alt="X"
            width={20}
            height={20}
            className="inline-block text-gray-400"
          />
        </a>
      </footer>
    </main>
  );
}
