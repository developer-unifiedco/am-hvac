"use client";

import { useEffect } from "react";

export function SectionMotion() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          observer.unobserve(target);
          if (preference.matches) continue;
          const image = target.hasAttribute("data-wipe");
          const animation = target.animate(
            image
              ? [
                  { clipPath: "inset(0 0 96% 0)", transform: "scale(.96)" },
                  { clipPath: "inset(0)", transform: "scale(1)" },
                ]
              : [
                  { transform: "translateY(65%) skewY(3deg)", opacity: 0.15 },
                  { transform: "none", opacity: 1 },
                ],
            { duration: image ? 900 : 720, easing: "cubic-bezier(.16,1,.3,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.06 },
    );
    document
      .querySelectorAll("[data-wipe], [data-lift]")
      .forEach((el) => observer.observe(el));
    function stop() {
      animations.forEach((a) => a.cancel());
      animations.clear();
    }
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      stop();
      preference.removeEventListener("change", stop);
    };
  }, []);
  return null;
}
