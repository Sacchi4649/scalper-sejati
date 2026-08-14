import { createAppIcon } from "@/lib/app-icon";

export const dynamic = "force-static";

const icons = {
  "192": { size: 192, maskable: false },
  "512": { size: 512, maskable: false },
  "512-maskable": { size: 512, maskable: true },
} as const;

type IconSize = keyof typeof icons;

export function generateStaticParams() {
  return Object.keys(icons).map((size) => ({ size }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ size: string }> },
) {
  const { size } = await context.params;
  const icon = icons[size as IconSize];
  if (!icon) {
    return new Response("Not found", { status: 404 });
  }

  return createAppIcon(icon.size, { maskable: icon.maskable });
}
