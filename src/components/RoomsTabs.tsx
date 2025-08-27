"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

type Props = { items: string[]; onAdd?: () => void };

export default function RoomsTabs({ items, onAdd }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div
          className="
            no-scrollbar flex items-center gap-3 overflow-x-auto
            scroll-px-4 px-3 py-2 justify-center
            max-w-[min(100vw-120px,900px)]
            bg-white/20 backdrop-blur-sm rounded-full
            border border-white/40
          "
        >
          {items.map((label, i) => (
            <button
              key={label}
              onClick={() => setActive(i)}
              className={cn(
                "whitespace-nowrap rounded-full transition-all duration-200",
                "px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold",
                "min-w-36 md:min-w-40",
                i === active
                  ? "bg-neutral-900 text-white shadow-md border border-neutral-700"
                  : "bg-white/90 text-slate-700 border border-cyan-200 hover:border-cyan-300 hover:bg-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onAdd}
        aria-label="Agregar ambiente"
        className="grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-full bg-white/90 border border-cyan-200 hover:border-cyan-300 hover:bg-white shadow transition"
      >
        <Plus className="h-4 w-4 md:h-5 md:w-5 text-slate-700" strokeWidth={3.2} />
      </button>
    </div>
  );
}
