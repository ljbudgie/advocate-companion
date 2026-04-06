import { useState, useCallback, useRef, useEffect } from "react";

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const supported = "speechSynthesis" in window;
    setIsSupported(supported);
    if (!supported) return;

    const loadVoices = () => {
      const raw = speechSynthesis.getVoices();
      // Filter to English voices and deduplicate
      const english = raw
        .filter((v) => v.lang.startsWith("en"))
        .map((v) => ({
          id: v.voiceURI,
          name: v.name,
          lang: v.lang,
        }));
      setVoices(english);
      // Default to a warm-sounding voice if available
      const preferred = english.find(
        (v) =>
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("karen") ||
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("google uk english female")
      );
      if (preferred && !selectedVoice) {
        setSelectedVoice(preferred.id);
      } else if (english.length > 0 && !selectedVoice) {
        setSelectedVoice(english[0].id);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;
      // Strip markdown for cleaner speech
      const clean = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/#{1,6}\s/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`~]/g, "");

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (selectedVoice) {
        const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === selectedVoice);
        if (voice) utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(
    (text: string) => {
      if (isSpeaking) stop();
      else speak(text);
    },
    [isSpeaking, speak, stop]
  );

  return {
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
    toggle,
  };
}
