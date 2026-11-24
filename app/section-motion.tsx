"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function smoothWheelScroll() {
  let remaining = 0;
  let frame = 0;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    remaining = 0;
  }
  function advance() {
    const next = Math.trunc(remaining * 0.93);
    const before = window.scrollY;
    window.scrollBy({ top: remaining - next, behavior: "instant" });
    remaining = next;
    if (next && window.scrollY !== before)
      frame = requestAnimationFrame(advance);
    else stop();
  }
  function wheel(event: WheelEvent) {
    if (
      !event.cancelable ||
      event.defaultPrevented ||
      event.ctrlKey ||
      event.shiftKey ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
    )
      return;
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest("input, textarea, select, [contenteditable=true], dialog")
    ) {
      stop();
      return;
    }
    event.preventDefault();
    const unit = [1, 28, 500][event.deltaMode] ?? 1;
    remaining = Math.round(remaining + event.deltaY * unit);
    if (!frame) frame = requestAnimationFrame(advance);
  }
  const interruptions = [
    "keydown",
    "pointerdown",
    "touchstart",
    "hashchange",
    "pagehide",
  ] as const;
  window.addEventListener("wheel", wheel, { passive: false });
  interruptions.forEach((name) =>
    window.addEventListener(name, stop, { passive: true }),
  );
  return () => {
    stop();
    window.removeEventListener("wheel", wheel);
    interruptions.forEach((name) => window.removeEventListener(name, stop));
  };
}

export function SectionMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 761px)");
    let cleanup = () => {};
    function configure() {
      cleanup();
      cleanup = () => {};
      if (reduced.matches) return;
      const stopWheel = desktop.matches ? smoothWheelScroll() : () => {};
      const tweens: gsap.core.Tween[] = [];
      const headings =
        document.querySelectorAll<HTMLElement>("main [data-lift]");
      const photos = document.querySelectorAll<HTMLImageElement>(
        "main [data-parallax] img",
      );
      const sections =
        document.querySelectorAll<HTMLElement>("main > .section");
      for (const section of sections) {
        tweens.push(
          gsap.fromTo(
            section,
            { "--rule-progress": 0 },
            {
              "--rule-progress": 1,
              duration: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom-=40",
                once: true,
              },
            },
          ),
        );
      }
      for (const heading of headings) {
        tweens.push(
          gsap.fromTo(
            heading,
            { y: 45, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.25,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: heading.parentElement,
                start: "top bottom-=50",
                once: true,
              },
            },
          ),
        );
      }
      for (const image of photos) {
        tweens.push(
          gsap.fromTo(
            image,
            { yPercent: -10, scale: 1.26 },
            {
              yPercent: 10,
              scale: 1.26,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          ),
        );
      }
      cleanup = () => {
        stopWheel();
        for (const tween of tweens) {
          tween.scrollTrigger?.kill();
          tween.kill();
        }
        gsap.set([...headings, ...photos], { clearProps: "transform,opacity" });
        sections.forEach((section) =>
          section.style.removeProperty("--rule-progress"),
        );
      };
    }
    configure();
    reduced.addEventListener("change", configure);
    desktop.addEventListener("change", configure);
    return () => {
      cleanup();
      reduced.removeEventListener("change", configure);
      desktop.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
