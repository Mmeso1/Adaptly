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

export async function processDocument(text: string, userSelectedLang: string) {
  if (!text || text.trim().length === 0) throw new Error("No text provided.");
  console.log("AI processing...");

  // test if userLang was recieved
  // alert(userLang);

  // 1. Detect Language
  const detectedLang = await safeCall(() => detectLanguage(text));
  const sourceLang = detectedLang || "en";
  // console.log("Detected language:", sourceLang);

  // Create both models immediately and concurrently using Promise.all().
  let translator = null;
  let promptModel = null;

  if (sourceLang !== "en") {
    console.log("Creating translator...");
    translator = await safeCall(() => createTranslator(sourceLang, "en"));
    if (!translator) {
      console.warn("Translator initialization failed — proceeding without it.");
    }
  }

  console.log("Creating prompt model...");
  promptModel = await safeCall(() => createPromptModel(userSelectedLang));
  if (!promptModel) {
    throw new Error("Failed to initialize Prompt model.");
  }

  // 2. Translate langugae to English if not in English
  let workingText = text;
  console.log("detected language 2: ", sourceLang);
  if (sourceLang !== "en") {
    const translated = await safeCall(() => translateText(text, translator));
    workingText = translated || text;
    // console.log("Translated txt:", workingText);
  }

  // 3. Action Plan Generation (Prompt API: Objective Triage)
  // Note: generateActionPlan is instructed to output in English for stability.
  const actionPlanEnglish = await safeCall(() =>
    generateActionPlan(promptModel, workingText, userSelectedLang)
  );
  const planEnglish =
    actionPlanEnglish || "Unable to generate action plan. Analysis failed.";

  // 4. Pro-Tips Generation (Prompt API: Creative Guidance)
  // Note: generateProTips is instructed to output in English for stability.
  const proTipsEnglish = await safeCall(() =>
    generateProTips(promptModel, planEnglish, userSelectedLang)
  );
  const tipsEnglish =
    proTipsEnglish || "Unable to generate pro tips. Guidance failed.";

  return {
    workingText,
    sourceLang,
    translatedLang: workingText,
    planEnglish,
    tipsEnglish,
    // proTips,
  };
}
