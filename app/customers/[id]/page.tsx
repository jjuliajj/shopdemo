'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { SDUIRenderer, SDUIPagePayload } from '../../../components/sdui/SDUIRenderer';
import { ArrowLeft, Zap, ExternalLink } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://serverdemo-eta.vercel.app';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;

  const [sduiPayload, setSduiPayload] = useState<SDUIPagePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Background polling (1000ms) with dynamic timestamp to sync state live
  useEffect(() => {
    if (!customerId) return;
    let isMounted = true;

    const fetchSDUISchema = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/sdui/customers/${customerId}?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (!res.ok) {
          throw new Error(`Khách hàng không tồn tại hoặc lỗi status ${res.status}`);
        }
        const data: SDUIPagePayload = await res.json();
        if (isMounted) {
          setSduiPayload(data);
          setError(null);
        }
      } catch (err: any) {
        console.error(err);
        if (isInitial && isMounted) {
          setError(err.message || 'Lỗi nạp dữ liệu chi tiết từ Serverdemo.');
        }
      } finally {
        if (isInitial && isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSDUISchema(true);

    const interval = setInterval(() => {
      fetchSDUISchema(false);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [customerId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {sduiPayload ? sduiPayload.title : 'Chi Tiết Khách Hàng'}
                </h1>
                <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> SDUI Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sduiPayload?.subtitle || `Mã KH: ${customerId}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={SERVER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              Serverdemo Admin <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && !sduiPayload ? (
          <div className="py-20 text-center text-sm font-semibold text-slate-500">
            Đang nạp thông tin chi tiết từ Serverdemo...
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-center space-y-3">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
            <Link href="/" className="inline-block px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg">
              Quay lại danh sách
            </Link>
          </div>
        ) : sduiPayload ? (
          <SDUIRenderer payload={sduiPayload} />
        ) : null}
      </main>
    </div>
  );
}
