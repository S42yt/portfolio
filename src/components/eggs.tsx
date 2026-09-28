"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AeroSoundToggle = dynamic(() => import("./aero-sound-toggle"), {
  ssr: false,
});
const Backrooms = dynamic(() => import("./backrooms"), { ssr: false });

export default function Eggs() {
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const check = () => {
      if (
        root.classList.contains("aero") ||
        root.classList.contains("backrooms")
      ) {
        setAwake(true);
        watch.disconnect();
      }
    };
    const watch = new MutationObserver(check);
    watch.observe(root, { attributes: true, attributeFilter: ["class"] });
    check();
    return () => watch.disconnect();
  }, []);

  if (!awake) return null;
  return (
    <>
      <AeroSoundToggle />
      <Backrooms />
    </>
  );
}
