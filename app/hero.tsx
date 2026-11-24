"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animateHero, heroLayers } from "./hero-motion";

export function Hero() {
  const track = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => animateHero(track.current!), []);

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
          {heroLayers.map(({ image }, i) => (
            <div
              aria-hidden="true"
              className={`plate plate-${i + 1}`}
              key={image}
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
