import { useEffect, useState } from "react";

const interactiveSelector = "a, button, .service-card, .portfolio-item, .pricing-card";

export function useCustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMove = (event) => setPosition({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(interactiveSelector);
    const handleEnter = () => setHovered(true);
    const handleLeave = () => setHovered(false);

    targets.forEach((target) => {
      target.addEventListener("mouseenter", handleEnter);
      target.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", handleEnter);
        target.removeEventListener("mouseleave", handleLeave);
      });
    };
  });

  return { position, hovered };
}
