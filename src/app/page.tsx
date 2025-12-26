"use client";

import { useState } from "react";
import FileUpload from "./components/FileUpload";
import LanguageSelector from "./components/LanguageSelector";
import Results from "./components/Results";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [statusTranslated, setStatusTranslated] = useState(false);

  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Mock translation function for UI demonstration
  const handleTranslate = async () => {
    if (!file || !targetLang) return;
    setIsTranslating(true);
    setAudioUrl(null); // Reset previous
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetLang", targetLang); // Pass full name like "Spanish" or code "es"

      const response = await fetch("/api/translate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Translation failed");

      // 1. Extract Headers (Text Data)
      const srcText = decodeURIComponent(response.headers.get("X-Source-Text") || "");
      const transText = decodeURIComponent(response.headers.get("X-Translated-Text") || "");
      
      setSourceText(srcText);
      setTranslatedText(transText);

      // 2. Handle Audio Blob
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // 3. Auto-play
      const audio = new Audio(url);
      audio.play();

    } catch (error) {
      alert("Something went wrong during translation.");
      console.error(error);
    } finally {
      setIsTranslating(false);
      setStatusTranslated(true);
    }
  };

  const handleClear = () => {
    if (audioUrl) {
      try { URL.revokeObjectURL(audioUrl); } catch {}
    }
    setSourceText("");
    setTranslatedText("");
    setAudioUrl(null);
    setStatusTranslated(false);
  };

  return (
    <main className="px-20  ">
      {/* Main Action Card - M3 Container */}
      <div className="mt-10 w-full bg-[#0f0e0e]  rounded-xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border  space-y-8 animate-in zoom-in-95 duration-500 delay-150">
        <section className="space-y-2">
          <h1 className="text-lg ">
            Upload an audio file to instantly translate voice to foreign speech
            using AI.
          </h1>
          <h2 className="text-sm font-medium text-[#ffffff7d] ">
            STEP 1: SOURCE AUDIO
          </h2>
          <FileUpload onFileSelected={setFile} />
        </section>

        {/* Divider */}

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-[#ffffff7d] ">
            STEP 2: TARGET LANGUAGE
          </h2>
          <LanguageSelector
            selectedLang={targetLang}
            setSelectedLang={setTargetLang}
          />
        </section>

        {/* Filled Button */}
        <div className="w-full flex border-t-2 pt-8 items-center justify-end">
          <button
            onClick={handleTranslate}
            disabled={!file || !targetLang || isTranslating || statusTranslated}
            className={`
            px-4 bg-white text-black relative overflow-hidden rounded-md h-12 text-lg font-medium transition-all
            flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:shadow-sm
            ${
              !file || !targetLang || isTranslating || statusTranslated
                ? " cursor-not-allowed opacity-50 shadow-none"
                : "opacity-100 hover:opacity-90 shadow-lg"
            }
          `}
          >
            {isTranslating ? (
              <>
                <div className="h-5 w-5 border-2  border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Translate Audio</span>
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        
      </div>
      {/* Results Section - M3 Card */}
        {(sourceText || translatedText) && (
          <>
            <Results sourceText={sourceText} translatedText={translatedText} audioUrl={audioUrl} />
            <div className="w-full flex items-center justify-center mb-5">
              <div className="h-px bg-[#333] grow" />
              
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm text-gray-500 hover:cursor-pointer hover:text-gray-400 transition"
                aria-label="Clear results"
              >
                Clear
              </button>
              <div className="h-px bg-[#333] grow" />
            </div>
          </>
        )}
    </main>
  );
}