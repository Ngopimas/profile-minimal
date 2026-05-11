import satori from "satori";
import type { CollectionEntry } from "astro:content";
import { SITE } from "@config";
import loadGoogleFonts, { type FontOptions } from "../loadGoogleFont";

export default async (post: CollectionEntry<"blog">) => {
  const pubDate = new Date(post.data.pubDatetime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return satori(
    <div
      style={{
        background: "#0a0a0e",
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        padding: "80px",
        paddingLeft: "100px",
      }}
    >
      {/* Vertical accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "6px",
          height: "100%",
          background: "#1e8c78",
        }}
      />

      {/* Subtle dot grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* RC monogram watermark */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "56px",
          fontSize: "140px",
          fontWeight: 700,
          color: "#131316",
          letterSpacing: "-0.05em",
          fontFamily: "IBM Plex Mono",
          lineHeight: 1,
        }}
      >
        RC
      </div>

      {/* Subtle top-right ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle at top right, rgba(30,140,120,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#1e8c78",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "40px",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            Article
          </p>
          <p
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#f0f0f4",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxHeight: "340px",
              overflow: "hidden",
              fontFamily: "IBM Plex Mono",
            }}
          >
            {post.data.title}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1e1e22",
            paddingTop: "28px",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#77777a",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            {post.data.author} · {pubDate}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#1e8c78",
              color: "#0a0a0e",
              fontSize: 15,
              fontFamily: "IBM Plex Mono",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "10px 22px",
              borderRadius: "4px",
            }}
          >
            Read article →
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        "ARTICLERead article→" + post.data.title + post.data.author + SITE.website + pubDate
      )) as FontOptions[],
    }
  );
};
