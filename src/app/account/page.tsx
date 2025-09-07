"use client";

import { User, LogOut, Settings, ShieldCheck } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-[100dvh] pb-28 bg-gradient-to-b from-[#fffef9] to-[#f5fbfb]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-black/5">
        <div className="mx-auto max-w-screen-md px-5 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#cfecee] grid place-items-center border border-[#b5e5e7]">
            <User className="h-5 w-5 text-[#225b60]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0c1b1d]">Cuenta</h1>
            <p className="text-sm text-slate-600">Gestión de perfil y acceso</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-screen-md px-5 space-y-8 mt-6">
        {/* Info de usuario */}
        <section className="rounded-3xl bg-white/90 border border-black/5 shadow-sm p-6 flex flex-col items-center gap-3">
          <div className="h-20 w-20 rounded-full bg-[#eaf7f8] border border-[#cfecee] grid place-items-center">
            <User className="h-10 w-10 text-[#1b656a]" />
          </div>
          <h2 className="text-lg font-semibold text-[#0c1b1d]">Nombre de Usuario</h2>
          <p className="text-sm text-slate-600">usuario@email.com</p>
        </section>

        {/* Opciones */}
        <div className="space-y-4">
          <AccountOption
            icon={<Settings className="h-5 w-5" />}
            title="Preferencias"
            subtitle="Idioma, tema y personalización"
          />
          <AccountOption
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Seguridad"
            subtitle="Cambiar contraseña y autenticación"
          />
          <AccountOption
            icon={<LogOut className="h-5 w-5 text-red-600" />}
            title="Cerrar sesión"
            subtitle="Salir de tu cuenta"
            danger
            onClick={() => alert("Aquí va la lógica de logout")}
          />
        </div>
      </div>
    </main>
  );
}

/* ---------- Subcomponente ---------- */
function AccountOption({
  icon,
  title,
  subtitle,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-2xl bg-white/90 border border-black/5 shadow-sm px-5 py-4 hover:shadow-md transition ${
        danger ? "text-red-600" : "text-[#0c1b1d]"
      }`}
    >
      <div className="flex items-center gap-3 text-left">
        <div className="h-10 w-10 rounded-xl bg-[#eaf7f8] grid place-items-center border border-[#cfecee]">
          {icon}
        </div>
        <div>
          <div className="text-[16px] font-semibold">{title}</div>
          {subtitle && <div className="text-sm text-slate-600">{subtitle}</div>}
        </div>
      </div>
    </button>
  );
}
