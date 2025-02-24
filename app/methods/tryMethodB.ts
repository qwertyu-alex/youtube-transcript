import { TranscriptResponse, TranscriptSegment } from "../types";
import sanitizeHtml from "sanitize-html";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";

export async function tryMethodB(
  videoPageBody: string
): Promise<null | TranscriptResponse[]> {
  const transcriptEndpointRegex =
    /"getTranscriptEndpoint":({"params":"([A-Za-z0-9%=+-_]+)"})/;
  const transcriptEndpoint = videoPageBody.match(transcriptEndpointRegex);

  const sanitizedVideoPageBody = sanitizeHtml(videoPageBody);

  const param = transcriptEndpoint?.at(-1);

  if (!transcriptEndpoint || !param) {
    return null;
  }

  const transcriptResponse = await fetch(
    `https://www.youtube.com/youtubei/v1/get_transcript?prettyPrint=false`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({
        context: {
          client: {
            hl: "en",
            gl: "",
            remoteHost: "147.78.199.226",
            deviceMake: "Apple",
            deviceModel: "",
            visitorData: "",
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36,gzip(gfe)",
            clientName: "WEB",
            clientVersion: "2.20250222.10.00",
            osName: "Macintosh",
            osVersion: "10_15_7",
            originalUrl: "",
            screenPixelDensity: 2,
            platform: "DESKTOP",
            clientFormFactor: "UNKNOWN_FORM_FACTOR",
            configInfo: {
              appInstallData: "",
              coldConfigData: "",
              coldHashData: "",
              hotHashData: "",
            },
            screenDensityFloat: 2,
            userInterfaceTheme: "USER_INTERFACE_THEME_DARK",
            timeZone: "Europe/Amsterdam",
            browserName: "Chrome",
            browserVersion: "132.0.0.0",
            acceptHeader:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            deviceExperimentId: "",
            rolloutToken: "",
            screenWidthPoints: 1338,
            screenHeightPoints: 687,
            utcOffsetMinutes: 60,
            connectionType: "CONN_CELLULAR_4G",
            memoryTotalKbytes: "8000000",
            mainAppWebInfo: {
              graftUrl: "",
              pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
              webDisplayMode: "WEB_DISPLAY_MODE_BROWSER",
              isWebNativeShareAvailable: true,
            },
          },
          user: {
            lockedSafetyMode: false,
          },
          request: {
            useSsl: true,
            internalExperimentFlags: [],
            consistencyTokenJars: [],
          },
          clickTracking: {
            clickTrackingParams: "",
          },
          adSignalsInfo: {
            params: [
              {
                key: "dt",
                value: "1740433287009",
              },
              {
                key: "flash",
                value: "0",
              },
              {
                key: "frm",
                value: "0",
              },
              {
                key: "u_tz",
                value: "60",
              },
              {
                key: "u_his",
                value: "1",
              },
              {
                key: "u_h",
                value: "982",
              },
              {
                key: "u_w",
                value: "1512",
              },
              {
                key: "u_ah",
                value: "944",
              },
              {
                key: "u_aw",
                value: "1512",
              },
              {
                key: "u_cd",
                value: "30",
              },
              {
                key: "bc",
                value: "31",
              },
              {
                key: "bih",
                value: "687",
              },
              {
                key: "biw",
                value: "1338",
              },
              {
                key: "brdim",
                value: "0,38,0,38,1512,38,1512,944,1338,687",
              },
              {
                key: "vis",
                value: "1",
              },
              {
                key: "wgl",
                value: "true",
              },
              {
                key: "ca_type",
                value: "image",
              },
            ],
          },
        },
        params: param,
      }),
    }
  );

  const transcriptBody = await transcriptResponse.json();

  const transcript = transcriptBody.actions.at(0)?.updateEngagementPanelAction;

  const transcriptContent = transcript?.content.transcriptRenderer.content
    .transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer
    .initialSegments as TranscriptSegment[];

  const res = transcriptContent.map((segment) => {
    if ("transcriptSectionHeaderRenderer" in segment) {
      return {
        text: segment.transcriptSectionHeaderRenderer.sectionHeader
          .sectionHeaderViewModel.headline.content,
        durationInSec:
          (parseInt(segment.transcriptSectionHeaderRenderer.endMs) -
            parseInt(segment.transcriptSectionHeaderRenderer.startMs)) /
          1000,
        offsetInSec:
          parseInt(segment.transcriptSectionHeaderRenderer.startMs) / 1000,
        lang: "en",
      };
    }

    if ("transcriptSegmentRenderer" in segment) {
      return {
        text: segment.transcriptSegmentRenderer.snippet.runs
          .map((run) => run.text)
          .join(""),
        durationInSec:
          (parseInt(segment.transcriptSegmentRenderer.endMs) -
            parseInt(segment.transcriptSegmentRenderer.startMs)) /
          1000,
        offsetInSec: parseInt(segment.transcriptSegmentRenderer.startMs) / 1000,
        lang: "en",
      };
    } else {
      throw new Error("Unknown segment type");
    }
  });

  return res;
}
