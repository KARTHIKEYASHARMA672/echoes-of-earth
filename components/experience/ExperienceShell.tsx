"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown, Radio, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChapterProgressRail } from "@/components/experience/ChapterProgressRail";
import { GlassStoryPanel } from "@/components/experience/GlassStoryPanel";
import { PreloaderSignal } from "@/components/experience/PreloaderSignal";
import { SignalCTA } from "@/components/experience/SignalCTA";
import { fadeUp, stagger } from "@/lib/animation";
import { chapters, telemetryItems } from "@/lib/chapters";

gsap.registerPlugin(ScrollTrigger);

const SceneCanvas = dynamic(() => import("@/components/scenes/SceneCanvas").then((mod) => mod.SceneCanvas), {
  ssr: false
});

export function ExperienceShell() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const reducedMotion = useReducedMotion();
  const audioRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const triggers = chapters.map((chapter, index) =>
      ScrollTrigger.create({
        trigger: `[data-chapter="${chapter.key}"]`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index)
      })
    );

    const progressTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress)
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      progressTrigger.kill();
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  const jumpTo = useCallback((index: number) => {
    document.querySelector(`[data-chapter="${chapters[index].key}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      gainRef.current?.gain.exponentialRampToValueAtTime(0.001, audioRef.current!.currentTime + 0.35);
      setSoundEnabled(false);
      return;
    }

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    const context = audioRef.current ?? new AudioContextConstructor();
    audioRef.current = context;
    const gain = context.createGain();
    gain.gain.value = 0.001;
    gain.connect(context.destination);
    gainRef.current = gain;

    const tones = [55, 82.4, 123.5];
    tones.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const toneGain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      toneGain.gain.value = 0.05 / (index + 1);
      oscillator.connect(toneGain);
      toneGain.connect(gain);
      oscillator.start();
    });

    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.8);
    setSoundEnabled(true);
  }, [soundEnabled]);

  const activeKey = chapters[active]?.key ?? "orbit";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-space-void text-white">
      <PreloaderSignal />
      <SceneCanvas activeKey={activeKey} progress={progress} mouse={mouse} />
      <div className="aurora pointer-events-none fixed inset-0 z-[1] opacity-70" />
      <div className="noise pointer-events-none fixed inset-0 z-[2] opacity-40" />
      <div className="pointer-events-none fixed inset-0 z-[3] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,3,0.32)_58%,rgba(2,2,3,0.9)_100%)]" />

      <ChapterProgressRail active={active} progress={progress} onJump={jumpTo} />

      <Hero soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <div className="relative z-20">
        {chapters.map((chapter, index) => (
          <section
            key={chapter.key}
            data-chapter={chapter.key}
            className="chapter-mask relative flex min-h-screen items-center px-5 py-24 sm:px-10 lg:px-16"
          >
            <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.35 }}
                className={index % 2 === 0 ? "lg:pr-12" : "lg:order-2 lg:pl-12"}
              >
                <motion.div variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.42em] text-white/45">
                  {chapter.index} / {chapter.kicker}
                </motion.div>
                <motion.h2 variants={fadeUp} className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">
                  {chapter.title}
                </motion.h2>
                <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-xl leading-8 text-white/70 sm:text-2xl">
                  {chapter.subtitle}
                </motion.p>
                <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
                  {chapter.body}
                </motion.p>
              </motion.div>
              <div className={index % 2 === 0 ? "" : "lg:order-1"}>
                <GlassStoryPanel chapter={chapter} />
              </div>
            </div>
            <BiomeAtmosphere activeKey={chapter.key} color={chapter.color} />
          </section>
        ))}
      </div>

      <SignalCTA soundEnabled={soundEnabled} onToggleSound={toggleSound} />
    </main>
  );
}

function Hero({ soundEnabled, onToggleSound }: { soundEnabled: boolean; onToggleSound: () => void }) {
  return (
    <section id="hero" className="relative z-20 flex min-h-screen items-center px-5 pb-24 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-5xl">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-signal-cyan" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/55">planetary story engine</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="mt-8 max-w-5xl font-display text-6xl leading-[0.88] text-white sm:text-8xl lg:text-[8.4rem]">
            Every Place Has a Story.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-8 max-w-2xl text-xl leading-8 text-white/68 sm:text-2xl">
            Explore the sounds, cultures, wildlife, and hidden wonders of our living planet.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#orbit"
              onClick={(event) => {
                event.preventDefault();
                document.querySelector('[data-chapter="orbit"]')?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-sm font-semibold text-space-void transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:bg-gradient-to-r hover:from-white hover:to-white/90 hover:shadow-[0_0_60px_rgba(0,229,255,0.45)] focus:outline-none focus:ring-2 focus:ring-signal-cyan focus:ring-offset-2 focus:ring-offset-space-void"
            >
              Begin descent
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onToggleSound}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-space-void"
            >
              <Radio className="h-4 w-4 text-signal-cyan transition-transform duration-300 group-hover:scale-110 group-hover:text-[#00E5FF]" aria-hidden="true" />
              {soundEnabled ? "Soundscape on" : "Enable soundscape"}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="glass-panel self-end rounded-2xl p-5"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/45">mission telemetry</div>
          <div className="mt-5 grid gap-4">
            {telemetryItems.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 text-white/55">
                  <Icon className="h-4 w-4 text-signal-cyan" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em]">{label}</span>
                </div>
                <span className="font-mono text-xs text-white">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/40 sm:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em]">scroll</span>
        <span className="h-10 w-px origin-top bg-gradient-to-b from-white to-transparent" style={{ animation: "pulse-line 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

function BiomeAtmosphere({ activeKey, color }: { activeKey: string; color: string }) {
  const common = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

  if (activeKey === "ocean") {
    return (
      <div className={common}>
        <div className="absolute inset-x-[-10%] bottom-0 h-1/2 opacity-50" style={{ background: `repeating-radial-gradient(ellipse at bottom, ${color}33 0 2px, transparent 3px 28px)` }} />
      </div>
    );
  }

  if (activeKey === "rainforest") {
    return (
      <div className={common}>
        <div className="absolute left-0 top-1/4 h-80 w-full bg-gradient-to-r from-transparent via-signal-green/10 to-transparent blur-3xl" />
      </div>
    );
  }

  if (activeKey === "desert") {
    return (
      <div className={common}>
        <div className="absolute inset-x-0 bottom-[-12%] h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(214,168,79,0.24),transparent_62%)] blur-xl" />
      </div>
    );
  }

  return (
    <div className={common}>
      <div className="absolute right-[-15%] top-1/4 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: `${color}24` }} />
    </div>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
