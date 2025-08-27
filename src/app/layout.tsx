import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Outfit, Manrope } from "next/font/google";
import Footer  from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APP Aeromatic",
  description: "Next + Tailwind + Capacitor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${manrope.variable}`}>
           <body className="min-h-dvh bg-white text-black">
        <Navbar />
        {/* deja suficiente espacio para el footer grande */}
        <main className="pb-[calc(120px+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
