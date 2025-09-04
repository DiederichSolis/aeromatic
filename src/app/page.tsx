"use client";

import RoomsTabs from "@/components/RoomsTabs";
import IndoorPanel from "@/components/IndoorPanel";
import OutdoorPanel from "@/components/OutdoorPanel";

export default function HomePage() {
  return (
    <section className="relative min-h-[100dvh] text-white">
      {/* Fondo */}

<div className="fixed inset-0 -z-10">
  <div
    className="
      absolute inset-0
      bg-[url('/background.png')] bg-no-repeat bg-cover
      bg-center md:bg-center          /* encuadre */
      transform-gpu origin-center
      scale-[1.10] sm:scale-[1.05] md:scale-100  /* 📱 zoom en móvil, normal en md+ */
      transition-transform duration-300
    "
  />
  <div className="absolute inset-0 bg-black/20 pointer-events-none" />
</div>


      {/* Tabs */}
      <div className="relative z-10 flex justify-center px-4 pt-5">
        <RoomsTabs items={["Habitación", "Sala de estar", "Oficina"]} onAdd={() => {}} />
      </div>

      {/* Contenedor CENTRADO */}
   
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="min-h-[calc(100dvh-230px)] flex items-center justify-center">
          {/* 2 columnas siempre (también en móvil) y cada columna centrada */}
          <div className="grid grid-cols-2 gap-8 md:gap-12 justify-items-center items-start w-full">
            {/* Izquierda: Indoor */}
            <div className="min-w-0 flex justify-center md:justify-start">
              <IndoorPanel titulo="Habitación" ventanaSrc="/closeW.png" size="md" />
            </div>

            {/* Derecha: Outdoor */}
            <div className="min-w-0 flex justify-center md:justify-end">
              <OutdoorPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
