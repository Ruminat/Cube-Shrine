"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewportOptions = {
  /** Extra margin around the root (e.g. preload before entering view). */
  rootMargin?: string;
  root?: Element | null;
};

export function useInViewport<T extends HTMLElement>(options?: UseInViewportOptions) {
  const ref = useRef<T | null>(null);
  /** Start `true` so SSR + first client paint match; observer may turn off once measured. */
  const [isIntersecting, setIsIntersecting] = useState(true);
  const { root = null, rootMargin = "120px 0px" } = options ?? {};

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { root, rootMargin, threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [root, rootMargin]);

  return { ref, isIntersecting } as const;
}
