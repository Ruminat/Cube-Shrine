import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@radix-ui/themes/styles.css";
import { RadixCubeProviders } from "@/components/radix-cube-providers";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cube Shrine — CFOP algorithm gallery",
  description:
    "Interactive Rubik's Cube algorithm gallery for the CFOP method. Explore OLL and PLL with accurate visualizations.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: "/apple-icon.png",
  },
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RadixCubeProviders>{children}</RadixCubeProviders>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;
