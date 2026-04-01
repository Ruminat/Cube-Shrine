import type { Metadata } from "next";
import { AppThemeProvider } from "@/components/AppTheme/AppThemeProvider";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import "@radix-ui/themes/styles.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Cube Shrine",
  description: "Rubik's cube algorithm visualizer"
};

export function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          {children}
          <SiteFooter />
        </AppThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
