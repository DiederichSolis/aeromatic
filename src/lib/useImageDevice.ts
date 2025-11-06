import { supabase } from "@/lib/supabaseClient";

export async function uploadDeviceImage(deviceId: string, file: File) {
  // 1. nombre único
  const ext = file.name.split(".").pop();
  const path = `${deviceId}/${crypto.randomUUID()}.${ext}`;

  // 2. subir al bucket
  const { error: uploadErr } = await supabase.storage
    .from("device-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadErr) throw uploadErr;

  // 3. obtener URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from("device-images").getPublicUrl(path);

  // 4. guardar en la tabla device
  const { error: updateErr } = await supabase
    .from("device")
    .update({ image_url: publicUrl })
    .eq("id", deviceId);

  if (updateErr) throw updateErr;

  return publicUrl;
}
