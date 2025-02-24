"use client";
import { previousTranscriptsAtom, transcriptAtom } from "@/app/atoms";
import { relativeDateFormatter } from "@/lib/date-formatter";
import { useAtomValue, useSetAtom } from "jotai";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { TranscriptResponseData } from "@/app/types";
import { TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "./ui/tooltip";

export function PreviousTranscripts() {
  const setTranscript = useSetAtom(transcriptAtom);

  const previousTranscripts = useAtomValue(previousTranscriptsAtom);

  const uniqueTranscripts = previousTranscripts.filter(
    (transcript, index, self) =>
      index ===
      self.findIndex(
        (t) => t.url === transcript.url && t.createdAt === transcript.createdAt
      )
  );

  const sortedTranscripts = uniqueTranscripts.toSorted(
    (a, b) => b.createdAt - a.createdAt
  );

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    toast(`Copied ${url} to clipboard`, {
      icon: <Copy className="h-4 w-4" />,
    });
  }

  function handleTranscriptClick(transcript: TranscriptResponseData) {
    setTranscript(transcript);
  }

  return (
    <>
      {sortedTranscripts.map((transcript) => (
        <SidebarMenuItem key={`${transcript.createdAt}-${transcript.url}`}>
          <SidebarMenuButton
            size={"lg"}
            className="flex flex-col gap-0"
            onClick={() => handleTranscriptClick(transcript)}
          >
            <div className="w-full pr-6">
              {transcript.title ? (
                <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {transcript.title}
                </div>
              ) : (
                <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {transcript.url.split("v=")[1]}
                </div>
              )}
              <div className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                {relativeDateFormatter(transcript.createdAt)}
              </div>
            </div>
          </SidebarMenuButton>
          <SidebarMenuAction
            onClick={() => {
              handleCopy(transcript.url);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Copy />
              </TooltipTrigger>
              <TooltipContent>Copy URL</TooltipContent>
            </Tooltip>
          </SidebarMenuAction>
        </SidebarMenuItem>
      ))}
    </>
  );
}
