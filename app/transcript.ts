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
    const videoTitlePromise = getVideoTitle(identifier);

    const res = await tryMethodA(videoPageBody);

    if (res) {
      console.log("Method A success");
      return {
        transcript: res,
        title: await videoTitlePromise,
      };
    }

    const res2 = await tryMethodB(videoPageBody);
    if (res2) {
      console.log("Method B success");
      return {
        transcript: res2,
        title: await videoTitlePromise,
      };
    }

    throw new YoutubeTranscriptNotAvailableError(identifier);
  }
}

async function getVideoTitle(videoId: string) {
  const oembedResponse = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  const oembedBody = await oembedResponse.json();

  /**
   * {
    "title": "TypeScript types can run DOOM",
    "author_name": "Michigan TypeScript",
    "author_url": "https://www.youtube.com/@MichiganTypeScript",
    "type": "video",
    "height": 113,
    "width": 200,
    "version": "1.0",
    "provider_name": "YouTube",
    "provider_url": "https://www.youtube.com/",
    "thumbnail_height": 360,
    "thumbnail_width": 480,
    "thumbnail_url": "https://i.ytimg.com/vi/0mCsluv5FXA/hqdefault.jpg",
    "html": "\u003Ciframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/0mCsluv5FXA?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"TypeScript types can run DOOM\"\u003E\u003C/iframe\u003E"
  }
 */

  return oembedBody.title;
}
