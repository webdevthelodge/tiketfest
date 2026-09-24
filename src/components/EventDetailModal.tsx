import { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Building,
  Check,
  Plus,
  Minus,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { EventItem, TicketTier } from '../types';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (tiers: { tier: TicketTier; quantity: number }[]) => void;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onProceedToCheckout
}: EventDetailModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!isOpen || !event) return null;

  const handleQtyChange = (tierId: string, delta: number, maxQuota: number) => {
    setQuantities(prev => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, Math.min(maxQuota, current + delta));
      return { ...prev, [tierId]: next };
    });
  };

  const selectedList = event.ticketTiers
    .map(tier => ({ tier, quantity: quantities[tier.id] || 0 }))
    .filter(it => it.quantity > 0);

  const totalQuantity = selectedList.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = selectedList.reduce((sum, it) => sum + it.tier.price * it.quantity, 0);

  const handleCheckoutClick = () => {
    if (totalQuantity === 0) return;
    onProceedToCheckout(selectedList);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="event-detail-modal-container"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp flex flex-col max-h-[90vh]"
      >
        {/* Banner with Close Button */}
        <div className="relative h-48 sm:h-64 w-full shrink-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <button
            id="btn-close-event-detail"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-600/90 text-[11px] font-bold tracking-wide uppercase backdrop-blur-xs mb-2">
              {event.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">{event.title}</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Key Event Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Hari & Tanggal</span>
                <strong className="text-slate-800">{event.date}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Jam Acara</span>
                <strong className="text-slate-800">{event.time}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Lokasi</span>
                <strong className="text-slate-800 truncate block">{event.venue}, {event.city}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tentang Acara
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
          </div>

          {/* Lineup / Performers */}
          {event.lineup.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Bintang Tamu / Pembicara Utama
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.lineup.map((person, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-full text-xs font-semibold"
                  >
                    ⭐ {person}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Tier Selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Pilihan Kategori Tiket</span>
              <span className="text-indigo-600 font-semibold normal-case">Maks 4 tiket per transaksi</span>
            </h4>

            <div className="space-y-3">
              {event.ticketTiers.map(tier => {
                const qty = quantities[tier.id] || 0;
                const remaining = tier.quota - tier.soldCount;
                const isSoldOut = remaining <= 0;

                return (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      qty > 0
                        ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    } ${isSoldOut ? 'opacity-60 bg-slate-100/60' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-sm sm:text-base">{tier.name}</h5>
                          {isSoldOut ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                              Habis Terjual
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                              Sisa {remaining} kuota
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {tier.perks.map((perk, pIdx) => (
                            <span
                              key={pIdx}
                              className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                            >
                              <Check className="w-3 h-3 text-emerald-600" /> {perk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block">Harga</span>
                          <span className="text-base font-extrabold text-indigo-600">
                            Rp {tier.price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        {!isSoldOut && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              id={`btn-decrease-tier-${tier.id}`}
                              type="button"
                              onClick={() => handleQtyChange(tier.id, -1, 4)}
                              disabled={qty <= 0}
                              className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-slate-900">{qty}</span>
                            <button
                              id={`btn-increase-tier-${tier.id}`}
                              type="button"
                              onClick={() => handleQtyChange(tier.id, 1, Math.min(4, remaining))}
                              disabled={qty >= 4 || qty >= remaining}
                              className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> Syarat & Ketentuan Masuk
            </h4>
            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
              {event.terms.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-xs text-slate-500 block">Total Estimasi ({totalQuantity} Tiket)</span>
            <div className="text-lg font-black text-slate-900">
              {totalQuantity > 0 ? (
                <span className="text-indigo-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
              ) : (
                <span className="text-slate-400">Pilih tiket di atas</span>
              )}
            </div>
          </div>

          <button
            id="btn-proceed-checkout"
            onClick={handleCheckoutClick}
            disabled={totalQuantity === 0}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Lanjut Isi Data Pembeli</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
