'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { registerGsap } from '@/lib/gsap';

type PinnedHeroProps = {
  children: ReactNode;
  className?: string;
  /** CSS length for the scroll distance the pin occupies. */
  scrub?: boolean;
  endOffset?: string;
};

/**
 * Pins its root while scrubbing an internal timeline:
 *   [data-pin-headline] : scales 1 -> 0.82 and fades to 0.3 opacity
 *   [data-pin-sub]      : translates up 40px and fades in
 *   [data-pin-meta]     : fades out to 0 toward the end
 *
 * Authors the timeline by scanning for these data attrs in the subtree, so
 * composition stays pure JSX at the call site.
 */
export function PinnedHero({
  children,
  className,
  scrub = true,
  endOffset = '+=120%',
}: PinnedHeroProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const headline = node.querySelector('[data-pin-headline]');
      const sub = node.querySelector('[data-pin-sub]');
      const meta = node.querySelector('[data-pin-meta]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          end: endOffset,
          pin: true,
          scrub: scrub ? 1 : false,
          anticipatePin: 1,
        },
      });

      if (sub) {
        gsap.set(sub, { y: 40, opacity: 0 });
        tl.to(sub, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.5 }, 0);
      }
      if (headline) {
        tl.to(
          headline,
          { scale: 0.82, opacity: 0.3, ease: 'power2.inOut', duration: 1 },
          0.35,
        );
      }
      if (meta) {
        tl.to(meta, { opacity: 0, ease: 'power1.in', duration: 0.35 }, 0.75);
      }
    }, node);

    return () => ctx.revert();
  }, [scrub, endOffset]);

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </section>
  );
}
