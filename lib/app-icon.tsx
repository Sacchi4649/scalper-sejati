import { ImageResponse } from "next/og";

export function createAppIcon(
  size: number,
  { maskable = false }: { maskable?: boolean } = {},
) {
  const inset = maskable ? Math.round(size * 0.18) : 0;
  const glyph = Math.round((size - inset * 2) * 0.42);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1f18",
        }}
      >
        <div
          style={{
            width: size - inset * 2,
            height: size - inset * 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f6b4d",
            color: "#c4a35a",
            fontSize: glyph,
            fontWeight: 700,
            letterSpacing: "-0.06em",
          }}
        >
          S
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
