"use client";

import { UploadCloud, Music } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface FileUploadProps {
  onFileSelected: (file: File | null) => void;
  file?: File | null;
}

export default function FileUpload({ onFileSelected, file }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal UI when parent clears/replaces the file
  useEffect(() => {
    if (file && file.name) {
      setFileName(file.name);
    } else {
      setFileName(null);
      // Clear native input so the same file can be reselected
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [file]);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("audio/")) {
      setFileName(file.name);
      onFileSelected(file);
    } else {
      alert("Please select a valid audio file (MP3, WAV, M4A, etc.)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerSelect = () => inputRef.current?.click();

  return (
    <div className="w-full">
      <input
        title="file"
        ref={inputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/ogg,audio/webm,audio/flac"
        className="hidden"
        onChange={handleChange}
      />
      
      {/* M3 Upload Container */}
      <div
        className={`
          relative flex flex-col items-center justify-center h-52 w-full 
          rounded-lg border-2 border-dashed transition-all cursor-pointer
          ${dragActive 
            ? "" 
            : ""
          }
        `}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={handleDrop}
        onClick={triggerSelect}
      >
        {fileName ? (
          // Selected State
          <div className="flex flex-col items-center w-full px-4 animate-in fade-in zoom-in">
            <Music className="w-12 h-12 mb-2" />
            <p className="text-lg font-medium w-full truncate text-center" title={fileName}>{fileName}</p>
            <p className="text-sm">Click to change file</p>
          </div>
        ) : (
          // Idle State
          <div className="flex flex-col items-center">
            <UploadCloud className="w-12 h-12 mb-4 " />
            <p className="text-lg text-center font-medium mb-1 text-m3-on-surface">
              Upload Audio File upto 10MB
            </p>
            <p className="text-sm text-center">Drag & drop or click to browse </p>
          </div>
        )}
      </div>
    </div>
  );
}