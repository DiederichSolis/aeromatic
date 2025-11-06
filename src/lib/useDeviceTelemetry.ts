// src/hooks/useDeviceTelemetry.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TelemetryRow = {
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

export function useDeviceTelemetry(deviceId?: string) {
  const [telemetry, setTelemetry] = useState<TelemetryRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // si no hay device seleccionado, limpiamos
    if (!deviceId) {
      setTelemetry(null);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const loadAndSubscribe = async () => {
      setLoading(true);

      // 1) cargar la última telemetría
      const { data } = await supabase
        .from("telemetry")
        .select("*")
        .eq("device_id", deviceId)
        .order("ts", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        if (data) setTelemetry(data as TelemetryRow);
        setLoading(false);
      }

      // 2) suscribirse a inserts de ese device
      channel = supabase
        .channel(`telemetry:device:${deviceId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "telemetry",
            filter: `device_id=eq.${deviceId}`,
          },
          (payload) => {
            setTelemetry(payload.new as TelemetryRow);
          }
        )
        .subscribe();
    };

    loadAndSubscribe();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [deviceId]);

  return { telemetry, loading };
}
