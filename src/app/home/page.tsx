"use client";

import { useEffect, useState } from "react";
import RoomsTabs from "@/components/RoomsTabs";
import IndoorPanel from "@/components/IndoorPanel";
import OutdoorPanel from "@/components/OutdoorPanel";
import AddSpaceModal from "@/components/AddSpaceModal";
import AddDeviceModal from "@/components/AddDeviceModal";
import { supabase } from "@/lib/supabaseClient";

type UserDevice = {
  device_id: string;
  name: string;
};

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
  // auth (por si no estás usando el guard en layout)
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // devices del usuario (ya no fijos)
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  // tab activa
  const [active, setActive] = useState<number>(0);

  // modales
  const [openSpace, setOpenSpace] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);

  // telemetría del device seleccionado
  const [telemetry, setTelemetry] = useState<TelemetryRow | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);

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

  // 2) traer devices del user en DOS pasos (user_has_device → device)
  useEffect(() => {
    const fetchDevices = async () => {
      setLoadingDevices(true);

      // user actual
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setDevices([]);
        setLoadingDevices(false);
        return;
      }

      // primero: relaciones
      const { data: rels, error: relErr } = await supabase
        .from("user_has_device")
        .select("device_id, role")
        .eq("user_id", user.id);

      if (relErr || !rels || rels.length === 0) {
        setDevices([]);
        setLoadingDevices(false);
        return;
      }

      const ids = rels.map((r) => r.device_id);

      // segundo: traer info de device SIN join
      const { data: devs, error: devErr } = await supabase
        .from("device")
        .select("id, name")
        .in("id", ids);

      // merge
      const merged: UserDevice[] = rels.map((r) => {
        const match = devs?.find((d) => d.id === r.device_id);
        return {
          device_id: r.device_id,
          name: match?.name ?? r.device_id.slice(0, 6),
        };
      });

      setDevices(merged);
      setLoadingDevices(false);

      // si no hay tab seleccionada, selecciona la primera
      if (merged.length > 0 && active >= merged.length) {
        setActive(0);
      }
    };

    fetchDevices();
  }, []); // ← importante: no depende de active

  // device actualmente seleccionado
  const selectedDevice = devices[active];

  // 3) suscribirse a la telemetría del device seleccionado
  useEffect(() => {
    if (!selectedDevice) {
      setTelemetry(null);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const loadAndSub = async () => {
      setLoadingTelemetry(true);

      // última telemetría
      const { data } = await supabase
        .from("telemetry")
        .select("*")
        .eq("device_id", selectedDevice.device_id)
        .order("ts", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        if (data) setTelemetry(data as TelemetryRow);
        setLoadingTelemetry(false);
      }

      // realtime
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

  // 4) modales
  const addSpace = (name: string) => {
    console.log("crear espacio/dispositivo con nombre:", name);
    setOpenSpace(false);
  };

  const addDevice = (deviceName: string) => {
    console.log("agregar device al espacio actual:", deviceName);
    setOpenDevice(false);
  };

  // auth states
  if (isAuth === null) {
    return <div className="min-h-screen bg-white" />;
  }

  if (isAuth === false) {
    return <div className="min-h-screen bg-white">No autorizado</div>;
  }

  // tabs a mostrar
  const tabItems = loadingDevices
    ? ["Cargando..."]
    : devices.map((d) => d.name);

  // valores a mandar a los paneles
  const interiorTemp = telemetry?.temp_in ?? 24;
  const interiorHum = telemetry?.hum_in ?? 50;
  const exteriorTemp = telemetry?.temp_out ?? 20;
  const exteriorHum = telemetry?.hum_out ?? 70;

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
          items={tabItems}
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
                titulo={selectedDevice ? selectedDevice.name : "Sin dispositivo"}
                ventanaSrc="/closeW.png"
                size="md"
                onAdd={() => setOpenDevice(true)}
                tempC={interiorTemp}
                humidity={interiorHum}
              />

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

      <AddSpaceModal
        open={openSpace}
        onClose={() => setOpenSpace(false)}
        onAdd={addSpace}
      />

      <AddDeviceModal
        open={openDevice}
        onClose={() => setOpenDevice(false)}
        currentSpace={selectedDevice ? selectedDevice.name : ""}
        onAdd={addDevice}
      />
    </section>
  );
}
