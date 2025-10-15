import { detectLanguage } from "./ai/detectLanguage";
// import { translateText } from "./ai/translate";
// import { summarizeText } from "./ai/summarize";
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
  const sourceLang = await safeCall(() => detectLanguage(text));
  console.log("Detected language:", sourceLang);

  // let workingText = text;
  // if (sourceLang !== "en") {
  //   workingText = await translateText(text, sourceLang, "en");
  // }

  // const summary = await summarizeText(workingText);

  // let translatedSummary = summary;
  // if (userLang !== "en") {
  //   translatedSummary = await translateText(summary, "en", userLang);
  // }

  // const proTips = await generateProTips(translatedSummary, userLang);

  return {
    sourceLang,
    // summary: translatedSummary,
    // proTips,
  };
}
