import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30; // Extends to 30 seconds

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetLang = formData.get("targetLang") as string;
    // Accept multiple possible keys (voiceId, voiceID, voice) to be flexible with client form keys
    const voiceIdRaw = formData.get("voiceId") ?? formData.get("voiceID") ?? formData.get("voice") ?? "21m00Tcm4TlvDq8ikWAM";
    const voiceId = String(voiceIdRaw);
    console.log("Using voiceId:", voiceId); // debug info

    if (!file || !targetLang) {
      return NextResponse.json({ error: "Missing file or language" }, { status: 400 });
    }

    // --- STEP 1: Transcription (STT) with Groq Whisper ---
    // We pass the raw file directly to Groq
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
      response_format: "json",
    });

    const sourceText = transcription?.text;
    console.log("Transcribed:", sourceText);
    if (!sourceText) {
      console.error("Transcription empty or failed:", transcription);
      return NextResponse.json({ error: "Transcription failed. Please try a different audio or format." }, { status: 502 });
    }

    // --- STEP 2: Translation with Groq Llama 3 ---
    const translationCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLang}. 
      Output ONLY the translated text. Do not include explanations or phonetic spellings. 
      Keep the meaning intact and ensure natural phrasing in the target language.`,
        },
        {
          role: "user",
          content: sourceText,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const translatedText = translationCompletion.choices[0]?.message?.content || "";
    console.log("Translated:", translatedText);

    // --- STEP 3: Synthesis (TTS) with ElevenLabs ---
    // Using a custom ID for voice (e.g., "Rachel" - 21m00Tcm4TlvDq8ikWAM)
    const ELEVENLABS_VOICE_ID = voiceId.toString(); 
    
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: translatedText,
          model_id: "eleven_turbo_v2_5", // Better for foreign languages
          language_code: targetLang,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const bodyText = await ttsResponse.text().catch(() => "");
      console.error("ElevenLabs TTS failed", ttsResponse.status, bodyText);
      return NextResponse.json({ error: `ElevenLabs TTS error: ${ttsResponse.status} ${bodyText}` }, { status: 502 });
    }

    // Get audio as ArrayBuffer
    const audioArrayBuffer = await ttsResponse.arrayBuffer();

    // Return the Audio + Metadata headers
    // We send the text results in headers so the frontend can display them alongside the audio
    return new Response(audioArrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Source-Text": encodeURIComponent(sourceText), // Header hack to send data back with file
        "X-Translated-Text": encodeURIComponent(translatedText),
      },
    });

  } catch (error: any) {
    console.error("Processing failed:", error);
    const msg = error?.message || "Translation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}