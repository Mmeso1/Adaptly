declare const Summarizer: any;

export async function createSummarizer() {
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
    monitor(m: any) {
      m.addEventListener("downloadprogress", (e: any) => {
        console.log(
          `Summarizer model download: ${(e.loaded * 100).toFixed(0)}%`
        );
      });
    },
  });
  return summarizer;
}

export async function summarizeText(
  summarizer: any,
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
