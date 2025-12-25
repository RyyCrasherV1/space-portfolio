"use client";

import { useEffect, useRef, useState } from "react";

const playlist = [
  "https://files.catbox.moe/dyyhrw.mp3",
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

  useEffect(() => {
    const playAudio = () => {
      audioRef.current?.play().catch(() => {});
      document.removeEventListener("click", playAudio);
    };

    document.addEventListener("click", playAudio);

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  const nextSong = () => {
    setIndex((prev) => (prev + 1) % playlist.length);
  };

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
  }, [index]);

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
