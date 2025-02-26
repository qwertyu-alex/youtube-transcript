import { TranscriptResponse } from "../types";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";

const RE_XML_TRANSCRIPT =
  /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

export async function tryMethodA(
  videoPageBody: string
): Promise<null | TranscriptResponse[]> {
  const splittedHTML = videoPageBody.split('"captions":');

  const captions = (() => {
    try {
      return JSON.parse(
        splittedHTML[1].split(',"videoDetails')[0].replace("\n", "")
      );
    } catch (e) {
      return undefined;
    }
  })()?.["playerCaptionsTracklistRenderer"];

  if (!captions) {
    return null;
  }

  if (!("captionTracks" in captions)) {
    return null;
  }

  const transcriptURL = captions.captionTracks[0].baseUrl;

  const transcriptResponse = await fetch(transcriptURL, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  if (!transcriptResponse.ok) {
    return null;
  }
  const transcriptBody = await transcriptResponse.text();
  const results = [...transcriptBody.matchAll(RE_XML_TRANSCRIPT)];

  const res = results.map((result) => ({
    text: result[3],
    durationInSec: parseFloat(result[2]),
    offsetInSec: parseFloat(result[1]),
    lang: captions.captionTracks[0].languageCode,
  }));

  return res;
}
