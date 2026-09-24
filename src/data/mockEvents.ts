import { EventItem } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-soundwave-2026',
    title: 'Nusantara Soundwave Music Festival 2026',
    category: 'Konser Musik',
    date: '2026-10-17',
    time: '15:00 - 23:30 WIB',
    venue: 'Stadion Madya Gelora Bung Karno',
    city: 'Jakarta Pusat',
    description: 'Festival musik akbar tahunan yang mempertemukan kolaborasi musisi pop, indie, dan elektronika ternama nusantara. Menghadirkan 3 panggung megah, instalasi cahaya imersif, dan 50+ kuliner artisan lokal.',
    lineup: ['Sheila On 7', 'Hindia', 'Barasuara', 'Nadin Amizah', 'Diskoria x Fariz RM', 'Isyana Sarasvati'],
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Nusantara Live Experience',
    terms: [
      'Wajib membawa kartu identitas (KTP/SIM/Paspor) yang masih berlaku sesuai nama pada tiket.',
      'Satu QR Code berlaku untuk satu kali masuk per pemegang tiket (1 scan per person).',
      'Dilarang membawa senjata tajam, kembang api, makanan/minuman dari luar, dan kamera profesional (DSLR/Mirrorless).',
      'Tiket yang sudah dibeli bersifat non-refundable kecuali terjadi pembatalan resmi dari pihak penyelenggara.'
    ],
    ticketTiers: [
      {
        id: 'tier-sound-vip',
        name: 'VIP Front Stage & Lounge',
        price: 1250000,
        description: 'Akses panggung paling depan, AC VIP Lounge, free-flow mocktails, dan fast-track gate khusus.',
        quota: 300,
        soldCount: 245,
        perks: ['Akses Paling Depan Panggung', 'VIP Air-Conditioned Lounge', 'Exclusive Lanyard & Merchandise', 'Jalur Masuk Ekspres Khusus'],
        color: 'indigo'
      },
      {
        id: 'tier-sound-early',
        name: 'Early Bird Festival',
        price: 450000,
        description: 'Harga spesial terbatas untuk kamu yang siap berpesta lebih awal. Akses seluruh panggung festival.',
        quota: 800,
        soldCount: 780,
        perks: ['Akses Semua Panggung (Stage A, B, C)', 'Area Festival Standing', 'Bebas Masuk Kapan Saja'],
        color: 'emerald'
      },
      {
        id: 'tier-sound-regular',
        name: 'Regular General Festival',
        price: 650000,
        description: 'Tiket standar festival untuk akses bebas ke seluruh panggung utama dan area bazaar kuliner.',
        quota: 2500,
        soldCount: 1650,
        perks: ['Akses Semua Panggung', 'Area Festival Berdiri', 'Kupon Diskon Merchandise Rp 25.000'],
        color: 'sky'
      }
    ]
  },
  {
    id: 'evt-tech-summit-2026',
    title: 'Indonesia Future Tech Summit 2026',
    category: 'Konferensi Teknologi',
    date: '2026-11-05',
    time: '08:30 - 17:30 WIB',
    venue: 'Indonesia Convention Exhibition (ICE) BSD City Hall 1-3',
    city: 'Tangerang',
    description: 'Konferensi teknologi terbesar Asia Tenggara yang membahas Artificial Intelligence, Cloud Infrastructure, Cyber Security, dan Startup Scalability bersama 40+ pembicara kelas dunia dari unicorn dan tech giants.',
    lineup: ['VP of Engineering Google', 'CTO GoTo Financial', 'Director of AI Research', 'Head of Security Bukalapak'],
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: 'TechAsia & Kemenparekraf',
    terms: [
      'Tiket mencakup akses seluruh sesi keynote, workshop panel, networking lunch, dan sertifikat digital berlisensi.',
      'Harap tiba 30 menit sebelum registrasi dibuka untuk penukaran badge fisik di Gate 1.',
      'Sertifikat keikutsertaan akan dikirimkan otomatis ke email setelah acara selesai.'
    ],
    ticketTiers: [
      {
        id: 'tier-tech-all',
        name: 'All-Access Pass (2 Days + Dinner)',
        price: 1850000,
        description: 'Akses penuh seluruh breakout session, networking dinner eksklusif bersama pembicara & C-Level.',
        quota: 400,
        soldCount: 290,
        perks: ['Keynote & 12 Breakout Rooms', 'VIP Networking Dinner', 'Exclusive Swag Bag & USB Key', 'Sertifikat Digital Terverifikasi'],
        color: 'purple'
      },
      {
        id: 'tier-tech-standard',
        name: 'Conference Standard Pass',
        price: 950000,
        description: 'Akses seluruh sesi presentasi panggung utama, expo area, dan lunch buffet harian.',
        quota: 1200,
        soldCount: 820,
        perks: ['Akses Main Stage & Exhibition Hall', 'Buffet Lunch & Coffee Break 2x', 'Digital Conference Kit'],
        color: 'blue'
      },
      {
        id: 'tier-tech-student',
        name: 'Student & Academic Pass',
        price: 350000,
        description: 'Tarif khusus pelajar/mahasiswa aktif untuk mendorong riset dan talenta digital muda.',
        quota: 300,
        soldCount: 260,
        perks: ['Akses Main Stage', 'Sertifikat Digital Mahasiswa', 'Career Booth Networking'],
        color: 'amber'
      }
    ]
  },
  {
    id: 'evt-indie-harmony-2026',
    title: 'Senja & Suara: Acoustic & Indie Night',
    category: 'Konser Musik',
    date: '2026-10-24',
    time: '17:00 - 22:30 WIB',
    venue: 'Amphitheater Tebing Breksi',
    city: 'Yogyakarta',
    description: 'Menikmati syahdunya senja dan malam bertabur bintang dengan alunan petikan gitar dan lantunan lirik puitis di salah satu lanskap alam paling ikonik di Yogyakarta.',
    lineup: ['Fourtwnty', 'Fiersa Besari', 'Danilla', 'Sal Priadi', 'Soegi Bornean'],
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Senja Karsa Production',
    terms: [
      'Pengunjung disarankan membawa jaket tebal atau selimut karena angin perbukitan pada malam hari.',
      'Kamera saku diperbolehkan, dilarang menyalakan laser pointer atau drone tanpa izin.',
      'Disediakan shuttle bus gratis dari area parkir bawah ke puncak amphiteater.'
    ],
    ticketTiers: [
      {
        id: 'tier-senja-tribun',
        name: 'Tribun VIP Seated (Numbered)',
        price: 450000,
        description: 'Tempat duduk bernomor di undakan batu tengah dengan pemandangan panggung terbaik & complimentary hot drink.',
        quota: 500,
        soldCount: 420,
        perks: ['Kursi Bernomor Khusus', 'Welcome Drink Jahe Hangat & Snack', 'Best Panoramic Stage View'],
        color: 'rose'
      },
      {
        id: 'tier-senja-lesehan',
        name: 'Picnic Lawn Lesehan',
        price: 250000,
        description: 'Area rumput terbuka santai bersama teman-teman beralaskan matras piknik.',
        quota: 1000,
        soldCount: 890,
        perks: ['Area Lesehan Terbuka', 'Matras Piknik Dipinjamkan', 'Stiker Eksklusif Festival'],
        color: 'emerald'
      }
    ]
  },
  {
    id: 'evt-creative-workshop-2026',
    title: 'UI/UX & AI Product Design Masterclass',
    category: 'Workshop & Edukasi',
    date: '2026-11-14',
    time: '09:00 - 16:00 WIB',
    venue: 'GoWork Coworking Space Plaza Indonesia',
    city: 'Jakarta Pusat',
    description: 'Workshop interaktif intensif 1 hari penuh untuk menguasai workflow desain produk modern berbasis AI Generatif, Design System bertaraf enterprise, dan studi kasus real-world fintech.',
    lineup: ['Principal Designer GoTo', 'Lead Product Designer Tokopedia', 'Design Systems Specialist'],
    bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    organizer: 'DesignKarya Academy',
    terms: [
      'Peserta wajib membawa laptop masing-masing dengan software Figma terinstal.',
      'Kapasitas sangat terbatas untuk menjaga efektivitas mentoring 1-on-1.',
      'Mendapatkan sertifikat fisik dan digital portofolio review.'
    ],
    ticketTiers: [
      {
        id: 'tier-ui-exclusive',
        name: 'Exclusive Seat (Mentoring + Portfolio Review)',
        price: 850000,
        description: 'Sesi workshop lengkap, hands-on project, review portofolio langsung dari mentor, dan lunch catering hotel bintang 5.',
        quota: 60,
        soldCount: 48,
        perks: ['1-on-1 Portfolio Feedback', 'Figma Design System Kit Enterprise', 'Lunch & Coffee Breaks', 'Sertifikat Kelulusan Resmi'],
        color: 'indigo'
      }
    ]
  },
  {
    id: 'evt-marathon-2026',
    title: 'Borobudur Heritage Half Marathon 2026',
    category: 'Olahraga',
    date: '2026-12-06',
    time: '05:00 - 10:30 WIB',
    venue: 'Taman Wisata Candi Borobudur',
    city: 'Magelang, Jawa Tengah',
    description: 'Lari melintasi keindahan alam pedesaan Jawa Tengah dengan latar megah Candi Borobudur warisan dunia. Kategori 21K Half Marathon, 10K, dan 5K Fun Run.',
    lineup: ['Official Pacer PASI', 'Guest Runner Nasional', 'Live Gamelan Cheering Zone'],
    bannerUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Borobudur Marathon Community',
    terms: [
      'Biaya pendaftaran sudah termasuk Running Jersey original brand, Medali Finisher logam, BIB Number terpasang RFID timing chip, dan asuransi kecelakaan diri.',
      'Peserta dalam kondisi sehat jasmani dan telah menandatangani waiver online saat checkout.'
    ],
    ticketTiers: [
      {
        id: 'tier-run-21k',
        name: '21K Half Marathon Race',
        price: 550000,
        description: 'Rute tantangan 21K bersertifikasi AIMS dengan water station setiap 2.5km dan timing chip akurat.',
        quota: 1500,
        soldCount: 1350,
        perks: ['Dry-Fit Running Jersey', 'BIB RFID Timing Chip', 'Logam Medali Finisher 21K', 'Recovery Meals & Fruit'],
        color: 'orange'
      },
      {
        id: 'tier-run-10k',
        name: '10K Challenge Run',
        price: 400000,
        description: 'Kategori favorit untuk pelari intermediate dengan elevasi seimbang dan spot foto candi indah.',
        quota: 2000,
        soldCount: 1820,
        perks: ['Dry-Fit Running Jersey', 'BIB RFID Chip', 'Medali Finisher 10K', 'Refreshment Pack'],
        color: 'amber'
      },
      {
        id: 'tier-run-5k',
        name: '5K Fun Heritage Run',
        price: 300000,
        description: 'Cocok untuk pemula, keluarga, dan pecinta fotografi alam.',
        quota: 2500,
        soldCount: 2200,
        perks: ['Fun Run Jersey', 'BIB Number', 'Medali Finisher 5K', 'Voucher Kuliner Lokal'],
        color: 'teal'
      }
    ]
  }
];
