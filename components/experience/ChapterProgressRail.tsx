"use client";

import { chapters } from "@/lib/chapters";
import { clsx } from "clsx";

type ChapterProgressRailProps = {
  active: number;
  progress: number;
  onJump: (index: number) => void;
};

export function ChapterProgressRail({ active, progress, onJump }: ChapterProgressRailProps) {
  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-white/5">
        <div
          className="h-full origin-left bg-gradient-to-r from-signal-cyan via-signal-green to-signal-magenta shadow-signal"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <nav className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block" aria-label="Chapter navigation">
        <div className="relative flex flex-col items-end gap-5">
          <div className="absolute right-[5px] top-1 h-[calc(100%-0.5rem)] w-px bg-white/10" />
          {chapters.map((chapter, index) => (
            <button
              key={chapter.key}
              type="button"
              onClick={() => onJump(index)}
              className="group relative flex items-center gap-3 focus:outline-none"
              aria-label={`Jump to ${chapter.kicker}`}
            >
              <span
                className={clsx(
                  "glass-panel translate-x-2 rounded px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                  active === index && "translate-x-0 opacity-100"
                )}
              >
                {chapter.kicker}
              </span>
              <span
                className={clsx(
                  "relative z-10 h-3 w-3 rounded-full border transition duration-300",
                  active === index ? "border-white bg-white shadow-signal" : "border-white/35 bg-white/5 group-hover:border-white/80"
                )}
              />
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
