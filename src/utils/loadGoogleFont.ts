import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { FontStyle, FontWeight } from "satori";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

// Fonts are vendored in src/assets/fonts so OG image generation
// works offline - no Google Fonts request at build time.
// Resolved from the project root: import.meta.url would point into
// dist/ after bundling, where the source assets don't exist.
async function loadLocalFont(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(resolve("src/assets/fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

async function loadGoogleFonts(
  _text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "IBM Plex Mono",
      file: "IBMPlexMono-Regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      file: "IBMPlexMono-Bold.ttf",
      weight: 700,
      style: "bold",
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, file, weight, style }) => {
      const data = await loadLocalFont(file);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadGoogleFonts;
