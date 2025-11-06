// src/hooks/useAddDevice.ts
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AddDeviceArgs = {
  name: string;
  description?: string;
  hardware_id: string;
  imageUrl?: string | null;
};

export function useAddDevice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDevice = async ({
    name,
    description = "",
    hardware_id,
    imageUrl = null,
  }: AddDeviceArgs) => {
    setLoading(true);
    setError(null);

    try {
      // usuario actual
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        throw new Error("Usuario no autenticado");
      }

      const userId = userData.user.id;

      const { data, error: insertErr } = await supabase
        .from("device")
        .insert([
          {
            name,
            description,
            hardware_id,
            image_url: imageUrl,
            owner_id: userId, // quítalo si tu tabla no lo tiene
          },
        ])
        .select()
        .single();

      if (insertErr) throw insertErr;

      setLoading(false);
      return data;
    } catch (err: any) {
      console.error("useAddDevice error:", err.message || err);
      setError(err.message || "Error al crear el dispositivo");
      setLoading(false);
      return null;
    }
  };

  return { addDevice, loading, error };
}
