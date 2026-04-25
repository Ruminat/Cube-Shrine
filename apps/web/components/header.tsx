"use client";

import Image from "next/image";
import { IconButton } from "@radix-ui/themes";
import { useTheme } from "@/components/theme-provider";
import { useDocumentAppearance } from "@/lib/document-appearance";
import { Moon, Sun } from "lucide-react";

const siteIconSrc = `${process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? ""}/icon.png`;

export function Header() {
  const appearance = useDocumentAppearance();
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60">
            <Image
              src={siteIconSrc}
              alt="Cube Shrine"
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Cube Shrine</h1>
            <p className="text-xs text-muted-foreground">CFOP algorithm gallery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            variant="ghost"
            size="2"
            onClick={() => setTheme(appearance === "dark" ? "light" : "dark")}
            className="relative"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </IconButton>
        </div>
      </div>
    </header>
  )
}
