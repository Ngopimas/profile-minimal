import satori from "satori";
import { SITE } from "@config";
import loadGoogleFonts, { type FontOptions } from "../loadGoogleFont";

export default async () => {
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
          fontSize: 72,
          fontWeight: 600,
          color: "#e1e1e6",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: "24px",
        }}
      >
        {SITE.title}
      </p>
      <p
        style={{
          fontSize: 28,
          color: "#88888c",
          lineHeight: 1.4,
          maxWidth: "800px",
        }}
      >
        {SITE.desc}
      </p>
      <div style={{ flex: 1 }} />
      <p
        style={{
          fontSize: 20,
          color: "#55555a",
          letterSpacing: "0.05em",
        }}
      >
        {new URL(SITE.website).hostname}
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        SITE.title + SITE.desc + SITE.website
      )) as FontOptions[],
    }
  );
};
