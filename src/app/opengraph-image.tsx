import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Blync – Game-Based Placement Aptitude Practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0f0e1e 0%, #1a1830 50%, #0f0e1e 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            background: "rgba(255, 107, 107, 0.25)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            background: "rgba(79, 70, 229, 0.25)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />

        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(79, 70, 229, 0.2)",
            border: "1px solid rgba(79, 70, 229, 0.4)",
            borderRadius: 999,
            padding: "8px 20px",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#a5b4fc", fontSize: 16, fontWeight: 500 }}>
            Capgemini &amp; Cognizant Placement Prep
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          Blync Cognitive Games
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Practice Switch, Grid, Digit, Motion &amp; more — free exam-style games for placements
        </div>

        {/* Game tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Switch", "Grid", "Digit", "Motion", "Inductive", "Deductive"].map(
            (name) => (
              <div
                key={name}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  color: "#e2e8f0",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                {name}
              </div>
            )
          )}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            color: "#475569",
            fontSize: 18,
          }}
        >
          cognitivegames.me
        </div>
      </div>
    ),
    size
  );
}
