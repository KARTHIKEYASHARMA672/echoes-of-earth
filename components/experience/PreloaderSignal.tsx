"use client";

import { motion } from "framer-motion";

export function PreloaderSignal() {
  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-space-void"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ delay: 1.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <div className="relative grid h-64 w-64 place-items-center">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <motion.div
          className="absolute inset-6 rounded-full border border-signal-cyan/40 shadow-signal"
          animate={{ rotate: 360, scale: [1, 1.04, 1] }}
          transition={{ rotate: { duration: 5, repeat: Infinity, ease: "linear" }, scale: { duration: 1.6, repeat: Infinity } }}
        />
        <motion.div
          className="absolute h-px w-56 bg-gradient-to-r from-transparent via-signal-cyan to-transparent"
          animate={{ rotate: [0, 180, 360], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/50">signal lock</div>
          <div className="mt-3 font-display text-4xl leading-none text-white">Earth</div>
        </div>
      </div>
    </motion.div>
  );
}
