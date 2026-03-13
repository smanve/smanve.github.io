type MailButtonProps = {
  className?: string;
  label?: string;
};

export default function MailButton({
  className = "",
  label = "Contact me",
}: MailButtonProps) {
  return (
    <a
      href="mailto:manvendrasingh1999@gmail.com"
      className={["ui-contact-button", className].join(" ").trim()}
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.7"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 7.5v9A2.25 2.25 0 0119.5 18.75h-15A2.25 2.25 0 012.25 16.5v-9M21.75 7.5A2.25 2.25 0 0019.5 5.25h-15A2.25 2.25 0 002.25 7.5m19.5 0l-8.69 5.79a1.5 1.5 0 01-1.66 0L2.25 7.5"
        />
      </svg>
      <span>{label}</span>
    </a>
  );
}
