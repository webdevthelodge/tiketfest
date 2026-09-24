import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { EventCatalog } from './components/EventCatalog';
import { EventDetailModal } from './components/EventDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentModal } from './components/PaymentModal';
import { TicketPassModal } from './components/TicketPassModal';
import { GateScanner } from './components/GateScanner';
import { AdminDashboard } from './components/AdminDashboard';
import { MyTicketsView } from './components/MyTicketsView';
import { EmailInboxModal } from './components/EmailInboxModal';
import { PushNotificationCenter } from './components/PushNotificationCenter';
import { storageService } from './services/storageService';
import {
  EventItem,
  TicketTier,
  Order,
  IssuedTicket,
  CheckInLog,
  EmailNotification,
  PushAlert,
  BuyerInfo,
  PaymentMethodType
} from './types';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'catalog' | 'mytickets' | 'scanner' | 'admin'>('catalog');

  // Core Data
  const [events, setEvents] = useState<EventItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<IssuedTicket[]>([]);
  const [logs, setLogs] = useState<CheckInLog[]>([]);
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [pushAlerts, setPushAlerts] = useState<PushAlert[]>([]);

  // Offline Engine State
  const [isOffline, setIsOffline] = useState<boolean>(() => storageService.isOfflineSimulation());
  const [queueCount, setQueueCount] = useState<number>(0);

  // Active Modals & Flow
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  const [checkoutTiers, setCheckoutTiers] = useState<{ tier: TicketTier; quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [activePendingOrder, setActivePendingOrder] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [selectedTicketPass, setSelectedTicketPass] = useState<IssuedTicket | null>(null);
  const [isTicketPassOpen, setIsTicketPassOpen] = useState(false);

  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [isPushDrawerOpen, setIsPushDrawerOpen] = useState(false);

  // Toast notification state
  const [activeToast, setActiveToast] = useState<PushAlert | null>(null);

  // Load all initial state from storage
  const loadData = useCallback(() => {
    setEvents(storageService.getEvents());
    setOrders(storageService.getOrders());
    setTickets(storageService.getTickets());
    setLogs(storageService.getCheckInLogs());
    setEmails(storageService.getEmails());
    setPushAlerts(storageService.getPushAlerts());
    setQueueCount(storageService.getOfflineQueue().length);
    setIsOffline(storageService.isOfflineSimulation());
  }, []);

  useEffect(() => {
    loadData();

    // Listen to window online/offline events as well
    const handleOnline = () => {
      // If native online fired, check if simulation is inactive
      if (!storageService.isOfflineSimulation()) {
        setIsOffline(false);
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData]);

  // Toggle offline simulation
  const handleToggleOffline = () => {
    const nextVal = !isOffline;
    setIsOffline(nextVal);
    storageService.setOfflineSimulation(nextVal);
    storageService.addPushAlert({
      title: nextVal ? 'Beralih ke Mode Offline' : 'Terkoneksi Kembali ke Internet',
      body: nextVal
        ? 'Aplikasi berjalan dalam mode offline lokal. Validasi tiket tetap dapat dilakukan secara aman.'
        : 'Jaringan online kembali aktif. Data dapat disinkronkan ke server pusat.',
      type: 'sync'
    });
    loadData();
  };

  // Sync offline queue
  const handleSyncOfflineQueue = () => {
    const res = storageService.syncOfflineQueue();
    loadData();
    alert(res.message);
  };

  // Step 1: Click an event to view details
  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  // Step 2: From event details, proceed to checkout with chosen tiers
  const handleProceedToCheckout = (tiers: { tier: TicketTier; quantity: number }[]) => {
    setCheckoutTiers(tiers);
    setIsEventDetailOpen(false);
    setIsCheckoutOpen(true);
  };

  // Step 3: From checkout form, create order and open automated payment gateway
  const handleSubmitCheckout = (params: {
    buyer: BuyerInfo;
    items: { tier: TicketTier; quantity: number; attendeeNames: string[] }[];
    paymentMethod: PaymentMethodType;
  }) => {
    if (!selectedEvent) return;

    const newOrder = storageService.createOrder({
      event: selectedEvent,
      buyer: params.buyer,
      items: params.items,
      paymentMethod: params.paymentMethod
    });

    setIsCheckoutOpen(false);
    setActivePendingOrder(newOrder);
    setIsPaymentOpen(true);
    loadData();

    // Trigger toast alert
    showToast({
      id: `toast-${Date.now()}`,
      title: 'Menunggu Pembayaran',
      body: `Invoice ${newOrder.orderNumber} diterbitkan. Selesaikan pembayaran sebelum waktu habis.`,
      time: 'Baru saja',
      type: 'payment',
      read: false
    });
  };

  // Step 4: Automated payment verified
  const handlePaymentSuccess = (paidOrder: Order) => {
    setIsPaymentOpen(false);
    loadData();

    // Open first issued ticket pass directly
    if (paidOrder.tickets.length > 0) {
      setSelectedTicketPass(paidOrder.tickets[0]);
      setIsTicketPassOpen(true);
    }

    // Trigger toast notification
    showToast({
      id: `toast-${Date.now()}`,
      title: 'Pembayaran Otomatis Berhasil! 🎉',
      body: `E-Tiket & bukti invoice resmi telah dikirimkan ke email ${paidOrder.buyerInfo.email}`,
      time: 'Baru saja',
      type: 'payment',
      read: false
    });
  };

  const showToast = (alertItem: PushAlert) => {
    setActiveToast(alertItem);
    setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  // Helper to open ticket pass by ID (e.g. from email inbox or admin table)
  const handleOpenTicketPassById = (ticketId: string) => {
    const allTix = storageService.getTickets();
    const found = allTix.find(t => t.id === ticketId);
    if (found) {
      setSelectedTicketPass(found);
      setIsTicketPassOpen(true);
    }
  };

  const unreadPushCount = pushAlerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Offline Status Bar */}
      <OfflineBanner
        isOffline={isOffline}
        queueCount={queueCount}
        onSync={handleSyncOfflineQueue}
        onToggleOffline={handleToggleOffline}
      />

      {/* Main Responsive Header */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        ticketCount={tickets.length}
        emailCount={emails.length}
        unreadPushCount={unreadPushCount}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
        onOpenPushDrawer={() => setIsPushDrawerOpen(true)}
      />

      {/* Toast Notification Alert */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-slideUp">
          <div className="p-2 bg-indigo-600 rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-white mb-0.5">{activeToast.title}</h4>
            <p className="text-slate-300 leading-relaxed">{activeToast.body}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'catalog' && (
          <EventCatalog events={events} onSelectEvent={handleSelectEvent} />
        )}

        {currentTab === 'mytickets' && (
          <MyTicketsView
            tickets={tickets}
            onOpenTicketPass={t => {
              setSelectedTicketPass(t);
              setIsTicketPassOpen(true);
            }}
            onExploreEvents={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'scanner' && (
          <GateScanner
            tickets={tickets}
            isOffline={isOffline}
            onRefreshData={loadData}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            tickets={tickets}
            logs={logs}
            events={events}
            onViewTicket={t => {
              setSelectedTicketPass(t);
              setIsTicketPassOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TiketFest Official</span>
            <span>•</span>
            <span>Enkripsi Kriptografi SHA-256</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Akses Gerbang Aman
            </span>
          </div>
          <div>© {new Date().getFullYear()} TiketFest Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Event Detail & Tier Stepper Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => setIsEventDetailOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 2. Checkout Modal with Buyer Details & Payment Method Choice */}
      {selectedEvent && (
        <CheckoutModal
          event={selectedEvent}
          selectedTiers={checkoutTiers}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSubmitCheckout={handleSubmitCheckout}
        />
      )}

      {/* 3. Automated Payment Gateway Simulation Modal */}
      <PaymentModal
        order={activePendingOrder}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 4. Digital E-Ticket Pass Voucher (Print & PDF) */}
      <TicketPassModal
        ticket={selectedTicketPass}
        isOpen={isTicketPassOpen}
        onClose={() => setIsTicketPassOpen(false)}
      />

      {/* 5. Real-Time Email Delivery Inbox Simulation Modal */}
      <EmailInboxModal
        emails={emails}
        isOpen={isEmailInboxOpen}
        onClose={() => setIsEmailInboxOpen(false)}
        onViewTicket={handleOpenTicketPassById}
      />

      {/* 6. Push Notification Center Drawer */}
      <PushNotificationCenter
        alerts={pushAlerts}
        isOpen={isPushDrawerOpen}
        onClose={() => setIsPushDrawerOpen(false)}
        onMarkAllRead={() => {
          storageService.markAllPushAlertsRead();
          loadData();
        }}
      />
    </div>
  );
}
