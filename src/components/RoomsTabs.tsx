"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

// helper sin dependencias
function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ")
}

type Props = {
  items: string[]
  onAdd?: () => void
}

export default function RoomsTabs({ items, onAdd }: Props) {
  const [active, setActive] = useState(0)

  return (
      <div className="flex items-center gap-6">
       <div className="relative">
        <div
            className="
            no-scrollbar flex items-center gap-4 overflow-x-auto
            scroll-px-4 px-4 py-3 justify-center
            max-w-[min(100vw-140px,1000px)]
            bg-white/20 backdrop-blur-sm
            rounded-full                   
            border border-white/40 shadow-lg
            "
            aria-label="Selector de ambientes"
        >
            {items.map((label, i) => (
            <button
                key={label}
                onClick={() => setActive(i)}
                className={cn(
                "whitespace-nowrap rounded-full transition-all duration-300", 
                "px-8 md:px-10 py-3.5 md:py-4 text-base md:text-lg font-semibold",
                "min-w-44 md:min-w-52 transform hover:scale-105",
                i === active
                ? "bg-neutral-900 text-white shadow-xl border-2 border-neutral-700"
                : "bg-white/90 text-slate-700 border-2 border-cyan-200 hover:border-cyan-300 hover:bg-white hover:shadow-md backdrop-blur-sm",
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
        className="
            grid h-12 w-12 md:h-14 md:w-14 place-items-center
            rounded-full bg-white/90 border-2 border-cyan-200
            hover:border-cyan-300 hover:bg-white hover:shadow-lg
            shadow-md transition-all duration-300 hover:scale-110
            backdrop-blur-sm
        "
        >
        <Plus className="h-5 w-5 md:h-6 md:w-6 text-slate-700" 
         strokeWidth={3.5}  />
        </button>

      </div>
    
  )
}
