'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Ambient cave/bat audio loop.
 *
 * Browsers block autoplay without a user gesture — we listen for the first
 * pointerdown/keydown and call play(). A floating mute toggle sits bottom-right.
 *
 * TODO (asset): drop a CC0 cave/bat ambient loop into /public/audio/bat-cave-loop.mp3.
 * Recommended sources:
 *  - https://pixabay.com/sound-effects/search/cave/  (CC0-equivalent content license)
 *  - https://freesound.org/  (filter by "Creative Commons 0")
 * A 30–90s seamless loop at -18 LUFS works well.
 */
const AUDIO_SRC = '/audio/bat-cave-loop.mp3';

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.35;

    const tryStart = () => {
      if (!ready) {
        el.play()
          .then(() => {
            setReady(true);
            setMuted(false);
          })
          .catch(() => {
            /* Will retry on next interaction */
          });
      }
    };

    const onFirst = () => {
      tryStart();
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
    };

    window.addEventListener('pointerdown', onFirst, { once: true });
    window.addEventListener('keydown', onFirst, { once: true });

    return () => {
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
    };
  }, [ready]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (muted) {
      el.play().catch(() => {
        /* ignored */
      });
      setMuted(false);
    } else {
      el.pause();
      setMuted(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
        data-cursor-hover
        className="fixed bottom-5 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-theme-line bg-theme-bg/70 backdrop-blur transition-colors hover:border-theme-accent"
      >
        <span className="u-mono text-[10px] uppercase tracking-[0.2em] text-theme-ink/80">
          {muted ? 'SND' : 'ON'}
        </span>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-full ${
            muted ? '' : 'animate-ping'
          } border border-theme-accent/40`}
        />
      </button>
    </>
  );
}
