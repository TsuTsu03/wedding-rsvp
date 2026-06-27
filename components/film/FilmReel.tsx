"use client";

import dynamic from "next/dynamic";
import { SaveTheDate, FILM } from "./SaveTheDate";

// The Player is browser-only - load it without SSR to avoid hydration noise.
const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
);

export function FilmReel() {
  return (
    <Player
      component={SaveTheDate}
      durationInFrames={FILM.duration}
      fps={FILM.fps}
      compositionWidth={FILM.width}
      compositionHeight={FILM.height}
      style={{ width: "100%", aspectRatio: `${FILM.width} / ${FILM.height}`, display: "block" }}
      loop
      autoPlay
      initiallyMuted
      controls
      clickToPlay
      doubleClickToFullscreen
      spaceKeyToPlayOrPause
      renderLoading={() => (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--noir)",
            color: "var(--sage)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Loading film...
        </div>
      )}
    />
  );
}
