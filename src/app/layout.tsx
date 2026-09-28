import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { JetBrains_Mono, Open_Sans, VT323 } from "next/font/google";
import "./globals.css";
import "./aero.css";
import "./backrooms.css";
import Footer from "@/components/footer";
import KofiToast from "@/components/kofi-toast";
import SmokeBg from "@/components/smoke-bg";
import AeroMode from "@/components/aero-mode";
import AeroSoundToggle from "@/components/aero-sound-toggle";
import Backrooms from "@/components/backrooms";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  preload: false,
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const BUBBLES = [
  { size: 150, top: "10%", left: "3%", duration: 18, delay: 0 },
  { size: 70, top: "34%", left: "12%", duration: 13, delay: -4 },
  { size: 230, top: "46%", left: "84%", duration: 24, delay: -8 },
  { size: 54, top: "20%", left: "70%", duration: 12, delay: -6 },
  { size: 110, top: "70%", left: "6%", duration: 20, delay: -10 },
  { size: 40, top: "62%", left: "93%", duration: 11, delay: -3 },
  { size: 88, top: "8%", left: "90%", duration: 16, delay: -7 },
];

const RESTORE_THEME = `try{if(sessionStorage.getItem("s42-theme")==="aero")document.documentElement.classList.add("aero")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://s42.site"),
  title: "S42 and Friends",
  description: "Personal Dev Portfolio of S42",
  icons: {
    icon: "/emojis/kuromi_love.gif",
    shortcut: "/emojis/kuromi_love.gif",
    apple: "/emojis/kuromi_love.gif",
  },
  openGraph: {
    images: ["/thumbnail/page.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/thumbnail/page.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#7348e2",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${openSans.variable} ${vt323.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: RESTORE_THEME }} />
      </head>
      <body className="antialiased relative overflow-x-hidden">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 110% 55% at 50% -8%, oklch(28% 0.1 288 / 0.55) 0%, transparent 62%)",
            }}
          />
          <div
            className="absolute bg-blob"
            style={{
              width: "min(60vw, 640px)",
              aspectRatio: "1",
              top: "8%",
              left: "58%",
              background:
                "radial-gradient(circle, oklch(24% 0.09 300 / 0.6) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            className="absolute bg-blob"
            style={{
              width: "min(52vw, 540px)",
              aspectRatio: "1",
              top: "34%",
              left: "-12%",
              background:
                "radial-gradient(circle, oklch(21% 0.07 275 / 0.55) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <SmokeBg />
          <div className="aero-wallpaper absolute inset-0 overflow-hidden">
            {BUBBLES.map((bubble, index) => (
              <span
                key={index}
                className="absolute"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  top: bubble.top,
                  left: bubble.left,
                }}
              >
                <span
                  className="aero-bubble"
                  style={
                    {
                      "--bubble-duration": `${bubble.duration}s`,
                      "--bubble-delay": `${bubble.delay}s`,
                    } as CSSProperties
                  }
                />
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        <KofiToast />
        <AeroMode />
        <AeroSoundToggle />
        <Backrooms />
      </body>
    </html>
  );
}
