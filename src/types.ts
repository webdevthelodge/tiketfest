export type EventCategory = 'Semua' | 'Konser Musik' | 'Konferensi Teknologi' | 'Workshop & Edukasi' | 'Olahraga' | 'Seni & Budaya';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  quota: number;
  soldCount: number;
  perks: string[];
  color: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  city: string;
  description: string;
  lineup: string[];
  bannerUrl: string;
  organizer: string;
  terms: string[];
  ticketTiers: TicketTier[];
}

export type PaymentMethodType = 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'gopay' | 'dana' | 'cc';

export interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string; // NIK/KTP terenkripsi
}

export interface IssuedTicket {
  id: string; // e.g. TKF-2026-8849
  orderId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  tierId: string;
  tierName: string;
  price: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeeIdNumberMasked: string;
  qrPayload: string;
  securityHash: string;
  status: 'ACTIVE' | 'USED' | 'CANCELLED';
  checkedInAt?: string;
  checkedInGate?: string;
  checkedInBy?: string;
  issuedAt: string;
}

export interface OrderItem {
  tierId: string;
  tierName: string;
  price: number;
  quantity: number;
  attendeeNames: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  eventId: string;
  eventTitle: string;
  buyerInfo: BuyerInfo;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number; // 11% PPN
  feeAmount: number; // Rp 5.000 biaya admin
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'PENDING' | 'PAID' | 'EXPIRED';
  vaNumber?: string;
  qrisPayload?: string;
  createdAt: string;
  paidAt?: string;
  tickets: IssuedTicket[];
}

export interface EmailNotification {
  id: string;
  orderId: string;
  recipientEmail: string;
  subject: string;
  sentAt: string;
  status: 'TERKIRIM' | 'DIBACA';
  buyerName: string;
  eventTitle: string;
  totalAmount: number;
  ticketCount: number;
  ticketIds: string[];
  htmlContent: string;
}

export interface PushAlert {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'payment' | 'checkin' | 'event' | 'sync' | 'security';
  read: boolean;
}

export interface CheckInLog {
  id: string;
  ticketId: string;
  attendeeName: string;
  eventTitle: string;
  tierName: string;
  gate: string;
  scannedAt: string;
  status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID_TICKET' | 'OFFLINE_QUEUED';
  isOffline: boolean;
  notes?: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  type: 'CHECK_IN' | 'ORDER';
  payload: any;
  queuedAt: string;
}
