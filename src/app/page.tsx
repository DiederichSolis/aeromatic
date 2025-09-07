"use client";

import { useState } from "react";
import RoomsTabs from "@/components/RoomsTabs";
import IndoorPanel from "@/components/IndoorPanel";
import OutdoorPanel from "@/components/OutdoorPanel";
import AddSpaceModal from "@/components/AddSpaceModal";
import AddDeviceModal from "@/components/AddDeviceModal";

export default function HomePage() {
  // espacios y tab activa
  const [spaces, setSpaces] = useState<string[]>(["Habitación", "Sala de estar", "Oficina"]);
  const [active, setActive] = useState<number>(0);
  const currentSpace = spaces[active];

  // modal: nuevo espacio
  const [openSpace, setOpenSpace] = useState(false);

  // modal: nuevo dispositivo
  const [openDevice, setOpenDevice] = useState(false);

  // (opcional) estructura para guardar dispositivos por espacio
  const [devicesBySpace, setDevicesBySpace] = useState<Record<string, string[]>>({
    Habitación: ["Ventana 1"],
    "Sala de estar": [],
    Oficina: [],
  });

  // agregar espacio y seleccionarlo
  const addSpace = (name: string) => {
    if (!spaces.some(s => s.toLowerCase() === name.toLowerCase())) {
      setSpaces(prev => [...prev, name]);
      setDevicesBySpace(prev => ({ ...prev, [name]: [] }));
      setActive(spaces.length); // seleccionar recién creado
    }
    setOpenSpace(false);
  };

  // agregar dispositivo al espacio actual
  const addDevice = (deviceName: string) => {
    setDevicesBySpace(prev => ({
      ...prev,
      [currentSpace]: [...(prev[currentSpace] ?? []), deviceName],
    }));
    setOpenDevice(false);
  };

  return (
    <section className="relative min-h-[100dvh] text-white">
      {/* Fondo */}
      <div className="fixed inset-0 -z-10">
        <div
          className="
            absolute inset-0
            bg-[url('/background.png')] bg-no-repeat bg-cover
            bg-center md:bg-center
            transform-gpu origin-center
            scale-[1.10] sm:scale-[1.05] md:scale-100
            transition-transform duration-300
          "
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Tabs controladas */}
      <div className="relative z-10 flex justify-center px-4 pt-5">
        <RoomsTabs
          items={spaces}
          active={active}
          onChangeActive={setActive}
          onAdd={() => setOpenSpace(true)}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="min-h-[calc(100dvh-230px)] flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 md:gap-12 justify-items-center items-start w-full">
            {/* Izquierda: Panel interior */}
            <div className="min-w-0 flex flex-col items-center md:items-start">
              <IndoorPanel
                titulo={currentSpace}          // << nombre del espacio activo
                ventanaSrc="/closeW.png"
                size="md"
                onAdd={() => setOpenDevice(true)} // << abre modal de nuevo dispositivo
              />

              {/* (opcional) listar dispositivos del espacio actual */}
              {devicesBySpace[currentSpace]?.length ? (
                <div className="mt-3 text-white/90 text-sm">
                  {devicesBySpace[currentSpace].map((d, i) => (
                    <div key={i} className="opacity-90">• {d}</div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Derecha: Panel exterior */}
            <div className="min-w-0 flex justify-center md:justify-end">
              <OutdoorPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Nuevo espacio */}
      <AddSpaceModal
        open={openSpace}
        onClose={() => setOpenSpace(false)}
        onAdd={addSpace}
      />

      {/* Modal: Nuevo dispositivo (muestra el espacio actual) */}
      <AddDeviceModal
        open={openDevice}
        onClose={() => setOpenDevice(false)}
        currentSpace={currentSpace}
        onAdd={addDevice}
      />
    </section>
  );
}
