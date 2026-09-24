import { useState } from 'react';
import {
  X,
  Shield,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Lock,
  UserCheck,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { EventItem, TicketTier, BuyerInfo, PaymentMethodType } from '../types';

interface CheckoutModalProps {
  event: EventItem;
  selectedTiers: { tier: TicketTier; quantity: number }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitCheckout: (params: {
    buyer: BuyerInfo;
    items: { tier: TicketTier; quantity: number; attendeeNames: string[] }[];
    paymentMethod: PaymentMethodType;
  }) => void;
}

export function CheckoutModal({
  event,
  selectedTiers,
  isOpen,
  onClose,
  onSubmitCheckout
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState('Ananda Bagas Pratama');
  const [email, setEmail] = useState('bagas.pratama@gmail.com');
  const [phone, setPhone] = useState('081298765432');
  const [idNumber, setIdNumber] = useState('3174021809980004'); // NIK KTP
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Collect attendee names if multiple tickets
  const totalTicketCount = selectedTiers.reduce((s, it) => s + it.quantity, 0);
  const [attendeeNames, setAttendeeNames] = useState<string[]>(() =>
    Array(totalTicketCount).fill('').map((_, idx) => (idx === 0 ? 'Ananda Bagas Pratama' : `Peserta ${idx + 1}`))
  );

  if (!isOpen) return null;

  const subtotal = selectedTiers.reduce((sum, item) => sum + item.tier.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.11);
  const adminFee = 5000;
  const grandTotal = subtotal + tax + adminFee;

  const handleAttendeeChange = (index: number, val: string) => {
    const updated = [...attendeeNames];
    updated[index] = val;
    setAttendeeNames(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi sesuai KTP';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Format email tidak valid';
    if (!phone.trim() || phone.length < 9) newErrors.phone = 'Nomor WhatsApp tidak valid (min 9 digit)';
    if (!idNumber.trim() || idNumber.length < 10) newErrors.idNumber = 'NIK/No. Identitas wajib diisi (min 10 digit)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Distribute attendee names to items
    let namePointer = 0;
    const itemsWithAttendees = selectedTiers.map(item => {
      const names: string[] = [];
      for (let i = 0; i < item.quantity; i++) {
        names.push(attendeeNames[namePointer] || fullName);
        namePointer++;
      }
      return {
        tier: item.tier,
        quantity: item.quantity,
        attendeeNames: names
      };
    });

    onSubmitCheckout({
      buyer: { fullName, email, phone, idNumber },
      items: itemsWithAttendees,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="checkout-modal-container"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                Checkout & Data Pemesan
              </span>
              <span className="text-xs text-slate-400">Step 2 of 3</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1">{event.title}</h3>
          </div>
          <button
            id="btn-close-checkout-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Security Banner */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-emerald-900">
              <strong className="block font-semibold">Keamanan Data Terenkripsi:</strong>
              Data identitas (NIK) Anda dilindungi dengan standar enkripsi kriptografi untuk mencegah duplikasi dan tiket palsu.
            </div>
          </div>

          {/* Buyer Details Form */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" /> Informasi Pembeli
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-buyer-fullname"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Contoh: Ananda Bagas Pratama"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Notifikasi E-Tiket <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-buyer-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email.anda@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-buyer-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIK / No. KTP / Paspor <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-buyer-idnumber"
                  type="text"
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder="3174xxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                />
                {errors.idNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.idNumber}</p>}
              </div>
            </div>
          </div>

          {/* Multiple Attendee Names if quantity > 1 */}
          {totalTicketCount > 1 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nama Pemegang Masing-Masing Tiket ({totalTicketCount} Orang)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: totalTicketCount }).map((_, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Nama Pengunjung #{idx + 1}
                    </label>
                    <input
                      id={`input-attendee-name-${idx}`}
                      type="text"
                      value={attendeeNames[idx] || ''}
                      onChange={e => handleAttendeeChange(idx, e.target.value)}
                      placeholder={`Nama lengkap tiket #${idx + 1}`}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pilih Metode Pembayaran Otomatis
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'qris', name: 'QRIS (Semua Bank)', icon: QrCode, badge: 'Paling Populer' },
                { id: 'bca_va', name: 'BCA Virtual Account', icon: Building2, badge: 'Otomatis' },
                { id: 'mandiri_va', name: 'Mandiri VA', icon: Building2, badge: 'Otomatis' },
                { id: 'bri_va', name: 'BRI Virtual Account', icon: Building2, badge: 'Otomatis' },
                { id: 'gopay', name: 'GoPay / GoPay Later', icon: Wallet, badge: 'Instan' },
                { id: 'dana', name: 'DANA E-Wallet', icon: Wallet, badge: 'Instan' }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethodType)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {method.badge}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Tiket ({totalTicketCount} item)</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>PPN 11%</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Layanan & Otomatisasi Sistem</span>
              <span>Rp {adminFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Pembayaran</span>
              <span className="text-indigo-600 text-base font-extrabold">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="btn-proceed-to-payment"
            type="submit"
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 text-sm"
          >
            <Lock className="w-4 h-4" />
            <span>Bayar Sekarang (Rp {grandTotal.toLocaleString('id-ID')})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
