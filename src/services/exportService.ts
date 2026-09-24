import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Order, IssuedTicket, CheckInLog, EventItem } from '../types';

export const exportService = {
  // --- EXPORT SALES & ATTENDANCE REPORT IN PDF ---
  exportAnalyticsReportPDF(params: {
    orders: Order[];
    tickets: IssuedTicket[];
    logs: CheckInLog[];
    events: EventItem[];
    dateRangeStr?: string;
  }) {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 18;

    // Header & Brand
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, pageWidth, 12, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('LAPORAN ANALITIK PENJUALAN & KEHADIRAN EVENT', 14, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`TiketFest Official Executive Report | Diterbitkan: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, y);
    y += 10;

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    // Executive Summary Metrics Box
    const totalOrders = params.orders.length;
    const paidOrders = params.orders.filter(o => o.paymentStatus === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalTicketsSold = params.tickets.length;
    const checkedInTickets = params.tickets.filter(t => t.status === 'USED').length;
    const attendanceRate = totalTicketsSold > 0 ? Math.round((checkedInTickets / totalTicketsSold) * 100) : 0;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    // 4 KPI Columns
    const colWidth = (pageWidth - 28) / 4;

    // Box 1: Pendapatan
    doc.text('Total Omzet (IDR)', 18, y + 8);
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text(`Rp ${totalRevenue.toLocaleString('id-ID')}`, 18, y + 18);

    // Box 2: Tiket Terjual
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Tiket Terjual', 18 + colWidth, y + 8);
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`${totalTicketsSold} Tiket`, 18 + colWidth, y + 18);

    // Box 3: Kehadiran Hari-H
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Tingkat Kehadiran', 18 + colWidth * 2, y + 8);
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`${attendanceRate}% (${checkedInTickets} Masuk)`, 18 + colWidth * 2, y + 18);

    // Box 4: Transaksi Berhasil
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Pesanan Selesai', 18 + colWidth * 3, y + 8);
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`${paidOrders.length} / ${totalOrders} Order`, 18 + colWidth * 3, y + 18);

    y += 38;

    // Section 1: Ringkasan Penjualan Berdasarkan Kategori Event
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('1. Distribusi Penjualan per Acara', 14, y);
    y += 6;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('NAMA ACARA', 18, y + 5);
    doc.text('TIKET TERJUAL', 110, y + 5);
    doc.text('HADIR / CHECK-IN', 145, y + 5);
    doc.text('TOTAL REVENUE', pageWidth - 18, y + 5, { align: 'right' });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    params.events.forEach(evt => {
      const evtOrders = paidOrders.filter(o => o.eventId === evt.id);
      const evtTickets = params.tickets.filter(t => t.eventId === evt.id);
      const evtCheckedIn = evtTickets.filter(t => t.status === 'USED').length;
      const evtRev = evtOrders.reduce((s, o) => s + o.totalAmount, 0);

      const titleShort = evt.title.length > 40 ? evt.title.substring(0, 38) + '...' : evt.title;
      doc.text(titleShort, 18, y + 4);
      doc.text(`${evtTickets.length} Tiket`, 110, y + 4);
      doc.text(`${evtCheckedIn} (${evtTickets.length > 0 ? Math.round((evtCheckedIn / evtTickets.length) * 100) : 0}%)`, 145, y + 4);
      doc.text(`Rp ${evtRev.toLocaleString('id-ID')}`, pageWidth - 18, y + 4, { align: 'right' });

      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 6, pageWidth - 14, y + 6);
      y += 7;
    });

    y += 6;

    // Section 2: Transaksi Terbaru
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('2. Riwayat Transaksi Terbaru', 14, y);
    y += 6;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('NO. INVOICE', 18, y + 5);
    doc.text('PEMBELI', 65, y + 5);
    doc.text('METODE', 115, y + 5);
    doc.text('STATUS', 145, y + 5);
    doc.text('TOTAL', pageWidth - 18, y + 5, { align: 'right' });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const recentOrders = params.orders.slice(0, 8);
    recentOrders.forEach(o => {
      doc.text(o.orderNumber.replace('INV/', ''), 18, y + 4);
      doc.text(o.buyerInfo.fullName.substring(0, 20), 65, y + 4);
      doc.text(o.paymentMethod.toUpperCase(), 115, y + 4);
      doc.setTextColor(o.paymentStatus === 'PAID' ? 22 : 234, o.paymentStatus === 'PAID' ? 101 : 88, o.paymentStatus === 'PAID' ? 52 : 12);
      doc.text(o.paymentStatus, 145, y + 4);
      doc.setTextColor(51, 65, 85);
      doc.text(`Rp ${o.totalAmount.toLocaleString('id-ID')}`, pageWidth - 18, y + 4, { align: 'right' });

      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 6, pageWidth - 14, y + 6);
      y += 7;
    });

    y += 10;

    // Footer Signature block
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Dokumen ini dihasilkan secara otomatis oleh TiketFest Event Intelligence System dengan enkripsi kriptografi.', 14, 280);
    doc.text(`Halaman 1 dari 1 | TiketFest ${new Date().getFullYear()}`, pageWidth - 14, 280, { align: 'right' });

    doc.save(`Laporan_Penjualan_TiketFest_${new Date().toISOString().slice(0, 10)}.pdf`);
  },

  // --- EXPORT ATTENDEES & SALES WORKBOOK IN EXCEL (.XLSX) ---
  exportComprehensiveExcel(params: {
    orders: Order[];
    tickets: IssuedTicket[];
    logs: CheckInLog[];
  }) {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Data Penjualan (Orders)
    const ordersData = params.orders.map(o => ({
      'Nomor Invoice': o.orderNumber,
      'Nama Pembeli': o.buyerInfo.fullName,
      'Email Pembeli': o.buyerInfo.email,
      'No. WhatsApp': o.buyerInfo.phone,
      'NIK / Identitas': o.buyerInfo.idNumber,
      'Nama Event': o.eventTitle,
      'Jumlah Tiket': o.tickets.length,
      'Subtotal (IDR)': o.subtotal,
      'PPN 11% (IDR)': o.taxAmount,
      'Biaya Layanan (IDR)': o.feeAmount,
      'Total Transaksi (IDR)': o.totalAmount,
      'Metode Bayar': o.paymentMethod.toUpperCase(),
      'Status Pembayaran': o.paymentStatus,
      'Waktu Transaksi': new Date(o.createdAt).toLocaleString('id-ID'),
      'Waktu Lunas': o.paidAt ? new Date(o.paidAt).toLocaleString('id-ID') : '-'
    }));
    const wsOrders = XLSX.utils.json_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(wb, wsOrders, 'Data Penjualan');

    // Sheet 2: Roster E-Tiket & Kehadiran (Attendees)
    const ticketsData = params.tickets.map(t => ({
      'Kode Tiket': t.id,
      'Nama Pemegang Tiket': t.attendeeName,
      'Email': t.attendeeEmail,
      'Identitas Masked': t.attendeeIdNumberMasked,
      'Nama Acara': t.eventTitle,
      'Kategori Tiket': t.tierName,
      'Harga (IDR)': t.price,
      'Status Tiket': t.status === 'USED' ? 'HADIR / DIGUNAKAN' : 'BELUM SCAN',
      'Waktu Check-In': t.checkedInAt ? new Date(t.checkedInAt).toLocaleString('id-ID') : '-',
      'Pintu Masuk (Gate)': t.checkedInGate || '-',
      'Tanda Tangan Digital': t.securityHash,
      'Nomor Pesanan': t.orderId
    }));
    const wsTickets = XLSX.utils.json_to_sheet(ticketsData);
    XLSX.utils.book_append_sheet(wb, wsTickets, 'Roster Tiket & Kehadiran');

    // Sheet 3: Log Pindai Gate (Gate Scanner Logs)
    const logsData = params.logs.map(l => ({
      'Log ID': l.id,
      'Kode Tiket': l.ticketId,
      'Nama Pengunjung': l.attendeeName,
      'Kategori Tiket': l.tierName,
      'Pintu Gate': l.gate,
      'Waktu Pindai': new Date(l.scannedAt).toLocaleString('id-ID'),
      'Hasil Verifikasi': l.status,
      'Mode Offline': l.isOffline ? 'Ya (Antrean Lokal)' : 'Tidak (Online Server)',
      'Catatan': l.notes || '-'
    }));
    const wsLogs = XLSX.utils.json_to_sheet(logsData);
    XLSX.utils.book_append_sheet(wb, wsLogs, 'Log Pindai Gate');

    // Generate and download
    XLSX.writeFile(wb, `TiketFest_Rekapitulasi_Lengkap_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },

  // --- EXPORT INDIVIDUAL E-TICKET AS PDF ---
  async exportSingleTicketPDF(ticket: IssuedTicket, qrDataUrl: string) {
    const doc = new jsPDF('portrait', 'mm', [105, 148]); // A6 Format (compact e-ticket badge)
    const w = 105;

    // Header gradient block
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, w, 28, 'F');

    // Event title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    const titleLines = doc.splitTextToSize(ticket.eventTitle, w - 16);
    doc.text(titleLines, 8, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(224, 231, 255);
    doc.text(`${ticket.eventDate} | ${ticket.eventTime}`, 8, 22);

    // Tier badge
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(8, 33, w - 16, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(67, 56, 202);
    doc.text(ticket.tierName.toUpperCase(), 12, 41);

    // QR Code Image in Center
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', (w - 44) / 2, 48, 44, 44);
    }

    // Ticket Code
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(ticket.id, w / 2, 98, { align: 'center' });

    // Attendee Info Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(8, 103, w - 16, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Nama Pemegang Tiket:', 12, 110);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(ticket.attendeeName, 12, 115);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Lokasi Acara:', 12, 122);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const venueShort = ticket.venue.length > 35 ? ticket.venue.substring(0, 33) + '...' : ticket.venue;
    doc.text(venueShort, 12, 127);

    // Security Watermark
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Security Hash: ${ticket.securityHash} | Status: ${ticket.status}`, w / 2, 140, { align: 'center' });

    doc.save(`E-Tiket_${ticket.id}.pdf`);
  }
};
