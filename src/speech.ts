import * as Speech from "expo-speech";

export const speakText = (text: string): Promise<void> =>
  new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: "de-DE",
      onDone: resolve,
      onStopped: resolve,
      onError: (error) => reject(new Error(error.message || "Speech failed")),
    });
  });
