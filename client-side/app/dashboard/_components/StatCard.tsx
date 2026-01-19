"use client";

import type { ReactNode } from "react";

type Props = {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

const toneClasses: Record<NonNullable<Props["tone"]>, { ring: string; iconBg: string }> = {
  default: { ring: "ring-slate-200", iconBg: "bg-slate-100 text-slate-700" },
  info: { ring: "ring-blue-200", iconBg: "bg-blue-50 text-blue-700" },
  success: { ring: "ring-emerald-200", iconBg: "bg-emerald-50 text-emerald-700" },
  warning: { ring: "ring-amber-200", iconBg: "bg-amber-50 text-amber-800" },
  danger: { ring: "ring-rose-200", iconBg: "bg-rose-50 text-rose-700" },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "default",
}: Props) {
  const t = toneClasses[tone];
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${t.ring}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </div>
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {icon ? (
          <div className={`shrink-0 rounded-xl p-3 ${t.iconBg}`}>{icon}</div>
        ) : null}
      </div>
    </div>
  );
}

