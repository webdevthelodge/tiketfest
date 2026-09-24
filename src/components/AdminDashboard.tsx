import { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Ticket,
  Users,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Order, IssuedTicket, CheckInLog, EventItem } from '../types';
import { exportService } from '../services/exportService';

interface AdminDashboardProps {
  orders: Order[];
  tickets: IssuedTicket[];
  logs: CheckInLog[];
  events: EventItem[];
  onViewTicket: (ticket: IssuedTicket) => void;
}

export function AdminDashboard({
  orders,
  tickets,
  logs,
  events,
  onViewTicket
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'attendees' | 'gatelogs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'USED' | 'ACTIVE'>('ALL');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Financial & Attendance KPIs
  const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTicketsSold = tickets.length;
  const checkedInCount = tickets.filter(t => t.status === 'USED').length;
  const attendanceRate = totalTicketsSold > 0 ? Math.round((checkedInCount / totalTicketsSold) * 100) : 0;
  const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    paidOrders.forEach(o => {
      const method = o.paymentMethod.toUpperCase();
      map[method] = (map[method] || 0) + o.totalAmount;
    });
    return Object.entries(map).map(([method, amount]) => ({
      method,
      amount,
      percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0
    }));
  }, [paidOrders, totalRevenue]);

  // Hourly check-in simulation
  const hourlyGateTraffic = [
    { hour: '08:00 - 10:00', count: Math.round(checkedInCount * 0.15) },
    { hour: '10:00 - 12:00', count: Math.round(checkedInCount * 0.25) },
    { hour: '12:00 - 14:00', count: Math.round(checkedInCount * 0.20) },
    { hour: '14:00 - 16:00', count: Math.round(checkedInCount * 0.30) },
    { hour: '16:00 - 18:00', count: Math.round(checkedInCount * 0.10) }
  ];

  // PDF Export
  const handleExportPDF = () => {
    setIsExportingPdf(true);
    try {
      exportService.exportAnalyticsReportPDF({ orders, tickets, logs, events });
    } catch (err) {
      console.error('Failed to generate PDF report', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      exportService.exportComprehensiveExcel({ orders, tickets, logs });
    } catch (err) {
      console.error('Failed to generate Excel workbook', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PAID' && o.paymentStatus === 'PAID') ||
        (statusFilter === 'PENDING' && o.paymentStatus === 'PENDING');
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'USED' && t.status === 'USED') ||
        (statusFilter === 'ACTIVE' && t.status === 'ACTIVE');
      return matchSearch && matchStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header & Export Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Dashboard Admin & Analitik Penjualan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring omzet harian, status verifikasi gate, serta ekspor laporan eksekutif PDF dan Excel.
          </p>
        </div>

        {/* Dual Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-export-analytics-pdf"
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{isExportingPdf ? 'Membuat PDF...' : 'Unduh Laporan (PDF)'}</span>
          </button>
          <button
            id="btn-export-analytics-excel"
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isExportingExcel ? 'Membuat Excel...' : 'Ekspor Rekap (Excel)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Total Omzet Penjualan</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {paidOrders.length} transaksi terverifikasi lunas
          </span>
        </div>

        {/* Tiket Terjual */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Total Tiket Terjual</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalTicketsSold} <span className="text-sm font-normal text-slate-500">Tiket</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Rata-rata order: Rp {averageOrderValue.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Kehadiran Hari-H */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Kehadiran Gate Langsung</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {checkedInCount} <span className="text-sm font-normal text-slate-500">/ {totalTicketsSold} Masuk</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{attendanceRate}% tingkat kehadiran saat ini</span>
        </div>

        {/* Total Pesanan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Total Invoice Diterbitkan</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {orders.length} <span className="text-sm font-normal text-slate-500">Pesanan</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Tingkat konversi: {orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0}% lunas
          </span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Channels Split */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" /> Distribusi Metode Pembayaran
          </h3>
          <div className="space-y-3">
            {paymentBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada transaksi pembayaran lunas.</p>
            ) : (
              paymentBreakdown.map(pb => (
                <div key={pb.method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{pb.method.replace('_', ' ')}</span>
                    <span className="text-slate-500">
                      Rp {pb.amount.toLocaleString('id-ID')} ({pb.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${pb.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gate Hourly Traffic Chart */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" /> Arus Kehadiran Pengunjung per Jam (Gate Traffic)
          </h3>
          <div className="space-y-2.5">
            {hourlyGateTraffic.map(item => {
              const barWidth = checkedInCount > 0 ? Math.round((item.count / checkedInCount) * 100) : 0;
              return (
                <div key={item.hour} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{item.hour}</span>
                    <span className="font-bold text-slate-800">{item.count} Pengunjung</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.max(5, barWidth)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables Section with Sub-Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header & Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              id="tab-admin-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' || activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Data Pesanan ({orders.length})
            </button>
            <button
              id="tab-admin-attendees"
              onClick={() => setActiveTab('attendees')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'attendees'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Roster E-Tiket & Tamu ({tickets.length})
            </button>
            <button
              id="tab-admin-gatelogs"
              onClick={() => setActiveTab('gatelogs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gatelogs'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Log Pindai Gate ({logs.length})
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-admin-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari invoice, nama, atau tiket..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
              />
            </div>
            <select
              id="select-admin-status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">Lunas (PAID)</option>
              <option value="PENDING">Pending</option>
              <option value="USED">Sudah Hadir (USED)</option>
              <option value="ACTIVE">Belum Scan (ACTIVE)</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Orders Table */}
        {(activeTab === 'orders' || activeTab === 'overview') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Pembeli</th>
                  <th className="p-3.5">Acara</th>
                  <th className="p-3.5">Metode Bayar</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Waktu</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      Tidak ada data pesanan yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-indigo-950">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{order.buyerInfo.fullName}</div>
                        <div className="text-[11px] text-slate-400">{order.buyerInfo.email}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800 max-w-xs truncate">
                        {order.eventTitle}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold text-[10px]">
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-3.5 text-right">
                        {order.tickets.length > 0 && (
                          <button
                            id={`btn-view-order-ticket-${order.id}`}
                            onClick={() => onViewTicket(order.tickets[0])}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] transition-colors"
                          >
                            Lihat Tiket
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Attendees & Issued Tickets Table */}
        {activeTab === 'attendees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Kode Tiket</th>
                  <th className="p-3.5">Nama Tamu</th>
                  <th className="p-3.5">Kategori Tiket</th>
                  <th className="p-3.5">Status Kehadiran</th>
                  <th className="p-3.5">Waktu Check-In</th>
                  <th className="p-3.5">Pintu Gate</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      Tidak ada tiket yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{ticket.id}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{ticket.attendeeName}</div>
                        <div className="text-[10px] text-slate-400">NIK: {ticket.attendeeIdNumberMasked}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{ticket.tierName}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ticket.status === 'USED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {ticket.status === 'USED' ? 'HADIR (CHECKED IN)' : 'BELUM SCAN'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleTimeString('id-ID') : '-'}
                      </td>
                      <td className="p-3.5 text-slate-500">{ticket.checkedInGate || '-'}</td>
                      <td className="p-3.5 text-right">
                        <button
                          id={`btn-open-ticket-roster-${ticket.id}`}
                          onClick={() => onViewTicket(ticket)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3" /> Cetak
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Gate Logs Table */}
        {activeTab === 'gatelogs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Waktu Pindai</th>
                  <th className="p-3.5">Kode Tiket</th>
                  <th className="p-3.5">Pengunjung</th>
                  <th className="p-3.5">Gate</th>
                  <th className="p-3.5">Hasil Verifikasi</th>
                  <th className="p-3.5">Status Offline</th>
                  <th className="p-3.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      Belum ada catatan pindai gerbang.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-slate-500">
                        {new Date(log.scannedAt).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">{log.ticketId}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{log.attendeeName}</td>
                      <td className="p-3.5 text-slate-700">{log.gate}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'SUCCESS' || log.status === 'OFFLINE_QUEUED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : log.status === 'ALREADY_USED'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {log.isOffline ? (
                          <span className="text-amber-600 font-semibold text-[11px]">Ya (Offline)</span>
                        ) : (
                          <span className="text-emerald-600 text-[11px]">Tersinkron Online</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">{log.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
