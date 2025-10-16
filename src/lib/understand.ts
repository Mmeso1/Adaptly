import { detectLanguage } from "./ai/detectLanguage";
import { translateText } from "./ai/translate";
import { summarizeText } from "./ai/summarize";
// import { generateProTips } from "./ai/generateTips";

export async function processDocument(text: string, userLang: string = "en") {
  if (!text || text.trim().length === 0) {
    throw new Error("No text provided for processing.");
  }
  console.log("Start AI processing...");
  // const sourceLang = await detectLanguage(text);

  const safeCall = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      console.error("AI error call:", error);
      return null;
    }
  };

  // 1. Detect Language
  const detectedLang = await safeCall(() => detectLanguage(text));
  const sourceLang = detectedLang || "en";
  console.log("Detected language:", sourceLang);

  let workingText = text;
  if (sourceLang !== "en") {
    const translated = await safeCall(() =>
      translateText(text, sourceLang, "en")
    );
    workingText = translated || text;
    // console.log("Translated txt:", workingText);
  }

  // 2. Summarize with null checking
  const summaryResult = await safeCall(() => summarizeText(workingText));
  const summary = summaryResult || "Unable to generate summary";

  // 3. Translate summary if needed (now summary is guaranteed to be a string)
  let translatedSummary = summary;
  if (userLang !== "en") {
    const translatedResult = await safeCall(() =>
      translateText(summary, "en", (userLang = "fr"))
    );
    translatedSummary = translatedResult || summary; // Fallback to original summary
  }

  // const proTips = await generateProTips(translatedSummary, userLang);

  return {
    sourceLang,
    translatedLang: workingText,
    summaryEnglish: summary,
    summary: translatedSummary,
    // proTips,
  };
}
