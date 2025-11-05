"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User, LogOut, Settings } from "lucide-react";

type SessionUser = {
  email: string | null;
  name?: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const u: any = data.session.user;
        setUser({
          email: u.email,
          name:
            (u.user_metadata &&
              (u.user_metadata.full_name || u.user_metadata.name)) ||
            u.email ||
            "Usuario",
        });
        localStorage.setItem("sb_session", JSON.stringify(data.session));
      } else {
        router.replace("/");
      }
      setLoading(false);
    };

    loadSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("sb_session");
    router.replace("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50" />;
  }

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
          <h2 className="text-lg font-semibold text-[#0c1b1d]">
            {user?.name ?? "Usuario"}
          </h2>
          <p className="text-sm text-slate-600">{user?.email}</p>
        </section>

        {/* Opciones */}
        <div className="space-y-4">
          <AccountOption
            icon={<Settings className="h-5 w-5" />}
            title="Preferencias"
            subtitle="Idioma, tema y personalización"
          />
          <AccountOption
            icon={<LogOut className="h-5 w-5 text-red-600" />}
            title="Cerrar sesión"
            subtitle="Salir de tu cuenta"
            danger
            onClick={() => setShowConfirm(true)}
          />
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              ¿Cerrar sesión?
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              Vas a salir de tu cuenta Aeromatic. Tendrás que iniciar sesión de nuevo.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition"
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
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
      style={{ cursor: "pointer" }}
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
