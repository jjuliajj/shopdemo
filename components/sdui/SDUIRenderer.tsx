import React from 'react';
import { SDUIStatsGroup } from './SDUIStatsGroup';
import { SDUIDataTable } from './SDUIDataTable';
import { SDUIDetailCard } from './SDUIDetailCard';

export interface SDUIComponentDef {
  id: string;
  type: 'StatsGroup' | 'DataTable' | 'DetailCard';
  title?: string;
  subtitle?: string;
  items?: any[];
  columns?: any[];
  fields?: any[];
  rowActionUrl?: string;
  emptyText?: string;
}

export interface SDUIPagePayload {
  pageKey: string;
  version: string;
  lastUpdated: string;
  title: string;
  subtitle?: string;
  components: SDUIComponentDef[];
  data: Record<string, any>;
}

interface SDUIRendererProps {
  payload: SDUIPagePayload;
}

export const SDUIRenderer: React.FC<SDUIRendererProps> = ({ payload }) => {
  if (!payload || !payload.components) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl text-rose-600">
        Không thể nạp dữ liệu SDUI Schema từ Serverdemo.
      </div>
    );
  }

  const { components, data } = payload;

  return (
    <div className="space-y-6">
      {components.map((comp) => {
        switch (comp.type) {
          case 'StatsGroup':
            return (
              <SDUIStatsGroup 
                key={comp.id} 
                title={comp.title} 
                items={comp.items} 
              />
            );

          case 'DataTable': {
            // Determine rows dataset from data based on component id / pageKey
            let rows = [];
            if (payload.pageKey === 'customers_list') {
              rows = data?.customers || [];
            } else if (payload.pageKey === 'customer_detail') {
              rows = data?.orders || [];
            } else if (data && data.rows) {
              rows = data.rows;
            }

            return (
              <SDUIDataTable
                key={comp.id}
                title={comp.title}
                subtitle={comp.subtitle}
                columns={comp.columns}
                rows={rows}
                rowActionUrl={comp.rowActionUrl}
                emptyText={comp.emptyText}
              />
            );
          }

          case 'DetailCard': {
            const detailData = data?.customer || data;
            return (
              <SDUIDetailCard
                key={comp.id}
                title={comp.title}
                subtitle={comp.subtitle}
                fields={comp.fields}
                data={detailData}
              />
            );
          }

          default:
            return (
              <div key={comp.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500">
                Unknown component type: {(comp as any).type}
              </div>
            );
        }
      })}
    </div>
  );
};
