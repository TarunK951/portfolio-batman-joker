'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { registerGsap } from '@/lib/gsap';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
});

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = headlineRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from(node, {
        yPercent: 15,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      });
    }, node);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <ThemeToggle />
      <div className="absolute inset-0 -z-10">
        <Scene />
      </div>
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 font-display text-sm uppercase tracking-[0.4em] text-theme-accent"
        >
          Satya Tarun K
        </motion.p>
        <h1
          ref={headlineRef}
          className="font-display text-5xl leading-[0.95] text-theme-ink sm:text-7xl md:text-8xl"
        >
          Order meets chaos.
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-base text-theme-ink/70"
        >
          A portfolio told twice — Batman&rsquo;s discipline, the Joker&rsquo;s wildfire.
          Toggle the mask.
        </motion.p>
      </div>
    </section>
  );
}
