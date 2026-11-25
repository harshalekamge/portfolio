/**
 * Hand-drawn strokes. Each is a single path drawn with a round pen, so it can be
 * "written" on by animating stroke-dashoffset (see drawStroke).
 */
const PATHS = {
  underline:
    "M6 30 C 90 22, 210 16, 330 15 C 420 14, 500 17, 560 22 C 520 23, 430 24, 330 26 C 240 28, 150 32, 90 37 C 180 35, 300 34, 420 36",
  loop: "M8 34 C 120 26, 260 22, 400 24 C 470 25, 520 28, 540 33 C 470 30, 380 30, 300 33 C 230 36, 180 42, 220 44 C 300 46, 420 40, 590 36",
  circle:
    "M150 8 C 70 6, 10 18, 8 34 C 6 52, 80 62, 170 60 C 260 58, 300 46, 292 30 C 284 14, 220 4, 130 10 C 90 13, 60 20, 52 26",
  arrow: "M6 40 C 60 34, 120 24, 180 12 M150 6 C 162 9, 174 10, 182 12 C 178 20, 174 28, 170 36",
} as const;

export type ScribbleKind = keyof typeof PATHS;

const VIEW: Record<ScribbleKind, string> = {
  underline: "0 0 570 46",
  loop: "0 0 600 52",
  circle: "0 0 300 68",
  arrow: "0 0 190 46",
};

export default function Scribble({ kind = "underline", className = "" }: { kind?: ScribbleKind; className?: string }) {
  return (
    <svg
      className={`scribble scribble--${kind} ${className}`}
      viewBox={VIEW[kind]}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[kind]} pathLength={1} />
    </svg>
  );
}
