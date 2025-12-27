"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, AlertCircle, Download } from 'lucide-react';
import { cn } from "@/lib/utils"; // shadcn utility

// --- Vercel-esque Button Component ---
const CustomButton = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-sm h-12 px-6 rounded-sm";
  const variants: any = {
    primary: "bg-white text-black hover:bg-gray-200 border border-transparent shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]",
    secondary: "bg-accent text-white border  hover:border-gray-600 hover:bg-gray-800",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Audio Visualizer Component ---
const Visualizer = ({ audioContext, sourceNode, isRecording }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    if (!audioContext || !sourceNode || !isRecording) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    sourceNode.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#444444');

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, 2);
        ctx.fill();
        x += barWidth + 2;
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [audioContext, sourceNode, isRecording]);

  return <canvas ref={canvasRef} width={800} height={128} className="w-full h-32 rounded opacity-80" />;
};

// --- Main VoiceRecorder Component ---
interface VoiceRecorderProps {
  onRecordingComplete: (file: File) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{url: string, duration: string, blobSize: number} | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      audioContextRef.current = audioCtx;
      sourceNodeRef.current = source;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        setRecordedAudio({
          url: URL.createObjectURL(blob),
          duration: formatTime(elapsedTime),
          blobSize: blob.size
        });
        onRecordingComplete(file); // SEND TO PAGE.TSX
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) audioContextRef.current.close();
      };

      mediaRecorder.start();
      setRecordedAudio(null);
      setIsRecording(true);
      setElapsedTime(0);
      setPermissionError(null);
    } catch (err) {
      setPermissionError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full  bg-black border  rounded-xl shadow-2xl overflow-hidden relative flex flex-col pb-0 lg:h-[400px]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50" />

      {/* Header */}
      <div className="px-8 py-4 border-b  flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-white")} />
          <h1 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            {isRecording ? 'Recording' : recordedAudio ? 'Preview' : 'Ready'}
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center p-8  gap-8">
        {recordedAudio && <audio ref={audioPlayerRef} src={recordedAudio.url} onEnded={() => setIsPlaying(false)} className="hidden" />}

        {/* Left: Timer */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <div className="font-mono font-bold tracking-tighter text-white text-7xl lg:text-8xl md:text-7xl">
            {recordedAudio ? recordedAudio.duration : formatTime(elapsedTime)}
          </div>
          {recordedAudio && (
            <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
              WebM • {(recordedAudio.blobSize / 1024).toFixed(1)} KB
            </p>
          )}
        </div>

        {/* Right: Visualizer & Controls */}
        <div className="flex flex-col items-center md:items-end w-full md:w-2/3 gap-8">
          <div className="px-10 h-24 flex items-center justify-center  rounded-xl  p-4">
            {permissionError ? (
              <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle size={16}/>{permissionError}</div>
            ) : recordedAudio ? (
              <div className="w-full flex items-center justify-center gap-1 h-12">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className={cn("w-1 rounded-full transition-all bg-[#ffffff49]", isPlaying && "bg-white animate-pulse")} 
                       style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
            ) : (
              <Visualizer audioContext={audioContextRef.current} sourceNode={sourceNodeRef.current} isRecording={isRecording} />
            )}
          </div>

          <div className="flex items-center gap-4">
            {!recordedAudio ? (
              !isRecording ? (
                <button onClick={startRecording} className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
                  <Mic className="text-black w-8 h-8" fill="currentColor" />
                </button>
              ) : (
                <button onClick={stopRecording} className="w-20 h-20 rounded-full bg-gray-900 border-2 border-red-500 flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-sm animate-pulse" />
                </button>
              )
            ) : (
              <div className="flex items-center gap-2 bg-card p-2 rounded-xl border-2  ">
                <CustomButton variant="ghost" onClick={() => setRecordedAudio(null)}><RotateCcw size={18}/></CustomButton>
                <CustomButton variant="primary" onClick={() => {
                  if (isPlaying) audioPlayerRef.current?.pause();
                  else audioPlayerRef.current?.play();
                  setIsPlaying(!isPlaying);
                }} className="w-18 md:w-32">
                  {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
                </CustomButton>
                <a href={recordedAudio.url} download="recording.webm">
                  <CustomButton variant="secondary"><Download size={18}/></CustomButton>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}