import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userProvidedKey = req.headers.get("x-user-elevenlabs-key");
  const apiKey = userProvidedKey || process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "No API Key found." }, { status: 401 });
  }

  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": apiKey },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return NextResponse.json(
      { error: `ElevenLabs voices error: ${response.status} ${body}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const voices = (data.voices || [])
    .filter((voice: { voice_id?: string; name?: string }) => voice.voice_id && voice.name)
    .map((voice: { voice_id: string; name: string }) => ({
      id: voice.voice_id,
      name: voice.name,
    }));

  return NextResponse.json({ voices });
}