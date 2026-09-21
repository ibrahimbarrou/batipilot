import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PILOTIS — Le système d'exploitation du BTP",
    template: "%s · PILOTIS",
  },
  description:
    "PILOTIS relie le terrain, le bureau et le client : pilotage des projets, suivi de chantier, finance, achats et portail client pour les entreprises de BTP.",
  applicationName: "PILOTIS",
  keywords: ["BTP", "chantier", "ERP", "construction", "gestion de projet", "SaaS"],
};

export const viewport: Viewport = {
  themeColor: "#071a3d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
