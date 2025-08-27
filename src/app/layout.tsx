import type { Metadata } from "next";
import "./globals.css";
import IonicRoot from "./IonicRoot";

export const metadata: Metadata = {
  title: "APP Aeromatic",
  description: "Next + Ionic + Capacitor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <IonicRoot>{children}</IonicRoot>
      </body>
    </html>
  );
}
