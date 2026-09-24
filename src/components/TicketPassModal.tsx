import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Ticket,
  Printer,
  Download,
  X,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  User,
  Share2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { IssuedTicket } from '../types';
import { exportService } from '../services/exportService';

interface TicketPassModalProps {
  ticket: IssuedTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketPassModal({ ticket, isOpen, onClose }: TicketPassModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket) {
      // Generate QR Code with high error correction and crisp margin
      QRCode.toDataURL(ticket.qrPayload, {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then(url => setQrUrl(url))
        .catch(err => console.error('Error generating QR code', err));
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!ticket) return;
    setIsExporting(true);
    try {
      await exportService.exportSingleTicketPDF(ticket, qrUrl);
    } catch (err) {
      console.error('Failed to export ticket PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div
        id="ticket-modal-container"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
      >
        {/* Modal Top Actions */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-slate-800">E-Tiket Resmi Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-ticket-voucher"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95"
              title="Cetak Tiket"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak</span>
            </button>
            <button
              id="btn-download-ticket-pdf"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
              title="Unduh PDF Tiket"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Membuat PDF...' : 'Unduh PDF'}</span>
            </button>
            <button
              id="btn-close-ticket-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Voucher Body */}
        <div ref={ticketRef} id="printable-ticket-content" className="p-6 bg-white text-slate-900">
          <div className="relative rounded-2xl border-2 border-indigo-200/80 bg-linear-to-b from-indigo-50/40 via-white to-slate-50/50 shadow-sm overflow-hidden">
            {/* Event Header Banner */}
            <div className="bg-indigo-600 text-white p-5 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase backdrop-blur-xs mb-1.5">
                    {ticket.tierName}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold leading-snug">{ticket.eventTitle}</h2>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-indigo-200 block uppercase tracking-wider">Tiket ID</span>
                  <span className="font-mono font-black text-sm tracking-wider">{ticket.id}</span>
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-100">
                {ticket.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 font-semibold border border-emerald-400/40 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> Valid untuk Masuk
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-200 font-semibold border border-amber-400/40 text-[11px]">
                    <AlertTriangle className="w-3 h-3" /> Sudah Digunakan di Gate
                  </span>
                )}
                <span className="text-[11px]">Enkripsi SHA-256</span>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative flex items-center justify-between px-2 py-1">
              <div className="w-5 h-5 -ml-4 bg-white rounded-full border-r-2 border-indigo-200"></div>
              <div className="flex-1 border-b-2 border-dashed border-indigo-200 mx-2"></div>
              <div className="w-5 h-5 -mr-4 bg-white rounded-full border-l-2 border-indigo-200"></div>
            </div>

            {/* Event Timing & Venue */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tanggal</span>
                    <strong className="text-slate-800">{ticket.eventDate}</strong>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Waktu</span>
                    <strong className="text-slate-800">{ticket.eventTime}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Lokasi & Venue</span>
                  <strong className="text-slate-800">{ticket.venue}</strong>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Pemegang Tiket</span>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    {ticket.attendeeName}
                  </div>
                  <span className="text-[11px] text-slate-500">NIK: {ticket.attendeeIdNumberMasked}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Harga</span>
                  <span className="font-extrabold text-sm text-indigo-600">
                    Rp {ticket.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt={`QR Code ${ticket.id}`}
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                    Membuat QR Code...
                  </div>
                )}
                <div className="mt-2 text-center">
                  <span className="font-mono font-black text-sm tracking-widest text-slate-800 block">
                    {ticket.id}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pindai di Access Gate saat kedatangan
                  </p>
                </div>
              </div>

              {/* Security Details Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sig: <code className="font-mono text-slate-600">{ticket.securityHash}</code></span>
                </div>
                <span>Order Ref: {ticket.orderId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Notes */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 print:hidden">
          💡 Tips: Anda dapat mencetak tiket ini di kertas A4 atau menyimpannya di ponsel Anda secara offline.
        </div>
      </div>
    </div>
  );
}
