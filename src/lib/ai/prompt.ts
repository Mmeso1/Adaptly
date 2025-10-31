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

interface PromptModelSession {
  prompt(
    prompt: string,
    options?: { systemInstruction?: string }
  ): Promise<string>;
  destroy(): void;
}

interface LanguageModelApi {
  availability(): Promise<"available" | "unavailable">;
  create(options: {
    monitor: (m: MonitorCallback) => void;
    expectedInputs: { type: "text"; languages: string[] }[];
    expectedOutputs: { type: "text"; languages: string[] }[];
  }): Promise<PromptModelSession>;
}

declare const LanguageModel: LanguageModelApi;

// --- 1. Model Creation (CRITICAL for User Gesture) ---
export async function createPromptModel(
  targetLanguage: string
): Promise<PromptModelSession | null> {
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

    const session = await LanguageModel.create({
      monitor(m: MonitorCallback) {
        m.addEventListener("downloadprogress", (e: DownloadProgressEvent) => {
          console.log(
            `Prompt Model Downloaded ${(e.loaded * 100).toFixed(0)}%`
          );
        });
      },
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: [`${targetLanguage}`] }],
    });
    return session;
  } catch (error) {
    console.error("Error creating Prompt model session:", error);
    return null;
  }
}

// --- 2. Task: Generate Action Plan (Structured Reasoning) ---
export async function generateActionPlan(
  promptModel: PromptModelSession,
  documentText: string,
  targetLanguage: string
): Promise<string> {
  const systemInstruction = `
    You are a multilingual content summarization expert.
    Your job is to help users understand complex or foreign-language text by rewriting it in a clear, simple, and structured way — without losing important meaning in the specified target language.

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
    ALL OUTPUT MUST BE in the following target language: ${targetLanguage}.

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
  promptModel: PromptModelSession,
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
