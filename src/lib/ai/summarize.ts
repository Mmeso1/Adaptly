declare const Summarizer: any;
export async function summarizeText(text: string): Promise<string | null> {
  if (!("Summarizer" in self)) {
    throw new Error("Summarizer API not available in this browser.");
  }
  try {
    // Check if the Summarizer API is available
    const availability = await Summarizer.availability();
    if (availability === "unavailable") {
      // The Summarizer API isn't usable.
      console.warn("Summarizer API is not ready or available:", availability);
    }

    const options = {
      sharedContext:
        "The text is a formal, administrative, legal, or financial document. Summarize it for a non-native speaker who needs clear, simple, practical instructions.",
      type: "key-points",
      format: "markdown",
      length: "long",
      outputLanguage: "en",
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    };

    // Check for user activation before creating the summarizer
    const summarizer = await Summarizer.create(options);

    // Run batch summarization
    const summaryMarkdown = await summarizer.summarize(text, {
      context:
        "Focus strictly on concrete actions the user must take, such as deadlines, required documents, or next steps.",
    });
    console.log("Summary generated:", summaryMarkdown);

    return summaryMarkdown;
  } catch (err) {
    console.error("On-device summarization failed:", err);
    return null;
  }
}
