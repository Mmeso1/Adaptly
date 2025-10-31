// ai/chatSession.ts

interface ChatMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

/** Defines the progress event object received during a model download. */
interface DownloadProgressEvent {
  loaded: number;
  total?: number;
}

/** Defines the object used to monitor download progress. */
interface MonitorCallback {
  addEventListener(
    event: "downloadprogress",
    callback: (e: DownloadProgressEvent) => void
  ): void;
}

/** Defines the active chat session object returned by LanguageModel.create(). */
interface ChatSession {
  promptStreaming(
    messages: ChatMessage[],
    options?: { signal?: AbortSignal }
  ): AsyncIterable<string>;
  destroy(): void;
}

/** Defines the global LanguageModel API object. */
interface LanguageModelApi {
  availability(): Promise<"available" | "unavailable">;
  create(options: {
    monitor: (m: MonitorCallback) => void;
    expectedInputs: { type: "text"; languages: string[] }[];
    expectedOutputs: { type: "text"; languages: string[] }[];
    initialPrompts: ChatMessage[];
  }): Promise<ChatSession>;
}

let chatSession: ChatSession | null = null;
declare const LanguageModel: LanguageModelApi;

export async function initChatSession(
  documentSummary: string,
  userSelectedLang: string
) {
  try {
    // Check availability first (optional but good practice)
    const availability = await LanguageModel.availability();
    console.log("Prompt Model availability in chatSession:", availability);
    if (availability === "unavailable") {
      throw new Error(
        "Prompt API model is unavailable or hardware requirements not met."
      );
    }

    // Create session with initial context
    chatSession = await LanguageModel.create({
      monitor(m: MonitorCallback) {
        m.addEventListener("downloadprogress", (e: DownloadProgressEvent) => {
          console.log(
            `Prompt Model Downloaded ${(e.loaded * 100).toFixed(0)}%`
          );
        });
      },
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: [`${userSelectedLang}`] }],
      initialPrompts: [
        {
          role: "system",
          content:
            "You are a helpful assistant who answers questions about a document the user uploaded.",
        },
        {
          role: "assistant",
          content: `Here’s the document summary you’ll use for context:\n\n${documentSummary}`,
        },
      ],
    });
  } catch (error) {
    console.error("Error initializing chat session:", error);
    chatSession = null;
  }

  return chatSession;
}

export async function askQuestion(
  question: string,
  onStreamChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  if (!chatSession) throw new Error("Chat session not initialized.");
  if (!question || question.trim().length === 0)
    throw new Error("No question provided.");

  const stream = await chatSession.promptStreaming(
    [{ role: "user", content: question.trim() }],
    { signal }
  );

  let response = "";
  for await (const chunk of stream) {
    response += chunk;
    if (onStreamChunk) onStreamChunk(response);
  }
  return response;
}

export function destroyChatSession() {
  if (chatSession) {
    chatSession.destroy();
    chatSession = null;
  }
}
