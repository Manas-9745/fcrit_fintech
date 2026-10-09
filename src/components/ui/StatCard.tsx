import React from 'react';
import { Badge } from './Badge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  changePercent?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  tooltipText?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  changePercent,
  changeLabel = 'all-time',
  icon,
  iconBgColor = 'bg-teal-50 text-teal-700 border-teal-100',
  highlight = false,
}) => {
  const isPositive = changePercent !== undefined && changePercent > 0;
  const isNegative = changePercent !== undefined && changePercent < 0;
  const isNeutral = changePercent !== undefined && changePercent === 0;

  return (
    <div
      className={`relative bg-white rounded-2xl border p-5 transition-all duration-200 ${
        highlight
          ? 'border-teal-500/40 shadow-card bg-gradient-to-br from-white via-white to-teal-50/20'
          : 'border-slate-200/90 shadow-subtle hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${iconBgColor}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-400 font-mono">
            {subValue}
          </span>
        )}
      </div>

      {changePercent !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <Badge
            variant={isPositive ? 'emerald' : isNegative ? 'coral' : 'slate'}
            size="sm"
            icon={
              isPositive ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              ) : isNegative ? (
                <ArrowDownRight className="w-3 h-3 text-rose-600" />
              ) : (
                <Minus className="w-3 h-3 text-slate-500" />
              )
            }
          >
            {isPositive ? '+' : ''}
            {changePercent.toFixed(2)}%
          </Badge>
          <span className="text-[11px] text-slate-400">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};
