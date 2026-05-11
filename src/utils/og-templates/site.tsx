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
          width: "4px",
          height: "100%",
          background: "#1e8c78",
        }}
      />

      {/* Subtle dot grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
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
          color: "#111114",
          letterSpacing: "-0.05em",
          fontFamily: "IBM Plex Mono",
          lineHeight: 1,
        }}
      >
        RC
      </div>

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
              fontSize: 14,
              color: "#1e8c78",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "36px",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            Portfolio
          </p>
          <p
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#e8e8ec",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "28px",
              maxWidth: "920px",
              fontFamily: "IBM Plex Mono",
            }}
          >
            {SITE.title}
          </p>
          <p
            style={{
              fontSize: 22,
              color: "#66666a",
              lineHeight: 1.5,
              maxWidth: "680px",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            {SITE.desc}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid #1a1a1e",
            paddingTop: "24px",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#44444a",
              letterSpacing: "0.06em",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            {new URL(SITE.website).hostname}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#1e8c78",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            View work →
          </p>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        "PORTFOLIOView work→" + SITE.title + SITE.desc + SITE.website + "RC"
      )) as FontOptions[],
    }
  );
};
