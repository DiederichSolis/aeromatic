"use client";

import { useEffect, useState } from "react";
import RoomsTabs from "@/components/RoomsTabs";
import IndoorPanel from "@/components/IndoorPanel";
import OutdoorPanel from "@/components/OutdoorPanel";
import AddSpaceModal from "@/components/AddSpaceModal";
import AddDeviceModal from "@/components/AddDeviceModal";
import { supabase } from "@/lib/supabaseClient";
import { useUserSpaces } from "@/lib/useUserSpaces";
import { useSelectedSpace } from "@/lib/useSelectedSpace";
import { useSpaceDevices } from "@/lib/useSpaceDevices";
import { useAddSpace } from "@/lib/useAddSpace";
import { useAddDevice } from "@/lib/useAddDevice";
import { useUploadDeviceImage } from "@/lib/useUploadDeviceImage";

type TelemetryRow = {
  id: number;
  device_id: string | null;
  ts: string | null;
  temp_in: number | null;
  temp_out: number | null;
  hum_in: number | null;
  hum_out: number | null;
  gases: number | null;
  movimiento: boolean | null;
  obstaculo: number | null;
  lluvia: number | null;
  raw: any;
};

export default function HomePage() {
  // auth (por si no metes el guard en layout)
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // 1) SPACES del usuario
  const { spaces, loading: loadingSpaces, refetch } = useUserSpaces();

  // 2) espacio seleccionado
  const { selectedSpaceId, setSelectedSpaceId } = useSelectedSpace(spaces);

  // 3) devices de ese espacio
  const { devices, loading: loadingDevices ,   refetch: refetchDevices } = useSpaceDevices(selectedSpaceId);

  // 4) device seleccionado dentro del espacio
  const [activeDeviceIdx, setActiveDeviceIdx] = useState(0);

  // 5) telemetría del device seleccionado
  const [telemetry, setTelemetry] = useState<TelemetryRow | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);

  const { addSpace, loading: loadingAdd } = useAddSpace();
  const { addDevice, loading: loadingAddDevice, error: addDeviceError } = useAddDevice();
  const { uploadImage } = useUploadDeviceImage();


  // 1) revisar sesión rápida
  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem("sb_session") : null;

    if (raw) {
      setIsAuth(true);
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          localStorage.setItem("sb_session", JSON.stringify(data.session));
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      });
    }
  }, []);

  // cuando cambien los devices del espacio (porque cambiaste de space), selecciona el primero
  useEffect(() => {
    if (devices.length > 0) {
      setActiveDeviceIdx(0);
    } else {
      setActiveDeviceIdx(0);
      setTelemetry(null);
    }
  }, [devices]);

  // device actualmente seleccionado
  const selectedDevice =
    devices.length > 0 ? devices[activeDeviceIdx] : undefined;

  // suscribirse a telemetría del device seleccionado
  useEffect(() => {
    if (!selectedDevice) {
      setTelemetry(null);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const loadAndSub = async () => {
      setLoadingTelemetry(true);

      const { data } = await supabase
        .from("telemetry")
        .select("*")
        .eq("device_id", selectedDevice.device_id)
        .order("ts", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        if (data) {
          setTelemetry(data as TelemetryRow);
        } else {
          // no encontró telemetría
          setTelemetry(null);
        }
        setLoadingTelemetry(false);
      }

      channel = supabase
        .channel(`telemetry:device:${selectedDevice.device_id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "telemetry",
            filter: `device_id=eq.${selectedDevice.device_id}`,
          },
          (payload) => {
            setTelemetry(payload.new as TelemetryRow);
          }
        )
        .subscribe();
    };

    loadAndSub();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [selectedDevice?.device_id]);

  // modales
  const [openSpace, setOpenSpace] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);

 const handleAddSpace = async (name: string, description: string) => {
    const newSpace = await addSpace(name, description);
    if (newSpace) {
      await refetch();
      // cierra el modal
      setOpenSpace(false);
    }
  };

  const handleAddDevice = async ({ name, description, hardware_id, file }: { name: string; description: string; hardware_id:string; file: File | null }) => {
    const newDevice = await addDevice({ name, description, hardware_id });
    if (!newDevice) return;

    if (file) {
      const publicUrl = await uploadImage(newDevice.id, file);
      if (publicUrl) {
        await supabase
          .from("device")
          .update({ image_url: publicUrl })
          .eq("id", newDevice.id);
      }
    }

    if (selectedSpaceId) {
      await supabase
        .from("spaces_has_devices")
        .insert([{ space_id: selectedSpaceId, device_id: newDevice.id }]);
    }

    await refetchDevices(selectedSpaceId);
    setOpenDevice(false);
  };

  // auth states
  if (isAuth === null) {
    return <div className="min-h-screen bg-white" />;
  }

  if (isAuth === false) {
    return <div className="min-h-screen bg-white">No autorizado</div>;
  }

  // tabs de arriba → SPACES
  const tabItems = loadingSpaces
    ? ["Cargando..."]
    : spaces.map((s:any) => s.name);

  // valores a mandar a los paneles
  const interiorTemp = telemetry?.temp_in ?? 0;
  const interiorHum = telemetry?.hum_in ?? 0;
  const exteriorTemp = telemetry?.temp_out ?? 0;
  const exteriorHum = telemetry?.hum_out ?? 0;

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

      {/* Tabs de espacios */}
      <div className="relative z-10 flex justify-center px-4 pt-5">
        <RoomsTabs
          items={tabItems}
          active={
            selectedSpaceId
              ? spaces.findIndex((s:any) => s.id === selectedSpaceId)
              : 0
          }
          onChangeActive={(idx) => {
            const space = spaces[idx];
            if (space) {
              setSelectedSpaceId(space.id);
            }
          }}
          onAdd={() => setOpenSpace(true)}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="min-h-[calc(100dvh-230px)] flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 md:gap-12 justify-items-center items-start w-full">
            {/* Izquierda */}
            <div  className="min-w-0 flex flex-col items-center md:items-start">
              <IndoorPanel
                titulo={
                  selectedDevice
                    ? selectedDevice.name
                    : selectedSpaceId
                    ? "Sin dispositivos"
                    : "Sin espacio"
                }
                image={selectedDevice ? selectedDevice.image : undefined}
                size="md"
                onAdd={() => setOpenDevice(true)}
                tempC={interiorTemp}
                humidity={interiorHum}
              />

              {/* selector de devices dentro del espacio */}
              {loadingDevices ? (
                <div className="mt-3 text-white/80 text-sm">
                  Cargando dispositivos...
                </div>
              ) : devices.length > 1 ? (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {devices.map((d:any, i:any) => (
                    <button
                      key={d.device_id}
                      onClick={() => setActiveDeviceIdx(i)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        i === activeDeviceIdx
                          ? "bg-white/90 text-slate-900"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              ) : null}

              {loadingTelemetry ? (
                <div className="mt-3 text-white/80 text-sm">
                  Actualizando telemetría...
                </div>
              ) : null}
            </div>

            {/* Derecha */}
            <div className="min-w-0 flex justify-center md:justify-end">
              <OutdoorPanel tempC={exteriorTemp} humidity={exteriorHum} />
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <AddSpaceModal
        open={openSpace}
        onClose={() => setOpenSpace(false)}
        onAdd={handleAddSpace}
      />

      <AddDeviceModal
        open={openDevice}
        onClose={() => setOpenDevice(false)}
        currentSpace={
          selectedSpaceId
            ? spaces.find((s:any) => s.id === selectedSpaceId)?.name ?? ""
            : ""
        }
        onAdd={handleAddDevice}
      />
    </section>
  );
}
