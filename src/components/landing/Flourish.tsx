/**
 * Hand-drawn editorial ornament — a single restrained flourish.
 * Inherits color via currentColor.
 */
export function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M2 30 C 20 30, 28 12, 48 12 C 68 12, 72 48, 92 48 C 108 48, 116 32, 118 30" />
      <path d="M48 12 C 50 6, 58 4, 60 10" opacity="0.7" />
      <path d="M92 48 C 90 54, 82 56, 80 50" opacity="0.7" />
      <circle cx="60" cy="30" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
