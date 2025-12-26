# AI Voice Translator (voice-translator) 🔊🌐

A small Next.js app that turns uploaded audio into translated text. It's built to be simple and practical — upload voice files, pick the source and target languages, then get a transcription and translation in one go.

---

## Highlights

- Casual, developer-friendly UI for quickly translating speech files
- App Router powered Next.js + TypeScript
- Minimal components: `FileUpload`, `LanguageSelector`, `Results`, `Navbar`
- Server-side API route at `src/app/api/translate/route.ts` that handles upload, transcription, and translation

---

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Plain CSS (global styles in `src/app/globals.css`) and small reusable UI components
- Minimal server-side API for handling translations (`/api/translate`)

---

## Quick start 🚀

1. Install deps:

```bash
npm install
# or
pnpm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open http://localhost:3000 (or try the live demo: https://ai-voice-translator.vercel.app/)

You should see the app where you can upload an audio file and select languages.

---

## Usage (what to expect) 💡

- Upload an audio file (wav, mp3, etc.) via the `FileUpload` component
- Choose a source language and a target language using `LanguageSelector`
- The app sends the file to the `/api/translate` endpoint, which returns a transcription and a translated string
- Results are rendered by `Results` component — both the original transcription and the translated text

---

## Development notes 🔧

- UI components live in `src/app/components/` (e.g., `FileUpload.tsx`, `LanguageSelector.tsx`, `Results.tsx`).
- Server logic is in `src/app/api/translate/route.ts` — check this file to see which speech or translation providers are wired up and what environment variables are expected.
- Helpers and small utilities are in `src/lib/utils.ts`.

If you need to add a new provider or change request/response shape, the API route is the place to update.

---

## Environment variables

This project may require API keys for speech/translation providers (for example: `OPENAI_API_KEY`, `SOME_SPEECH_API_KEY`, etc.). See `src/app/api/translate/route.ts` for exact variable names and expected configuration.

---

## Tests & CI

There aren't any tests included by default. If you add tests, consider using Jest or Playwright for component and E2E coverage.

---

## Contributing & ideas 🤝

- Add more robust audio input (live mic capture)
- Improve results UI (timestamps, speaker separation)
- Add caching for repeated translations

Feel free to open issues or PRs — small improvements make a big difference.

---

## License

This project is open source — include your preferred license here.

---

Need help figuring something out? Check the `src/app/api/translate/route.ts` to see how the backend expects requests and what keys you might need. Happy coding! ✨
