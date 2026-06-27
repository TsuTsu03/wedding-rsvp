"use client";

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { wedding } from "@/lib/content";

export const FILM = { fps: 30, duration: 430, width: 1600, height: 900 };

const NOIR = "#14110d";
const IVORY = "#f0ead9";
const SAGE = "#aebaa0";
const CLAY = "#b4694e";

const display = "var(--font-display), Georgia, serif";
const sans = "var(--font-sans), system-ui, sans-serif";

/* -- Persistent cinema furniture: grain, vignette, letterbox, timecode ---- */

function Grain() {
  const frame = useCurrentFrame();
  // Shift a noise tile every couple frames for a living-grain feel.
  const seed = Math.floor(frame / 2) % 5;
  const offsets = [
    [0, 0],
    [-8, 6],
    [6, -8],
    [-4, 9],
    [7, -3],
  ][seed];
  return (
    <AbsoluteFill
      style={{
        opacity: 0.08,
        mixBlendMode: "screen",
        transform: `translate(${offsets[0]}px, ${offsets[1]}px) scale(1.1)`,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function Vignette() {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 50% 45%, transparent 50%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  );
}

function Letterbox() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inBar = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const outBar = spring({
    frame: frame - (durationInFrames - 24),
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const h = interpolate(inBar - outBar, [0, 1], [0, 64]);
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000" }} />
    </>
  );
}

function Timecode() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [10, 30], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secs = frame / fps;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(Math.floor(secs % 60)).padStart(2, "0");
  const ff = String(frame % fps).padStart(2, "0");
  return (
    <div
      style={{
        position: "absolute",
        bottom: 84,
        left: 64,
        opacity,
        color: IVORY,
        fontFamily: sans,
        fontSize: 22,
        letterSpacing: "0.25em",
      }}
    >
      {mm}:{ss}:{ff}
    </div>
  );
}

function RecDot() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blink = Math.sin(frame / 6) > 0 ? 1 : 0.2;
  return (
    <div
      style={{
        position: "absolute",
        top: 84,
        right: 64,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: IVORY,
        fontFamily: sans,
        fontSize: 20,
        letterSpacing: "0.25em",
      }}
    >
      <span style={{ width: 11, height: 11, borderRadius: 99, background: CLAY, opacity: blink }} />
      REC
    </div>
  );
}

/* -- A small drawn sprig (path length animated by frame) ----------------- */
function Sprig({ progress }: { progress: number }) {
  const d = [
    "M80 4 V96",
    "M80 30 C60 18 36 16 14 22 C22 44 46 56 78 50",
    "M80 30 C100 18 124 16 146 22 C138 44 114 56 82 50",
    "M80 60 C64 50 44 49 24 54 C32 72 52 80 80 74",
    "M80 60 C96 50 116 49 136 54 C128 72 108 80 80 74",
  ];
  return (
    <svg width="160" height="100" viewBox="0 0 160 100" fill="none">
      {d.map((p, i) => (
        <path
          key={i}
          d={p}
          stroke={SAGE}
          strokeWidth={1.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, progress * 1.3 - i * 0.08))}
        />
      ))}
    </svg>
  );
}

/* -- Scenes --------------------------------------------------------------- */

function fadeInOut(frame: number, dur: number, hold = 18) {
  return interpolate(frame, [0, hold, dur - hold, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function SceneOpen() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, 80);
  const lineW = interpolate(frame, [8, 50], [0, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const spread = interpolate(frame, [12, 60], [0.6, 0.32], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ height: 1, width: lineW, background: SAGE, opacity: 0.7 }} />
      <div
        style={{
          marginTop: 28,
          color: IVORY,
          fontFamily: sans,
          fontSize: 26,
          letterSpacing: `${spread}em`,
          textTransform: "uppercase",
          paddingLeft: `${spread}em`,
        }}
      >
        Save the Date
      </div>
    </AbsoluteFill>
  );
}

function SceneNames() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, 110, 22);
  // Wipe-up reveal via clip-path inset, with a slow drift up.
  const reveal = interpolate(frame, [8, 46], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const drift = interpolate(frame, [0, 110], [22, -22]);
  const amp = spring({ frame: frame - 20, fps: 30, config: { damping: 200 }, durationInFrames: 40 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 300,
          color: IVORY,
          fontSize: 168,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textAlign: "center",
          transform: `translateY(${drift}px)`,
          clipPath: `inset(0 0 ${reveal}% 0)`,
        }}
      >
        {wedding.couple.one}
        <span style={{ fontStyle: "italic", color: SAGE, opacity: amp, margin: "0 24px" }}>&amp;</span>
        {wedding.couple.two}
      </div>
    </AbsoluteFill>
  );
}

function SceneDate() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = fadeInOut(frame, 100, 20);
  const parts = ["14", "11", "26"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
        {parts.map((p, i) => {
          const s = spring({ frame: frame - 8 - i * 8, fps, config: { damping: 16, stiffness: 120 } });
          const y = interpolate(s, [0, 1], [70, 0]);
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 300,
                  color: IVORY,
                  fontSize: 200,
                  lineHeight: 1,
                  transform: `translateY(${y}px)`,
                  opacity: s,
                }}
              >
                {p}
              </span>
              {i < parts.length - 1 && (
                <span style={{ color: CLAY, fontFamily: display, fontSize: 120, opacity: interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                  /
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 36,
          color: SAGE,
          fontFamily: sans,
          fontSize: 26,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [40, 60], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Saturday / November
      </div>
    </AbsoluteFill>
  );
}

function SceneLocation() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, 100, 20);
  const sprig = interpolate(frame, [6, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [10, 50], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ opacity: sprig }}>
        <Sprig progress={sprig} />
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: display,
          fontStyle: "italic",
          fontWeight: 300,
          color: IVORY,
          fontSize: 96,
          transform: `translateY(${rise}px)`,
        }}
      >
        {wedding.location.split(",")[0]}
      </div>
      <div
        style={{
          marginTop: 14,
          color: SAGE,
          fontFamily: sans,
          fontSize: 24,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [34, 54], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Philippines
      </div>
    </AbsoluteFill>
  );
}

function SceneClose() {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, 80, 20);
  const spread = interpolate(frame, [6, 40], [0.5, 0.3], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          color: IVORY,
          fontFamily: sans,
          fontSize: 24,
          letterSpacing: `${spread}em`,
          textTransform: "uppercase",
          paddingLeft: `${spread}em`,
        }}
      >
        You're invited
      </div>
      <div style={{ marginTop: 22, fontFamily: display, fontStyle: "italic", color: SAGE, fontSize: 30, opacity: interpolate(frame, [24, 44], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {wedding.hashtag}
      </div>
    </AbsoluteFill>
  );
}

/* -- Root composition ----------------------------------------------------- */

export function SaveTheDate() {
  return (
    <AbsoluteFill style={{ background: NOIR }}>
      <Sequence from={0} durationInFrames={80}>
        <SceneOpen />
      </Sequence>
      <Sequence from={70} durationInFrames={110}>
        <SceneNames />
      </Sequence>
      <Sequence from={170} durationInFrames={100}>
        <SceneDate />
      </Sequence>
      <Sequence from={260} durationInFrames={100}>
        <SceneLocation />
      </Sequence>
      <Sequence from={350} durationInFrames={80}>
        <SceneClose />
      </Sequence>

      <Vignette />
      <Grain />
      <Letterbox />
      <Timecode />
      <RecDot />
    </AbsoluteFill>
  );
}
