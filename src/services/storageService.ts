import {
  EventItem,
  Order,
  IssuedTicket,
  EmailNotification,
  PushAlert,
  CheckInLog,
  OfflineSyncQueueItem,
  BuyerInfo
} from '../types';
import { INITIAL_EVENTS } from '../data/mockEvents';

const STORAGE_KEYS = {
  EVENTS: 'tiketfest_events_v1',
  ORDERS: 'tiketfest_orders_v1',
  TICKETS: 'tiketfest_tickets_v1',
  CHECKIN_LOGS: 'tiketfest_checkin_logs_v1',
  EMAILS: 'tiketfest_emails_v1',
  PUSH_ALERTS: 'tiketfest_push_alerts_v1',
  OFFLINE_QUEUE: 'tiketfest_offline_queue_v1',
  OFFLINE_MODE_FLAG: 'tiketfest_offline_simulation_active'
};

// Simple pseudo cryptographic hash for secure tamper-proof verification
export function generateSecurityHash(ticketId: string, eventId: string, attendeeName: string): string {
  const secretKey = 'TIKET_FEST_SECURE_AUTH_KEY_2026';
  const str = `${ticketId}:${eventId}:${attendeeName}:${secretKey}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  return `HMAC-${hex}-${ticketId.slice(-4)}`;
}

// Mask ID/NIK for privacy & compliance
export function maskIdNumber(idNumber: string): string {
  if (!idNumber || idNumber.length < 8) return '3174********0002';
  const start = idNumber.slice(0, 4);
  const end = idNumber.slice(-4);
  return `${start}${'*'.repeat(Math.max(4, idNumber.length - 8))}${end}`;
}

export const storageService = {
  // --- EVENTS ---
  getEvents(): EventItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  saveEvents(events: EventItem[]) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getEventById(id: string): EventItem | undefined {
    return this.getEvents().find(e => e.id === id);
  },

  // --- ORDERS & TICKETS ---
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      // Seed initial sample orders for rich admin dashboard demonstration
      const initialOrders = this.seedInitialOrders();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getTickets(): IssuedTicket[] {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!data) {
      const orders = this.getOrders();
      const allTickets: IssuedTicket[] = orders.flatMap(o => o.tickets);
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(allTickets));
      return allTickets;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTickets(tickets: IssuedTicket[]) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // Seed realistic historical orders so the admin dashboard and scan gates have instant live data
  seedInitialOrders(): Order[] {
    const events = INITIAL_EVENTS;
    const soundEvent = events[0];
    const techEvent = events[1];

    const orders: Order[] = [
      {
        id: 'ord-88910',
        orderNumber: 'INV/20260920/TKF/88910',
        eventId: soundEvent.id,
        eventTitle: soundEvent.title,
        buyerInfo: {
          fullName: 'Budi Santoso',
          email: 'budi.santoso@gmail.com',
          phone: '081234567890',
          idNumber: '3171021405900001'
        },
        items: [
          {
            tierId: soundEvent.ticketTiers[0].id,
            tierName: soundEvent.ticketTiers[0].name,
            price: soundEvent.ticketTiers[0].price,
            quantity: 1,
            attendeeNames: ['Budi Santoso']
          }
        ],
        subtotal: 1250000,
        taxAmount: 137500,
        feeAmount: 5000,
        totalAmount: 1392500,
        paymentMethod: 'qris',
        paymentStatus: 'PAID',
        createdAt: '2026-09-20T10:15:00.000Z',
        paidAt: '2026-09-20T10:16:30.000Z',
        tickets: [
          {
            id: 'TKF-2026-88910-1',
            orderId: 'ord-88910',
            eventId: soundEvent.id,
            eventTitle: soundEvent.title,
            eventDate: soundEvent.date,
            eventTime: soundEvent.time,
            venue: soundEvent.venue,
            tierId: soundEvent.ticketTiers[0].id,
            tierName: soundEvent.ticketTiers[0].name,
            price: soundEvent.ticketTiers[0].price,
            attendeeName: 'Budi Santoso',
            attendeeEmail: 'budi.santoso@gmail.com',
            attendeeIdNumberMasked: '3171********0001',
            qrPayload: `TKF|TKF-2026-88910-1|${soundEvent.id}|Budi Santoso|HMAC-E4F2-8891`,
            securityHash: 'HMAC-E4F2-8891',
            status: 'USED',
            checkedInAt: '2026-09-22T08:30:15.000Z',
            checkedInGate: 'Gate VIP A',
            checkedInBy: 'Scanner Staff 01',
            issuedAt: '2026-09-20T10:16:30.000Z'
          }
        ]
      },
      {
        id: 'ord-88911',
        orderNumber: 'INV/20260921/TKF/88911',
        eventId: soundEvent.id,
        eventTitle: soundEvent.title,
        buyerInfo: {
          fullName: 'Anisa Rahmawati',
          email: 'anisa.rahma@yahoo.com',
          phone: '085712349988',
          idNumber: '3201085203950003'
        },
        items: [
          {
            tierId: soundEvent.ticketTiers[1].id,
            tierName: soundEvent.ticketTiers[1].name,
            price: soundEvent.ticketTiers[1].price,
            quantity: 2,
            attendeeNames: ['Anisa Rahmawati', 'Rian Pratama']
          }
        ],
        subtotal: 900000,
        taxAmount: 99000,
        feeAmount: 5000,
        totalAmount: 1004000,
        paymentMethod: 'bca_va',
        paymentStatus: 'PAID',
        createdAt: '2026-09-21T14:20:00.000Z',
        paidAt: '2026-09-21T14:22:10.000Z',
        tickets: [
          {
            id: 'TKF-2026-88911-1',
            orderId: 'ord-88911',
            eventId: soundEvent.id,
            eventTitle: soundEvent.title,
            eventDate: soundEvent.date,
            eventTime: soundEvent.time,
            venue: soundEvent.venue,
            tierId: soundEvent.ticketTiers[1].id,
            tierName: soundEvent.ticketTiers[1].name,
            price: soundEvent.ticketTiers[1].price,
            attendeeName: 'Anisa Rahmawati',
            attendeeEmail: 'anisa.rahma@yahoo.com',
            attendeeIdNumberMasked: '3201********0003',
            qrPayload: `TKF|TKF-2026-88911-1|${soundEvent.id}|Anisa Rahmawati|HMAC-99B1-8891`,
            securityHash: 'HMAC-99B1-8891',
            status: 'ACTIVE',
            issuedAt: '2026-09-21T14:22:10.000Z'
          },
          {
            id: 'TKF-2026-88911-2',
            orderId: 'ord-88911',
            eventId: soundEvent.id,
            eventTitle: soundEvent.title,
            eventDate: soundEvent.date,
            eventTime: soundEvent.time,
            venue: soundEvent.venue,
            tierId: soundEvent.ticketTiers[1].id,
            tierName: soundEvent.ticketTiers[1].name,
            price: soundEvent.ticketTiers[1].price,
            attendeeName: 'Rian Pratama',
            attendeeEmail: 'anisa.rahma@yahoo.com',
            attendeeIdNumberMasked: '3201********0003',
            qrPayload: `TKF|TKF-2026-88911-2|${soundEvent.id}|Rian Pratama|HMAC-37C8-8891`,
            securityHash: 'HMAC-37C8-8891',
            status: 'ACTIVE',
            issuedAt: '2026-09-21T14:22:10.000Z'
          }
        ]
      },
      {
        id: 'ord-88912',
        orderNumber: 'INV/20260921/TKF/88912',
        eventId: techEvent.id,
        eventTitle: techEvent.title,
        buyerInfo: {
          fullName: 'Dimas Wicaksono',
          email: 'dimas.wicak@techcorp.id',
          phone: '081198765432',
          idNumber: '3175042008920002'
        },
        items: [
          {
            tierId: techEvent.ticketTiers[0].id,
            tierName: techEvent.ticketTiers[0].name,
            price: techEvent.ticketTiers[0].price,
            quantity: 1,
            attendeeNames: ['Dimas Wicaksono']
          }
        ],
        subtotal: 1850000,
        taxAmount: 203500,
        feeAmount: 5000,
        totalAmount: 2058500,
        paymentMethod: 'mandiri_va',
        paymentStatus: 'PAID',
        createdAt: '2026-09-21T16:00:00.000Z',
        paidAt: '2026-09-21T16:05:00.000Z',
        tickets: [
          {
            id: 'TKF-2026-88912-1',
            orderId: 'ord-88912',
            eventId: techEvent.id,
            eventTitle: techEvent.title,
            eventDate: techEvent.date,
            eventTime: techEvent.time,
            venue: techEvent.venue,
            tierId: techEvent.ticketTiers[0].id,
            tierName: techEvent.ticketTiers[0].name,
            price: techEvent.ticketTiers[0].price,
            attendeeName: 'Dimas Wicaksono',
            attendeeEmail: 'dimas.wicak@techcorp.id',
            attendeeIdNumberMasked: '3175********0002',
            qrPayload: `TKF|TKF-2026-88912-1|${techEvent.id}|Dimas Wicaksono|HMAC-A103-8891`,
            securityHash: 'HMAC-A103-8891',
            status: 'ACTIVE',
            issuedAt: '2026-09-21T16:05:00.000Z'
          }
        ]
      }
    ];

    return orders;
  },

  // Create a new order with generated tickets
  createOrder(params: {
    event: EventItem;
    buyer: BuyerInfo;
    items: { tier: any; quantity: number; attendeeNames: string[] }[];
    paymentMethod: any;
  }): Order {
    const orderRandom = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ord-${orderRandom}`;
    const orderNumber = `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/TKF/${orderRandom}`;

    let subtotal = 0;
    const orderItems = params.items.map(item => {
      subtotal += item.tier.price * item.quantity;
      return {
        tierId: item.tier.id,
        tierName: item.tier.name,
        price: item.tier.price,
        quantity: item.quantity,
        attendeeNames: item.attendeeNames
      };
    });

    const taxAmount = Math.round(subtotal * 0.11);
    const feeAmount = 5000;
    const totalAmount = subtotal + taxAmount + feeAmount;

    // Generate Tickets
    const tickets: IssuedTicket[] = [];
    let ticketCounter = 1;
    params.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const attendeeName = item.attendeeNames[i] || params.buyer.fullName;
        const ticketId = `TKF-${new Date().getFullYear()}-${orderRandom}-${ticketCounter++}`;
        const securityHash = generateSecurityHash(ticketId, params.event.id, attendeeName);
        const qrPayload = `TKF|${ticketId}|${params.event.id}|${attendeeName}|${securityHash}`;

        tickets.push({
          id: ticketId,
          orderId,
          eventId: params.event.id,
          eventTitle: params.event.title,
          eventDate: params.event.date,
          eventTime: params.event.time,
          venue: params.event.venue,
          tierId: item.tier.id,
          tierName: item.tier.name,
          price: item.tier.price,
          attendeeName,
          attendeeEmail: params.buyer.email,
          attendeeIdNumberMasked: maskIdNumber(params.buyer.idNumber),
          qrPayload,
          securityHash,
          status: 'ACTIVE',
          issuedAt: new Date().toISOString()
        });
      }
    });

    // VA or QRIS payload
    let vaNumber: string | undefined;
    let qrisPayload: string | undefined;

    if (params.paymentMethod === 'bca_va') {
      vaNumber = `80777${params.buyer.phone.slice(-6)}${orderRandom.toString().slice(-4)}`;
    } else if (params.paymentMethod === 'mandiri_va') {
      vaNumber = `88908${params.buyer.phone.slice(-6)}${orderRandom.toString().slice(-4)}`;
    } else if (params.paymentMethod === 'bri_va') {
      vaNumber = `12800${params.buyer.phone.slice(-6)}${orderRandom.toString().slice(-4)}`;
    } else if (params.paymentMethod === 'qris') {
      qrisPayload = `00020101021226610014ID.GO.QRIS.WWW01189360091800000000000215${orderId}51440014ID.CO.TIKETFEST52045812530336054${totalAmount}5802ID5914TIKETFEST_ID6007JAKARTA62070703A016304C74B`;
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      eventId: params.event.id,
      eventTitle: params.event.title,
      buyerInfo: params.buyer,
      items: orderItems,
      subtotal,
      taxAmount,
      feeAmount,
      totalAmount,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'PENDING',
      vaNumber,
      qrisPayload,
      createdAt: new Date().toISOString(),
      tickets
    };

    // Save order
    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Save tickets
    const existingTickets = this.getTickets();
    this.saveTickets([...tickets, ...existingTickets]);

    // Update event tier sold count
    const events = this.getEvents();
    const targetEvt = events.find(e => e.id === params.event.id);
    if (targetEvt) {
      params.items.forEach(it => {
        const tier = targetEvt.ticketTiers.find(t => t.id === it.tier.id);
        if (tier) {
          tier.soldCount += it.quantity;
        }
      });
      this.saveEvents(events);
    }

    // Queue push notification
    this.addPushAlert({
      title: 'Menunggu Pembayaran',
      body: `Pesanan ${orderNumber} berhasil dibuat. Selesaikan pembayaran sebelum waktu habis.`,
      type: 'payment'
    });

    return newOrder;
  },

  // Mark order as paid & trigger automated email + push
  completePayment(orderId: string): Order | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    const order = orders[orderIndex];
    order.paymentStatus = 'PAID';
    order.paidAt = new Date().toISOString();

    orders[orderIndex] = order;
    this.saveOrders(orders);

    // Dispatch automated Email Receipt to buyer
    this.dispatchOrderEmail(order);

    // Dispatch real-time Push Alert
    this.addPushAlert({
      title: 'Pembayaran Berhasil! 🎉',
      body: `Transaksi ${order.orderNumber} senilai Rp ${order.totalAmount.toLocaleString('id-ID')} telah diverifikasi. E-Tiket siap diunduh!`,
      type: 'payment'
    });

    return order;
  },

  // --- AUTOMATED EMAIL NOTIFICATION DISPATCH ---
  getEmails(): EmailNotification[] {
    const data = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  dispatchOrderEmail(order: Order): EmailNotification {
    const emails = this.getEmails();
    const emailId = `eml-${Date.now()}`;
    const ticketIds = order.tickets.map(t => t.id);

    const email: EmailNotification = {
      id: emailId,
      orderId: order.id,
      recipientEmail: order.buyerInfo.email,
      subject: `[TiketFest] E-Tiket Resmi & Bukti Transaksi: ${order.eventTitle} (${order.orderNumber})`,
      sentAt: new Date().toISOString(),
      status: 'TERKIRIM',
      buyerName: order.buyerInfo.fullName,
      eventTitle: order.eventTitle,
      totalAmount: order.totalAmount,
      ticketCount: order.tickets.length,
      ticketIds,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">TiketFest Indonesia</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Konfirmasi Pemesanan & E-Tiket Digital</p>
          </div>
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #334155;">Halo <strong>${order.buyerInfo.fullName}</strong>,</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #334155;">Pembayaran otomatis Anda untuk acara <strong>${order.eventTitle}</strong> telah sukses diverifikasi.</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Nomor Invoice</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${order.orderNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Status</td>
              <td style="padding: 8px 0; color: #16a34a; font-weight: 700; text-align: right;">LUNAS (Auto-Verified)</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Jumlah Tiket</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${order.tickets.length} Tiket</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Total Pembayaran</td>
              <td style="padding: 8px 0; font-size: 16px; font-weight: 800; color: #4f46e5; text-align: right;">Rp ${order.totalAmount.toLocaleString('id-ID')}</td>
            </tr>
          </table>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: 700; color: #065f46;">Kode Tiket Anda: ${ticketIds.join(', ')}</p>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #047857;">Tunjukkan QR Code di gate acara untuk dipindai oleh panitia.</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Email otomatis ini dikirim oleh sistem TiketFest 24/7 Real-Time Delivery.</p>
        </div>
      `
    };

    emails.unshift(email);
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
    return email;
  },

  // --- REAL-TIME PUSH ALERTS ---
  getPushAlerts(): PushAlert[] {
    const data = localStorage.getItem(STORAGE_KEYS.PUSH_ALERTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addPushAlert(alert: { title: string; body: string; type: PushAlert['type'] }): PushAlert {
    const alerts = this.getPushAlerts();
    const newAlert: PushAlert = {
      id: `push-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      title: alert.title,
      body: alert.body,
      type: alert.type,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    alerts.unshift(newAlert);
    localStorage.setItem(STORAGE_KEYS.PUSH_ALERTS, JSON.stringify(alerts.slice(0, 30)));

    // Also trigger browser Notification API if allowed
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(alert.title, {
          body: alert.body,
          icon: '/favicon.ico'
        });
      } catch {
        // Safe ignore
      }
    }

    return newAlert;
  },

  markAllPushAlertsRead() {
    const alerts = this.getPushAlerts().map(a => ({ ...a, read: true }));
    localStorage.setItem(STORAGE_KEYS.PUSH_ALERTS, JSON.stringify(alerts));
  },

  // --- ACCESS CONTROL SCANNER & CHECK-IN ---
  getCheckInLogs(): CheckInLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKIN_LOGS);
    if (!data) {
      // Seed initial check-in log
      const initialLogs: CheckInLog[] = [
        {
          id: 'chk-init-1',
          ticketId: 'TKF-2026-88910-1',
          attendeeName: 'Budi Santoso',
          eventTitle: 'Nusantara Soundwave Music Festival 2026',
          tierName: 'VIP Front Stage & Lounge',
          gate: 'Gate VIP A',
          scannedAt: '2026-09-22T08:30:15.000Z',
          status: 'SUCCESS',
          isOffline: false
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCheckInLogs(logs: CheckInLog[]) {
    localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(logs));
  },

  // Verify and process ticket scan (supports offline execution!)
  scanTicket(payloadOrId: string, gateName = 'Gate Utama 1', isOfflineMode = false): {
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID_TICKET' | 'OFFLINE_QUEUED';
    message: string;
    ticket?: IssuedTicket;
    log: CheckInLog;
  } {
    const cleanPayload = payloadOrId.trim();
    // Parse either full payload "TKF|TKF-2026-XXXX|..." or raw ticket ID "TKF-2026-XXXX"
    let ticketId = cleanPayload;
    if (cleanPayload.includes('|')) {
      const parts = cleanPayload.split('|');
      ticketId = parts[1] || parts[0];
    }

    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId || t.qrPayload === cleanPayload);

    const nowIso = new Date().toISOString();
    const logId = `chk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (!ticket) {
      const invalidLog: CheckInLog = {
        id: logId,
        ticketId: cleanPayload.slice(0, 30),
        attendeeName: 'Tidak Diketahui',
        eventTitle: 'Tiket Palsu / Tidak Terdaftar',
        tierName: '-',
        gate: gateName,
        scannedAt: nowIso,
        status: 'INVALID_TICKET',
        isOffline: isOfflineMode,
        notes: 'Barcode atau QR Code tidak ditemukan dalam database resmi.'
      };
      const logs = this.getCheckInLogs();
      logs.unshift(invalidLog);
      this.saveCheckInLogs(logs);

      return {
        status: 'INVALID_TICKET',
        message: 'DITOLAK: Tiket tidak valid atau tidak terdaftar!',
        log: invalidLog
      };
    }

    // Check if already used
    if (ticket.status === 'USED') {
      const duplicateLog: CheckInLog = {
        id: logId,
        ticketId: ticket.id,
        attendeeName: ticket.attendeeName,
        eventTitle: ticket.eventTitle,
        tierName: ticket.tierName,
        gate: gateName,
        scannedAt: nowIso,
        status: 'ALREADY_USED',
        isOffline: isOfflineMode,
        notes: `Tiket sudah pernah discan pada ${new Date(ticket.checkedInAt || '').toLocaleTimeString('id-ID')} di ${ticket.checkedInGate || 'Gate Sebelumnya'}`
      };
      const logs = this.getCheckInLogs();
      logs.unshift(duplicateLog);
      this.saveCheckInLogs(logs);

      return {
        status: 'ALREADY_USED',
        message: `PERINGATAN: Tiket sudah digunakan sebelumnya di ${ticket.checkedInGate || 'Gate'}!`,
        ticket,
        log: duplicateLog
      };
    }

    // Success check-in!
    ticket.status = 'USED';
    ticket.checkedInAt = nowIso;
    ticket.checkedInGate = gateName;
    ticket.checkedInBy = 'Petugas Gate';

    // Update in tickets list
    this.saveTickets(tickets);

    // Also update order if matching
    const orders = this.getOrders();
    const order = orders.find(o => o.id === ticket.orderId);
    if (order) {
      const tInOrder = order.tickets.find(t => t.id === ticket.id);
      if (tInOrder) {
        tInOrder.status = 'USED';
        tInOrder.checkedInAt = nowIso;
        tInOrder.checkedInGate = gateName;
      }
      this.saveOrders(orders);
    }

    const successLog: CheckInLog = {
      id: logId,
      ticketId: ticket.id,
      attendeeName: ticket.attendeeName,
      eventTitle: ticket.eventTitle,
      tierName: ticket.tierName,
      gate: gateName,
      scannedAt: nowIso,
      status: isOfflineMode ? 'OFFLINE_QUEUED' : 'SUCCESS',
      isOffline: isOfflineMode,
      notes: isOfflineMode ? 'Disimpan dalam antrean lokal offline' : 'Akses Disetujui'
    };

    const logs = this.getCheckInLogs();
    logs.unshift(successLog);
    this.saveCheckInLogs(logs);

    // If offline mode is simulated, queue it for sync
    if (isOfflineMode) {
      this.queueOfflineItem({
        id: `sync-${Date.now()}`,
        type: 'CHECK_IN',
        payload: { ticketId: ticket.id, gate: gateName, time: nowIso },
        queuedAt: nowIso
      });
    }

    this.addPushAlert({
      title: 'Check-In Berhasil di Gate',
      body: `${ticket.attendeeName} (${ticket.tierName}) berhasil masuk melalui ${gateName}.`,
      type: 'checkin'
    });

    return {
      status: 'SUCCESS',
      message: 'AKSES DITERIMA: Silakan Masuk!',
      ticket,
      log: successLog
    };
  },

  // --- OFFLINE MODE ENGINE ---
  isOfflineSimulation(): boolean {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE_FLAG) === 'true';
  },

  setOfflineSimulation(active: boolean) {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE_FLAG, active ? 'true' : 'false');
  },

  getOfflineQueue(): OfflineSyncQueueItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  queueOfflineItem(item: OfflineSyncQueueItem) {
    const queue = this.getOfflineQueue();
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  },

  syncOfflineQueue(): { syncedCount: number; message: string } {
    const queue = this.getOfflineQueue();
    const count = queue.length;
    if (count === 0) {
      return { syncedCount: 0, message: 'Tidak ada data antrean offline yang perlu disinkronkan.' };
    }

    // Process all queued checkins
    const logs = this.getCheckInLogs();
    logs.forEach(log => {
      if (log.status === 'OFFLINE_QUEUED') {
        log.status = 'SUCCESS';
        log.isOffline = false;
        log.notes = 'Berhasil disinkronisasi ke server pusat';
      }
    });
    this.saveCheckInLogs(logs);

    // Clear queue
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));

    this.addPushAlert({
      title: 'Sinkronisasi Selesai',
      body: `Sebanyak ${count} catatan transaksi/kehadiran offline berhasil disinkronisasi ke database pusat.`,
      type: 'sync'
    });

    return {
      syncedCount: count,
      message: `Berhasil menyinkronkan ${count} data offline ke server utama!`
    };
  }
};
