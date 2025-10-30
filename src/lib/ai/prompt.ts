declare const LanguageModel: any;

// --- 1. Model Creation (CRITICAL for User Gesture) ---
// This function must be called immediately when the user clicks 'Analyze'.
export async function createPromptModel(targetLanguage: string) {
  console.log("Initializing Prompt (Gemini Nano) Model...");
  try {
    // Check availability first (optional but good practice)
    const availability = await LanguageModel.availability();
    console.log("Prompt Model availability:", availability);
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
      expectedOutputs: [{ type: "text", languages: [`${targetLanguage}`] }],
    });
    // console.log("prompt session created:", session);
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
  const systemInstruction = `
    You are a multilingual content summarization expert.
    Your job is to help users understand complex or foreign-language text by rewriting it in a clear, simple, and structured way — without losing important meaning in the specified target language.  ALL OUTPUT MUST BE IN THE LANGUAGE SPECIFIED by the outputLanguage 
    parameter, which is ${targetLanguage}.

    Guidelines:
    - Summarize the document in a way that captures its **main ideas, important points, and tone**.
    - Use only **short paragraphs, bullet points, or subheadings** only when they make the content easier to read.
    - Focus on clarity and readability for **non-native speakers**.
    - Do **not** add opinions, assumptions, or advice.
    - Maintain a **neutral, explanatory, and helpful tone**.
    - Translate the final summary into the user’s target language.

    Keep the output natural and well-organized — like a professional executive summary.
    `;

  const userPrompt = `
    Summarize the following text in a clear, easy-to-understand way.
    The goal is for a non-native speaker to grasp the key meaning, purpose, and context.

    DOCUMENT:${documentText}`;
  const result = await promptModel.prompt(userPrompt, {
    systemInstruction: systemInstruction,
  });
  // console.log("created action plan");
  // console.log("Action Plan Result:", result);
  return result;
}

// --- 3. Task: Generate Pro-Tips (Creative Reasoning) ---
export async function generateProTips(
  promptModel: any,
  documentText: string,
  targetLanguage: string
): Promise<string> {
  const systemInstruction = `
    You are a supportive and encouraging communication assistant.
    Your role is to help users apply or remember what they just read in a practical way.

    Based on the given structured summary, write **three concise "Pro-Tips"** that help the user:
    - Better understand or apply the information.
    - Avoid common misunderstandings or mistakes.
    - Feel confident taking the next step.

    Keep it friendly, clear, and short.
    Do not restate the summary or give legal/financial advice.
    Output only three bullet points, no intro or outro.
    `;

  // Use the previously generated Action Plan as the context for the tips
  const userPrompt = `Based on this Action Plan, generate three separate bullet points (Pro-Tips) in the target language: ${targetLanguage}.\n\nACTION PLAN:\n${documentText}`;

  const result = await promptModel.prompt(userPrompt, {
    systemInstruction: systemInstruction,
  });
  // console.log("Pro-Tips Result:", result);
  return result;
}
