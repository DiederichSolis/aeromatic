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
    { href: "/stats", label: "Estadísticas", icon: BarChart3 },
    { href: "/home",  label: "Inicio",        icon: Home },
    { href: "/ajustes", label: "Ajustes",     icon: Settings },
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-[#bee2e4]">
      <nav className="mx-auto max-w-screen-md bg-transparent border-t border-black/10 px-8 py-3 pb-[calc(14px+env(safe-area-inset-bottom))]">
        <ul className="flex items-center justify-between gap-8">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} aria-label={label} className={cn("group inline-flex flex-col items-center", active && "scale-105")}>
                  <Icon className="h-7 w-7 md:h-8 md:w-8 text-black" strokeWidth={2.75} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
