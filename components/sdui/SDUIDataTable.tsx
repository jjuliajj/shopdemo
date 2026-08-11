import React from 'react';
import Link from 'next/link';
import { SDUIBadge } from './SDUIBadge';
import { formatCurrency } from './SDUIStatsGroup';
import { ChevronRight, ArrowUpDown } from 'lucide-react';

interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'date' | 'badge' | 'email' | 'phone';
  badgeVariants?: Record<string, { label: string; color: string }>;
  prefix?: string;
  suffix?: string;
}

interface SDUIDataTableProps {
  title?: string;
  subtitle?: string;
  columns?: ColumnDef[];
  rows?: any[];
  rowActionUrl?: string; // e.g., "/customers/{id}"
  emptyText?: string;
}

export const SDUIDataTable: React.FC<SDUIDataTableProps> = ({
  title,
  subtitle,
  columns = [],
  rows = [],
  rowActionUrl,
  emptyText = 'Chưa có dữ liệu'
}) => {
  if (!columns || columns.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl my-6 shadow-sm overflow-hidden">
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs px-3 py-1 rounded-full font-medium border border-indigo-100 dark:border-indigo-900/50">
            {rows.length} bản ghi
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                  </div>
                </th>
              ))}
              {rowActionUrl && <th className="px-6 py-3.5 text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActionUrl ? 1 : 0)} className="px-6 py-8 text-center text-slate-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const targetUrl = rowActionUrl ? rowActionUrl.replace('{id}', row.id || row._id || idx) : null;

                return (
                  <tr 
                    key={row.id || idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition duration-150 group"
                  >
                    {columns.map((col) => {
                      const rawVal = row[col.key];

                      return (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap font-medium">
                          {col.type === 'currency' ? (
                            <span className="font-bold text-slate-900 dark:text-emerald-400">
                              {formatCurrency(rawVal)}
                            </span>
                          ) : col.type === 'badge' ? (
                            <SDUIBadge value={rawVal} variantConfig={col.badgeVariants} />
                          ) : col.type === 'email' ? (
                            <span className="text-indigo-600 dark:text-indigo-400 hover:underline">{rawVal || '-'}</span>
                          ) : col.type === 'phone' ? (
                            <span className="font-mono text-slate-600 dark:text-slate-300">{rawVal || '-'}</span>
                          ) : (
                            <span>{col.prefix}{rawVal !== undefined && rawVal !== null ? String(rawVal) : '-'}{col.suffix}</span>
                          )}
                        </td>
                      );
                    })}

                    {rowActionUrl && targetUrl && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={targetUrl}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 transition"
                        >
                          Chi tiết <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                        </Link>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
