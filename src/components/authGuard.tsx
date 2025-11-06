// src/components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/");
      } else {
        // opcional
        localStorage.setItem("sb_session", JSON.stringify(data.session));
      }
      setReady(true);
    };
    check();
  }, [router]);

 
  return (
    <div className="min-h-dvh bg-white text-black">
      {ready ? (
        children
      ) : (
        <div className="min-h-dvh flex items-center justify-center text-slate-500">
          Verificando sesión...
        </div>
      )}
    </div>
  );
}
