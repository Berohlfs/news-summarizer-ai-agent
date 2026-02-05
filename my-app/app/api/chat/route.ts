import OpenAI from "openai";
import type { ResponseInputItem } from "openai/resources/responses/responses";
import { fetchArticle } from "@/app/api/helpers/fetch-article";

const tools: OpenAI.Responses.Tool[] = [
  {
    type: "function",
    name: "fetch_article",
    description:
      "Fetches and extracts the content of a news article given its URL. " +
      "Use this tool whenever the user provides a news article URL or asks " +
      "about a specific article.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The full URL of the news article to fetch.",
        },
      },
      required: ["url"],
      additionalProperties: false,
    },
    strict: true,
  },
];

const SYSTEM_PROMPT =
  "You are a news summarizer assistant. When a user shares a news article " +
  "URL, use the fetch_article tool to retrieve its content, then provide " +
  "a clear, well-structured summary. You can also answer follow-up " +
  "questions about articles you have already read. If the user asks " +
  "something unrelated to news articles, politely redirect them to share " +
  "an article URL.";

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  try {
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        let input: ResponseInputItem[] = [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        let continueLoop = true;

        while (continueLoop) {
          continueLoop = false;

          const stream = await openai.responses.create({
            model: "gpt-4o-mini",
            input,
            tools,
            stream: true,
          });

          for await (const event of stream) {
            if (
              event.type === "response.output_text.delta" &&
              event.delta
            ) {
              controller.enqueue(encoder.encode(event.delta));
            }

            if (event.type === "response.completed") {
              const functionCallOutput = event.response.output.find(
                (item) => item.type === "function_call"
              );

              if (
                functionCallOutput &&
                functionCallOutput.type === "function_call"
              ) {
                let toolResult: string;

                try {
                  const args = JSON.parse(
                    functionCallOutput.arguments
                  ) as { url: string };
                  const article = await fetchArticle(args.url);
                  toolResult = JSON.stringify(article);
                } catch (err) {
                  toolResult = JSON.stringify({
                    error:
                      err instanceof Error
                        ? err.message
                        : "Failed to fetch article",
                  });
                }

                input = [
                  ...input,
                  functionCallOutput,
                  {
                    type: "function_call_output",
                    call_id: functionCallOutput.call_id,
                    output: toolResult,
                  },
                ];

                continueLoop = true;
              }
            }
          }
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
