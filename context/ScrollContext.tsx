"use client";

import { createContext, useContext, useRef, ReactNode, useEffect } from "react";

type ScrollContextType = {
  scrollX: { current: number };
  scrollY: { current: number };
  watchElement: (element: HTMLElement | null) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const scrollX = useRef(0);
  const scrollY = useRef(0);
  const targetElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const element = targetElement.current;

          if (element) {
            scrollX.current = element.scrollLeft;
            scrollY.current = element.scrollTop;
          } else {
            scrollX.current = window.scrollX;
            scrollY.current = window.scrollY;
          }
          ticking = false;
        });
      }
    };

    const scrollTarget = targetElement.current || window;
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const watchElement = (element: HTMLElement | null) => {
    targetElement.current = element;
  };

  return (
    <ScrollContext.Provider value={{ scrollX, scrollY, watchElement }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }
  return context;
}
