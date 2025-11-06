// src/hooks/useSpaceDevices.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export type SpaceDevice = {
  device_id: string;
  name: string;
  image?: string | null;
};

export function useSpaceDevices(spaceId?: string) {
  const [devices, setDevices] = useState<SpaceDevice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDevices = useCallback(
    async (currentSpaceId?: string) => {
      const effectiveSpaceId = currentSpaceId ?? spaceId;
      if (!effectiveSpaceId) {
        setDevices([]);
        return;
      }

      setLoading(true);

      // 1) traer los device_id que están en ese space
      const { data: links, error: linksErr } = await supabase
        .from("spaces_has_devices")
        .select("device_id, sort_order")
        .eq("space_id", effectiveSpaceId)
        .order("sort_order", { ascending: true });

      if (linksErr || !links || links.length === 0) {
        setDevices([]);
        setLoading(false);
        return;
      }

      const ids = links.map((l) => l.device_id);

      // 2) traer la info de esos devices
      const { data: devs, error: devErr } = await supabase
        .from("device")
        .select("id, name, image_url")
        .in("id", ids);

      if (devErr) {
        console.error("useSpaceDevices device error", devErr);
        setDevices(
          links.map((l) => ({
            device_id: l.device_id,
            name: l.device_id.slice(0, 6),
            image: null,
          }))
        );
        setLoading(false);
        return;
      }

      // 3) merge respetando el orden
      const merged: SpaceDevice[] = links.map((l) => {
        const match = devs?.find((d) => d.id === l.device_id);
        return {
          device_id: l.device_id,
          name: match?.name ?? l.device_id.slice(0, 6),
          image: match?.image_url ?? null,
        };
      });

      setDevices(merged);
      setLoading(false);
    },
    [spaceId]
  );

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // 👇 devolvemos refetch
  return { devices, loading, refetch: fetchDevices };
}
