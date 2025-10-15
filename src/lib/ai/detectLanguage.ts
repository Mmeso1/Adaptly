// Import or define LanguageDetector depending on your environment.
// Example for a browser global (if available):
declare const LanguageDetector: any;

export async function detectLanguage(text: string): Promise<string> {
  const DEFAULT_LANG = "en";
  // 1. Feature detection: Check if the API is available in the browser.
  if (!("LanguageDetector" in self)) {
    console.warn("LanguageDetector API not available, defaulting to English");
    return DEFAULT_LANG;
  }

  try {
    // 2. Check for language availability
    const langAvailability = await LanguageDetector.availability();
    if (langAvailability === "unavailable") {
      console.warn("LanguageDetector API is unavailable");
      return DEFAULT_LANG;
    } else {
      console.log(`Detector API is ${langAvailability}`);
    }

    // 3. Instantiate the language detector
    const detector = await LanguageDetector.create({
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: { loaded: number }) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });
    const results = await detector.detect(text);

    if (results && results.length > 0) {
      return results[0].detectedLanguage;
    }
    console.warn("No language detected, defaulting to English");
    return DEFAULT_LANG;
  } catch (err) {
    console.error("Language detection failed:", err);
    return "en";
  }
}
