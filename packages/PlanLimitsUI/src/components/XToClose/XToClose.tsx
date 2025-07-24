import colors from '@lib/shared/styles/colors';

const xIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={`${colors.nui}`}
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const XToClose = ({ onClick }: { onClick: () => void; className?: string }) => (
  <button
    className={`border-none m-0 p-1`}
    style={{ backgroundColor: 'transparent' }}
    onClick={onClick}
  >
    {xIcon}
  </button>
);

export default XToClose;
