"use client";

import RoomsTabs from "@/components/RoomsTabs";
import { Thermometer, Droplets } from "lucide-react";
import IndoorPanel from "@/components/IndoorPanel";
import OutdoorPanel from "@/components/OutdoorPanel";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100dvh-80px)] text-white">
      
      {/* Fondo a pantalla */}
      <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-black/20" />
      {/* Si no quieres oscurecer nada, comenta esta línea: */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

    
      {/* Tabs centradas */}
      <div className="relative z-10 flex justify-center px-6 pt-6">
        <RoomsTabs
          items={["Habitación", "Sala de estar", "Oficina"]}
          onAdd={() => console.log("Agregar ambiente")}
        />
      </div>

      {/* Contenido principal a pantalla con 2 columnas */}
      <div className="relative z-10 mx-auto max-w-screen-2xl px-50 pt-20">
  

        {/* Paneles: izquierda (azul) = Interior, derecha (celeste) = Exterior */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="flex justify-center">
        <IndoorPanel titulo="Habitación" ventanaSrc="/closeW.png" size="md" />
      </div>
      <div className="flex justify-center">
        <OutdoorPanel />
      </div>
    </div>

      </div>
    </section>
  );
}
