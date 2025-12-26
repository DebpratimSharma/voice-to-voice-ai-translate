"use client";
import React from "react";
import { Languages, Check, ChevronsUpDown } from "lucide-react";
import { MicVocal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { SelectItem } from "@/components/ui/select";
// import { SelectTrigger } from "@/components/ui/select";
// import { SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

// Sample languages (expanded)
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "ru", name: "Russian" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" },
  { code: "uk", name: "Ukrainian" },
  { code: "fa", name: "Persian (Farsi)" },
];

//sample voices
const voices = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Female - Soft)" },
  { id: "cgSgspJ2msm6cl6m55bi", name: "Jessica (Female - Mature)" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel (Male - Deep)" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Male - Deep)" },
];

export default function LanguageSelector({
  selectedLang,
  setSelectedLang,
  selectedVoice,
  setSelectedVoice,

}: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(selectedLang || "");

  React.useEffect(() => {
    // keep local value in sync if parent changes selectedLang
    setValue(selectedLang || "");
  }, [selectedLang]);

  function handleSelect(code: string) {
    setValue(code);
    setSelectedLang(code);
    setOpen(false);
  }

  return (
    <div className="relative w-full md:flex gap-x-10">
      {/* Input Container */}
      <div className="flex w-full md:w-1/2 items-center rounded-t-2xl py-2 transition-colors relative">
        <Languages className="mr-3 h-6 w-6" />
        <div className="flex flex-col flex-1 bg-transparent ">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className=" justify-between bg-[#0f0e0e]"
              >
                {value
                  ? languages.find((l) => l.code === value)?.name
                  : "Select language..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className=" p-0">
              <Command>
                <CommandInput
                  placeholder="Search languages..."
                  className="h-9"
                />
                <CommandList className="custom-scrollbar h-50">
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((lang) => (
                      <CommandItem
                        key={lang.code}
                        value={lang.code}
                        onSelect={() => handleSelect(lang.code)}
                      >
                        {lang.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === lang.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center">
        <MicVocal className="mr-[15px]  h-6 w-6 text-white" />
        <Select value={selectedVoice} onValueChange={(v) => setSelectedVoice(v)}>
          <SelectTrigger className="bg-[#121212] hover:bg-[#262626]">
            <SelectValue placeholder="Select Voice" />
          </SelectTrigger>
          <SelectContent className="">
            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
