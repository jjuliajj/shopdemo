import React from 'react';
import { SDUIBadge } from './SDUIBadge';
import { formatCurrency } from './SDUIStatsGroup';
import { UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface DetailField {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'date' | 'badge' | 'email' | 'phone';
  badgeVariants?: Record<string, { label: string; color: string }>;
  suffix?: string;
  prefix?: string;
  gridSpan?: number;
}

interface SDUIDetailCardProps {
  title?: string;
  subtitle?: string;
  fields?: DetailField[];
  data?: Record<string, any>;
}

export const SDUIDetailCard: React.FC<SDUIDetailCardProps> = ({
  title,
  subtitle,
  fields = [],
  data = {}
}) => {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl my-6 p-6 shadow-sm">
      {(title || subtitle) && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-500" /> {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> SDUI Dynamic Card
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => {
          const val = data ? data[field.key] : null;
          const isNewDynamicField = !['id', 'name', 'email', 'phone', 'city'].includes(field.key);

          return (
            <div 
              key={field.key}
              className={`p-4 rounded-xl transition duration-150 ${
                field.gridSpan && field.gridSpan > 1 ? 'md:col-span-2' : ''
              } ${
                isNewDynamicField 
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40' 
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {field.label}
                </span>
                {isNewDynamicField && (
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">
                    Trường Động
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {field.type === 'currency' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    {formatCurrency(val)}
                  </span>
                ) : field.type === 'badge' ? (
                  <SDUIBadge value={val} variantConfig={field.badgeVariants} />
                ) : field.type === 'email' ? (
                  <a href={`mailto:${val}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{val || '-'}</a>
                ) : field.type === 'phone' ? (
                  <span className="font-mono">{val || '-'}</span>
                ) : (
                  <span>
                    {field.prefix}{val !== undefined && val !== null ? String(val) : '-'}{field.suffix}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
