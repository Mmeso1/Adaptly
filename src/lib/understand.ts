import { detectLanguage } from "./ai/detectLanguage";
import { createTranslator, translateText } from "./ai/translate";
import {
  createPromptModel,
  generateActionPlan,
  generateProTips,
} from "./ai/prompt";

const safeCall = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    console.error("AI error call:", error);
    return null;
  }
};

export async function processDocument(text: string, userLang: string = "en") {
  if (!text || text.trim().length === 0) throw new Error("No text provided.");
  console.log("AI processing...");

  // 1. Detect Language
  const detectedLang = await safeCall(() => detectLanguage(text));
  const sourceLang = detectedLang || "en";
  console.log("Detected language:", sourceLang);

  // Create both models immediately and concurrently using Promise.all().
  const translatorPromise =
    sourceLang !== "en"
      ? safeCall(() => createTranslator(sourceLang, "en"))
      : Promise.resolve(null);
  const promptPromise = safeCall(() => createPromptModel());

  const [translator, promptModel] = await Promise.all([
    translatorPromise,
    promptPromise,
  ]);

  if (!translator || !promptModel) {
    throw new Error("Failed to initialize AI models.");
  }

  // 2. Translate langugae to English if not in English
  let workingText = text;
  if (sourceLang !== "en") {
    const translated = await safeCall(() => translateText(text, translator));
    workingText = translated || text;
    console.log("Translated txt:", workingText);
  }

  // 3. Action Plan Generation (Prompt API: Objective Triage)
  // Note: generateActionPlan is instructed to output in English for stability.
  const actionPlanEnglish = await safeCall(() =>
    generateActionPlan(promptModel, workingText, "en")
  );
  const planEnglish =
    actionPlanEnglish || "Unable to generate action plan. Analysis failed.";

  // 4. Pro-Tips Generation (Prompt API: Creative Guidance)
  // Note: generateProTips is instructed to output in English for stability.
  const proTipsEnglish = await safeCall(() =>
    generateProTips(promptModel, planEnglish, "en")
  );
  const tipsEnglish =
    proTipsEnglish || "Unable to generate pro tips. Guidance failed.";

  // 5. Final Outputs Translation (Translator API: High-speed Utility)
  // Translate the final English outputs back to the user's target language (userLang).
  // const finalActionPlan = await safeCall(() =>
  //   translateText(translator, planEnglish)
  // );
  // const finalProTips = await safeCall(() =>
  //   translateText(translator, tipsEnglish)
  // );

  return {
    sourceLang,
    translatedLang: workingText,
    planEnglish,
    tipsEnglish,
    // proTips,
  };
}
