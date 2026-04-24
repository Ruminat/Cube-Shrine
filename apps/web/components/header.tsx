"use client";

import { useTheme } from "@/components/theme-provider";
import { useDocumentAppearance } from "@/lib/document-appearance";
import { Moon, Sun, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const appearance = useDocumentAppearance();
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Cube Shrine</h1>
            <p className="text-xs text-muted-foreground">CFOP algorithm gallery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(appearance === "dark" ? "light" : "dark")}
            className="relative h-9 w-9 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
