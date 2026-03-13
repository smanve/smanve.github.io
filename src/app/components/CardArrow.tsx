export default function CardArrow() {
  return (
    <span
      aria-hidden="true"
      className="ui-card-arrow transition-transform group-hover:translate-x-0.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14m0 0-5-5m5 5-5 5"
        />
      </svg>
    </span>
  );
}
