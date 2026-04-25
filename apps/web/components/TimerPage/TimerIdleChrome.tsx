"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";

export type TimerIdleChromeProps = {
  children: ReactNode;
};

export function TimerIdleChrome({ children }: TimerIdleChromeProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <SiteFooter />
    </>
  );
}
