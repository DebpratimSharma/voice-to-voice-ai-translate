"use client";

import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface LanguageSelectorProps {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}

// Sample languages
const languages = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "hi", name: "Hindi" },
];

export default function LanguageSelector({ selectedLang, setSelectedLang }: LanguageSelectorProps) {
  return (
    <div className="relative w-full">
      {/* M3 Filled Input Style Container */}
      <div className="flex items-center rounded-t-2xl  py-2  transition-colors relative">
        <Languages className=" mr-3 h-6 w-6" />
        
        <div className="flex flex-col flex-1">

          {/* Select Component using shadcn */}
          <Select value={selectedLang} onValueChange={setSelectedLang}>
            <SelectTrigger >
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} >
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>          
          {/* Native Select styled to be invisible but functional over the container */}
          {/* <select
            id="lang-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="font-medium text-lg outline-none appearance-none w-full cursor-pointer pt-1 pb-1 z-10"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-black py-2">
                {lang.name}
              </option>
            ))}
          </select> */}
        </div>
        
        {/* Custom drop arrow */}
        
      </div>
    </div>
  );
}