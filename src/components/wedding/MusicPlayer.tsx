import { useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";

interface Props {
  enabled: boolean;
}

export function MusicPlayer({ enabled }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    if (enabled) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [enabled]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.3;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/wedding.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Išjungti muziką" : "Įjungti muziką"}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 text-primary shadow-soft backdrop-blur-md transition-all hover:scale-110 hover:bg-card"
      >
        {playing ? (
          <Music2 className="h-5 w-5 animate-shimmer" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
