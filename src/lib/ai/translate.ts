declare const Translator: any;

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const translatorCapabilities = await Translator.availability({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  });

  console.log("Translator capabilities:", translatorCapabilities);

  const translator = await Translator.create({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
    monitor(m: any) {
      m.addEventListener("downloadprogress", (e: any) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });
  const result = await translator.translate(text);
  //   console.log("Translated in translate function:", result);
  //   console.log("Translated text in tfn:", result.text);
  return result;
}
