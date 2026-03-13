import React from "react";

interface AlertBoxProps {
  message: string;
  buttonText: string;
  buttonLink: string;
  onDismiss: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  message,
  buttonText,
  buttonLink,
}) => {
  return (
    <div role="alert" className="ui-panel p-5">
      <div className="space-y-4">
        <strong className="block text-base font-semibold text-[color:var(--text)]">
          {message}
        </strong>

        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-button"
        >
          <span className="text-sm">{buttonText}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default AlertBox;
