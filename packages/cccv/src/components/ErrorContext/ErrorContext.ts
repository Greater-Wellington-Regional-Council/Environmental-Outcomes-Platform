import React from 'react';

const ErrorContext = React.createContext<{ error: Error | null, setError: (e: Error | null) => void }>({error: null, setError: () => {}});

export default ErrorContext;