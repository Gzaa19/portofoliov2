import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { ChatBotWrapper } from "@/components/ChatBotWrapper";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ThemeProvider } from "@/components/theme-provider";

import grainImage from "@/assets/images/grain.jpg";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});
const calistoga = Calistoga({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: "Gaza Al Ghozali Chansa",
  description: "Personal Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          "bg-background text-foreground antialiased font-sans"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Grain Overlay - Dark Mode Only */}
          <div
            className="fixed inset-0 z-[9999] pointer-events-none opacity-4 hidden dark:block"
            style={{ backgroundImage: `url(${grainImage.src})` }}
          />
          <SmoothScrollProvider>
            <ConditionalHeader />
            {children}
            <ChatBotWrapper />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


