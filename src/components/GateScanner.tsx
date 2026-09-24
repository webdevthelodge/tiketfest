import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Volume2,
  VolumeX,
  RefreshCw,
  Search,
  WifiOff,
  UserCheck,
  Building,
  Zap,
  Ticket
} from 'lucide-react';
import { IssuedTicket, CheckInLog } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface GateScannerProps {
  tickets: IssuedTicket[];
  isOffline: boolean;
  onRefreshData: () => void;
}

export function GateScanner({ tickets, isOffline, onRefreshData }: GateScannerProps) {
  const [selectedGate, setSelectedGate] = useState('Gate Utama A (Barat)');
  const [manualInput, setManualInput] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScanResult, setLastScanResult] = useState<{
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID_TICKET' | 'OFFLINE_QUEUED';
    message: string;
    ticket?: IssuedTicket;
    log: CheckInLog;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Statistics
  const totalTickets = tickets.length;
  const checkedInCount = tickets.filter(t => t.status === 'USED').length;
  const remainingCount = totalTickets - checkedInCount;
  const attendanceRate = totalTickets > 0 ? Math.round((checkedInCount / totalTickets) * 100) : 0;

  const recentLogs = storageService.getCheckInLogs().slice(0, 10);

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Kamera tidak didukung di peramban ini.');
      }
    } catch (err: any) {
      setCameraError('Izin kamera tidak diberikan atau perangkat kamera tidak ditemukan.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleProcessCode = (code: string) => {
    if (!code.trim()) return;

    const result = storageService.scanTicket(code.trim(), selectedGate, isOffline);
    setLastScanResult(result);
    setManualInput('');

    if (soundEnabled) {
      if (result.status === 'SUCCESS' || result.status === 'OFFLINE_QUEUED') {
        soundService.playSuccess();
      } else {
        soundService.playError();
      }
    }

    onRefreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header & Gate Selection */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Akses Kontrol & Pindai Gerbang Hari-H
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validasi tanda tangan digital QR Code secara real-time dengan proteksi duplikasi tiket & dukungan mode offline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Gate Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <select
              id="select-active-gate"
              value={selectedGate}
              onChange={e => setSelectedGate(e.target.value)}
              className="bg-transparent focus:outline-hidden text-xs font-bold text-slate-800"
            >
              <option value="Gate Utama A (Barat)">Gate Utama A (Barat)</option>
              <option value="Gate VIP Khusus 1">Gate VIP Khusus 1</option>
              <option value="Gate Festival B (Timur)">Gate Festival B (Timur)</option>
              <option value="Gate Media & Crew">Gate Media & Crew</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Attendance Counter Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Total Tiket Acara</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900">{totalTickets}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-emerald-600 font-medium block">Sudah Masuk (Checked In)</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600">{checkedInCount}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Belum Hadir</span>
          <span className="text-xl sm:text-2xl font-black text-slate-700">{remainingCount}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-indigo-600 font-medium block">Tingkat Kehadiran</span>
          <span className="text-xl sm:text-2xl font-black text-indigo-600">{attendanceRate}%</span>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm sm:text-base">Kamera Pindai QR Code</h3>
              </div>
              {isOffline && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                  <WifiOff className="w-3 h-3" /> Pindai Offline
                </span>
              )}
            </div>

            {/* Video Viewport / Simulator Screen */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border-2 border-slate-800">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-56 border-2 border-indigo-400/80 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-400" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-400" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-400" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-400" />
                      <div className="absolute inset-x-0 h-0.5 bg-indigo-400 shadow-[0_0_12px_#818cf8] animate-pulse" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <Camera className="w-12 h-12 text-slate-500 mx-auto stroke-1" />
                  <p className="text-xs text-slate-400 max-w-xs">
                    {cameraError ? cameraError : 'Arahkan kamera perangkat petugas ke QR Code pada tiket pengunjung.'}
                  </p>
                  <button
                    id="btn-start-camera"
                    onClick={startCamera}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Buka Kamera Perangkat
                  </button>
                </div>
              )}

              {isCameraActive && (
                <button
                  id="btn-stop-camera"
                  onClick={stopCamera}
                  className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 text-white rounded-lg text-xs font-semibold backdrop-blur-xs hover:bg-black/80"
                >
                  Tutup Kamera
                </button>
              )}
            </div>

            {/* Manual Ticket Input / Quick Demo Test */}
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <input
                  id="input-manual-ticket-code"
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleProcessCode(manualInput)}
                  placeholder="Ketik Kode Tiket (misal: TKF-2026-88910-1)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  id="btn-verify-manual-code"
                  onClick={() => handleProcessCode(manualInput)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0"
                >
                  Verifikasi
                </button>
              </div>

              {/* Quick Preset Buttons for rapid testing */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  🧪 Uji Pindai Instan (Demo Verifikasi):
                </span>
                <div className="flex flex-wrap gap-2">
                  {tickets.slice(0, 3).map((t, idx) => (
                    <button
                      key={t.id}
                      id={`btn-demo-scan-${idx}`}
                      onClick={() => handleProcessCode(t.qrPayload)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                        t.status === 'USED'
                          ? 'bg-amber-900/40 text-amber-300 border border-amber-700/50 hover:bg-amber-900/60'
                          : 'bg-indigo-900/50 text-indigo-200 border border-indigo-700/50 hover:bg-indigo-900/80'
                      }`}
                    >
                      {t.attendeeName} ({t.status === 'USED' ? 'Sudah Scan' : 'Aktif'})
                    </button>
                  ))}
                  <button
                    id="btn-demo-scan-fake"
                    onClick={() => handleProcessCode('TKF-FAKE-99999-PALSU')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-rose-900/40 text-rose-300 border border-rose-700/50 hover:bg-rose-900/60"
                  >
                    Tiket Palsu (Uji Ditolak)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Result Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dynamic Result Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Status Pemindaian Terakhir
            </h4>

            {lastScanResult ? (
              <div
                id="scan-result-card"
                className={`p-5 rounded-2xl border-2 transition-all ${
                  lastScanResult.status === 'SUCCESS' || lastScanResult.status === 'OFFLINE_QUEUED'
                    ? 'bg-emerald-50/80 border-emerald-400'
                    : lastScanResult.status === 'ALREADY_USED'
                    ? 'bg-amber-50/80 border-amber-400'
                    : 'bg-rose-50/80 border-rose-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {lastScanResult.status === 'SUCCESS' || lastScanResult.status === 'OFFLINE_QUEUED' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                  ) : lastScanResult.status === 'ALREADY_USED' ? (
                    <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wide block ${
                        lastScanResult.status === 'SUCCESS' || lastScanResult.status === 'OFFLINE_QUEUED'
                          ? 'text-emerald-700'
                          : lastScanResult.status === 'ALREADY_USED'
                          ? 'text-amber-800'
                          : 'text-rose-700'
                      }`}
                    >
                      {lastScanResult.status === 'SUCCESS' && 'AKSES DITERIMA (VERIFIED)'}
                      {lastScanResult.status === 'OFFLINE_QUEUED' && 'AKSES DITERIMA (TERSIMPAN OFFLINE)'}
                      {lastScanResult.status === 'ALREADY_USED' && 'PERINGATAN: TIKET SUDAH DIGUNAKAN'}
                      {lastScanResult.status === 'INVALID_TICKET' && 'AKSES DITOLAK: TIKET TIDAK VALID'}
                    </span>

                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {lastScanResult.log.attendeeName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lastScanResult.log.tierName} • {lastScanResult.log.eventTitle}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Kode Tiket:</span>
                        <strong className="font-mono text-slate-800">{lastScanResult.log.ticketId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Pintu Gerbang:</span>
                        <span>{lastScanResult.log.gate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Waktu Scan:</span>
                        <span>{new Date(lastScanResult.log.scannedAt).toLocaleTimeString('id-ID')}</span>
                      </div>
                      {lastScanResult.log.notes && (
                        <div className="mt-1 p-2 rounded-lg bg-white/70 text-slate-700 text-[11px] italic">
                          {lastScanResult.log.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">Menunggu Pemindaian Pertama</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Arahkan kamera ke QR tiket atau klik salah satu tombol uji demo di atas.
                </p>
              </div>
            )}
          </div>

          {/* Recent Gate Logs Table */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Riwayat Pindai Terkini
              </h4>
              <span className="text-[11px] text-slate-400">Gate Real-Time Feed</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-slate-100">
              {recentLogs.map(log => (
                <div key={log.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{log.attendeeName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          log.status === 'SUCCESS' || log.status === 'OFFLINE_QUEUED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : log.status === 'ALREADY_USED'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {log.status === 'OFFLINE_QUEUED' ? 'OFFLINE' : log.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.ticketId} • {log.gate}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.scannedAt).toLocaleTimeString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
