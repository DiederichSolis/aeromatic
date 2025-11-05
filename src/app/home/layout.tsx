"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/authGuard";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-white text-black">
        <Navbar />
        <main className="pb-[calc(120px+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
