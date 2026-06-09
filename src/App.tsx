import { useState } from "react";
import {
  BookOpen, GraduationCap, Calendar, ClipboardCheck, FileText,
  LayoutDashboard, UserCog, School, LogOut, Menu as MenuIcon, X,
  Plus, Edit2, Trash2, Save, Search, Printer,
  BarChart3, TrendingUp, Award, AlertCircle, CheckCircle2, Filter,
  Settings, Upload, Download, Eye, EyeOff, KeyRound, Users
} from "lucide-react";
import type {
  AppData, User, UserRole, Guru, Siswa, Kelas, TahunAjaran, Absensi, Penilaian,
  JilidType, StatusAbsen, PenilaianHarian
} from "./types";
import { DataGuru } from "./components/guru/DataGuru";
import { PengampuUMMI } from "./components/guru/PengampuUMMI";
import { TahunAjaranPage } from "./components/kelas/TahunAjaran";
import { DataSiswa } from "./components/siswa/DataSiswa";
import { DataKelas } from "./components/kelas/DataKelas";
import { Absensi as AbsensiPage } from "./components/absensi/Absensi";
import { Penilaian as PenilaianPage } from "./components/penilaian/Penilaian";
import { Laporan } from "./components/laporan/Laporan";
import { PenilaianHarianPage } from "./components/penilaian/PenilaianHarian";
import { AdminUsers } from "./components/admin/AdminUsers";
import { AdminImport } from "./components/admin/AdminImport"; 
import { JILID_OPTIONS } from "./types";
import { loadData, saveData, getNextId } from "./store";
import { exportToExcel, exportToCSV, exportToPDF, buildHTMLTable } from "./utils/exportUtils";

// ==================== TYPE ====================
type Page = 'dashboard' | 'admin-users' | 'admin-import' | 'guru' | 'pengampu' | 'siswa' | 'kelas' | 'tahun-ajaran' | 'absensi' | 'penilaian' | 'penilaian-harian' | 'laporan';

// ==================== UTILS ====================
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function terbilang(n: number): string {
  const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  if (n < 0) return "";
  if (n < 12) return satuan[n];
  if (n < 20) return terbilang(n - 10) + " belas";
  if (n < 100) return (terbilang(Math.floor(n / 10)) + " puluh" + (n % 10 ? " " + terbilang(n % 10) : "")).trim();
  if (n < 200) return ("seratus" + (n % 100 ? " " + terbilang(n % 100) : "")).trim();
  if (n < 1000) return (terbilang(Math.floor(n / 100)) + " ratus" + (n % 100 ? " " + terbilang(n % 100) : "")).trim();
  if (n < 2000) return ("seribu" + (n % 1000 ? " " + terbilang(n % 1000) : "")).trim();
  return (terbilang(Math.floor(n / 1000)) + " ribu" + (n % 1000 ? " " + terbilang(n % 1000) : "")).trim();
}

function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function nilaiHuruf(n: number): string {
  if (n <= 0) return "";
  if (n >= 90) return "A";
  if (n >= 85) return "B+";
  if (n >= 80) return "B";
  if (n >= 75) return "C+";
  if (n >= 70) return "C";
  return "D";
}

// ==================== AUTH CONTEXT ====================
function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("ummi_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("ummi_session", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ummi_session");
  };

  return { user, login, logout };
}

// ==================== LOGIN ====================
function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const data = loadData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = data.users.find((u) => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError("Username atau password salah!");
    }
  };

  const quickLogin = (uname: string, pwd: string) => {
    const user = data.users.find((u) => u.username === uname && u.password === pwd);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logos/logo-sukma.png" alt="Logo SUKMA" className="w-48 sm:w-64 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-emerald-900 mb-1">
            Laporan Hasil Belajar Mengaji
          </h1>
          <p className="text-emerald-700 font-medium">METODE UMMI</p>
          <p className="text-gray-600 text-sm mt-1">MI ISLAMIYAH - MALANG</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Masukkan password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 text-center">Demo Login (klik untuk login cepat):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin("admin", "admin123")}
                className="flex items-center justify-center gap-1.5 px-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium transition"
              >
                <Settings className="w-4 h-4" /> Admin
              </button>
              <button
                onClick={() => quickLogin("guru", "guru123")}
                className="flex items-center justify-center gap-1.5 px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition"
              >
                <UserCog className="w-4 h-4" /> Guru
              </button>
              <button
                onClick={() => quickLogin("siswa", "siswa123")}
                className="flex items-center justify-center gap-1.5 px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition"
              >
                <GraduationCap className="w-4 h-4" /> Siswa
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">© 2025 MI Islamiyah Malang. All rights reserved.</p>
      </div>
    </div>
  );
}

