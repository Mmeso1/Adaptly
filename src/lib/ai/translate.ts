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

interface TranslatorSession {
  translate(text: string): Promise<string>;
}

interface TranslatorApi {
  availability(options: {
    sourceLanguage: string;
    targetLanguage: string;
  }): Promise<"available" | "unavailable">;
  create(options: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor: (m: MonitorCallback) => void;
  }): Promise<TranslatorSession>;
}

declare const Translator: TranslatorApi;

export async function createTranslator(
  sourceLang: string,
  targetLang: string
): Promise<TranslatorSession> {
  if (!("Translator" in self)) {
    throw new Error("Translator API not available in this browser.");
  }

  const translatorCapabilities = await Translator.availability({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  });

  if (translatorCapabilities === "unavailable") {
    console.warn(
      "Translator API is not ready or available:",
      translatorCapabilities
    );
  }

  const translator = await Translator.create({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
    monitor(m: MonitorCallback) {
      m.addEventListener("downloadprogress", (e: DownloadProgressEvent) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });

  return translator;
}

export async function translateText(
  text: string,
  translator: TranslatorSession
): Promise<string> {
  if (!translator || typeof translator.translate !== "function") {
    throw new Error("Translator is not ready yet. Please try again later.");
  }
  const result = await translator.translate(text);
  return result;
}

export async function translateFullDocument(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string | null> {
  if (sourceLang === targetLang) {
    return text;
  }

  try {
    const documentTranslator = await createTranslator(sourceLang, targetLang);
    const translated = await documentTranslator.translate(text);
    return translated;
  } catch (error) {
    console.error("Failed to translate full document:", error);
    return null;
  }
}
