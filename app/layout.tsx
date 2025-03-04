import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Free YouTube Transcript Generator",
  description:
    "Fastest way to get transcripts from Youtube videos - Open source on GitHub",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    images: [
      {
        url: "https://gxbsjhzsyzmqllluvkof.supabase.co/storage/v1/object/public/youtube-transcript-gen/yt-open-graph.png",
      },
    ],
    title: "Free YouTube Transcript Generator",
    description:
      "Fastest way to get transcripts from Youtube videos - Open source on GitHub",
    siteName: "YouTube Transcript Generator",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <SidebarProvider>
            <TooltipProvider delayDuration={100}>
              <Sidebar />
              <div className="relative top-2 left-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger />
                  </TooltipTrigger>
                  <TooltipContent>Open sidebar (⌘+B)</TooltipContent>
                </Tooltip>
              </div>
              {children}
              <Toaster />
            </TooltipProvider>
          </SidebarProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
