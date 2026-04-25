import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@radix-ui/themes/styles.css";
import { RadixCubeProviders } from "@/components/radix-cube-providers";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/variables.scss";
import "./globals.css";

const siteBase = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";
const themeInitSrc = `${siteBase}/theme-init.js`;

export const metadata: Metadata = {
  title: "Cube Shrine",
  description:
    "Interactive Rubik's Cube algorithm gallery for the CFOP method. Explore OLL and PLL with accurate visualizations.",
  icons: {
    icon: [{ url: `${siteBase}/icon.png`, type: "image/png" }],
  },
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- blocking theme init; see `public/theme-init.js` */}
        <script src={themeInitSrc} />
      </head>
      <body className='font-sans antialiased' suppressHydrationWarning>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <RadixCubeProviders>{children}</RadixCubeProviders>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;
