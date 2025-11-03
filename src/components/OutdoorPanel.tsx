"use client";

import { useState } from "react";
import { Thermometer, Droplets } from "lucide-react";

type Props = {
  headerLabel?: string;
  tempC?: number;
  humidity?: number;
};

export default function OutdoorPanel({
  headerLabel = "Exterior",
  tempC = 20,
  humidity = 70,
}: Props) {
  const [auto, setAuto] = useState(true);

  return (
    <div className="flex flex-col items-center text-white">
      {/* CARD gris (texto un poco más grande en móvil) */}
      <div className="mt-6 mb-12">
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

        
          <div className="flex items-center gap-3 md:gap-6 text-sm md:text-lg">
            <span className="inline-flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 md:h-6 md:w-6" strokeWidth={3} /> {tempC}°C
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Droplets className="h-4 w-4 md:h-6 md:w-6" strokeWidth={3} /> {humidity}%
            </span>
          </div>
        </div>
      </div>

      {/* Controles (más compactos en móvil, igual en md+) */}
      <div className="mt-22 md:mt-10 flex flex-col items-center gap-3.5 md:gap-5">
        {/* Auto */}
        <button
          type="button"
          aria-pressed={auto}
          onClick={() => setAuto(v => !v)}
          className="
            w-[clamp(7.8rem,42vw,12rem)] h-9 md:h-12
            rounded-full bg-neutral-700/90 text-white shadow-lg px-3.5 md:px-4
            flex items-center justify-between
          "
        >
          <span className="text-[13px] md:text-lg font-semibold">Auto</span>
          <span
            className={`
              relative inline-flex items-center rounded-full transition
              h-4 w-9 md:h-6 md:w-12
              ${auto ? "bg-emerald-500" : "bg-neutral-400"}
            `}
          >
            <span
              className={`
                h-3.5 w-3.5 md:h-5 md:w-5 bg-white rounded-full shadow transform transition
                ${auto ? "translate-x-4 md:translate-x-6" : "translate-x-1"}
              `}
            />
          </span>
        </button>

        {/* Abrir */}
        <button
          className="
            w-[clamp(7.8rem,42vw,12rem)] h-9 md:h-12
            rounded-full bg-gradient-to-b from-cyan-800 to-cyan-900
            text-white text-[13px] md:text-lg font-semibold shadow-xl
          "
        >
          Abrir
        </button>

        {/* Programar */}
        <button
          className="
            w-[clamp(7.8rem,42vw,12rem)] h-9 md:h-12
            rounded-full bg-neutral-600/85
            text-white text-[13px] md:text-lg font-semibold shadow-lg
          "
        >
          Programar
        </button>
      </div>
    </div>
  );
}
