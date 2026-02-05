import { Bot, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SUPPORTED_SOURCES = [
  { label: "g1.globo.com", href: "https://g1.globo.com" },
  { label: "bbc.com", href: "https://bbc.com" },
  { label: "cnn.com", href: "https://cnn.com" },
  { label: "nytimes.com", href: "https://nytimes.com" },
  { label: "nytimes.com/athletic", href: "https://www.nytimes.com/athletic" }
];

export function ChatWelcome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Bot className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          News Summarizer
        </h2>
        <p className="text-sm text-muted-foreground">
          Share a news article URL and I will read, summarize, and answer your questions about it.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {SUPPORTED_SOURCES.map((source) => (
            <Badge
              key={source.label}
              variant="secondary"
              className="text-xs"
              asChild
            >
              <a href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
                <ExternalLink className="size-3" />
              </a>
            </Badge>
          ))}
        </div>
        <span className="block pt-6 mt-2 text-xs text-muted-foreground">
          <strong>Note:</strong> Some websites may not work temporarily due to anti-bot protections.
        </span>
      </div>
    </div>
  );
}
