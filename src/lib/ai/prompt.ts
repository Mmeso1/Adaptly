declare const LanguageModel: any;

// --- 1. Model Creation (CRITICAL for User Gesture) ---
// This function must be called immediately when the user clicks 'Analyze'.
export async function createPromptModel() {
  console.log("Initializing Prompt (Gemini Nano) Model...");
  try {
    // Check availability first (optional but good practice)
    const availability = await LanguageModel.availability();
    if (availability === "unavailable") {
      throw new Error(
        "Prompt API model is unavailable or hardware requirements not met."
      );
    }

    // Create the session. This is the call that requires the user gesture
    // for model download/initialization.
    const session = await LanguageModel.create({
      // Monitor is essential for showing the user that a model is downloading
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          console.log(
            `Prompt Model Downloaded ${(e.loaded * 100).toFixed(0)}%`
          );
        });
      },
      // Setting expected languages confirms the model supports our use case
      expectedInputs: [{ type: "text", languages: ["en"] }],
      // We expect the final output to be in the user's language
      expectedOutputs: [{ type: "text", languages: ["en", "ja", "es"] }],
    });
    console.log("prompt session created:", session);
    return session;
  } catch (error) {
    // If the error is NotAllowedError, it will be handled by the caller (understand.ts)
    console.error("Error creating Prompt model session:", error);
    return null;
  }
}

// --- 2. Task: Generate Action Plan (Structured Reasoning) ---
export async function generateActionPlan(
  promptModel: any,
  documentText: string,
  targetLanguage: string
): Promise<string> {
  const systemInstruction = `You are an Executive Analyst specialized in simplifying complex, non-native documents (legal, financial, technical, educational, etc.). Your goal is to provide the user with the essential and actionable core of the document. In a structured format, summarise the document and extract the mandatory facts and steps into a clear, numbered list. Maintain a highly professional, helpful, and simple tone. **DO NOT generate advice, tips, or unnecessary context.**`;

  // The user prompt is fed the English text for best analysis quality
  const userPrompt = `Analyze the following document and generate a numbered list of all mandatory actions, deadlines, critical facts, or financial risks. Translate the final list into the target language: ${targetLanguage}.\n\nDOCUMENT:\n${documentText}`;

  const result = await promptModel.prompt(userPrompt, {
    systemInstruction: systemInstruction,
  });
  console.log("created action plan");
  //   console.log("Action Plan Result:", result);
  return result;
}

// --- 3. Task: Generate Pro-Tips (Creative Reasoning) ---
export async function generateProTips(
  promptModel: any,
  documentText: string,
  targetLanguage: string
): Promise<string> {
  const systemInstruction = `You are a professional, friendly, and encouraging expert. Your goal is to provide three concise, high-value "Pro-Tips" based on the provided action plan. The tips should focus on maximizing success, mitigating risks, or saving money/time. Output only the three bullet points, no other text.`;

  // Use the previously generated Action Plan as the context for the tips
  const userPrompt = `Based on this Action Plan, generate three separate bullet points (Pro-Tips) in the target language: ${targetLanguage}.\n\nACTION PLAN:\n${documentText}`;

  const result = await promptModel.prompt(userPrompt, {
    systemInstruction: systemInstruction,
  });
  //   console.log("Pro-Tips Result:", result);
  return result;
}
