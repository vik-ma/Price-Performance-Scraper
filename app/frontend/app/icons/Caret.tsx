export default function Caret({ rotate = 0 }) {
  // SVG Icon depicting a triangular Arrow
  // At 0 (default) the arrow is pointing down
  return (
    <svg
      fill="#00df6f"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}
