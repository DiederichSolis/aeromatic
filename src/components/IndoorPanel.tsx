"use client";

import Image from "next/image";
import { Wifi, Plus, Thermometer, Droplets } from "lucide-react";

type Size = "sm" | "md" | "lg";

const circleBase: Record<Size, string> = {
  sm: "w-32 h-32",
  md: "w-45 h-50",
  lg: "w-40 h-40",
};

const circleMdUp: Record<Size, string> = {
  sm: "md:w-48 md:h-48",
  md: "md:w-64 md:h-64",
  lg: "md:w-80 md:h-80",
};

const imgBase: Record<Size, string> = {
  sm: "w-[52%]",
  md: "w-[62%]",
  lg: "w-[58%]",
};
const imgMdUp: Record<Size, string> = {
  sm: "md:w-[65%]",
  md: "md:w-[70%]",
  lg: "md:w-[78%]",
};

type Props = {
  titulo: string;          // nombre del espacio (lo pinta el padre)
  ventanaSrc?: string;
  size?: Size;
  onAdd?: () => void;      // handler para abrir modal de nuevo dispositivo
  headerLabel?: string;
  tempC?: number;
  humidity?: number;
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
      {/* Header gris */}
      <div className="mb-3 md:mb-6 -mt-10 sm:-mt-7 md:-mt-2">
        <div
          className="
            flex flex-col items-center gap-1.5 md:gap-2
            rounded-2xl bg-neutral-700/70 text-white
            px-4 py-2.5 md:px-5 md:py-3.5
            shadow-lg ring-1 ring-white/15 backdrop-blur-sm
          "
        >
          <span className="text-base md:text-xl font-bold tracking-tight">
            {headerLabel}
          </span>
          <div className="flex items-center gap-4 md:gap-6 text-sm md:text-lg">
            <span className="inline-flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 md:h-6 md:w-6" strokeWidth={3} /> {tempC}°C
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Droplets className="h-4 w-4 md:h-6 md:w-6" strokeWidth={3} /> {humidity}%
            </span>
          </div>
        </div>
      </div>

      {/* Título del espacio */}
      <div className="mt-10 mb-4 md:mb-6 text-lg md:text-3xl font-extrabold tracking-tight">
        {titulo}
      </div>

      {/* Círculo + ventana */}
      <div
        className={[
          "mt-12",
          "relative grid place-items-center rounded-full",
          "bg-gradient-to-br from-cyan-700/40 via-cyan-600/30 to-cyan-400/30",
          "ring-1 ring-white/30 shadow-[inset_0_18px_60px_rgba(0,0,0,0.25)]",
          circleBase[size],
          circleMdUp[size],
        ].join(" ")}
      >
        {/* Wifi badge */}
        <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 grid
                h-12 w-12 md:h-14 md:w-14
                place-items-center rounded-full bg-slate-800/90
                border-2 border-slate-700/60 shadow-xl">
          <Wifi className="h-6 w-6 md:h-7 md:w-7 text-white" strokeWidth={2.6} />
        </div>

        <Image
          src={ventanaSrc}
          alt="Ventana"
          width={600}
          height={600}
          priority
          className={`${imgBase[size]} ${imgMdUp[size]} h-auto drop-shadow-2xl`}
        />
      </div>

      {/* Botón + (nuevo dispositivo) */}
      <button
        onClick={onAdd}
        className="mt-4 md:mt-6 grid
                   h-12 w-12 md:h-14 md:w-14
                   place-items-center rounded-full bg-slate-800/90 text-white
                   border-2 border-slate-700/60 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200"
        aria-label="Agregar dispositivo"
        title="Agregar dispositivo"
      >
        <Plus className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.6} />
      </button>

      {/* Etiqueta bajo el botón (puedes cambiarla por el último dispositivo agregado si quieres) */}
      <div className="mt-1 md:mt-2 text-xs md:text-base text-white/90">Ventana 1</div>
    </div>
  );
}
