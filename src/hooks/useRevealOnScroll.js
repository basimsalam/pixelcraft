import { useEffect } from "react";

export function useRevealOnScroll(selector = ".fade-up") {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(selector).forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [selector]);
}
