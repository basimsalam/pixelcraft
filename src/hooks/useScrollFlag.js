import { useEffect, useState } from "react";

export function useScrollFlag(threshold = 50) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsPastThreshold(window.scrollY > threshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isPastThreshold;
}
