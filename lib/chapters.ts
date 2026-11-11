import type { LucideIcon } from "lucide-react";
import { AudioWaveform, Binoculars, Building2, Cloud, Fish, Mountain, Orbit, Trees, Waves } from "lucide-react";

export type ChapterKey = "orbit" | "ocean" | "rainforest" | "desert" | "mountain" | "city";

export type Chapter = {
  key: ChapterKey;
  index: string;
  kicker: string;
  title: string;
  subtitle: string;
  body: string;
  stat: string;
  tone: string;
  color: string;
  Icon: LucideIcon;
};

export const chapters: Chapter[] = [
  {
    key: "orbit",
    index: "01",
    kicker: "Low Orbit",
    title: "Earth from silence.",
    subtitle: "A blue signal suspended in dark.",
    body: "The journey opens above the atmosphere, where weather systems move like breath and coastlines glow beneath a thin veil of light.",
    stat: "408 km",
    tone: "orbital drift",
    color: "#00E5FF",
    Icon: Orbit
  },
  {
    key: "ocean",
    index: "02",
    kicker: "Pelagic Layer",
    title: "The ocean remembers first.",
    subtitle: "Currents carry songs older than language.",
    body: "Waves fold into bioluminescent particles while silhouettes pass through the deep, turning the scroll into a slow descent.",
    stat: "71%",
    tone: "submerged pulse",
    color: "#2F80ED",
    Icon: Waves
  },
  {
    key: "rainforest",
    index: "03",
    kicker: "Canopy",
    title: "Green light, hidden lives.",
    subtitle: "Fog turns every branch into a threshold.",
    body: "Layered leaves, distant birds, and suspended mist build a living corridor where depth is felt before it is understood.",
    stat: "50M+",
    tone: "humid chorus",
    color: "#16A34A",
    Icon: Trees
  },
  {
    key: "desert",
    index: "04",
    kicker: "Dune Field",
    title: "Heat writes in waves.",
    subtitle: "The horizon bends but never breaks.",
    body: "Sand moves like a slow machine. The interface thins out here, leaving only gold light, long shadows, and distortion.",
    stat: "58 C",
    tone: "thermal shimmer",
    color: "#D6A84F",
    Icon: Binoculars
  },
  {
    key: "mountain",
    index: "05",
    kicker: "High Air",
    title: "Clouds pass below your feet.",
    subtitle: "Altitude makes the world feel newly made.",
    body: "Birds cross through cold blue air while ridgelines reveal themselves in layers, each scroll step lifting the camera higher.",
    stat: "8.8K m",
    tone: "thin-air bloom",
    color: "#BFD7FF",
    Icon: Mountain
  },
  {
    key: "city",
    index: "06",
    kicker: "Night Grid",
    title: "Humanity becomes constellation.",
    subtitle: "Traffic, windows, towers, signals.",
    body: "The planet returns as a network of luminous streets and moving traces, not separate from nature but another layer of its signal.",
    stat: "4.4B",
    tone: "neon transmission",
    color: "#FF4FD8",
    Icon: Building2
  }
];

export const telemetryItems = [
  { label: "signal", value: "ACTIVE", Icon: AudioWaveform },
  { label: "depth", value: "6 BIOMES", Icon: Fish },
  { label: "weather", value: "LIVE DRIFT", Icon: Cloud }
];
