export const UNCATEGORIZED_LANGUAGE_SLUG = "uncategorized";
export const UNCATEGORIZED_LANGUAGE_LABEL = "Belum dikategorikan";

export function productsPath(lang?: string | null) {
  if (!lang) return "/products";
  return `/products?lang=${encodeURIComponent(lang)}`;
}

export function isUncategorizedListing(slug: string | null | undefined) {
  return slug === UNCATEGORIZED_LANGUAGE_SLUG;
}

export function slugifyLanguage(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "bahasa";
}
