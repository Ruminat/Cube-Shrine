import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Timer — Cube Shrine",
  description: "Speed-solving practice timer with random scrambles and a 3D cube preview.",
};

export default function TimerLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
