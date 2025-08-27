"use client";

import RoomsTabs from "@/components/RoomsTabs";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100dvh-80px)]">
      <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat" />
     <div className="absolute inset-0 bg-black/20" />


      {/* chips arriba, CENTRADOS */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-6">
        <div className="w-full flex justify-center">
          <RoomsTabs
            items={["Habitación", "Sala de estar", "Oficina"]}
            onAdd={() => console.log("Agregar ambiente")}
          />
        </div>
      </div>

      {/* resto del contenido */}
    </section>
  );
}
