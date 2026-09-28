"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/icon";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { onMusicChange, toggleSound } from "@/lib/aero-audio";

export default function AeroSoundToggle() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => onMusicChange(setPlaying), []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={playing}
      aria-label={playing ? "Mute Aero music" : "Play Aero music"}
      className="aero-sound aero-only"
      data-playing={playing}
    >
      <Icon icon={playing ? faVolumeHigh : faVolumeXmark} className="h-4 w-4" />
      <span className="aero-sound-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
