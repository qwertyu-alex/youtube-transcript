import { TranscriptResponse } from "@/app/types";
import {
  copyToClipboard,
  formatTimestamp,
  getTranscriptWithTimestamps,
  getTranscriptWithoutTimestamps,
} from "../app/util";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { TranscriptResponseData } from "@/app/types";

interface TranscriptDisplayProps {
  transcriptData: TranscriptResponseData;
}

export default function TranscriptDisplay(props: TranscriptDisplayProps) {
  const handleCopyWithoutTimestamps = () => {
    const cleanTranscript = getTranscriptWithoutTimestamps(
      props.transcriptData.transcript
    );
    copyToClipboard(cleanTranscript);
    toast.success("Copied transcript without timestamps to clipboard");
  };

  const handleCopyWithTimestamps = () => {
    const timestampedTranscript = getTranscriptWithTimestamps(
      props.transcriptData.transcript
    );
    copyToClipboard(timestampedTranscript);
    toast.success("Copied transcript with timestamps to clipboard");
  };

  return (
    <div className="mt-4 mb-8 py-4  space-y-2  ">
      <h2 className="text-lg font-bold">{props.transcriptData.title}</h2>

      <Popover>
        <PopoverTrigger asChild>
          <Button size={"sm"}>
            <Copy className="w-4 h-4 " />
            Copy transcript
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="flex flex-col" sideOffset={-1}>
          <PopoverClose asChild>
            <Button
              onClick={handleCopyWithoutTimestamps}
              size={"sm"}
              variant={"outline"}
            >
              <Copy className="w-4 h-4 " />
              Without timestamps
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={handleCopyWithTimestamps}
              size={"sm"}
              variant={"outline"}
            >
              <Copy className="w-4 h-4 " />
              With timestamps
            </Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>

      <div
        className="whitespace-pre-wrap border p-4 rounded"
        style={{ userSelect: "none" }}
      >
        {props.transcriptData.transcript.map((item, index) => (
          <div key={index} className="mb-2 flex">
            <div
              className="flex-grow"
              style={{
                userSelect: "text",
                cursor: "text",
              }}
            >
              {
                new DOMParser().parseFromString(item.text, "text/html")
                  .documentElement.textContent
              }
            </div>
            <div
              className="text-gray-500 ml-4 shrink-0"
              style={{ userSelect: "none" }}
            >
              {formatTimestamp(item.offsetInSec)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
