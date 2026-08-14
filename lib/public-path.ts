const PUBLIC_EXACT = new Set([
  "/login",
  "/offline",
  "/sw.js",
  "/manifest.webmanifest",
  "/manifest.json",
]);

export function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/icon")) return true;
  if (pathname.startsWith("/apple-icon")) return true;
  if (pathname.startsWith("/icons/")) return true;
  return false;
}
