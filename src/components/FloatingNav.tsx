import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, BarChart3, BookOpen, Trophy, Map, Crown } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

const sections = [
  { id: 'hero-poster-container', label: 'Home', icon: Home },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'journey', label: 'Journey', icon: BookOpen },
  { id: 'trophies', label: 'Trophies', icon: Trophy },
  { id: 'argentina', label: 'Argentina', icon: Map },
  { id: 'legacy', label: 'Legacy', icon: Crown },
];

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('hero-poster-container');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback for modals
      window.dispatchEvent(new CustomEvent('open-modal', { detail: id }));
    }
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      {sections.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            onMouseEnter={playHoverSound}
            className="group relative flex items-center justify-center"
            title={sec.label}
          >
            <motion.div
              animate={{
                scale: isActive ? 1.2 : 1,
                backgroundColor: isActive ? 'rgba(117,170,219,0.3)' : 'rgba(255,255,255,0.05)',
                borderColor: isActive ? 'rgba(117,170,219,0.6)' : 'rgba(255,255,255,0.1)',
              }}
              className="w-12 h-12 rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-300"
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#A3D2F7]' : 'text-white/60 group-hover:text-white'}`} />
            </motion.div>
            
            {/* Tooltip */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-16 px-3 py-1 rounded bg-[#03060c]/80 backdrop-blur border border-white/10 text-[10px] uppercase tracking-widest text-white whitespace-nowrap pointer-events-none opacity-0"
            >
              {sec.label}
            </motion.span>
          </button>
        );
      })}
    </nav>
  );
}
