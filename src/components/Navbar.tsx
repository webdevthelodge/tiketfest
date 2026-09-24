import {
  Ticket,
  Compass,
  ShieldCheck,
  BarChart3,
  Mail,
  Bell,
  Wifi,
  WifiOff,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentTab: 'catalog' | 'mytickets' | 'scanner' | 'admin';
  onChangeTab: (tab: 'catalog' | 'mytickets' | 'scanner' | 'admin') => void;
  ticketCount: number;
  emailCount: number;
  unreadPushCount: number;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenEmailInbox: () => void;
  onOpenPushDrawer: () => void;
}

export function Navbar({
  currentTab,
  onChangeTab,
  ticketCount,
  emailCount,
  unreadPushCount,
  isOffline,
  onToggleOffline,
  onOpenEmailInbox,
  onOpenPushDrawer
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => onChangeTab('catalog')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">TiketFest</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
                ID
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Sistem Pembelian & Akses Kontrol Event
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <button
            id="nav-tab-catalog"
            onClick={() => onChangeTab('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'catalog'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Jelajah Event</span>
          </button>

          <button
            id="nav-tab-mytickets"
            onClick={() => onChangeTab('mytickets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'mytickets'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>E-Tiket Saya</span>
            {ticketCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
                {ticketCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-scanner"
            onClick={() => onChangeTab('scanner')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'scanner'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Akses Kontrol Hari-H</span>
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => onChangeTab('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard Admin</span>
          </button>
        </nav>

        {/* Action Badges & Utilities */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Toggle Button */}
          <button
            id="btn-nav-offline-toggle"
            onClick={onToggleOffline}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOffline
                ? 'bg-amber-500/10 text-amber-700 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Simulasi Mode Offline (Bekerja tanpa internet)"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>

          {/* Email Notifications Button */}
          <button
            id="btn-open-email-inbox"
            onClick={onOpenEmailInbox}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 relative transition-colors"
            title="Pusat Notifikasi Email Real-Time"
          >
            <Mail className="w-4 h-4" />
            {emailCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                {emailCount}
              </span>
            )}
          </button>

          {/* Push Notification Bell */}
          <button
            id="btn-open-push-drawer"
            onClick={onOpenPushDrawer}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 relative transition-colors"
            title="Notifikasi Push Real-Time"
          >
            <Bell className="w-4 h-4" />
            {unreadPushCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadPushCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="btn-toggle-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1.5 shadow-lg">
          <button
            onClick={() => {
              onChangeTab('catalog');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
              currentTab === 'catalog' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" /> Jelajah Event
          </button>
          <button
            onClick={() => {
              onChangeTab('mytickets');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
              currentTab === 'mytickets' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4" /> E-Tiket Saya
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs">
              {ticketCount}
            </span>
          </button>
          <button
            onClick={() => {
              onChangeTab('scanner');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
              currentTab === 'scanner' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Akses Kontrol Hari-H
          </button>
          <button
            onClick={() => {
              onChangeTab('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
              currentTab === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Dashboard Admin & Analitik
          </button>
        </div>
      )}
    </header>
  );
}
