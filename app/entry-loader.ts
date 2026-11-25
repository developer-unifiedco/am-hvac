import { gsap } from "gsap";

export function prepareEntrance(root: HTMLElement, enter: () => void) {
  const loader = root.querySelector<HTMLElement>(".entry-loader")!;
  const amount = loader.querySelector<HTMLOutputElement>("output")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const started = performance.now();
  let cancelled = false;
  let closing = false;
  let timer = 0;
  let exit: gsap.core.Tween | undefined;

  function complete() {
    if (cancelled) return;
    loader.hidden = true;
    enter();
  }
  function dismiss(immediate = false) {
    if (cancelled || closing) return;
    closing = true;
    clearTimeout(timer);
    loader.style.setProperty("--loaded", "1");
    amount.value = "100%";
    if (immediate || reduced.matches) complete();
    else
      exit = gsap.to(loader, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.56,
        ease: "power3.inOut",
        onComplete: complete,
      });
  }
  const skip = () => dismiss(true);
  const enterNow = () => {
    skip();
    root
      .querySelector<HTMLAnchorElement>(".brand")
      ?.focus({ preventScroll: true });
  };
  const button = loader.querySelector("button")!;
  button.addEventListener("click", enterNow);
  reduced.addEventListener("change", skip);
  if (location.hash || window.scrollY > 0 || reduced.matches) skip();
  else {
    const assets = [
      ...root.querySelectorAll<HTMLImageElement>(".plate img"),
    ].map((image) => image.decode());
    assets.push(document.fonts.ready.then(() => undefined));
    let loaded = 0;
    timer = window.setTimeout(() => dismiss(), 3500);
    for (const asset of assets) {
      void asset
        .catch(() => undefined)
        .then(() => {
          if (cancelled || closing) return;
          const progress = ++loaded / assets.length;
          amount.value = Math.round(progress * 100) + "%";
          loader.style.setProperty("--loaded", String(progress));
          if (loaded === assets.length) {
            clearTimeout(timer);
            timer = window.setTimeout(
              () => dismiss(),
              Math.max(0, 750 - (performance.now() - started)),
            );
          }
        });
    }
  }
  return () => {
    cancelled = true;
    clearTimeout(timer);
    exit?.kill();
    button.removeEventListener("click", enterNow);
    reduced.removeEventListener("change", skip);
  };
}
