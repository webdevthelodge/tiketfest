import { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Ticket,
  ChevronRight,
  Flame,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';

interface EventCatalogProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

const CATEGORIES: EventCategory[] = [
  'Semua',
  'Konser Musik',
  'Konferensi Teknologi',
  'Workshop & Edukasi',
  'Olahraga',
  'Seni & Budaya'
];

export function EventCatalog({ events, onSelectEvent }: EventCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchCat = selectedCategory === 'Semua' || evt.category === selectedCategory;
      const matchSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.lineup.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Search Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900/40 opacity-90" />
        <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Platform Tiket Event Resmi & Pembayaran Otomatis
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Beli Tiket Konser, Festival, & Konferensi Tanpa Antre
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Dilengkapi sistem pembayaran otomatis 24/7, cetak e-tiket QR code aman terenkripsi, dan akses masuk cepat di gerbang acara.
          </p>

          {/* Search Input Bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="search-event-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama konser, artis, kota, atau venue..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 text-white placeholder-slate-400 border border-white/20 backdrop-blur-md text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Daftar Event Pilihan ({filteredEvents.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Auto QR Ticket Ready</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">Tidak ada event yang sesuai</h3>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain atau ganti kategori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(evt => {
              const minPrice = Math.min(...evt.ticketTiers.map(t => t.price));
              const totalQuota = evt.ticketTiers.reduce((s, t) => s + t.quota, 0);
              const totalSold = evt.ticketTiers.reduce((s, t) => s + t.soldCount, 0);
              const percentageSold = Math.round((totalSold / totalQuota) * 100);

              return (
                <div
                  key={evt.id}
                  id={`event-card-${evt.id}`}
                  onClick={() => onSelectEvent(evt)}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-[11px] font-bold backdrop-blur-xs">
                        {evt.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-800 text-[11px] font-bold backdrop-blur-xs shadow-xs">
                        {evt.city}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {evt.title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>

                      {/* Quota Progress */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500">Terjual {percentageSold}%</span>
                          <span className="text-indigo-600 font-semibold">{totalSold} / {totalQuota} tiket</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${percentageSold}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Mulai dari</span>
                        <span className="text-base font-extrabold text-indigo-600">
                          Rp {minPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <button
                        id={`btn-beli-tiket-${evt.id}`}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <span>Pilih Tiket</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
