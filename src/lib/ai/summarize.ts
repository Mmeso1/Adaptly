interface DownloadProgressEvent {
  loaded: number;
  total?: number;
}

interface MonitorCallback {
  addEventListener(
    event: "downloadprogress",
    callback: (e: DownloadProgressEvent) => void
  ): void;
}

interface SummarizerSession {
  summarize(text: string, options?: { context?: string }): Promise<string>;
}

interface SummarizerApi {
  availability(): Promise<"available" | "unavailable">;
  create(options: {
    sharedContext: string;
    type: "key-points" | "summary";
    format: "markdown" | "text";
    length: "short" | "long";
    outputLanguage: string;
    monitor: (m: MonitorCallback) => void;
  }): Promise<SummarizerSession>;
}

declare const Summarizer: SummarizerApi;

export async function createSummarizer(): Promise<SummarizerSession> {
  if (!("Summarizer" in self)) {
    throw new Error("Summarizer API not available in this browser.");
  }

  // Check if the Summarizer API is available
  const availability = await Summarizer.availability();
  if (availability === "unavailable") {
    console.warn("Summarizer API is not ready or available:", availability);
  }

  const summarizer = await Summarizer.create({
    sharedContext:
      "The text is a formal, administrative, legal, or financial document. Summarize it for a non-native speaker who needs clear, simple, practical instructions.",
    type: "key-points",
    format: "markdown",
    length: "long",
    outputLanguage: "en",
    monitor(m: MonitorCallback) {
      m.addEventListener("downloadprogress", (e: DownloadProgressEvent) => {
        console.log(
          `Summarizer model download: ${(e.loaded * 100).toFixed(0)}%`
        );
      });
    },
  });
  return summarizer;
}

export async function summarizeText(
  summarizer: SummarizerSession,
  text: string
): Promise<string> {
  try {
    const summaryMarkdown = await summarizer.summarize(text, {
      context:
        "Focus strictly on concrete actions the user must take, such as deadlines, required documents, or next steps.",
    });
    console.log("Summary generated:", summaryMarkdown);
    return summaryMarkdown;
  } catch (err) {
    console.error("On-device summarization failed:", err);
    return "Unable to generate summary";
  }
}
