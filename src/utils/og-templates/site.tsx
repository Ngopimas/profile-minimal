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
            Portfolio
          </p>
          <p
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#f0f0f4",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "32px",
              maxWidth: "920px",
              fontFamily: "IBM Plex Mono",
            }}
          >
            {SITE.title}
          </p>
          <p
            style={{
              fontSize: 22,
              color: "#77777a",
              lineHeight: 1.55,
              maxWidth: "640px",
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
            alignItems: "center",
            borderTop: "1px solid #1e1e22",
            paddingTop: "28px",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#55555a",
              letterSpacing: "0.06em",
              fontFamily: "IBM Plex Mono",
              fontWeight: 400,
            }}
          >
            {new URL(SITE.website).hostname}
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
            View work →
          </div>
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
