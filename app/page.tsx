'use client';

import React, { useState, useEffect } from 'react';
import { SDUIRenderer, SDUIPagePayload } from '../components/sdui/SDUIRenderer';
import { Store, ExternalLink, Zap } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://serverdemo-eta.vercel.app';

export default function ShopHomePage() {
  const [sduiPayload, setSduiPayload] = useState<SDUIPagePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Background polling every 1000ms with cache-busting timestamp
  useEffect(() => {
    let isMounted = true;

    const fetchSDUISchema = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/sdui/customers?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (!res.ok) {
          throw new Error(`Server status ${res.status}`);
        }
        const data: SDUIPagePayload = await res.json();
        if (isMounted) {
          setSduiPayload(data);
          setError(null);
        }
      } catch (err: any) {
        console.error(err);
        if (isInitial && isMounted) {
          setError(`Không thể kết nối với Serverdemo tại ${SERVER_URL}. Vui lòng kiểm tra serverdemo đang chạy.`);
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Shopdemo Store Management
                </h1>
                <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> SDUI Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Giao diện điều khiển hoàn toàn tự động từ Server (Server-Driven UI)
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
              Mở Serverdemo Admin <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && !sduiPayload ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
              Đang tải dữ liệu từ Serverdemo...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-center space-y-3">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        ) : sduiPayload ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {sduiPayload.title}
              </h2>
              {sduiPayload.subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {sduiPayload.subtitle}
                </p>
              )}
            </div>

            {/* Render dynamic component tree from React state */}
            <SDUIRenderer payload={sduiPayload} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
