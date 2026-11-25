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
    if (target instanceof Element && target.closest(".entry-loader")) {
      event.preventDefault();
      return;
    }
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

type Motion = gsap.core.Tween | gsap.core.Timeline;

export function SectionMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 761px)");
    const pastHero = new IntersectionObserver(([entry]) => {
      document.body.toggleAttribute(
        "data-past-hero",
        entry.boundingClientRect.bottom <= 0,
      );
    });
    pastHero.observe(document.querySelector(".hero-track")!);
    let initialAnchor = document.getElementById(location.hash.slice(1));
    const cancelAnchor = () => {
      initialAnchor = null;
    };
    const inputEvents = [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
    ] as const;
    inputEvents.forEach((event) =>
      window.addEventListener(event, cancelAnchor, { passive: true }),
    );
    let cleanup = () => {};

    function configure() {
      cleanup();
      cleanup = () => {};
      if (reduced.matches) return;
      const wide = desktop.matches;
      document.body.dataset.scenes = "";
      const stopWheel = wide ? smoothWheelScroll() : () => {};
      const animations: Motion[] = [];
      const styled = new Set<Element>();
      function fromTo(
        target: Element,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
      ) {
        styled.add(target);
        animations.push(gsap.fromTo(target, from, to));
      }
      const enter = (trigger: Element, start = "top bottom-=50") => ({
        trigger,
        start,
        toggleActions: "play none none reverse",
      });
      const sweep = (
        trigger: Element,
        start = "top bottom",
        end = "bottom top",
      ) => ({
        trigger,
        start,
        end,
        scrub: true,
        invalidateOnRefresh: true,
      });
      const all = (selector: string) =>
        Array.from(document.querySelectorAll<HTMLElement>(selector));
      for (const section of all(
        "main > .section:not(.enquiry), footer, .step-grid",
      )) {
        fromTo(
          section,
          { "--rule-progress": 0, "--vertical-rule": 0 },
          {
            "--rule-progress": 1,
            "--vertical-rule": 1,
            duration: 1,
            ease: "none",
            scrollTrigger: enter(section),
          },
        );
      }
      for (const heading of all(
        "main [data-lift]:not(.about-intro h2, .quote-intro h2, .enquiry h2)",
      )) {
        fromTo(
          heading,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: enter(heading.parentElement!),
          },
        );
      }
      const about = document.querySelector(".about-intro")!;
      fromTo(
        about.firstElementChild!,
        { scale: 0 },
        {
          scale: 1,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: enter(about, "bottom bottom+=250"),
        },
      );

      const reel = document.querySelector(".service-reel")!;
      const mask = reel.querySelector(".count-mask")!;
      const number = reel.querySelector(".service-number")!;
      const label = reel.querySelector(".service-heading")!;
      const zoom = gsap.timeline({
        scrollTrigger: { ...sweep(reel, "top top", "bottom bottom"), scrub: 1 },
      });
      zoom
        .to(number, { scale: 12, rotation: 48, duration: 1, ease: "none" }, 0)
        .to(number, { scale: 30, rotation: 90, duration: 1, ease: "none" }, 1)
        .to(label, { opacity: 0, duration: 0.5, ease: "none" }, 0)
        .to(mask, { opacity: 0, duration: 0.38, ease: "none" }, 1.62);
      animations.push(zoom);
      [number, label, mask].forEach((el) => styled.add(el));

      for (const row of all(".service-grid dl > div, .step-grid li")) {
        const lines = row.querySelectorAll("dt, dd, h4, p");
        lines.forEach((line, index) =>
          fromTo(
            line,
            { yPercent: 65, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: enter(row),
            },
          ),
        );
      }
      for (const text of all(".ink-title")) {
        fromTo(
          text,
          { "--ink": "0%" },
          {
            "--ink": "100%",
            ease: "none",
            scrollTrigger: {
              trigger: text.parentElement!,
              start: "center center",
              end: () => "+=" + text.offsetHeight * 2,
              scrub: true,
            },
          },
        );
      }
      for (const [index, tile] of all(".process-stills > div").entries()) {
        if (!wide) continue;
        const travel = [21.875, 57.292, 83.333][index];
        fromTo(
          tile,
          { y: () => ((innerWidth * travel) / 100) * 0.72 },
          {
            y: () => ((-innerWidth * travel) / 100) * 0.28,
            ease: "none",
            scrollTrigger: sweep(tile.closest(".step-grid")!),
          },
        );
      }
      all(".service-details > div").forEach((tile, index) => {
        const travel = () =>
          wide
            ? innerWidth * [0.36458, 0.32656, 0.26042][index]
            : [300, 127, 200][index];
        fromTo(
          tile,
          { y: () => travel() * 0.5 },
          {
            y: () => -travel() * 0.5,
            ease: "none",
            scrollTrigger: sweep(tile.closest("figure")!),
          },
        );
      });
      for (const spread of all(".industry-spread")) {
        const figures = Array.from(spread.querySelectorAll("figure"));
        if (wide) {
          figures.forEach((figure, index) => {
            const photo = figure.querySelector<HTMLElement>(".photo")!;
            const image = photo.querySelector("img")!;
            const caption = figure.querySelector("figcaption")!;
            fromTo(
              image,
              { yPercent: -22 },
              { yPercent: 22, ease: "none", scrollTrigger: sweep(spread) },
            );
            fromTo(
              caption,
              { y: 45, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.1,
                delay: index * 0.15,
                ease: "power3.out",
                scrollTrigger: enter(figure),
              },
            );
          });
        } else {
          fromTo(
            figures[0],
            { scale: 1 },
            {
              scale: 0.88,
              ease: "power2.inOut",
              scrollTrigger: sweep(figures[1], "top bottom", "top 74px"),
            },
          );
        }
      }
      for (const photo of all("[data-parallax]")) {
        if (wide && photo.closest(".industry-spread")) continue;
        const image = photo.querySelector("img")!;
        const direction = photo.closest(".quote-intro") ? -1 : 1;
        const distance = () =>
          direction * Math.min(innerWidth * 0.10938, photo.clientHeight * 0.25);
        fromTo(
          image,
          { y: () => -distance(), scale: 1.52 },
          {
            y: distance,
            scale: 1.52,
            ease: "none",
            scrollTrigger: sweep(
              photo,
              photo.closest(".process") ? "center center" : "top bottom",
            ),
          },
        );
      }
      const cards = all(".answers article");
      cards.forEach((card, index) => {
        if (wide) {
          fromTo(
            card,
            { y: () => [0, innerWidth * 0.025, innerWidth * 0.04531][index] },
            {
              y: 0,
              ease: "none",
              scrollTrigger: sweep(card.parentElement!),
            },
          );
        } else if (index < cards.length - 1) {
          fromTo(
            card,
            { scale: 1 },
            {
              scale: 0.88,
              ease: "power2.inOut",
              scrollTrigger: sweep(cards[index + 1], "top bottom", "top 74px"),
            },
          );
        }
      });
      const quote = document.querySelector(".quote-intro")!;
      all(".line-mask > span").forEach((line, index) =>
        fromTo(
          line,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            delay: index * 0.175,
            ease: "power4.inOut",
            scrollTrigger: enter(quote),
          },
        ),
      );
      const enquiry = document.querySelector(".enquiry")!;
      const form = enquiry.querySelector("form")!;
      const contactTitle = enquiry.querySelector("h2")!;
      const arrival = gsap.timeline({ scrollTrigger: enter(enquiry) });
      arrival
        .fromTo(
          contactTitle,
          { y: 45, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.25, ease: "power3.inOut" },
          0.15,
        )
        .fromTo(
          enquiry,
          { "--rule-progress": 0, "--vertical-rule": 0 },
          {
            "--rule-progress": 1,
            "--vertical-rule": 1,
            duration: 1,
            ease: "none",
          },
          0.9,
        )
        .fromTo(
          form,
          { y: 45, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.25, ease: "power3.inOut" },
          1.4,
        );
      const revealForm = () => arrival.progress(1);
      enquiry.addEventListener("focusin", revealForm);
      animations.push(arrival);
      [contactTitle, enquiry, form].forEach((el) => styled.add(el));
      const foot = document.querySelector("footer")!;
      for (const [index, item] of all(
        "footer > a, footer > nav, footer .footer-base",
      ).entries()) {
        fromTo(
          item,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.12,
            ease: "power3.out",
            scrollTrigger: enter(foot, "top bottom"),
          },
        );
      }
      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // Enhancing the pinned scenes changes the document height after native hash navigation.
        if (initialAnchor && location.hash.slice(1) === initialAnchor.id) {
          initialAnchor.scrollIntoView({ block: "start", behavior: "instant" });
          ScrollTrigger.update();
          initialAnchor = null;
        }
      });
      cleanup = () => {
        enquiry.removeEventListener("focusin", revealForm);
        cancelAnimationFrame(refreshFrame);
        stopWheel();
        for (const animation of animations) {
          animation.scrollTrigger?.kill();
          animation.kill();
        }
        gsap.set(Array.from(styled), {
          clearProps: "transform,opacity,--ink,--vertical-rule,--rule-progress",
        });
        delete document.body.dataset.scenes;
      };
    }
    configure();
    reduced.addEventListener("change", configure);
    desktop.addEventListener("change", configure);
    return () => {
      cleanup();
      inputEvents.forEach((event) =>
        window.removeEventListener(event, cancelAnchor),
      );
      pastHero.disconnect();
      delete document.body.dataset.pastHero;
      reduced.removeEventListener("change", configure);
      desktop.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
