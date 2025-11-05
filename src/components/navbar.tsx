"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import Link from "next/link"; 
type Props = { logoSrc?: string; avatarSrc?: string };

export default function Navbar({
  logoSrc = "/logo.png",
  avatarSrc = "/user.png",
}: Props) {
  return (
    <header className="sticky top-0 z-50 bg-[#bee2e4]">
      <div className="relative mx-auto max-w-screen-2xl flex h-16 items-center justify-between px-4">
        {/* Izquierda */}
        <div className="relative z-20 flex items-center gap-4 text-black">
          <button aria-label="Abrir menú" className="p-2 rounded-md hover:bg-black/5 active:scale-95 transition">
            <Menu className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <button aria-label="Notificaciones" className="p-2 rounded-md hover:bg-black/5 active:scale-95 transition">
            <Bell className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Centro: LOGO PNG centrado */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image
            src={logoSrc}
            alt="Aeromatic"
            width={300}
            height={120}
            className="h-auto w-[160px] sm:w-[190px] md:w-[220px] object-contain"
            priority
          />
        </div>

        {/* Derecha */}
        <div className="relative z-20 flex items-center">
        <Link href="/home/account" aria-label="Cuenta">
          <Image
            src={avatarSrc}
            alt="Perfil"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-black/10 shadow hover:scale-105 transition"
          />
        </Link>
      </div>
      </div>
    </header>
  );
}
