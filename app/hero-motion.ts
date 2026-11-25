import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prepareEntrance } from "./entry-loader";

export const heroLayers = [
  {
    image: "slat",
    desktop: [-250, 220, 2.604, 26.042],
    mobile: [-250, 220, 0, 200],
  },
  {
    image: "office",
    desktop: [-180, -250, 5.208, 20.833],
    mobile: [-180, -250, 25, 400],
  },
  {
    image: "roof",
    desktop: [-220, -280, 20.833, 44.271],
    mobile: [-120, -180, 100, 700],
  },
  {
    image: "ahu",
    desktop: [250, 320, 15.625, 31.25],
    mobile: [50, 270, 50, 650],
  },
  { image: "elbow", desktop: [165, -150, 7.813, 41.667], mobile: null },
  { image: "fan", desktop: [195, 255, 0, 26.042], mobile: [195, 235, 50, 250] },
  {
    image: "factory",
    desktop: [235, -360, 18.229, 33.854],
    mobile: [135, -260, 75, 450],
  },
] as const;

export function animateHero(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const mobileQuery = matchMedia("(max-width: 760px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const plates = Array.from(root.querySelectorAll<HTMLElement>(".plate"));
  const masks = plates.map(
    (plate) => plate.querySelector<HTMLElement>(".mask")!,
  );
  const title = root.querySelector<HTMLElement>("h1 span")!;
  const header = root.querySelector<HTMLElement>("header")!;
  const copy = root.querySelector<HTMLElement>(".hero-base")!;
  let cleanup = () => {};
  let hasStarted = false;

  function configure() {
    cleanup();
    const mobile = mobileQuery.matches;
    if (reduced.matches) {
      root.dataset.ready = "true";
      hasStarted = true;
      return;
    }
    const scrollTweens: gsap.core.Tween[] = [];
    const order = mobile ? [6, 1, 3, 2, 0, 5] : [6, 1, 4, 3, 2, 0, 5];
    const intro = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" },
    });
    order.forEach((layer, index) => {
      intro.fromTo(
        masks[layer],
        { scale: 1.8, clipPath: "inset(100% 100% 100% 100%)" },
        { scale: 1, clipPath: "inset(0%)", duration: 1.8 },
        index * 0.27,
      );
    });
    const titleOffset = mobile
      ? "85px"
      : innerWidth <= 1024
        ? "17.5vw"
        : "21vw";
    intro.fromTo(
      title,
      { y: titleOffset },
      { y: 0, duration: 1.8 },
      mobile ? 1.25 : 1.52,
    );
    const chromeStart = mobile ? 2.8 : 2.5;
    intro.fromTo(
      copy.children,
      { opacity: 0, y: mobile ? "25px" : "1.302vw" },
      { opacity: 1, y: 0, duration: mobile ? 1.5 : 1.8 },
      chromeStart,
    );
    intro.fromTo(
      header,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1 },
      chromeStart,
    );

    // Travel starts are viewport widths on desktop and fixed pixels on mobile.
    function trigger(offset: number, length: () => number) {
      const start = () =>
        Math.round(
          root.getBoundingClientRect().top +
            scrollY +
            (mobile ? offset : (innerWidth * offset) / 100),
        );
      return { start, end: () => start() + length(), scrub: 1 };
    }
    function connectScroll() {
      if (scrollTweens.length) return;
      heroLayers.forEach((layer, index) => {
        const path = mobile ? layer.mobile : layer.desktop;
        if (!path) return;
        const [xPercent, yPercent, start, fade] = path;
        scrollTweens.push(
          gsap.fromTo(
            plates[index],
            { xPercent: 0, yPercent: 0 },
            {
              xPercent,
              yPercent,
              ease: "none",
              scrollTrigger: trigger(start, () => innerHeight),
            },
          ),
          gsap.fromTo(
            plates[index],
            { opacity: 1 },
            {
              opacity: mobile ? 0 : 0.3,
              ease: "none",
              scrollTrigger: trigger(fade, () => 50),
            },
          ),
        );
      });
      scrollTweens.push(
        gsap.fromTo(
          copy,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: trigger(
              mobile ? 0 : 2.604,
              () => innerHeight * (mobile ? 0.5 : 1),
            ),
          },
        ),
      );
    }
    connectScroll();
    root.dataset.ready = "true";
    if (hasStarted || scrollY > 0) intro.progress(1);
    else intro.play();
    hasStarted = true;

    function revealFocusedNavigation() {
      if (header.contains(document.activeElement)) intro.progress(1);
    }
    root.addEventListener("focusin", revealFocusedNavigation);
    cleanup = () => {
      root.removeEventListener("focusin", revealFocusedNavigation);
      intro.kill();
      for (const tween of scrollTweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
      gsap.set([...plates, ...masks, title, header, copy, ...copy.children], {
        clearProps: "transform,opacity,clipPath",
      });
    };
  }
  function start() {
    configure();
    mobileQuery.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
  }
  const cancelEntrance = prepareEntrance(root, start);
  return () => {
    cancelEntrance();
    mobileQuery.removeEventListener("change", configure);
    reduced.removeEventListener("change", configure);
    cleanup();
  };
}
