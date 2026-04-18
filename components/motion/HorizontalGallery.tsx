'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { registerGsap } from '@/lib/gsap';

type HorizontalGalleryProps = {
  children: ReactNode;
  className?: string;
  /** Extra scroll headroom after the track finishes translating. */
  tail?: number;
};

/**
 * Pins a section vertically while translating an inner track horizontally
 * across its full width. The track is expected to be a flex row — this
 * component wraps children in one automatically.
 */
export function HorizontalGallery({
  children,
  className,
  tail = 0,
}: HorizontalGalleryProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    const track = trackRef.current;
    if (!node || !track) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      const compute = () => {
        const distance = track.scrollWidth - node.clientWidth;
        return distance > 0 ? distance : 0;
      };

      const tween = gsap.to(track, {
        x: () => `-${compute()}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          end: () => `+=${compute() + tail}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, node);

    return () => ctx.revert();
  }, [tail]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden', width: '100%' }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
