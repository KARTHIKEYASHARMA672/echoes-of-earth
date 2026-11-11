"use client";

import { motion } from "framer-motion";
import { Radio, Volume2 } from "lucide-react";

type SignalCTAProps = {
  soundEnabled: boolean;
  onToggleSound: () => void;
};

export function SignalCTA({ soundEnabled, onToggleSound }: SignalCTAProps) {
  return (
    <section className="relative z-20 flex min-h-screen items-center px-5 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-signal-cyan/40 bg-signal-cyan/10 shadow-signal"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Radio className="h-7 w-7 text-signal-cyan" aria-hidden="true" />
        </motion.div>
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.42em] text-white/45"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          final transmission
        </motion.p>
        <motion.h2
          className="mt-6 font-display text-5xl leading-[0.95] text-white sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Listen closer.
          <br />
          The planet is speaking.
        </motion.h2>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          <button
            type="button"
            onClick={onToggleSound}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-space-void shadow-[0_0_42px_rgba(255,255,255,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_56px_rgba(0,229,255,0.35)] focus:outline-none focus:ring-2 focus:ring-signal-cyan focus:ring-offset-2 focus:ring-offset-space-void"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            {soundEnabled ? "Mute soundscape" : "Activate soundscape"}
          </button>
          <a
            href="#hero"
            className="inline-flex min-h-12 items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-space-void"
          >
            Return to orbit
          </a>
        </motion.div>
      </div>
    </section>
  );
}
