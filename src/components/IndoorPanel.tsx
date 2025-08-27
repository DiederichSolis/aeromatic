"use client";

import Image from "next/image";
import { Wifi, Plus, Thermometer, Droplets } from "lucide-react";

type Size = "sm" | "md" | "lg";

const circleSize: Record<Size, string> = {
  sm: "w-48 h-48",
  md: "w-64 h-64",
  lg: "w-80 h-80",
};
const imgWidth: Record<Size, string> = {
  sm: "w-[65%]",
  md: "w-[70%]",
  lg: "w-[78%]",
};

type Props = {
  titulo: string;
  ventanaSrc?: string;
  size?: Size;
  onAdd?: () => void;

  headerLabel?: string;  // "Interior"
  tempC?: number;        // 24
  humidity?: number;     // 50
};

export default function IndoorPanel({
  titulo,
  ventanaSrc = "/closeW.png",
  size = "lg",
  onAdd,
  headerLabel = "Interior",
  tempC = 24,
  humidity = 50,
}: Props) {
  return (
    <div className="flex flex-col items-center text-white">
      {/* === CARD GRIS: Interior + lecturas === */}
      <div className="mb-6 md:mb-8">
        <div
          className="
            flex flex-col items-center gap-2
            rounded-2xl bg-neutral-700/70 text-white
            px-4 py-3 md:px-5 md:py-3.5
            shadow-lg ring-1 ring-white/15 backdrop-blur-sm
          "
        >
          <span className="text-lg md:text-xl font-bold tracking-tight">
            {headerLabel}
          </span>
          <div className="flex items-center gap-5 text-base md:text-lg">
            <span className="flex items-center gap-1.5">
              <Thermometer className="h-5 w-5 md:h-6 md:w-6" strokeWidth={3} /> {tempC}°C
            </span>
            <span className="flex items-center gap-1.5">
              <Droplets className="h-5 w-5 md:h-6 md:w-6" strokeWidth={3} /> {humidity}%
            </span>
          </div>
        </div>
      </div>

      {/* Título del bloque (Habtación) con espacio extra */}
      <div className="mb-6 md:mb-7 text-2xl md:text-3xl font-extrabold tracking-tight">
        {titulo}
      </div>

      {/* Círculo + ventana */}
      <div
        className={[
          "relative grid place-items-center rounded-full",
          "bg-gradient-to-br from-cyan-700/40 via-cyan-600/30 to-cyan-400/30",
          "ring-1 ring-white/30 shadow-[inset_0_18px_60px_rgba(0,0,0,0.25)]",
          circleSize[size],
        ].join(" ")}
      >
        {/* Badge Wi-Fi (mismo estilo que antes) */}
        <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 grid h-12 w-12 place-items-center rounded-full bg-slate-800/90 border border-slate-700/60 shadow-lg">
          <Wifi className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>

        <Image
          src={ventanaSrc}
          alt="Ventana"
          width={600}
          height={600}
          priority
          className={`${imgWidth[size]} h-auto drop-shadow-2xl`}
        />
      </div>

      {/* Badge + */}
      <button
        onClick={onAdd}
        aria-label="Agregar ventana"
        className="mt-5 grid h-12 w-12 place-items-center rounded-full bg-slate-800/90 text-white
                   border border-slate-700/60 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <div className="mt-2 text-base text-white/90">Ventana 1</div>
    </div>
  );
}
