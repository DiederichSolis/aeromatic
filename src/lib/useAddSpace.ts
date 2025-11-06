"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAddSpace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSpace = async (name: string, description: string) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener usuario autenticado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Usuario no autenticado");
      }

      const userId = userData.user.id;

      // Insertar espacio
      const { data, error: insertError } = await supabase
        .from("spaces")
        .insert([
          {
            name,
            description,
            user_id: userId,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setLoading(false);
      return data;
    } catch (err: any) {
      console.error("Error al agregar espacio:", err.message);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  return { addSpace, loading, error };
}
