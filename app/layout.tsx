import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
