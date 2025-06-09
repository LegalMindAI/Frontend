"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: SpeechRecognitionStatic;
declare var webkitSpeechRecognition: SpeechRecognitionStatic;

interface VoiceInputProps {
  display: string;
  showDisplay: (value: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ display, showDisplay }) => {
  const [listening, setListening] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser 😢");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcriptRef.current += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      showDisplay(transcriptRef.current + interimTranscript);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicToggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <button
      onClick={handleMicToggle}
      className={`absolute bottom-4  right-14 h-10 p-2 rounded-md transition
        shadow-[0_2px_5px_rgba(0,0,0,0.4)] hover:bg-black hover:text-white
        ${listening ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {listening ? <FaMicrophoneSlash size={23} /> : <FaMicrophone size={23} />}
    </button>
  );
};

export default VoiceInput;
