"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { useTheme } from "@/components/theme-provider";
import { useDocumentAppearance } from "@/lib/document-appearance";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun } from "lucide-react";

const siteIconSrc = `${process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? ""}/icon.png`;

export function Header() {
  const appearance = useDocumentAppearance();
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const isTimerRoute = pathname.includes("/timer");
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMdUp = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setIsNavigating(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMdUp) setMobileMenuOpen(false);
  }, [isMdUp]);

  const handleNavClick = useCallback(
    (href: string, event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      if (pathname === href || pathname === `${href}/`) {
        return;
      }
      event.preventDefault();
      setIsNavigating(true);
      setMobileMenuOpen(false);
      router.push(href);
    },
    [pathname, router],
  );

  return (
    <>
      <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex min-w-0 flex-1 items-center gap-4 md:gap-6'>
            <Link
              href='/'
              onClick={(event) => handleNavClick("/", event)}
              className='flex min-w-0 shrink-0 items-center gap-3 rounded-md outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring'
            >
              <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/60'>
                <Image src={siteIconSrc} alt='Cube Shrine' width={36} height={36} className='object-cover' priority />
              </div>
              <div className='min-w-0 text-left'>
                <h1 className='truncate text-lg font-bold tracking-tight text-foreground'>Cube Shrine</h1>
                <p className='truncate text-xs text-muted-foreground'>One cube to rule them all</p>
              </div>
            </Link>

            <nav className='hidden flex-wrap items-center gap-1 md:flex' aria-label='Main'>
              <Link
                href='/'
                onClick={(event) => handleNavClick("/", event)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  !isTimerRoute
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                Algorithms
              </Link>
              <Link
                href='/timer'
                onClick={(event) => handleNavClick("/timer", event)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isTimerRoute
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                Timer
              </Link>
            </nav>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <div className='flex md:hidden'>
                <IconButton
                  type='button'
                  variant='ghost'
                  size='2'
                  aria-label='Open menu'
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className='h-4 w-4' />
                </IconButton>
              </div>
              <Dialog.Content className='md:!hidden !fixed !left-auto !right-0 !top-0 !bottom-0 !m-0 !max-h-none h-full !max-w-none w-[min(20rem,calc(100vw-1rem))] !translate-x-0 !translate-y-0 rounded-none border-l border-border p-4 shadow-xl'>
                <Dialog.Title className='text-lg font-semibold text-foreground'>Menu</Dialog.Title>
                <Dialog.Description className='sr-only'>Navigation links and appearance settings.</Dialog.Description>
                <Flex direction='column' gap='3' mt='4'>
                  <Link
                    href='/'
                    onClick={(event) => {
                      setMobileMenuOpen(false);
                      handleNavClick("/", event);
                    }}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      !isTimerRoute
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    Algorithms
                  </Link>
                  <Link
                    href='/timer'
                    onClick={(event) => {
                      setMobileMenuOpen(false);
                      handleNavClick("/timer", event);
                    }}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isTimerRoute
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    Timer
                  </Link>
                  <Flex direction='column' align='stretch' gap='2' className='border-t border-border pt-3'>
                    <Text as='div' size='2' color='gray'>
                      Appearance
                    </Text>
                    <Button
                      type='button'
                      variant='soft'
                      className='w-full'
                      onClick={() => setTheme(appearance === "dark" ? "light" : "dark")}
                    >
                      {appearance === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    </Button>
                  </Flex>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>

            <IconButton
              variant='ghost'
              size='2'
              onClick={() => setTheme(appearance === "dark" ? "light" : "dark")}
              className='relative hidden md:inline-flex'
              aria-label='Toggle theme'
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </IconButton>
          </div>
        </div>
      </header>
      {isNavigating ? (
        <div
          className='fixed inset-0 z-[250] bg-background/50 backdrop-blur-sm'
          role='status'
          aria-live='polite'
          aria-label='Navigating'
        />
      ) : null}
    </>
  );
}
