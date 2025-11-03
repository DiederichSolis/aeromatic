"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";


const dailySample = [
  { label: "12 Feb", views: 65, unique: 96, returns: 213 },
  { label: "13 Feb", views: 73, unique: 42, returns: 189 },
  { label: "14 Feb", views: 87, unique: 132, returns: 278 },
];

const monthlySample = [
  { label: "Nov", views: 1450, unique: 980, returns: 2100 },
  { label: "Dec", views: 1620, unique: 1100, returns: 2400 },
  { label: "Jan", views: 1710, unique: 1205, returns: 2630 },
];

function StatCard({ title, value, diff }: { title: string; value: string; diff: string }) {
    return (
      <div className="flex-1 rounded-2xl shadow-md p-4 bg-[#f0fafa]">
        <div className="text-sm font-semibold text-gray-600 mb-2">{title}</div>
        <div className="text-3xl font-bold text-black">{value}</div>
        <div className="text-xs mt-1 text-green-600">{diff}</div>
      </div>
    );
  }
  

export default function StatsPage() {
    const [mode, setMode] = useState<"daily" | "monthly">("daily");

  const chartData = useMemo(() => {
    return mode === "daily" ? dailySample : monthlySample;
  }, [mode]);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-[#e6f6f7]">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 text-center">
      <h1 className="text-xl font-bold text-black">Analíticas</h1>
        <div className="mt-4 inline-flex bg-[#eef7ff] rounded-full p-1">
        <button
        onClick={() => setMode("daily")}   // 👈 usar setMode aquí
        className={`px-4 py-1 rounded-full text-sm font-semibold ${
            mode === "daily" ? "bg-[#bee2e4] text-black" : "text-gray-500"
        }`}
        >
        Diario
        </button>

        <button
        onClick={() => setMode("monthly")} // 👈 usar setMode aquí
        className={`px-4 py-1 rounded-full text-sm font-semibold ${
            mode === "monthly" ? "bg-[#bee2e4] text-black" : "text-gray-500"
        }`}
        >
        Mensual
        </button>

        </div>
      </div>

      {/* Chart */}
      <div className="px-4">
        <div className="rounded-2xl bg-white p-3 shadow-md">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" name="Vistas" fill="#4F46E5" />
                <Bar dataKey="unique" name="Únicos" fill="#EF4444" />
                <Bar dataKey="returns" name="Retorno" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="px-4 mt-4 flex gap-3">
        <StatCard title="Usuarios" value="5.7K" diff="+1.2K (+93%)" />
        <StatCard title="Sesiones" value="6.3K" diff="+1.4K (+85%)" />
        <StatCard title="Nuevos" value="2.6K" diff="+0.9K (+97%)" />
      </div>

      {/* Espacio para no tapar con la barra inferior */}
      <div className="h-20" />
    </div>
  );
}
