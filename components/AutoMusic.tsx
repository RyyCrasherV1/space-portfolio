"use client";

import { useEffect, useRef, useState } from "react";

const playlist = [
  "https://files.catbox.moe/dyyhrw.mp3",
  "https://files.catbox.moe/9j3h6k.m4a",
  "https://files.catbox.moe/lvu2v7.m4a",
  "https://files.catbox.moe/8sn3pp.mp3",
  "https://files.catbox.moe/1fq3d2.mp3",
  "https://files.catbox.moe/tvbpbj.mp3",
];

export default function AutoMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);

  // Fade in volume
  const fadeIn = () => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0; // mulai dari pelan
    let volume = 0;

    const interval = setInterval(() => {
      if (!audioRef.current) return clearInterval(interval);

      volume += 0.02; // kecepatan naik (ubah kalau mau)
      if (volume >= 0.6) {
        volume = 0.6; // volume maksimal (0.0 - 1.0)
        clearInterval(interval);
      }

      audioRef.current.volume = volume;
    }, 150); // delay per step (ms)
  };

  // Autoplay setelah 1 klik user
  useEffect(() => {
    const startMusic = () => {
      if (!audioRef.current) return;

      audioRef.current.play().then(fadeIn).catch(() => {});
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);

    return () => {
      document.removeEventListener("click", startMusic);
    };
  }, []);

  // Ganti lagu → fade in lagi
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.play().then(fadeIn).catch(() => {});
  }, [index]);

  const nextSong = () => {
    setIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <audio
      ref={audioRef}
      src={playlist[index]}
      onEnded={nextSong}
      loop={false}
      style={{ display: "none" }}
    />
  );
}
