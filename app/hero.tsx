"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const layers = [
  {
    image: "slat",
    order: 5,
    x: -250,
    y: 220,
    start: 2.604,
    fade: 26.042,
    mobileStart: 0,
    mobileFade: 200,
  },
  {
    image: "office",
    order: 1,
    x: -180,
    y: -250,
    start: 5.208,
    fade: 20.833,
    mobileStart: 25,
    mobileFade: 400,
  },
  {
    image: "roof",
    order: 4,
    x: -120,
    y: -180,
    start: 20.833,
    fade: 44.271,
    mobileStart: 100,
    mobileFade: 700,
  },
  {
    image: "ahu",
    order: 3,
    x: 50,
    y: 270,
    start: 15.625,
    fade: 31.25,
    mobileStart: 50,
    mobileFade: 650,
  },
  {
    image: "elbow",
    order: 2,
    x: 165,
    y: -150,
    start: 7.813,
    fade: 41.667,
    mobileStart: 0,
    mobileFade: 0,
  },
  {
    image: "fan",
    order: 6,
    x: 195,
    y: 235,
    start: 0,
    fade: 26.042,
    mobileStart: 50,
    mobileFade: 250,
  },
  {
    image: "factory",
    order: 0,
    x: 135,
    y: -260,
    start: 18.229,
    fade: 33.854,
    mobileStart: 75,
    mobileFade: 450,
  },
];

export function Hero() {
  const track = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = track.current!;
    const stage = el.querySelector<HTMLElement>(".hero-stage")!;
    const plates = Array.from(el.querySelectorAll<HTMLElement>(".plate"));
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const startIntro = () => {
      el.dataset.ready = "true";
    };
    if (document.readyState === "complete") startIntro();
    else window.addEventListener("load", startIntro, { once: true });
    let frame = 0;
    let distance = 0;
    let previousTime = 0;
    function paint(time: number) {
      frame = 0;
      const height = stage.offsetHeight;
      const width = el.clientWidth;
      const mobile = width <= 760;
      const limit = el.offsetHeight - height;
      const target = preference.matches
        ? 0
        : Math.max(0, Math.min(limit, -el.getBoundingClientRect().top));
      const delta = Math.max(1, Math.min(80, time - previousTime));
      previousTime = time;
      distance = preference.matches
        ? 0
        : distance + (target - distance) * (1 - Math.exp(-delta / 145));
      if (Math.abs(distance - target) < 0.1) distance = target;
      plates.forEach((plate, index) => {
        const { x, y, start, fade, mobileStart, mobileFade } = layers[index];
        const startAt = mobile ? mobileStart : (width * start) / 100;
        const fadeAt = mobile ? mobileFade : (width * fade) / 100;
        const p = Math.max(0, Math.min(1, (distance - startAt) / height));
        const fadeProgress = Math.max(0, Math.min(1, (distance - fadeAt) / 50));
        plate.style.transform = `translate3d(${x * p}%, ${y * p}%, 0)`;
        plate.style.opacity = String(1 - fadeProgress * (mobile ? 1 : 0.7));
      });
      stage.style.setProperty(
        "--exit",
        String(
          Math.min(
            1,
            Math.max(0, distance - (mobile ? 0 : width * 0.02604)) /
              (height * (mobile ? 0.5 : 1)),
          ),
        ),
      );
      if (distance !== target) frame = requestAnimationFrame(paint);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", startIntro);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section
      ref={track}
      aria-labelledby="hero-title"
      className="hero-track"
      id="top"
    >
      <div className="hero-stage">
        <header
          className="mast"
          onKeyDown={(e) => {
            if (e.key === "Escape" && open) {
              setOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          <a href="#top" aria-label="AM HVAC home" className="brand">
            <Image src="/media/am.png" width={76} height={34} alt="" /> HVAC
          </a>
          <button
            type="button"
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <nav
            id="primary-nav"
            aria-label="Main navigation"
            data-open={open}
            onClick={() => setOpen(false)}
          >
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#industries">Industries</a>
            <a href="#process">Process</a>
          </nav>
          <a className="quote-button" href="#contact">
            Get a free quote <span aria-hidden="true">↗</span>
          </a>
        </header>
        <div className="collage">
          {layers.map(({ image, order }, i) => (
            <div
              aria-hidden="true"
              className={`plate plate-${i + 1}`}
              key={image}
              style={{ "--delay": `${order * 0.27}s` } as CSSProperties}
            >
              <div className="mask">
                <Image
                  src={`/media/${image}.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 50vw, 32vw"
                  loading="eager"
                />
              </div>
            </div>
          ))}
          <h1 id="hero-title">
            <span>AM HVAC</span>
          </h1>
        </div>
        <div className="hero-base">
          <p>
            Complete HVAC solutions
            <br />
            for every space.
          </p>
          <p>
            Installation, maintenance and repair
            <br />
            for buildings across the UAE.
          </p>
          <a href="#about" className="down" aria-label="Explore AM HVAC">
            ↓
          </a>
        </div>
      </div>
    </section>
  );
}
