"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";

type Props = {
  logoSrc?: string;
  avatarSrc?: string;
};

export default function Navbar({
  logoSrc = "/logo.png",
  avatarSrc = "/user.png",
}: Props) {
  return (
    
    <header className="sticky top-0 z-50 bg-[#c8f7f2]">
        
      <div className="relative mx-auto max-w-screen-2xl flex h-20 items-center justify-between px-4 sm:px-6">
        
        {/* Izquierda: menú + campana (negros y gruesos) */}
        <div className="relative z-20 flex items-center gap-6 text-black">
          <button
            aria-label="Abrir menú"
            className="p-2 rounded-md hover:bg-black/5 active:scale-95 transition"
          >
            <Menu className="h-8 w-8" strokeWidth={3} />
          </button>
          <button
            aria-label="Notificaciones"
            className="p-2 rounded-md hover:bg-black/5 active:scale-95 transition"
          >
            <Bell className="h-8 w-8" strokeWidth={2.75} />
          </button>
        </div>

        {/* Centro: LOGO PNG centrado */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
        src={logoSrc}
        alt="Aeromatic"
        width={360} height={140}
        className="h-auto w-[180px] sm:w-[220px] md:w-[260px] object-contain"
        />

        </div>

        {/* Derecha: avatar */}
        <div className="relative z-20 flex items-center">
          <Image
            src={avatarSrc}
            alt="Perfil"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-black/10 shadow"
          />
        </div>
      </div>
    </header>
  );
}
