"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

type Props = {
  items: string[];
  onAdd?: () => void;
  active?: number;                          // controlado
  onChangeActive?: (index: number) => void; // callback al padre
};

export default function RoomsTabs({ items, onAdd, active, onChangeActive }: Props) {
  // Soporta modo controlado/no controlado
  const isControlled = typeof active === "number";
  const [innerActive, setInnerActive] = useState(0);
  const currActive = isControlled ? (active as number) : innerActive;
  const setActive = (i: number) => (isControlled ? onChangeActive?.(i) : setInnerActive(i));

  const railRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = btnRefs.current[currActive];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currActive]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        rail.scrollBy({ left: e.deltaY, behavior: "auto" });
      }
    };
    rail.addEventListener("wheel", onWheel, { passive: true });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  const scrollBy = (dx: number) => railRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* Flecha izquierda (md+) */}
      <button
        type="button"
        onClick={() => scrollBy(-220)}
        className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white/80 shadow
                   ring-1 ring-cyan-200 hover:bg-white"
        aria-label="Desplazar a la izquierda"
      >
        <ChevronLeft className="h-5 w-5 text-slate-700" />
      </button>

      {/* Carril */}
      <div className="relative max-w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white/40 to-transparent rounded-l-full" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white/40 to-transparent rounded-r-full" />

        <div
          ref={railRef}
          role="tablist"
          aria-label="Seleccionar ambiente"
          className={`
            no-scrollbar flex gap-3 md:gap-4 overflow-x-auto scroll-smooth
            snap-x snap-mandatory touch-pan-x select-none
            px-2 py-2 md:px-3
            rounded-full border border-white/40 bg-white/20 backdrop-blur-sm
            max-w-[min(100vw-120px,900px)]
          `}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((label, i) => {
            const activeTab = i === currActive;
            return (
              <button
                key={label}
                ref={(el: HTMLButtonElement | null) => {
                  btnRefs.current[i] = el;
                }}
                role="tab"
                aria-selected={activeTab}
                tabIndex={activeTab ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") setActive(Math.min(currActive + 1, items.length - 1));
                  if (e.key === "ArrowLeft") setActive(Math.max(currActive - 1, 0));
                }}
                className={cx(
                  "snap-start whitespace-nowrap rounded-full transition-all duration-200 outline-none",
                  "px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold",
                  "min-w-36 md:min-w-40",
                  activeTab
                    ? "bg-neutral-900 text-white shadow-md border border-neutral-700"
                    : "bg-white/90 text-slate-700 border border-cyan-200 hover:border-cyan-300 hover:bg-white"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flecha derecha (md+) */}
      <button
        type="button"
        onClick={() => scrollBy(220)}
        className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white/80 shadow
                   ring-1 ring-cyan-200 hover:bg-white"
        aria-label="Desplazar a la derecha"
      >
        <ChevronRight className="h-5 w-5 text-slate-700" />
      </button>

      {/* Botón + (nuevo espacio) */}
      <button
        onClick={onAdd}
        aria-label="Agregar ambiente"
        className="grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-full bg-white/90
                   border border-cyan-200 hover:border-cyan-300 hover:bg-white shadow transition"
      >
        <Plus className="h-4 w-4 md:h-5 md:w-5 text-slate-700" strokeWidth={3.2} />
      </button>
    </div>
  );
}
