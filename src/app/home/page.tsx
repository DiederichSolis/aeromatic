"use client";

import { useEffect, useState } from "react";
import RoomsTabs from "@/components/RoomsTabs";
import IndoorPanel from "@/components/IndoorPanel";
import OutdoorPanel from "@/components/OutdoorPanel";
import AddSpaceModal from "@/components/AddSpaceModal";
import AddDeviceModal from "@/components/AddDeviceModal";
import LoginPage from "@/app/login/page";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // estados que ya tenías
  const [spaces, setSpaces] = useState<string[]>([
    "Habitación",
    "Sala de estar",
    "Oficina",
  ]);
  const [active, setActive] = useState<number>(0);
  const currentSpace = spaces[active];
  const [openSpace, setOpenSpace] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);
  const [devicesBySpace, setDevicesBySpace] = useState<
    Record<string, string[]>
  >({
    Habitación: ["Ventana 1"],
    "Sala de estar": [],
    Oficina: [],
  });

  useEffect(() => {
    // 1) intentar leer del localStorage
    const raw = typeof window !== "undefined"
      ? localStorage.getItem("sb_session")
      : null;

    if (raw) {
      setIsAuth(true);
    } else {
      // 2) fallback: preguntar a supabase por si hay sesión válida en cookies
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          // opcional: guardarlo en localStorage para después
          localStorage.setItem("sb_session", JSON.stringify(data.session));
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      });
    }
  }, []);

  const addSpace = (name: string) => {
    if (!spaces.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setSpaces((prev) => [...prev, name]);
      setDevicesBySpace((prev) => ({ ...prev, [name]: [] }));
      setActive(spaces.length);
    }
    setOpenSpace(false);
  };

  const addDevice = (deviceName: string) => {
    setDevicesBySpace((prev) => ({
      ...prev,
      [currentSpace]: [...(prev[currentSpace] ?? []), deviceName],
    }));
    setOpenDevice(false);
  };

  // si sí está autenticado → mostrar tu UI
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
            {/* Izquierda */}
            <div className="min-w-0 flex flex-col items-center md:items-start">
              <IndoorPanel
                titulo={currentSpace}
                ventanaSrc="/closeW.png"
                size="md"
                onAdd={() => setOpenDevice(true)}
              />

              {devicesBySpace[currentSpace]?.length ? (
                <div className="mt-3 text-white/90 text-sm">
                  {devicesBySpace[currentSpace].map((d, i) => (
                    <div key={i} className="opacity-90">
                      • {d}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Derecha */}
            <div className="min-w-0 flex justify-center md:justify-end">
              <OutdoorPanel />
            </div>
          </div>
        </div>
      </div>

      <AddSpaceModal
        open={openSpace}
        onClose={() => setOpenSpace(false)}
        onAdd={addSpace}
      />

      <AddDeviceModal
        open={openDevice}
        onClose={() => setOpenDevice(false)}
        currentSpace={currentSpace}
        onAdd={addDevice}
      />
    </section>
  );
}
