"use client";

import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Settings2,
  Bell,
  LayoutGrid,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type Space = { id: string; name: string };

export default function SettingsPage() {
  // 👉 aquí podrías traerlos de tu store/API
  const [spaces, setSpaces] = useState<Space[]>([
    { id: "1", name: "Habitación" },
    { id: "2", name: "Sala de estar" },
    { id: "3", name: "Oficina" },
  ]);

  const addSpace = () => {
    const name = prompt("Nombre del nuevo espacio:");
    if (!name) return;
    setSpaces((s) => [...s, { id: crypto.randomUUID(), name }]);
  };

  const renameSpace = (id: string) => {
    const current = spaces.find((s) => s.id === id);
    const name = prompt("Renombrar espacio:", current?.name ?? "");
    if (!name) return;
    setSpaces((s) => s.map((x) => (x.id === id ? { ...x, name } : x)));
  };

  const removeSpace = (id: string) => {
    if (!confirm("¿Eliminar este espacio?")) return;
    setSpaces((s) => s.filter((x) => x.id !== id));
  };

  return (
    <main className="min-h-[100dvh] pb-28 bg-gradient-to-b from-[#fffef9] to-[#f5fbfb]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-black/5">
        <div className="mx-auto max-w-screen-md px-5 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#cfecee] grid place-items-center border border-[#b5e5e7]">
            <Settings2 className="h-5 w-5 text-[#225b60]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0c1b1d]">
              Configuración
            </h1>
            <p className="text-sm text-slate-600">
              Preferencias generales de tu hogar inteligente
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-md px-5 space-y-8 mt-6">
        {/* ------------------ Sección: Espacios ------------------ */}
        <section className="rounded-3xl bg-white/90 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <header className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#e8f7f7] grid place-items-center border border-[#cfecee]">
                <LayoutGrid className="h-4 w-4 text-[#1b656a]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0c1b1d]">
                Configuración de espacios
              </h2>
            </div>

            <button
              onClick={addSpace}
              className="inline-flex items-center gap-2 rounded-full bg-[#2c7a80] text-white px-4 py-2 text-sm font-semibold shadow hover:bg-[#276d73] active:scale-[0.98] transition"
            >
              <Plus className="h-4 w-4" />
              Agregar espacio
            </button>
          </header>

          <ul className="divide-y divide-black/5">
            {spaces.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-4">
                <div className="text-[17px] font-medium text-[#0c1b1d]">{s.name}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => renameSpace(s.id)}
                    className="rounded-full p-2 text-[#17484c] hover:bg-[#eaf7f8] border border-transparent hover:border-[#cfecee]"
                    aria-label="Renombrar"
                    title="Renombrar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeSpace(s.id)}
                    className="rounded-full p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
                    aria-label="Eliminar"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------ Sección: Dispositivo ------------------ */}
        <SectionLink
          title="Configuración de dispositivos"
          subtitle="Empareja o ajusta tus dispositivos"
          href="#"
          icon={<Settings2 className="h-5 w-5" />}
        />

        {/* ------------------ Sección: Notificaciones ------------------ */}
        <SectionLink
          title="Notificaciones"
          subtitle="Alertas, recordatorios y estado del sistema"
          href="#"
          icon={<Bell className="h-5 w-5" />}
        />
      </div>
    </main>
  );
}

/* ---------- Subcomponente: fila enlazada tipo card ---------- */
function SectionLink({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl bg-white/90 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition"
    >
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#eaf7f8] grid place-items-center border border-[#cfecee] text-[#1b656a]">
            {icon}
          </div>
          <div>
            <div className="text-[17px] font-semibold text-[#0c1b1d]">{title}</div>
            {subtitle && <div className="text-sm text-slate-600">{subtitle}</div>}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:translate-x-0.5 transition" />
      </div>
    </Link>
  );
}
