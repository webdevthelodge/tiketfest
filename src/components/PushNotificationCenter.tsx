import { useState } from 'react';
import { Bell, Check, Trash2, X, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { PushAlert } from '../types';

interface PushNotificationCenterProps {
  alerts: PushAlert[];
  onMarkAllRead: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PushNotificationCenter({ alerts, onMarkAllRead, isOpen, onClose }: PushNotificationCenterProps) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermission(res);
      } catch (err) {
        console.error('Failed to request notification permission', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div
        id="push-notification-drawer"
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Notifikasi Real-Time</h3>
              <p className="text-xs text-slate-500">Pembaruan instan tiket & gerbang acara</p>
            </div>
          </div>
          <button
            id="btn-close-push-drawer"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        {permission !== 'granted' && (
          <div className="m-4 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-indigo-950 mb-0.5">Aktifkan Notifikasi Desktop</p>
              <p className="text-indigo-700/80 mb-2">Terima status pembayaran otomatis dan pembukaan gerbang langsung di layar Anda.</p>
              <button
                id="btn-request-push-permission"
                onClick={requestBrowserPermission}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-xs text-xs transition-colors"
              >
                Izinkan Notifikasi Web
              </button>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">{alerts.length} Notifikasi Tersimpan</span>
          {alerts.length > 0 && (
            <button
              id="btn-mark-all-read"
              onClick={onMarkAllRead}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
          {alerts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Belum ada notifikasi baru</p>
              <p className="text-xs text-slate-400 mt-1">Setiap pembelian tiket atau pemindaian gate akan muncul otomatis di sini.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                className={`pt-2.5 first:pt-0 pb-2 px-2.5 rounded-lg transition-colors ${
                  !alert.read ? 'bg-indigo-50/40 border-l-2 border-indigo-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {alert.type === 'payment' && <Ticket className="w-4 h-4 text-emerald-600" />}
                    {alert.type === 'checkin' && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                    {alert.type === 'sync' && <Check className="w-4 h-4 text-cyan-600" />}
                    {(alert.type === 'event' || alert.type === 'security') && <AlertCircle className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{alert.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{alert.body}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
