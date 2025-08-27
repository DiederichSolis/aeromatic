"use client";

import { useState } from "react";
import { Thermometer, Droplets } from "lucide-react";

type Props = {
  headerLabel?: string;  // default: "Exterior"
  tempC?: number;        // default: 20
  humidity?: number;     // default: 70
};

export default function OutdoorPanel({
  headerLabel = "Exterior",
  tempC = 20,
  humidity = 70,
}: Props) {
  const [auto, setAuto] = useState(true);

  return (
    <div className="flex flex-col items-center text-white">
      {/* === CARD GRIS: Exterior + lecturas === */}
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

      {/* Controles */}
      <div className="mt-0 md:mt-20 flex flex-col items-center gap-5">
        {/* Auto */}
        <button
          onClick={() => setAuto(v => !v)}
          className="w-48 h-12 rounded-full bg-neutral-700/90 text-white shadow-lg px-4
                     flex items-center justify-between"
        >
          <span className="text-base md:text-lg font-semibold">Auto</span>
          <span
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition
                        ${auto ? "bg-emerald-500" : "bg-neutral-400"}`}
          >
            <span
              className={`h-5 w-5 bg-white rounded-full shadow transform transition
                          ${auto ? "translate-x-6" : "translate-x-1"}`}
            />
          </span>
        </button>

        {/* Abrir */}
        <button className="w-48 h-12 rounded-full bg-gradient-to-b from-cyan-800 to-cyan-900
                           text-white text-base md:text-lg font-semibold shadow-xl">
          Abrir
        </button>

        {/* Programar */}
        <button className="w-48 h-12 rounded-full bg-neutral-600/85 text-white text-base md:text-lg font-semibold shadow-lg">
          Programar
        </button>
      </div>
    </div>
  );
}
