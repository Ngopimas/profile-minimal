import satori from "satori";
import type { CollectionEntry } from "astro:content";
import { SITE } from "@config";
import loadGoogleFonts, { type FontOptions } from "../loadGoogleFont";

export default async (post: CollectionEntry<"blog">) => {
  return satori(
    <div
      style={{
        background: "#0a0a0e",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "80px",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "4px",
          background: "#1e8c78",
          marginBottom: "48px",
        }}
      />
      <p
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: "#e1e1e6",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          maxHeight: "400px",
          overflow: "hidden",
        }}
      >
        {post.data.title}
      </p>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: "#88888c",
          }}
        >
          {post.data.author}
        </p>
        <p
          style={{
            fontSize: 18,
            color: "#55555a",
            letterSpacing: "0.05em",
          }}
        >
          {new URL(SITE.website).hostname}
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        post.data.title + post.data.author + SITE.website
      )) as FontOptions[],
    }
  );
};
