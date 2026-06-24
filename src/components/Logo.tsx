/**
 * Southern Tier brand mark — a simplified rendition of the two interwoven
 * swooshes from the STT logo (red sweeping the top, royal blue the bottom).
 * Pure SVG so it stays crisp at any size and never hits the network.
 */
export function BrandMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Southern Tier Telecommunications"
    >
      {/* Red swoosh — arcs over the top */}
      <path
        d="M9 31 C 6 12, 31 4, 56 13"
        stroke="#ce1126"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Royal-blue swoosh — sweeps under the bottom */}
      <path
        d="M55 17 C 58 36, 33 44, 8 35"
        stroke="#2f86e0"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
