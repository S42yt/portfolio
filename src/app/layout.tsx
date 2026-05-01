import type { Metadata } from "next";
import { JetBrains_Mono, Big_Shoulders } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import KofiToast from "@/components/kofi-toast";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "S42 and Friends",
  description: "Personal Dev Portfolio of S42",
  icons: {
    icon: "emojis/kuromi_love.gif",
    shortcut: "emojis/kuromi_love.gif",
    apple: "emojis/kuromi_love.gif",
  },
  openGraph: {
    images: ["/thumbnail/page.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/thumbnail/page.png"],
  },
  themeColor: "#6416c9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="emojis/kuromi_love.gif" type="image/gif" />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${bigShoulders.variable} antialiased relative overflow-x-hidden`}
      >
        <div className="fixed inset-0" style={{ background: "var(--bg)" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 100% 60% at 50% -10%, oklch(22% 0.08 288) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "600px",
              height: "600px",
              top: "10%",
              left: "60%",
              background:
                "radial-gradient(circle, oklch(18% 0.06 300) 0%, transparent 70%)",
              filter: "blur(80px)",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "500px",
              height: "500px",
              top: "30%",
              left: "-10%",
              background:
                "radial-gradient(circle, oklch(16% 0.05 275) 0%, transparent 70%)",
              filter: "blur(80px)",
              opacity: 0.6,
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        
        <KofiToast />
      </body>
    </html>
  );
}
