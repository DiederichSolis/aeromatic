// src/components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // 1) chequeo inmediato en cliente: ¿hay algo en localStorage?
  const [authorized, setAuthorized] = useState<null | boolean>(() => {
    if (typeof window === "undefined") return null; // en server no sabemos
    const raw = localStorage.getItem("sb_session");
    return raw ? true : null; // si hay, mostramos de una
  });

  useEffect(() => {
    const verify = async () => {
   
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setAuthorized(false);
        router.replace("/");
        return;
      }

      // refrescar el localStorage
      localStorage.setItem("sb_session", JSON.stringify(data.session));
      setAuthorized(true);
    };

    if (authorized === null) {
      verify();
    } else {
      verify();
    }
  }, [authorized, router]);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-500">
        Verificando sesión...
      </div>
    );
  }

  if (authorized === false) {
    return <div className="min-h-screen bg-white" />;
  }

  // authorized === true
  return <>{children}</>;
}
