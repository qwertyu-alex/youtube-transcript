export type TranscriptSegment =
  | {
      transcriptSectionHeaderRenderer: {
        startMs: string;
        endMs: string;
        accessibility: {
          accessibilityData: {
            label: string;
          };
        };
        trackingParams: string;
        enableTappableTranscriptHeader: boolean;
        sectionHeader: {
          sectionHeaderViewModel: {
            headline: {
              content: string;
            };
          };
        };
      };
    }
  | {
      transcriptSegmentRenderer: {
        startMs: string;
        endMs: string;
        snippet: {
          runs: {
            text: string;
          }[];
        };
        startTimeText: {
          simpleText: string;
        };
        trackingParams: string;
        accessibility: {
          accessibilityData: {
            label: string;
          };
        };
        targetId: string;
      };
    };

export type TranscriptResponse = {
  text: string;
  durationInSec: number;
  offsetInSec: number;
  lang?: string;
};

export type TranscriptResponseData = {
  url: string;
  transcript: TranscriptResponse[];
  title: string;
  createdAt: number;
};
