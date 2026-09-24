import { useState } from 'react';
import { Ticket, Calendar, Clock, MapPin, Printer, Download, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';
import { IssuedTicket } from '../types';

interface MyTicketsViewProps {
  tickets: IssuedTicket[];
  onOpenTicketPass: (ticket: IssuedTicket) => void;
  onExploreEvents: () => void;
}

export function MyTicketsView({ tickets, onOpenTicketPass, onExploreEvents }: MyTicketsViewProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'USED'>('ALL');

  const filteredTickets = tickets.filter(t => {
    if (filter === 'ACTIVE') return t.status === 'ACTIVE';
    if (filter === 'USED') return t.status === 'USED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Ticket className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">E-Tiket & Pas Masuk Saya</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simpan dan cetak tiket QR Code Anda untuk ditunjukkan kepada petugas saat memasuki venue acara.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            id="filter-my-tickets-all"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'ALL' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({tickets.length})
          </button>
          <button
            id="filter-my-tickets-active"
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'ACTIVE' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Siap Digunakan ({tickets.filter(t => t.status === 'ACTIVE').length})
          </button>
          <button
            id="filter-my-tickets-used"
            onClick={() => setFilter('USED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'USED' ? 'bg-white text-slate-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Scan ({tickets.filter(t => t.status === 'USED').length})
          </button>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">Belum Ada Tiket yang Terdaftar</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Jelajahi konser, festival musik, atau konferensi pilihan dan lakukan pembelian dengan pembayaran otomatis.
          </p>
          <button
            id="btn-explore-events-from-empty-tickets"
            onClick={onExploreEvents}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <span>Jelajah Event Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              id={`my-ticket-card-${ticket.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold">
                    {ticket.tierName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      ticket.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {ticket.status === 'ACTIVE' ? 'Aktif (Ready)' : 'Sudah Masuk Gate'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{ticket.eventTitle}</h3>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{ticket.eventDate} • {ticket.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{ticket.venue}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nama Tamu</span>
                    <strong className="text-slate-800">{ticket.attendeeName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Tiket ID</span>
                    <span className="font-mono font-bold text-slate-800">{ticket.id}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enkripsi Kriptografi Aman</span>
                </div>

                <button
                  id={`btn-open-pass-${ticket.id}`}
                  onClick={() => onOpenTicketPass(ticket)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Buka & Cetak QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
