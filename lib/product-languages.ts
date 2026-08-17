export const PRODUCT_LANGUAGE_MENUS = [
  { slug: "chinese", label: "China" },
  { slug: "english", label: "English" },
  { slug: "japanese", label: "Jepang" },
  { slug: "indonesian", label: "Indo" },
] as const;

export type ProductLanguageSlug =
  (typeof PRODUCT_LANGUAGE_MENUS)[number]["slug"];

export const DEFAULT_PRODUCT_LANGUAGE: ProductLanguageSlug = "english";

export function productsPath(slug: ProductLanguageSlug = DEFAULT_PRODUCT_LANGUAGE) {
  return `/products?lang=${slug}`;
}

export function isProductLanguageSlug(
  value: string | null | undefined,
): value is ProductLanguageSlug {
  return PRODUCT_LANGUAGE_MENUS.some((item) => item.slug === value);
}

export function productLanguageLabel(slug: ProductLanguageSlug) {
  return PRODUCT_LANGUAGE_MENUS.find((item) => item.slug === slug)?.label ?? slug;
}

export function slugifyLanguage(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "bahasa";
}
