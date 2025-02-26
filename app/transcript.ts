import parse from "node-html-parser";
import { tryMethodA } from "./methods/tryMethodA";
import { tryMethodB } from "./methods/tryMethodB";
import { TranscriptResponse } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";

export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] 🚨 ${message}`);
  }
}

export class YoutubeTranscriptNotAvailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`No transcripts are available for this video (${videoId})`);
  }
}

export interface TranscriptConfig {
  lang?: string;
}

/**
 * Class to retrieve transcript if exist
 */
export class YoutubeTranscript {
  /**
   * Fetch transcript from YTB Video
   * @param videoId Video url or video identifier
   * @param config Get transcript in a specific language ISO
   */
  public static async fetchTranscript(
    videoId: string,
    config?: TranscriptConfig
  ): Promise<{
    transcript: TranscriptResponse[];
    title: string | undefined;
  }> {
    const identifier = videoId;

    const videoPageResponse = await fetch(
      `https://www.youtube.com/watch?v=${identifier}`,
      {
        mode: "no-cors",
        headers: {
          ...(config?.lang && { "Accept-Language": config.lang }),
          "User-Agent": USER_AGENT,
        },
      }
    );
    const videoPageBody = await videoPageResponse.text();
    const htmlTitle = parse(videoPageBody).querySelector("title")?.textContent;

    const res = await tryMethodA(videoPageBody);

    if (res) {
      console.log("Method A success");
      return {
        transcript: res,
        title: htmlTitle,
      };
    }

    const res2 = await tryMethodB(videoPageBody);
    if (res2) {
      console.log("Method B success");
      return {
        transcript: res2,
        title: htmlTitle,
      };
    }

    throw new YoutubeTranscriptNotAvailableError(identifier);
  }
}
