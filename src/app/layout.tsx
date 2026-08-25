import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Big_Shoulders } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import KofiToast from "@/components/kofi-toast";
import SmokeBg from "@/components/smoke-bg";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

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
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${bigShoulders.variable} antialiased relative overflow-x-hidden`}
      >
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
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        <KofiToast />
      </body>
    </html>
  );
}
