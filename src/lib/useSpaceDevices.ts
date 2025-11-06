// src/hooks/useSpaceDevices.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type SpaceDevice = {
  device_id: string;
  name: string;
};

export function useSpaceDevices(spaceId?: string) {
  const [devices, setDevices] = useState<SpaceDevice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // si no hay espacio seleccionado, limpiamos
    if (!spaceId) {
      setDevices([]);
      return;
    }

    const load = async () => {
      setLoading(true);

      // 1) traer los device_id que están en ese space
      const { data: links, error: linksErr } = await supabase
        .from("spaces_has_devices")
        .select("device_id, sort_order")
        .eq("space_id", spaceId)
        .order("sort_order", { ascending: true });

      // si no hay links, no hay devices en ese space
      if (linksErr || !links || links.length === 0) {
        setDevices([]);
        setLoading(false);
        return;
      }

      const ids = links.map((l) => l.device_id);

      // 2) traer la info de esos devices
      const { data: devs, error: devErr } = await supabase
        .from("device")
        .select("id, name")
        .in("id", ids);

      if (devErr) {
        console.error("useSpaceDevices device error", devErr);
        // devolvemos al menos los IDs
        setDevices(
          links.map((l) => ({
            device_id: l.device_id,
            name: l.device_id.slice(0, 6),
          }))
        );
        setLoading(false);
        return;
      }

      // 3) merge respetando el orden de la tabla puente
      const merged: SpaceDevice[] = links.map((l) => {
        const match = devs?.find((d) => d.id === l.device_id);
        return {
          device_id: l.device_id,
          name: match?.name ?? l.device_id.slice(0, 6),
        };
      });

      setDevices(merged);
      setLoading(false);
    };

    load();
  }, [spaceId]);

  return { devices, loading };
}
