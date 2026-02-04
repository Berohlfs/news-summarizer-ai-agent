export interface Article {
  title: string;
  subtitle: string | null;
  author: string | null;
  content: string;
}

interface JinaResponse {
  data: {
    title: string;
    description: string;
    url: string;
    content: string;
  };
}

export async function fetchArticle(url: string): Promise<Article> {
  const response = await fetch(`https://r.jina.ai/${url}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: HTTP ${response.status}`);
  }

  const json = (await response.json()) as JinaResponse;
  const { title, description, content } = json.data;

  if (!content || content.length < 50) {
    throw new Error(
      "Could not extract article content. The article may be behind a paywall or the page structure was unrecognized."
    );
  }

  const maxLength = 15000;
  const truncatedContent =
    content.length > maxLength
      ? content.slice(0, maxLength) + "\n\n[Content truncated...]"
      : content;

  return {
    title: title || "Untitled",
    subtitle: description || null,
    author: null,
    content: truncatedContent,
  };
}
