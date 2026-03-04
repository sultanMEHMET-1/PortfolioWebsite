import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageTransitionProvider } from "@/components/layout/PageTransitionProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { TerminalBoot } from "@/components/ui/TerminalBoot";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent/20 selection:text-accent-light">
        <SmoothScroll>
          <MotionProvider>
            <TerminalBoot />
            <CustomCursor />
            <NoiseOverlay />
            <Header />
            <PageTransitionProvider>
                <main className="pt-16">{children}</main>
            </PageTransitionProvider>
            <Footer />
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
