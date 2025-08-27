"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, BarChart3 } from "lucide-react";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Footer() {
  const pathname = usePathname();

  const items = [
    { href: "/stats",   label: "Estadísticas", icon: BarChart3 },
    { href: "/home",    label: "Inicio",        icon: Home },
    { href: "/ajustes", label: "Ajustes",       icon: Settings },
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-[url('/background.png')]">
    <div className="absolute inset-0 bg-black/20" />
      <nav
        className="
          mx-auto max-w-screen-md
          bg-transparent
          border-t border-black/10
          px-10
          py-4 md:py-5
          pb-[calc(18px+env(safe-area-inset-bottom))]
        "
        aria-label="Navegación inferior"
      >
        <ul className="flex items-center justify-between gap-10">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    "group inline-flex flex-col items-center",
                    active && "scale-105"
                  )}
                >
                  <Icon
                   className="h-10 w-10 md:h-12 md:w-12 text-black"  
                    strokeWidth={3}
                  />
                  {/* Si quieres texto, descomenta: */}
                  {/* <span className="mt-1 text-xs opacity-80">{label}</span> */}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
