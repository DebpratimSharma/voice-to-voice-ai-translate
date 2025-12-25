"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsProps {
  sourceText: string;
  translatedText: string;
  audioUrl: string | null;
}

export default function Results({ sourceText, translatedText, audioUrl }: ResultsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioUrl]);

  useEffect(() => {
    // Reset state when audio changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="w-full py-6 animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-4 mb-4 fade-in">
        <div className="h-px bg-[#333] grow" />
        <span className="text-xs text-gray-500 font-mono">RESULTS</span>
        <div className="h-px bg-[#333] grow" />
      </div>
      <div className="w-full flex gap-5 ">
        <ScrollArea className="bg-[#0f0e0e] w-2/3 max-h-50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ">
          {/* Source Text */}
          <div className="mb-6 px-5 py-3">
            <p className="text-xs font-bold uppercase tracking-wider mb-2">
              You said:
            </p>
            <p className="text-lg italic opacity-80">"{sourceText}"</p>
          </div>

          {/* Translated Text */}
          <div className="mb-6 px-5">
            <p className="text-xs font-bold uppercase tracking-wider mb-2">
              Translation:
            </p>
            <p className="text-2xl font-medium">"{translatedText}"</p>
          </div>
        </ScrollArea>
        {/* Audio Player - modern controls */}
        {audioUrl && (
          <div className="w-1/3 h-50 rounded-xl flex flex-col items-stretch justify-between pt-3 shadow-sm border bg-white/5">
            <audio ref={audioRef} src={audioUrl} className="hidden " />

            <div className="flex items-center justify-between  px-7 gap-3 py-2">
              <button
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                onClick={() => {
                  if (!audioRef.current) return;
                  if (isPlaying) audioRef.current.pause();
                  else audioRef.current.play();
                }}
                className="flex items-center justify-center p-7 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-white/80 shadow-md transition-all duration-200"
              >
                {isPlaying ? <Pause className="text-black w-5 h-5" /> : <Play className="text-black w-5 h-5" />}
              </button>
              <div className="flex-col w-full  ">
                <div className="py-2">
                  Audio Preview
                </div>
                
                <div className="flex-1">
                <div
                  title="progress bar"
                  role="progressbar"
                  aria-label="Audio progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  onClick={(e) => {
                    if (!audioRef.current || !duration) return;
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, clickX / rect.width));
                    audioRef.current.currentTime = pct * duration;
                  }}
                  className="h-2 bg-black border border-gray-600 rounded-full relative cursor-pointer"
                >
                  <div
                    className="h-2 rounded-full bg-gray-200 absolute left-0 top-0"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              </div>

              

              
            </div>
            <div className="flex items-baseline justify-end px-7 py-4 border-t-2">
              <a
                href={audioUrl}
                download={"translation.wav"}
                className="ml-3 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm transition-all duration-200"
                aria-label="Download audio"
                rel="noopener noreferrer"
              >
                <Download className="text-black w-4 h-4" />
                <span className=" text-black hidden md:inline">Download</span>
              </a>

            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
