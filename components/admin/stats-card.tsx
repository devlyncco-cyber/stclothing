import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: LucideIcon;
  trend?: string;
}

export function StatsCard({ label, value, sublabel, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-neutral-400" />}
      </div>

      <div className="mt-4">
        <span className="text-3xl font-black tracking-tight text-neutral-900 font-mono">
          {value}
        </span>
        {sublabel && (
          <p className="text-[11px] text-neutral-500 mt-1 tracking-wider">{sublabel}</p>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 uppercase tracking-wider">
          {trend}
        </div>
      )}
    </div>
  );
}
