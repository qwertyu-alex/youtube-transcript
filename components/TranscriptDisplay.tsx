import { TranscriptResponse } from "@/app/transcript";
import {
  copyToClipboard,
  getTranscriptWithTimestamps,
  getTranscriptWithoutTimestamps,
} from "../app/util";
import { Button } from "./ui/button";

interface TranscriptDisplayProps {
  transcript: TranscriptResponse[];
}

export default function TranscriptDisplay(props: TranscriptDisplayProps) {
  const handleCopyWithoutTimestamps = () => {
    const cleanTranscript = getTranscriptWithoutTimestamps(props.transcript);
    copyToClipboard(cleanTranscript);
  };

  const handleCopyWithTimestamps = () => {
    const timestampedTranscript = getTranscriptWithTimestamps(props.transcript);
    copyToClipboard(timestampedTranscript);
  };

  return (
    <div className="mt-4" style={{ userSelect: "none" }}>
      <div className="flex gap-2 mb-4">
        <Button onClick={handleCopyWithoutTimestamps}>
          Copy without timestamps
        </Button>
        <Button onClick={handleCopyWithTimestamps}>Copy with timestamps</Button>
      </div>
      <div
        className="whitespace-pre-wrap border p-4 rounded"
        style={{ userSelect: "none" }}
      >
        {props.transcript.map((item, index) => (
          <div key={index} className="mb-2 flex">
            <div
              className="flex-grow"
              style={{
                userSelect: "text",
                cursor: "text",
              }}
            >
              {item.text}
            </div>
            <div
              className="text-gray-500 ml-4 shrink-0"
              style={{ userSelect: "none" }}
            >
              {new Date(item.offset * 1000).toISOString().substr(11, 8)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
