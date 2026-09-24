import { useState } from 'react';
import { Mail, X, CheckCircle2, Ticket, Printer, ExternalLink, Calendar, MapPin, User, Clock } from 'lucide-react';
import { EmailNotification } from '../types';

interface EmailInboxModalProps {
  emails: EmailNotification[];
  isOpen: boolean;
  onClose: () => void;
  onViewTicket: (ticketId: string) => void;
}

export function EmailInboxModal({ emails, isOpen, onClose, onViewTicket }: EmailInboxModalProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(emails[0] || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="email-inbox-modal"
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base">Pusat Notifikasi Email Real-Time</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                  24/7 Automated Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Email konfirmasi otomatis dikirimkan ke pembeli segera setelah transaksi terverifikasi.
              </p>
            </div>
          </div>
          <button
            id="btn-close-email-inbox"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split View (List on left, Preview on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
          {/* Email List */}
          <div className="w-full md:w-80 border-r border-slate-200 overflow-y-auto bg-slate-50/50 p-2 space-y-1.5 shrink-0">
            <div className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              Kotak Masuk ({emails.length})
            </div>
            {emails.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Belum ada email yang terkirim. Lakukan pembelian tiket untuk melihat notifikasi otomatis!
              </div>
            ) : (
              emails.map(email => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-white shadow-sm border border-indigo-200 ring-1 ring-indigo-500/20'
                        : 'hover:bg-slate-100/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        TiketFest Auto-System
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(email.sentAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate mb-1">{email.subject}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Ke: {email.recipientEmail}</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Terkirim
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Email Viewer */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
            {selectedEmail ? (
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Meta details */}
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">{selectedEmail.subject}</h2>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Dari: no-reply@tiketfest.id</span>
                      <span>•</span>
                      <span>Kepada: <strong>{selectedEmail.recipientEmail}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(selectedEmail.sentAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Email Canvas Preview */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-slate-50">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Transaksi Berhasil & Terverifikasi
                    </div>
                    <h3 className="text-xl font-black">E-Tiket Resmi Siap Digunakan</h3>
                    <p className="text-xs text-indigo-100 mt-1">
                      Terima kasih atas pesanan Anda di TiketFest. Simpan email ini dan perlihatkan QR code saat masuk acara.
                    </p>
                  </div>

                  <div className="p-6 space-y-4 bg-white">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-500">Nama Acara</div>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{selectedEmail.eventTitle}</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400">Pemesan:</span> {selectedEmail.buyerName}
                        </div>
                        <div>
                          <span className="text-slate-400">Jumlah Tiket:</span> {selectedEmail.ticketCount} Tiket
                        </div>
                        <div>
                          <span className="text-slate-400">Total Biaya:</span>{' '}
                          <strong className="text-indigo-600">
                            Rp {selectedEmail.totalAmount.toLocaleString('id-ID')}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Status Pembayaran:</span>{' '}
                          <span className="text-emerald-600 font-bold">LUNAS</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Daftar E-Tiket Terbit
                      </h4>
                      <div className="space-y-2">
                        {selectedEmail.ticketIds.map(tid => (
                          <div
                            key={tid}
                            className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                <Ticket className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-mono text-xs font-bold text-indigo-950">{tid}</span>
                                <p className="text-[11px] text-slate-500">QR Code Terenkripsi Aktif</p>
                              </div>
                            </div>
                            <button
                              id={`btn-open-ticket-from-email-${tid}`}
                              onClick={() => {
                                onViewTicket(tid);
                                onClose();
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Buka Tiket
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-4">
                      Sistem Otomatisasi TiketFest • Enkripsi Kriptografi SHA-256 • Bebas Calo
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Pilih email di sebelah kiri untuk membaca
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
