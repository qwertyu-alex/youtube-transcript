import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { TranscriptResponseData } from "./types";

export const transcriptAtom = atom<TranscriptResponseData | null>(null);

export const previousTranscriptsAtom = atomWithStorage<
  TranscriptResponseData[]
>("previousTranscripts", []);
