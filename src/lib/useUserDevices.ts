// src/hooks/useUserDevices.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type UserDevice = {
  device_id: string;
  role?: string | null;
  name: string; // <- lo llenamos con la segunda consulta
};

export function useUserDevices() {
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1) user actual
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setDevices([]);
        setLoading(false);
        return;
      }

      // 2) traer relaciones user_has_device
      const { data: rels, error: relErr } = await supabase
        .from("user_has_device")
        .select("device_id, role")
        .eq("user_id", user.id);

      if (relErr || !rels || rels.length === 0) {
        setDevices([]);
        setLoading(false);
        return;
      }

      const ids = rels.map((r) => r.device_id);

      // 3) traer info de cada device SIN join en la misma query
      const { data: devs, error: devErr } = await supabase
        .from("device")
        .select("id, name")
        .in("id", ids);

      if (devErr) {
        console.error(devErr);
        // aun así devolvemos las relaciones
        setDevices(
          rels.map((r) => ({
            device_id: r.device_id,
            role: r.role,
            name: r.device_id.slice(0, 6), // fallback
          }))
        );
        setLoading(false);
        return;
      }

      // 4) merge
      const merged: UserDevice[] = rels.map((r) => {
        const match = devs.find((d) => d.id === r.device_id);
        return {
          device_id: r.device_id,
          role: r.role,
          name: match?.name ?? r.device_id.slice(0, 6),
        };
      });

      setDevices(merged);
      setLoading(false);
    };

    load();
  }, []);

  return { devices, loading };
}
