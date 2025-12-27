import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-700 bg-black text-gray-300 py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm flex flex-col items-center md:items-start text-center md:text-left">
          <div >
            <a
              href="https://ai-voice-translator.vercel.app/"
              className=" hover:text-white"
            >
              <span className="font-semibold text-white">
                AI Voice Translator{" "}
              </span>
            </a>
            <a
              href="https://github.com/DebpratimSharma/voice-to-voice-ai-translate"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-white"
            >
              GitHub
            </a>
          </div>

          <div className="">
            By{" "}
            <a
              href="https://github.com/DebpratimSharma"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-white"
            >
              Debpratim Sharma
            </a>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center md:text-right">
          <span>Built with </span>
          <Tooltip>
            <TooltipTrigger className="underline">Groq</TooltipTrigger>
            <TooltipContent className="bg-transparent text-gray-300">
              <p>For translation</p>
            </TooltipContent>
          </Tooltip>
          <span> and </span>
          <Tooltip>
            <TooltipTrigger className="underline">Elevenlabs</TooltipTrigger>
            <TooltipContent className="bg-transparent text-gray-300">
              <p>For speech</p>
            </TooltipContent>
          </Tooltip>
          <div className="mt-2">© {year} · Open source</div>
        </div>
        
      </div>
      <div className="p-5 text-xs text-center text-gray-300">
            Disclaimer: AI outputs may be imperfect.<br/>Please cross-check
            transcriptions and translations before using them.
          </div>
    </footer>
  );
};

export default Footer;
