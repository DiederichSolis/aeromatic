"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page"; 

export default function RootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // 1. leer del localStorage
    const raw = typeof window !== "undefined" ? localStorage.getItem("sb_session") : null;

    if (raw) {
      // hay sesión → mandarlo a /home
      setIsAuth(true);
      router.replace("/home");
    } else {
      // no hay sesión → mostrar login
      setIsAuth(false);
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!isAuth) {
    return <LoginPage />;
  }

  return null;
}
