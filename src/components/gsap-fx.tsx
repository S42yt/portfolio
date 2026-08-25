"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GsapFx() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // hero headline: masked char rise
      gsap.from("[data-gsap='hero-char']", {
        yPercent: 110,
        stagger: 0.06,
        duration: 1.1,
        ease: "power4.out",
      });

      // hero support lines: soft fade-up
      gsap.from("[data-gsap='hero-item']", {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
      });

      // hero drifts up + fades slightly as you scroll past it
      const hero = document.querySelector("[data-gsap='hero']");
      if (hero) {
        gsap.to(hero, {
          yPercent: -12,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }

      // section titles: rise in
      gsap.utils
        .toArray<HTMLElement>("[data-gsap='section-title']")
        .forEach((el) => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          });
        });

      // section subtitles / blocks: gentle fade-up
      gsap.utils
        .toArray<HTMLElement>("[data-gsap='fade-up']")
        .forEach((el) => {
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

      // skill chips: springy pop
      gsap.from("[data-gsap='chips'] .chip", {
        y: 18,
        scale: 0.7,
        opacity: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: "[data-gsap='chips']", start: "top 88%" },
      });

      // project cards: staggered rise, each on its own trigger
      gsap.utils.toArray<HTMLElement>("[data-gsap='card']").forEach((el) => {
        gsap.from(el, {
          y: 64,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // giant ghost words: slow horizontal scrub for depth
      gsap.utils.toArray<HTMLElement>("[data-gsap='giant']").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 4 },
          {
            xPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });

      // background blobs: parallax scrub
      gsap.utils.toArray<HTMLElement>(".bg-blob").forEach((el, i) => {
        gsap.to(el, {
          yPercent: (i + 1) * 10,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });
      });

      // tickers: slight skew from scroll velocity
      const tickers = gsap.utils.toArray<HTMLElement>("[data-gsap='ticker']");
      if (tickers.length) {
        const proxy = { skew: 0 };
        const setters = tickers.map((el) =>
          gsap.quickSetter(el, "skewX", "deg"),
        );
        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = gsap.utils.clamp(-5, 5, self.getVelocity() / -400);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.7,
                ease: "power3",
                overwrite: true,
                onUpdate: () => setters.forEach((set) => set(proxy.skew)),
              });
            }
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return null;
}
