import { useEffect } from 'react';

function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
        (document?.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onEscape]);
}

export default useEscapeKey;