import React from 'react';
import { TrendingUp, DollarSign, Users, CheckCircle, Award } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  type?: 'currency' | 'text' | 'percent';
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  suffix?: string;
  description?: string;
}

interface SDUIStatsGroupProps {
  title?: string;
  items?: StatItem[];
}

export function formatCurrency(num: number | string): string {
  const val = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(val)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

export const SDUIStatsGroup: React.FC<SDUIStatsGroupProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-6">
      {title && <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          let formattedValue = item.value;
          if (item.type === 'currency' && typeof item.value === 'number') {
            formattedValue = formatCurrency(item.value);
          } else if (item.suffix) {
            formattedValue = `${item.value} ${item.suffix}`;
          }

          return (
            <div 
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {item.label}
                </span>
                {item.type === 'currency' ? (
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="mt-3">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {formattedValue}
                </span>
              </div>

              {(item.change || item.description) && (
                <div className="mt-3 flex items-center justify-between text-xs">
                  {item.change && (
                    <span className={`font-semibold ${
                      item.changeType === 'positive' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : item.changeType === 'negative'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.change}
                    </span>
                  )}
                  {item.description && (
                    <span className="text-slate-400 dark:text-slate-500 truncate">{item.description}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
