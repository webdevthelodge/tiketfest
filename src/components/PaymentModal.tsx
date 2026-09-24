import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { Order } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface PaymentModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paidOrder: Order) => void;
}

export function PaymentModal({ order, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrisImage, setQrisImage] = useState<string>('');

  useEffect(() => {
    if (order && order.paymentMethod === 'qris') {
      const payload = order.qrisPayload || `QRIS.TIKETFEST.${order.id}.${order.totalAmount}`;
      QRCode.toDataURL(payload, {
        width: 260,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(url => setQrisImage(url));
    }
  }, [order]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate automated payment gateway callback
  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedOrder = storageService.completePayment(order.id);
      setIsProcessing(false);
      soundService.playPaymentSuccess();

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe ignore
      }

      if (updatedOrder) {
        onPaymentSuccess(updatedOrder);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="payment-modal-container"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
      >
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Selesaikan Pembayaran</h3>
              <p className="text-[11px] text-slate-500 font-mono">{order.orderNumber}</p>
            </div>
          </div>
          <button
            id="btn-close-payment-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Countdown & Total Amount Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Total yang Harus Dibayar</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-600">
                Rp {order.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium justify-end">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Batas Waktu</span>
              </div>
              <span className="font-mono text-base font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                {timeFormatted}
              </span>
            </div>
          </div>

          {/* Payment Method Details */}
          {order.paymentMethod === 'qris' && (
            <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs mb-3">
                <QrCode className="w-4 h-4" /> QRIS Standar Bank Indonesia
              </div>

              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                {qrisImage ? (
                  <img src={qrisImage} alt="QRIS Code" className="w-48 h-48 object-contain" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-xs text-slate-400">
                    Memuat QRIS...
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 font-medium mt-3">
                Scan QRIS di atas dengan GoPay, OVO, BCA Mobile, Livin Mandiri, atau aplikasi e-wallet apa pun.
              </p>
            </div>
          )}

          {(order.paymentMethod === 'bca_va' ||
            order.paymentMethod === 'mandiri_va' ||
            order.paymentMethod === 'bri_va') && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {order.paymentMethod === 'bca_va' && 'BCA Virtual Account'}
                  {order.paymentMethod === 'mandiri_va' && 'Mandiri Virtual Account'}
                  {order.paymentMethod === 'bri_va' && 'BRI Virtual Account (BRIVA)'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold">
                  Otomatis
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nomor Virtual Account</span>
                  <span className="font-mono text-base font-black text-slate-900">
                    {order.vaNumber || '8077708123456987'}
                  </span>
                </div>
                <button
                  id="btn-copy-va-number"
                  onClick={() => copyToClipboard(order.vaNumber || '8077708123456987')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <p>1. Buka Mobile Banking atau ATM bank pilihan Anda.</p>
                <p>2. Pilih menu <strong>Transfer / Pembayaran &gt; Virtual Account</strong>.</p>
                <p>3. Masukkan nomor VA di atas dan konfirmasi nama pembeli serta nominal.</p>
              </div>
            </div>
          )}

          {(order.paymentMethod === 'gopay' || order.paymentMethod === 'dana') && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <Wallet className="w-8 h-8 text-indigo-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">
                Hubungkan ke {order.paymentMethod === 'gopay' ? 'GoPay' : 'DANA'}
              </h4>
              <p className="text-xs text-slate-500">
                Tekan tombol verifikasi di bawah untuk menyimulasikan konfirmasi saldo dompet digital Anda.
              </p>
            </div>
          )}

          {/* Automated Payment Sandbox / Simulation trigger */}
          <div className="pt-2">
            <button
              id="btn-trigger-instant-payment"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isProcessing ? 'Memverifikasi Pembayaran Otomatis...' : 'Simulasi Pembayaran Otomatis (Instan)'}
              </span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Pembayaran otomatis diverifikasi sistem dalam 1-3 detik tanpa unggah bukti manual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
