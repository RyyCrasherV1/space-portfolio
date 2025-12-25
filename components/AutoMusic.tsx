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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  const [index, setIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Fade-in volume (AMAN, tidak dobel)
  const fadeIn = () => {
    if (!audioRef.current) return;

    if (fadeInterval.current) {
      clearInterval(fadeInterval.current);
    }

    audioRef.current.volume = 0;
    let volume = 0;

    fadeInterval.current = setInterval(() => {
      if (!audioRef.current) return;

      volume += 0.02;
      if (volume >= 0.6) {
        audioRef.current.volume = 0.6;
        clearInterval(fadeInterval.current!);
        fadeInterval.current = null;
        return;
      }

      audioRef.current.volume = volume;
    }, 150);
  };

  // Main play function (SATU pintu)
  const playCurrent = async () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    try {
      await audioRef.current.play();
      fadeIn();
    } catch {
      // autoplay blocked → akan jalan setelah klik
    }
  };

  // Start autoplay after first user interaction
  useEffect(() => {
    const start = () => {
      if (isStarted) return;

      setIsStarted(true);
      playCurrent();

      document.removeEventListener("click", start);
    };

    document.addEventListener("click", start);
    return () => document.removeEventListener("click", start);
  }, [isStarted]);

  // When song changes → play next (TIDAK MEMOTONG)
  useEffect(() => {
    if (!isStarted) return;
    playCurrent();
  }, [index]);

  // When song ends → next song (loop)
  const handleEnded = () => {
    setIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <audio
      ref={audioRef}
      src={playlist[index]}
      onEnded={handleEnded}
      preload="auto"
      style={{ display: "none" }}
    />
  );
      }
