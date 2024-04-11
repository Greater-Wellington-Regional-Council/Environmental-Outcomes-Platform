import React, { useState } from "react";
import ErrorContext from "./ErrorContext";

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <ErrorContext.Provider value={{error, setError}}>
      {/* This parent div is positioned relative to allow absolute positioned children within */}
      <div className="relative min-h-screen">
        {/* Error banner absolutely positioned to overlay at the top of the container */}
        {error && (
          <div className="absolute inset-x-0 top-0 bg-red-500 text-white z-50 p-2 shadow-lg">
            {error.message}
          </div>
        )}
        {children}
      </div>
    </ErrorContext.Provider>
  );
};
