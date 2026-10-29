/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroPoster } from './components/HeroPoster';
import { StatsSection } from './components/StatsSection';
import { JourneySection } from './components/JourneySection';
import { ArgentinaSection } from './components/ArgentinaSection';
import { TrophiesSection } from './components/TrophiesSection';
import { AchievementCounter } from './components/AchievementCounter';
import { QuotesSection } from './components/QuotesSection';
import { FinalFooter } from './components/FinalFooter';
import { StatsModal } from './components/StatsModal';
import { LegacyModal } from './components/LegacyModal';
import { MessiMomentsToast } from './components/MessiMomentsToast';
import { FloatingNav } from './components/FloatingNav';
import { Language } from './utils/translations';

export default function App() {
  const [cameraFilter, setCameraFilter] = useState<'none' | 'vintage' | 'stadium' | 'bw'>('none');
  const [statsOpen, setStatsOpen] = useState(false);
  const [legacyOpen, setLegacyOpen] = useState(false);
  const [legacyTab, setLegacyTab] = useState<'journey' | 'trophies' | 'argentina' | 'legacy'>('journey');
  const [lightingMode, setLightingMode] = useState<'night' | 'glory' | 'classic'>('night');
  const [language, setLanguage] = useState<Language>('en');

  // Framer Motion Page Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Handle keys for interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStatsOpen(false);
        setLegacyOpen(false);
      }
      if (e.key.toLowerCase() === 's') {
        setStatsOpen(true);
      }
      if (e.key.toLowerCase() === 'l') {
        setLegacyOpen(true);
      }
      if (e.key.toLowerCase() === 'h') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle mouse movement for stadium light effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleOpenSection = (section: 'journey' | 'stats' | 'trophies' | 'argentina' | 'legacy') => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (section === 'stats') {
        setStatsOpen(true);
      } else {
        setLegacyTab(section);
        setLegacyOpen(true);
      }
    }
  };

  const handleDeepDive = (tab: 'journey' | 'trophies' | 'argentina' | 'legacy') => {
    setLegacyTab(tab);
    setLegacyOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#03060c] text-white selection:bg-[#75AADB]/30 selection:text-white font-editorial">
      {/* Stadium Cursor Light Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-30 mix-blend-screen transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at var(--cursor-x) var(--cursor-y), #75AADB40, transparent 80%)`,
        }}
      />
      
      {/* Top Scroll Indicator Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#75AADB] via-white to-[#E5C158] origin-left z-[60] pointer-events-none"
      />

      {/* Extremely minimal transparent-to-blurred navbar */}
      <Navbar
        onOpenSection={handleOpenSection}
        activeLighting={lightingMode}
        onChangeLighting={setLightingMode}
        language={language}
        onChangeLanguage={setLanguage}
      />

      {/* Cinematic Argentina x Lionel Messi Hero Poster */}
      <main id="main-content" className="w-full">
        <HeroPoster
          onExploreLegacy={() => {
            const journeyEl = document.getElementById('journey');
            if (journeyEl) {
              journeyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              handleDeepDive('journey');
            }
          }}
          onSelectLegacyTab={(tab) => {
            const targetEl = document.getElementById(tab);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              handleDeepDive(tab);
            }
          }}
          onOpenStats={() => {
            const statsEl = document.getElementById('stats');
            if (statsEl) {
              statsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              setStatsOpen(true);
            }
          }}
          lightingMode={lightingMode}
          cameraFilter={cameraFilter}
          onChangeFilter={setCameraFilter}
        />

        {/* Scroll-Triggered Reveal Component Sections */}
        <StatsSection onOpenDeepStats={() => setStatsOpen(true)} />

        <JourneySection onOpenJourneyModal={() => handleDeepDive('journey')} />

        <ArgentinaSection onOpenArgentinaDetails={() => handleDeepDive('argentina')} />

        <TrophiesSection onOpenTrophiesModal={() => handleDeepDive('trophies')} />

        <AchievementCounter />

        <QuotesSection />

        <FinalFooter
          onNavigateSection={(sec) => {
            if (sec === 'home') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (sec === 'barcelona' || sec === 'journey') {
              handleDeepDive('journey');
            } else if (sec === 'argentina' || sec === 'worldcup') {
              handleDeepDive('argentina');
            } else if (sec === 'trophies') {
              handleDeepDive('trophies');
            } else if (sec === 'legacy') {
              handleDeepDive('legacy');
            }
          }}
        />
      </main>

      {/* Interactive Career Stats Modal */}
      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
      />

      {/* Interactive Legacy & Argentina Journey Modal */}
      <LegacyModal
        isOpen={legacyOpen}
        initialTab={legacyTab}
        onClose={() => setLegacyOpen(false)}
      />
      <MessiMomentsToast />
      <FloatingNav />
    </div>
  );
}

