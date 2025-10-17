declare const Translator: any;

export async function createTranslator(sourceLang: string, targetLang: string) {
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
    monitor(m: any) {
      m.addEventListener("downloadprogress", (e: any) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });
  return translator;
}
export async function translateText(
  text: string,
  translator: any
): Promise<string> {
  const result = await translator.translate(text);
  //   console.log("Translated text in tfn:", result);
  return result;
}
