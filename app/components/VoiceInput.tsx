"use client";
import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleMicToggle}
            variant={listening ? "destructive" : "outline"}
            size="icon"
            className={cn(
              "rounded-xl border-border/30",
              !listening && "bg-background/80",
              listening && "relative"
            )}
          >
            {listening ? (
              <>
                <MicOff size={18} />
                <motion.div 
                  className="absolute inset-0 rounded-xl border border-destructive"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </>
            ) : (
              <Mic size={18} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{listening ? "Stop recording" : "Voice input"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceInput;
