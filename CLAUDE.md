# AI Chatbot

News-focused AI chatbot with article summarization and text-to-speech, built with Next.js and the OpenAI SDK.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Radix UI, shadcn/ui (New York style)
- **AI:** OpenAI SDK — `gpt-4o-mini` for chat, `tts-1` for speech
- **Package manager:** pnpm

## Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # Chat streaming endpoint (SSE)
│   │   └── tts/route.ts        # Text-to-speech endpoint
│   ├── components/
│   │   ├── chat.tsx             # Main chat container
│   │   ├── chat-input.tsx       # Message input
│   │   ├── chat-message.tsx     # Message display (markdown)
│   │   ├── chat-welcome.tsx     # Welcome screen
│   │   ├── audio-context.tsx    # Audio state provider
│   │   ├── audio-player.tsx     # Audio player with waveform
│   │   ├── fetch-article.ts     # Jina API article extraction
│   │   └── types.ts             # Shared TypeScript interfaces
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/ui/               # shadcn/ui components (button, input, scroll-area, sonner)
└── lib/utils.ts                 # cn() helper
```

## Key Features

- **Streaming chat:** OpenAI Responses API streamed to the client via SSE
- **Article fetching:** `fetch_article` function tool calls Jina API (`r.jina.ai`) to extract and summarize news articles
- **Text-to-speech:** OpenAI TTS generates audio for assistant messages; cached in-memory per message
- **Markdown rendering:** React Markdown with GFM support and styled components

## Architecture Notes

- No database — chat messages live in React component state (ephemeral)
- Audio blobs cached in a `Map<messageId, blobUrl>` via React Context (`AudioProvider`)
- OpenAI function tools are resolved server-side in the chat route before streaming back
- No authentication — API keys stored in `.env`

## Development

```sh
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Run ESLint
```

### Environment Variables

| Variable      | Description       |
|---------------|-------------------|
| `OPEN_AI_KEY` | OpenAI API key    |
