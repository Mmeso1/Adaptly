// ai/chatSession.ts

let chatSession: any = null;
declare const LanguageModel: any;

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
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
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
  onStreamChunk: (chunk: string) => void
): Promise<string> {
  if (!chatSession) throw new Error("Chat session not initialized.");

  const stream = await chatSession.promptStreaming([
    { role: "user", content: question },
  ]);

  let response = "";
  for await (const chunk of stream) {
    console.log(chunk);
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
