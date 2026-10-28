import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useSpring, useTransform } from 'motion/react';

function Counter({ value, label }: { value: number; label: string }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const count = useSpring(0, {
    stiffness: 60,
    damping: 20
  });

  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      count.set(value);
    }
  }, [isInView, value, count]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.div className="font-bebas text-5xl sm:text-6xl text-white tracking-widest mb-2">
        <motion.span>{rounded}</motion.span>
        {label.toLowerCase().includes('goals') && '+'}
      </motion.div>
      <div className="font-editorial text-xs sm:text-sm text-[#75AADB] uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}

export function AchievementCounter() {
  const stats = [
    { value: 850, label: 'Career Goals' },
    { value: 380, label: 'Career Assists' },
    { value: 8, label: 'Ballon d\'Or' },
    { value: 6, label: 'Golden Boots' },
  ];

  return (
    <section className="py-24 sm:py-32 px-6 bg-[#02050b] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16">
          {stats.map((stat, i) => (
            <Counter key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
