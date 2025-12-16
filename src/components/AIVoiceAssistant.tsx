"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, MessageSquare } from "lucide-react";

interface AIVoiceAssistantProps {
  onClose?: () => void;
}

export function AIVoiceAssistant({ onClose }: AIVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const sampleResponses = [
    "I can help you with your learning path. What would you like to know?",
    "Based on your progress, I recommend focusing on TypeScript next.",
    "Your React skills are improving. Keep practicing!",
    "Would you like me to generate a personalized assessment?",
    "I've analyzed your performance. You're doing great in frontend development!",
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setTranscript("How can I improve my React skills?");
        setIsListening(false);
        setTimeout(() => {
          setIsSpeaking(true);
          setResponse(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
          setTimeout(() => setIsSpeaking(false), 3000);
        }, 1000);
      }, 2000);
    }
  };

  return (
    <Card className="fixed bottom-24 right-6 z-50 w-96 border-white/20 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Voice Assistant</h3>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
              AI Powered
            </Badge>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </Button>
        )}
      </div>

      <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4">
        {isListening && (
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></div>
            <span className="text-sm">Listening...</span>
          </div>
        )}
        
        {transcript && (
          <div className="mb-3">
            <p className="text-xs text-slate-400">You said:</p>
            <p className="text-sm text-white">{transcript}</p>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center gap-2 text-violet-400">
            <Volume2 className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Speaking...</span>
          </div>
        )}
        
        {response && !isSpeaking && (
          <div>
            <p className="text-xs text-slate-400">AI Response:</p>
            <p className="text-sm text-white">{response}</p>
          </div>
        )}
        
        {!isListening && !transcript && !isSpeaking && (
          <p className="text-center text-sm text-slate-400">Click the mic to start</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleVoiceToggle}
          className={`flex-1 gap-2 ${
            isListening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isListening ? "Stop" : "Start Voice"}
        </Button>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={() => {
            setTranscript("");
            setResponse("");
          }}
        >
          Clear
        </Button>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-slate-400 mb-2">Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {["What's my progress?", "Generate assessment", "Learning tips", "Show roadmap"].map((cmd) => (
            <Badge
              key={cmd}
              variant="outline"
              className="cursor-pointer border-violet-500/30 text-violet-400 hover:bg-violet-500/20"
              onClick={() => {
                setTranscript(cmd);
                setTimeout(() => {
                  setIsSpeaking(true);
                  setResponse(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
                  setTimeout(() => setIsSpeaking(false), 3000);
                }, 500);
              }}
            >
              {cmd}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