// ==================== SIDEBAR ====================
function Sidebar({
  user, currentPage, onNavigate, onLogout, isOpen, onClose
}: {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const menu = user.role === "admin"
    ? [
        { page: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
        { page: "admin-users" as Page, label: "Manajemen User", icon: UserCog },
        { page: "admin-import" as Page, label: "Import Massal", icon: FileText },
      ]
    : user.role === "guru"
    ? [
        { page: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
        { page: "guru" as Page, label: "Data Guru", icon: UserCog },
        { page: "pengampu" as Page, label: "Pengampu UMMI", icon: BookOpen },
        { page: "siswa" as Page, label: "Data Siswa", icon: GraduationCap },
        { page: "kelas" as Page, label: "Data Kelas", icon: School },
        { page: "tahun-ajaran" as Page, label: "Tahun Ajaran", icon: Calendar },
        { page: "absensi" as Page, label: "Absensi", icon: ClipboardCheck },
        { page: "penilaian" as Page, label: "Penilaian", icon: BookOpen },
        { page: "penilaian-harian" as Page, label: "Penilaian Harian", icon: ClipboardCheck },
        { page: "laporan" as Page, label: "Laporan", icon: FileText },
      ]
    : [
        { page: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
        { page: "penilaian-harian" as Page, label: "Kartu Prestasi", icon: ClipboardCheck },
        { page: "laporan" as Page, label: "Laporan Saya", icon: FileText },
      ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-emerald-900 text-white z-50 transform transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logos/logo-mi-new2.png" alt="Logo MI" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-serif font-bold text-sm text-white">MI Islamiyah</h2>
              <p className="text-emerald-300 text-xs">Metode UMMI</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                  isActive ? "bg-amber-500 text-white shadow-md" : "text-emerald-100 hover:bg-emerald-800"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-emerald-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-emerald-300">Login sebagai</p>
            <p className="text-sm font-semibold">{user.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-800 text-emerald-200 text-xs rounded">
              {user.role === "admin" ? "Administrator" : user.role === "guru" ? "Guru" : "Siswa"}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/30 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ==================== DASHBOARD ====================
const BULAN_NAMA = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function LineChart({ labels, values, color, title, icon: Icon, minY = 0 }: {
  labels: string[];
  values: number[];
  color: string;
  title: string;
  icon: any;
  minY?: number;
}) {
  const W = 800;
  const H = 260;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxY = 100;

  const xFor = (i: number) => padL + (labels.length === 1 ? chartW / 2 : (i * chartW) / (labels.length - 1));
  const yFor = (v: number) => padT + chartH - ((Math.max(minY, Math.min(maxY, v)) - minY) / (maxY - minY)) * chartH;

  const points = values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');
  const areaPoints = `${padL},${padT + chartH} ${points} ${padL + chartW},${padT + chartH}`;

  const gradId = `grad-${title.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-500">Real-time updates</p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 420 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id={`shadow-${gradId}`}>
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Area */}
          <polygon points={areaPoints} fill={`url(#${gradId})`} />

          {/* Smooth line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={`url(#shadow-${gradId})`}
          />

          {/* Data points */}
          {values.map((v, i) => (
            <g key={i}>
              <circle cx={xFor(i)} cy={yFor(v)} r="6" fill="white" stroke={color} strokeWidth="3" />
              {(i % Math.ceil(labels.length / 8) === 0 || i === values.length - 1) && (
                <text x={xFor(i)} y={yFor(v) - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
                  {v}
                </text>
              )}
              {(i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1) && (
                <text x={xFor(i)} y={H - 10} textAnchor="middle" fontSize="10" fill="#9ca3af">
                  {labels[i]}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function Dashboard({ user, data }: { user: User; data: AppData }) {
  const activeTAId = data.tahunAjaran.find((ta) => ta.aktif)?.id || data.tahunAjaran[0]?.id;
  const [periode, setPeriode] = useState<"minggu" | "bulan" | "tahun">("minggu");
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [filterJilid, setFilterJilid] = useState<string>("all");

  const trend = (() => {
    const siswaIds = new Set(
      data.siswa
        .filter((s) => filterKelas === "all" || s.kelasId === Number(filterKelas))
        .filter((s) => filterJilid === "all" || s.jilid === filterJilid)
        .map((s) => s.id)
    );

    let absen = data.absensi.filter((a) => siswaIds.has(a.siswaId));
    if (periode !== "tahun" && activeTAId) {
      absen = absen.filter((a) => a.tahunAjaranId === activeTAId);
    }

    const buckets = new Map<string, { hadir: number; total: number; order: number }>();

    const addBucket = (key: string, order: number, isHadir: boolean) => {
      const b = buckets.get(key) || { hadir: 0, total: 0, order };
      b.total += 1;
      if (isHadir) b.hadir += 1;
      buckets.set(key, b);
    };

    absen.forEach((a) => {
      const isHadir = a.status === "H";
      if (periode === "minggu") {
        addBucket(`P${a.pertemuan}`, a.pertemuan, isHadir);
      } else if (periode === "bulan") {
        const d = new Date(a.tanggal);
        const order = d.getFullYear() * 12 + d.getMonth();
        addBucket(BULAN_NAMA[d.getMonth()] + " '" + String(d.getFullYear()).slice(2), order, isHadir);
      } else {
        const d = new Date(a.tanggal);
        addBucket(String(d.getFullYear()), d.getFullYear(), isHadir);
      }
    });

    const sorted = Array.from(buckets.entries()).sort((a, b) => a[1].order - b[1].order);
    const labels = sorted.map(([k]) => k);
    const values = sorted.map(([, v]) => (v.total ? Math.round((v.hadir / v.total) * 100) : 0));

    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    const last = values[values.length - 1] || 0;
    const prev = values[values.length - 2] || last;
    const delta = last - prev;

    return { labels, values, avg, last, delta, jumlahSiswa: siswaIds.size };
  })();

  const stats = (() => {
    if (user.role === "siswa") {
      const myData = data.siswa.find((s) => s.id === user.refId);
      const myAbsensi = data.absensi.filter((a) => a.siswaId === user.refId);
      const myHadir = myAbsensi.filter((a) => a.status === "H").length;
      const myNilai = data.penilaian.find((p) => p.siswaId === user.refId);
      const totalNilai = myNilai
        ? myNilai.teoriMembaca.hafal + myNilai.teoriMembaca.kelancaran + myNilai.teoriMembaca.fasoha + myNilai.teoriMembaca.tartil + myNilai.tahfidz.juz1 * 5 + myNilai.tahfidz.juz30 * 5 + myNilai.tahfidz.juz29_28 * 5
        : 0;

      return [
        { label: "Jilid Saat Ini", value: myData?.jilid || "-", icon: BookOpen, color: "emerald" },
        { label: "Kehadiran", value: `${myHadir}/${myAbsensi.length}`, icon: CheckCircle2, color: "green" },
        { label: "Total Nilai", value: totalNilai, icon: Award, color: "amber" },
        { label: "Kelas", value: data.kelas.find((k) => k.id === myData?.kelasId)?.nama || "-", icon: School, color: "blue" },
      ];
    }

    const totalSiswa = data.siswa.length;
    const totalGuru = data.guru.length;
    const totalKelas = data.kelas.length;
    const aktifTA = data.tahunAjaran.find((ta) => ta.aktif);

    return [
      { label: "Total Siswa", value: totalSiswa, icon: GraduationCap, color: "emerald" },
      { label: "Total Guru", value: totalGuru, icon: UserCog, color: "blue" },
      { label: "Total Kelas", value: totalKelas, icon: School, color: "amber" },
      { label: "Th. Ajaran Aktif", value: aktifTA ? `${aktifTA.tahun} - ${aktifTA.semester}` : "-", icon: Calendar, color: "purple" },
    ];
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang, <span className="font-semibold text-emerald-700">{user.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => {
          const StatIcon = stat.icon;
          const colorMap: Record<string, string> = {
            emerald: "from-emerald-500 to-emerald-700",
            green: "from-green-500 to-green-700",
            amber: "from-amber-500 to-amber-600",
            blue: "from-blue-500 to-blue-700",
            purple: "from-purple-500 to-purple-700",
          };
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center mb-3`}>
                <StatIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h3 className="font-semibold text-gray-900">Grafik Tren Pencapaian Siswa</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              {([
                ["minggu", "Mingguan"],
                ["bulan", "Bulanan"],
                ["tahun", "Tahunan"],
              ] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setPeriode(val)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium transition",
                    periode === val ? "bg-emerald-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
            >
              <option value="all">Semua Kelas</option>
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  Kelas {k.nama}
                </option>
              ))}
            </select>
            <select
              value={filterJilid}
              onChange={(e) => setFilterJilid(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
            >
              <option value="all">Semua Jilid</option>
              {JILID_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
            <p className="text-[11px] text-emerald-700">Rata-rata</p>
            <p className="text-xl font-bold text-emerald-800">{trend.avg}%</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
            <p className="text-[11px] text-blue-700">Periode Terakhir</p>
            <p className="text-xl font-bold text-blue-800">{trend.last}%</p>
          </div>
          <div
            className={cn(
              "rounded-lg p-3 text-center border",
              trend.delta >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
            )}
          >
            <p className={cn("text-[11px]", trend.delta >= 0 ? "text-green-700" : "text-red-700")}>Perubahan</p>
            <p className={cn("text-xl font-bold", trend.delta >= 0 ? "text-green-800" : "text-red-800")}>
              {trend.delta >= 0 ? "▲ +" : "▼ "}
              {trend.delta}%
            </p>
          </div>
        </div>

        {trend.values.length > 0 ? (
          <>
            <LineChart
              title={`Tingkat Pencapaian ${periode === "minggu" ? "per Minggu" : periode === "bulan" ? "per Bulan" : "per Tahun"}`}
              icon={TrendingUp}
              color="#059669"
              labels={trend.labels}
              values={trend.values}
              minY={0}
            />
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Menampilkan tren dari {trend.jumlahSiswa} siswa
            </p>
          </>
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm">Belum ada data untuk filter yang dipilih.</div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-semibold text-gray-900">Distribusi Jilid Siswa</h3>
          </div>
          <div className="space-y-2">
            {JILID_OPTIONS.map((jilid) => {
              const count = data.siswa.filter((s) => s.jilid === jilid).length;
              const pct = data.siswa.length ? (count / data.siswa.length) * 100 : 0;
              return (
                <div key={jilid}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{jilid}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h3 className="font-semibold text-gray-900">Informasi Sistem</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Tahun Ajaran Aktif</span>
              <span className="font-semibold text-gray-900">
                {data.tahunAjaran.find((ta) => ta.aktif)?.tahun} - {data.tahunAjaran.find((ta) => ta.aktif)?.semester}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Metode Pembelajaran</span>
              <span className="font-semibold text-gray-900">UMMI</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Pertemuan</span>
              <span className="font-semibold text-gray-900">{data.pertemuan.length} Pertemuan</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Madrasah</span>
              <span className="font-semibold text-gray-900">MI Islamiyah Malang</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Kepala Madrasah</span>
              <span className="font-semibold text-gray-900">Nur Kholifah, S.Pd.I</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const { user, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<AppData>(() => loadData());

  const handleUpdate = (newData: AppData) => {
    setData(newData);
    saveData(newData);
  };

  if (!user) return <Login onLogin={login} />;

  const pageTitle: Record<Page, string> = {
    dashboard: "Dashboard",
    "admin-users": "Manajemen User",
    "admin-import": "Import Massal",
    guru: "Data Guru",
    pengampu: "Pengampu UMMI",
    siswa: "Data Siswa",
    kelas: "Data Kelas",
    "tahun-ajaran": "Tahun Ajaran",
    absensi: "Absensi",
    penilaian: "Penilaian",
    "penilaian-harian": "Penilaian Harian",
    laporan: "Laporan",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <MenuIcon className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-gray-900 text-sm">{pageTitle[currentPage]}</h2>
          <div className="w-9 h-9 bg-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user.name.charAt(0)}
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 max-w-full">
          {currentPage === "dashboard" && <Dashboard user={user} data={data} />}
          {currentPage === "admin-users" && user.role === "admin" && <AdminUsers data={data} onUpdate={handleUpdate} />}
          {currentPage === "admin-import" && user.role === "admin" && <AdminImport data={data} onUpdate={handleUpdate} />}
          {currentPage === "guru" && user.role === "guru" && <DataGuru data={data} onUpdate={handleUpdate} />}
          {currentPage === "pengampu" && user.role === "guru" && <PengampuUMMI data={data} />}
          {currentPage === "siswa" && user.role === "guru" && <DataSiswa data={data} onUpdate={handleUpdate} />}
          {currentPage === "kelas" && user.role === "guru" && <DataKelas data={data} onUpdate={handleUpdate} />}
          {currentPage === "tahun-ajaran" && user.role === "guru" && <TahunAjaranPage data={data} onUpdate={handleUpdate} />}
          {currentPage === "absensi" && user.role === "guru" && <AbsensiPage data={data} onUpdate={handleUpdate} />}
          {currentPage === "penilaian" && user.role === "guru" && <PenilaianPage data={data} onUpdate={handleUpdate} />}
          {currentPage === "penilaian-harian" && <PenilaianHarianPage data={data} user={user} onUpdate={handleUpdate} />}
          {currentPage === "laporan" && <Laporan data={data} user={user} />}
        </main>
      </div>
    </div>
  );
}