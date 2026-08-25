"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GsapFx() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    addEventListener("load", refresh);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-gsap='hero-char']", {
        yPercent: 110,
        stagger: 0.06,
        duration: 1.1,
        ease: "power4.out",
      });

      gsap.from("[data-gsap='hero-item']", {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
      });

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

      gsap.utils
        .toArray<HTMLElement>("[data-gsap='section-title']")
        .forEach((el) => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

      gsap.utils.toArray<HTMLElement>("[data-gsap='fade-up']").forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });

      gsap.from("[data-gsap='chips'] .chip", {
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-gsap='chips']",
          start: "top 95%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap='card']").forEach((el) => {
        gsap.from(el, {
          y: 64,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });

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

    return () => {
      removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
