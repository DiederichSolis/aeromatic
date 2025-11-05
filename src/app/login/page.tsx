"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data.session) {
      localStorage.setItem("sb_session", JSON.stringify(data.session));
    }

    // login ok -> redirige a donde tengas tu dashboard
    router.push("/home"); // cámbialo por / o /dashboard o lo que uses
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Ingresa con tu cuenta de Aeromatic
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent"
              placeholder="tucorreo@dominio.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          ¿Olvidaste tu contraseña? configúralo en Supabase Auth.
        </p>
      </div>
    </div>
  );
}
