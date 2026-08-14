const MAX_SEARCH_LENGTH = 80;

export function parseSearchQuery(value: string | null | undefined) {
  if (!value) return "";

  return value
    .trim()
    .replace(/[%_]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, MAX_SEARCH_LENGTH);
}

export function toIlikePattern(query: string) {
  return `%${query}%`;
}
