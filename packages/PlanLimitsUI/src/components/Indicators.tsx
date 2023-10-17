export const LoadingIndicator = () => (
  <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
    <svg
      className="h-1.5 w-1.5 fill-gray-400 animate-ping"
      viewBox="0 0 6 6"
      aria-hidden="true"
    >
      <circle cx={3} cy={3} r={3} />
    </svg>
    Loading
  </span>
);

export const ErrorIndicator = () => (
  <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
    <svg
      className="h-1.5 w-1.5 fill-red-500"
      viewBox="0 0 6 6"
      aria-hidden="true"
    >
      <circle cx={3} cy={3} r={3} />
    </svg>
    Error
  </span>
);
