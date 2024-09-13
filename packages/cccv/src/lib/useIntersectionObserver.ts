import { useEffect, useRef, MutableRefObject } from 'react'

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => void;

const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): MutableRefObject<HTMLDivElement | null> => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!targetRef.current) return

    const observer = new IntersectionObserver((entries) => {
      callback(entries)
    }, options)

    observer.observe(targetRef.current)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return targetRef
}

export default useIntersectionObserver
