import { WifiOff, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  queueCount: number;
  onSync: () => void;
  onToggleOffline: () => void;
}

export function OfflineBanner({ isOffline, queueCount, onSync, onToggleOffline }: OfflineBannerProps) {
  if (!isOffline && queueCount === 0) return null;

  return (
    <div
      id="offline-banner"
      className={`px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors border-b flex flex-wrap items-center justify-between gap-3 ${
        isOffline
          ? 'bg-amber-50 text-amber-900 border-amber-200'
          : 'bg-emerald-50 text-emerald-900 border-emerald-200'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOffline ? (
          <WifiOff className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        )}
        <span>
          {isOffline ? (
            <>
              <strong>Mode Offline Aktif:</strong> Pindai tiket gate dan transaksi tetap tersimpan dalam penyimpanan lokal terenkripsi.
            </>
          ) : (
            <>
              <strong>Terkoneksi Kembali:</strong> Siap menyinkronkan data offline ke server pusat.
            </>
          )}
        </span>
        {queueCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-semibold">
            {queueCount} data antrean
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {queueCount > 0 && (
          <button
            id="btn-sync-offline-queue"
            onClick={onSync}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sinkronisasi Sekarang
          </button>
        )}
        <button
          id="btn-toggle-offline-mode"
          onClick={onToggleOffline}
          className="text-xs underline hover:text-amber-950 font-semibold"
        >
          {isOffline ? 'Beralih ke Online' : 'Aktifkan Mode Offline'}
        </button>
      </div>
    </div>
  );
}
