/**
 * Blync AI Web Search Utility
 * Fast, lightweight web search for latest company placement patterns and recruitment news.
 */

export interface SearchResult {
  searched: boolean;
  query: string;
  snippets: string[];
}

export async function searchWebForPlacementInfo(userQuery: string): Promise<SearchResult> {
  const queryLower = userQuery.toLowerCase();
  
  // Only trigger web search if query specifically asks for latest / current / recent / hiring drive info
  const needsWebSearch =
    queryLower.includes("latest") ||
    queryLower.includes("recent") ||
    queryLower.includes("2024") ||
    queryLower.includes("2025") ||
    queryLower.includes("2026") ||
    queryLower.includes("hiring drive") ||
    queryLower.includes("on-campus") ||
    queryLower.includes("off-campus") ||
    queryLower.includes("search web") ||
    queryLower.includes("update") ||
    queryLower.includes("new pattern");

  if (!needsWebSearch) {
    return { searched: false, query: "", snippets: [] };
  }

  // Refine query for high-yield recruitment round answers
  const searchQuery = `${userQuery.replace(/search web|please|can you/gi, "").trim()} recruitment pattern test rounds`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "BlyncBot/1.0 (Placement Prep Search)",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { searched: true, query: searchQuery, snippets: [] };
    }

    const data = await res.json();
    const snippets: string[] = [];

    if (data.AbstractText) {
      snippets.push(data.AbstractText);
    }

    if (Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 3)) {
        if (topic.Text) {
          snippets.push(topic.Text);
        }
      }
    }

    return {
      searched: true,
      query: searchQuery,
      snippets: snippets.slice(0, 3),
    };
  } catch {
    // Graceful fallback on network timeout or restriction
    return { searched: true, query: searchQuery, snippets: [] };
  }
}
