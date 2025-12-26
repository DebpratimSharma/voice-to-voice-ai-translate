import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-700 bg-black text-gray-300 py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-semibold text-white">AI Voice Translator <span className=" font-extralight ">at</span></span>
          <div className="text-xs text-gray-400 mt-1">
            <a href="https://ai-voice-translator.vercel.app/" className="underline hover:text-white">ai-voice-translator.vercel.app</a>
            <span className="mx-2">·</span>
            <a
              href="https://github.com/DebpratimSharma/voice-to-voice-ai-translate"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              GitHub
            </a>
          </div>
          <div className="mt-2">Created by <a href="https://github.com/DebpratimSharma" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Debpratim Sharma</a></div>
        </div>

        <div className="text-xs text-gray-400">
          Built with <a href="https://console.groq.com/docs/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">GROQ</a> (for translation) and <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">ElevenLabs</a> (for voice synthesis). Audio is processed server-side by configured providers.
          <div className="mt-2 text-xs text-yellow-300">Disclaimer: AI outputs may be imperfect — please cross-check transcriptions and translations before using them.</div>
          
          <div className="mt-2">© {year} · Open source</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
