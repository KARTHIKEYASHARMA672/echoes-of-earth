"use client";

import type { Chapter } from "@/lib/chapters";
import { motion } from "framer-motion";

type GlassStoryPanelProps = {
  chapter: Chapter;
};

export function GlassStoryPanel({ chapter }: GlassStoryPanelProps) {
  const Icon = chapter.Icon;

  return (
    <motion.aside
      className="glass-panel max-w-md rounded-2xl p-5 sm:p-6"
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.45 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">{chapter.tone}</div>
        <Icon className="h-4 w-4" style={{ color: chapter.color }} aria-hidden="true" />
      </div>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">reading</div>
          <div className="mt-2 font-display text-5xl leading-none text-white">{chapter.stat}</div>
        </div>
        <div className="h-20 w-px origin-bottom bg-gradient-to-t from-white/70 to-transparent" style={{ animation: "pulse-line 2.8s ease-in-out infinite" }} />
      </div>
    </motion.aside>
  );
}
