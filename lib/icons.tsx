import type { SVGProps } from "react";

// Custom line icons for the wedding details - drawn to one weight (1.4) so they
// sit together as a set. No emoji, no clip-art. Stroke inherits currentColor.

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Ceremony - an arch with rings beneath. */
export function CeremonyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 21V9a6 6 0 0 1 12 0v12" />
      <path d="M6 13h12" />
      <circle cx="10" cy="18" r="1.6" />
      <circle cx="13.4" cy="18" r="1.6" />
    </svg>
  );
}

/** Reception - two glasses raised in a toast. */
export function ReceptionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3l1.2 6.2a3 3 0 0 1-2.95 3.6h0A3 3 0 0 1 3.3 9.2L4.5 3" />
      <path d="M6.6 13v7M4.5 20h4.2" />
      <path d="M16 3l-1.2 6.2a3 3 0 0 0 2.95 3.6h0a3 3 0 0 0 2.95-3.6L19.5 3" />
      <path d="M17.4 13v7M15.3 20h4.2" />
    </svg>
  );
}

/** After-party - a crescent moon with a small spark. */
export function AfterPartyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.2 6.2 0 0 0 10.5 10.5z" />
      <path d="M18 4v3M16.5 5.5h3" />
    </svg>
  );
}

export const detailIcons = {
  ceremony: CeremonyIcon,
  reception: ReceptionIcon,
  afterparty: AfterPartyIcon,
};

/** A small botanical sprig used as a quiet divider/ornament. */
export function Sprig(props: IconProps) {
  return (
    <svg
      width="48"
      height="16"
      viewBox="0 0 48 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      {...props}
    >
      <path d="M24 2v12" />
      <path d="M24 6c-2-1.4-4.5-1.6-7-1 .8 2.2 2.7 3.3 5 3.2" />
      <path d="M24 6c2-1.4 4.5-1.6 7-1-.8 2.2-2.7 3.3-5 3.2" />
      <path d="M24 10c-1.6-1-3.4-1.1-5.2-.7.7 1.7 2 2.5 3.7 2.4" />
      <path d="M24 10c1.6-1 3.4-1.1 5.2-.7-.7 1.7-2 2.5-3.7 2.4" />
    </svg>
  );
}
