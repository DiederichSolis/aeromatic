"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function AddDeviceModal({
  open,
  onClose,
  currentSpace,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  currentSpace: string;
  onAdd: (deviceName: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const submit = () => {
    const v = name.trim();
    if (!v) {
      setError("Escribe un nombre de dispositivo.");
      return;
    }
    onAdd(v);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] mx-auto rounded-3xl bg-[#f7fffe] shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 md:p-7 border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-black">Agregar dispositivo</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-black/5" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-3 text-sm font-semibold text-gray-700">
          Espacio actual: <span className="font-bold text-black">{currentSpace}</span>
        </div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de tu dispositivo</label>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Ventana 2, Sensor balcón..."
          className="w-full rounded-2xl border border-[#b7e5e7] bg-white/80 px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-[#bfeef0] focus:border-[#9fe1e4]"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-center">
          <button
            onClick={submit}
            className="w-full md:w-auto px-8 py-3 rounded-full font-semibold text-white shadow-lg active:scale-[0.99] transition
                       bg-[#2c7a80] hover:bg-[#276d73] focus:outline-none focus:ring-4 focus:ring-[#bfeef0]"
          >
            Agregar dispositivo
          </button>
        </div>
      </div>
    </div>
  );
}
