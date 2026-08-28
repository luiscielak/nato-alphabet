import type { Metadata, Viewport } from "next";
import "../styles/konstrukt.css";
import "../styles/base.css";
import "../styles/app.css";
import { BottomNav } from "../components/BottomNav";
import { ServiceWorkerRegister } from "../components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "NATO Alphabet — spell it on the call",
  description:
    "Type a name or code and read the NATO phonetic spelling. Glance at the full A–Z. Practice until it sticks. Works offline, installs to your home screen.",
  applicationName: "NATO Alphabet",
  manifest: "/spell/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NATO",
  },
  icons: {
    icon: "/spell/icons/icon.svg",
    apple: "/spell/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-palette="hl" data-mode="dark">
      <body>
        {children}
        <BottomNav />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
