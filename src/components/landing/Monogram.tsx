/**
 * Editorial monogram — interlocked A · B initials inside a hairline seal.
 * Serves as a small, unobtrusive personal mark (replaces the random flourish).
 * Inherits color via currentColor.
 */
export function Monogram({ className = '', size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-label="AGB monogram"
      role="img"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {/* Outer hairline seal */}
      <circle cx="20" cy="20" r="18.5" strokeWidth="0.6" opacity="0.55" />
      {/* Inner tick marks — like a compass rose, editorial */}
      <line x1="20" y1="2" x2="20" y2="4.5" strokeWidth="0.5" opacity="0.5" />
      <line x1="20" y1="35.5" x2="20" y2="38" strokeWidth="0.5" opacity="0.5" />
      <line x1="2" y1="20" x2="4.5" y2="20" strokeWidth="0.5" opacity="0.5" />
      <line x1="35.5" y1="20" x2="38" y2="20" strokeWidth="0.5" opacity="0.5" />
      {/* Italic serif initials */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontFamily="'Fraunces', 'Playfair Display', Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="18"
        fill="currentColor"
        stroke="none"
      >
        <tspan>A</tspan>
        <tspan dx="-1.5" fill="currentColor" opacity="0.85">B</tspan>
      </text>
    </svg>
  );
}
