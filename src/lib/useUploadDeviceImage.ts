// src/hooks/useUploadDeviceImage.ts
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "device-images";

export function useUploadDeviceImage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sube una imagen al bucket y devuelve la URL pública
   * @param deviceId id del device recién creado
   * @param file File del input
   */
  const uploadImage = async (deviceId: string, file: File) => {
    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      // puedes cambiar la ruta si quieres carpetas por usuario
      const path = `devices/${deviceId}.${ext}`;

      // 1. subir al bucket
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          upsert: true,
        });

      if (uploadErr) {
        throw uploadErr;
      }

      // 2. obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

      setUploading(false);
      return publicUrl as string;
    } catch (err: any) {
      console.error("upload image error", err.message || err);
      setError(err.message || "Error al subir la imagen");
      setUploading(false);
      return null;
    }
  };

  return { uploadImage, uploading, error };
}
