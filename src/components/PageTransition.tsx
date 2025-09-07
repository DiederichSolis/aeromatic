"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const variants = {
  initial: { opacity: 0, y: 8, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit:    { opacity: 0, y: -8, filter: "blur(2px)" },
};

export default function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}              // 🔑 cambia en cada ruta
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        className="min-h-[calc(100vh-4rem)]" // ajusta si tu header/footer ocupan altura
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
