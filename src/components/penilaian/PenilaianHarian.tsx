import { useState, useEffect } from "react";
import { Plus, Trash2, Download, BookOpen, CheckCircle2 } from "lucide-react";
import type { AppData, PenilaianHarian, User } from "../../types";

// ==================== TOAST COMPONENT ====================
function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// ==================== PENILAIAN HARIAN ====================
export function PenilaianHarianPage({ data, user, onUpdate }: {
  data: AppData;
  user: User;
  onUpdate: (d: AppData) => void;
}) {
  const isGuru = user.role === "guru";
  const isSiswa = user.role === "siswa";

  const [selectedSiswa, setSelectedSiswa] = useState<number>(
    isSiswa ? (user.refId || 0) : (data.siswa[0]?.id || 0)
  );
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [activeTA, setActiveTA] = useState<number>(data.tahunAjaran.find((ta) => ta.aktif)?.id || 1);

  // Toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: "", visible: false });
  };

  const siswa = data.siswa.find((s) => s.id === selectedSiswa);
  const kelas = data.kelas.find((k) => k.id === siswa?.kelasId);
  const ta = data.tahunAjaran.find((t) => t.id === activeTA);
  const guruPengampu = siswa
    ? data.guru.find((g) => g.jilidAjar?.includes(siswa.jilid))
    : undefined;

  const phList = (data.penilaianHarian || [])
    .filter((p) => p.siswaId === selectedSiswa && p.tahunAjaranId === activeTA)
    .sort((a, b) => a.tatapMuka - b.tatapMuka);

  const siswaPilihan = data.siswa.filter((s) => filterKelas === "all" || s.kelasId === Number(filterKelas));

  const handleUpdate = (id: number, patch: Partial<PenilaianHarian>) => {
    const list = data.penilaianHarian || [];
    onUpdate({
      ...data,
      penilaianHarian: list.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
    showToast("✅ Data tersimpan otomatis");
  };

  const handleAdd = () => {
    if (!siswa) return;
    const list = data.penilaianHarian || [];
    const nextTM = phList.length > 0 ? Math.max(...phList.map((p) => p.tatapMuka)) + 1 : 1;
    const newId = list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
    const baru: PenilaianHarian = {
      id: newId,
      siswaId: selectedSiswa,
      guruId: isGuru ? (user.refId || undefined) : undefined,
      tahunAjaranId: activeTA,
      tatapMuka: nextTM,
      tanggal: new Date().toISOString().split("T")[0],
      hafalanSurat: "",
      hafalanAyat: "",
      ummiJilidSurat: siswa.jilid,
      ummiHalAyat: "",
      materi: "",
      nilai: "",
      disimakGuru: "",
      disimakOrtu: "",
      keterangan: "",
    };
    onUpdate({ ...data, penilaianHarian: [...list, baru] });
    showToast("✅ Baris baru ditambahkan");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus baris ini?")) return;
    const list = data.penilaianHarian || [];
    onUpdate({ ...data, penilaianHarian: list.filter((p) => p.id !== id) });
    showToast("🗑️ Data dihapus");
  };

  const nilaiOptions = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "D"];

  const minRows = 20;
  const emptyRows = Math.max(0, minRows - phList.length);

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Penilaian Harian</h1>
          <p className="text-gray-600 text-sm mt-1">Kartu Prestasi Siswa - Guru Pengampu UMMI</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isGuru && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Tatap Muka
            </button>
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2 print:hidden">
        <CheckCircle2 className="w-4 h-4" />
        <span>
          <b>Auto-save aktif:</b> Setiap perubahan langsung tersimpan ke localStorage. Tidak perlu klik tombol simpan.
        </span>
      </div>

      {/* Filter */}
      {isGuru && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 print:hidden">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Filter Kelas</label>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Semua Kelas</option>
                {data.kelas.map((k) => (
                  <option key={k.id} value={k.id}>Kelas {k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Siswa</label>
              <select
                value={selectedSiswa}
                onChange={(e) => setSelectedSiswa(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {siswaPilihan.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} - {data.kelas.find((k) => k.id === s.kelasId)?.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tahun Ajaran</label>
              <select
                value={activeTA}
                onChange={(e) => setActiveTA(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {data.tahunAjaran.map((t) => (
                  <option key={t.id} value={t.id}>{t.tahun} - {t.semester}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Kartu */}
      {siswa ? (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-5xl print:shadow-none print:border-0 print:rounded-none">
            <div className="p-4 md:p-6 print:p-0">
              {/* Header */}
              <div className="flex items-center gap-3 bg-emerald-700 text-white px-4 py-2.5 rounded-md mb-4">
                <img src="/logos/logo-mi-new2.png" alt="Logo MI" className="w-12 h-12 object-contain flex-shrink-0" />
                <h2 className="font-bold tracking-wide text-lg sm:text-xl flex-1 text-center">KARTU PRESTASI SISWA</h2>
                <img src="/logos/logo-ummi-new2.png" alt="Logo UMMI" className="w-10 h-10 object-cover rounded-full flex-shrink-0" />
              </div>

              {/* Identitas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm mb-3">
                <div className="flex">
                  <span className="w-24 text-gray-700">Nama</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold flex-1 border-b border-dotted border-gray-400">{siswa.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-700">Jilid / Tkt.</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold flex-1 border-b border-dotted border-gray-400">{siswa.jilid}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-700">No. Induk</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold flex-1 border-b border-dotted border-gray-400">{siswa.nis}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-700">Ustadz/ah</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold flex-1 border-b border-dotted border-gray-400">{guruPengampu?.nama || kelas?.waliKelas || "-"}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-700">Kelas</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold flex-1 border-b border-dotted border-gray-400">{kelas?.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-700">Tempat</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold flex-1 border-b border-dotted border-gray-400">MI Islamiyah Malang</span>
                </div>
                {ta && (
                  <div className="flex md:col-span-2">
                    <span className="w-24 text-gray-700">Th. Ajaran</span>
                    <span className="mr-1">:</span>
                    <span className="font-semibold border-b border-dotted border-gray-400">{ta.tahun} - Semester {ta.semester}</span>
                  </div>
                )}
              </div>

              {/* Tabel */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse border-2 border-emerald-700">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th rowSpan={2} className="border border-emerald-700 px-1 py-1 align-middle w-12 text-emerald-900">Tatap Muka</th>
                      <th rowSpan={2} className="border border-emerald-700 px-1 py-1 align-middle w-20 text-emerald-900">Tanggal</th>
                      <th colSpan={2} className="border border-emerald-700 px-1 py-1 text-emerald-900">Hafalan</th>
                      <th colSpan={2} className="border border-emerald-700 px-1 py-1 text-emerald-900">Ummi/AlQur'an</th>
                      <th rowSpan={2} className="border border-emerald-700 px-1 py-1 align-middle text-emerald-900">Materi</th>
                      <th rowSpan={2} className="border border-emerald-700 px-1 py-1 align-middle w-14 text-emerald-900">Nilai</th>
                      <th colSpan={2} className="border border-emerald-700 px-1 py-1 text-emerald-900">Disimak</th>
                      <th rowSpan={2} className="border border-emerald-700 px-1 py-1 align-middle text-emerald-900">Keterangan</th>
                      {isGuru && <th rowSpan={2} className="border border-emerald-700 px-1 py-1 w-10 print:hidden text-emerald-900"></th>}
                    </tr>
                    <tr className="bg-emerald-50">
                      <th className="border border-emerald-700 px-1 py-1 text-emerald-900">Surat</th>
                      <th className="border border-emerald-700 px-1 py-1 text-emerald-900">Ayat</th>
                      <th className="border border-emerald-700 px-1 py-1 text-emerald-900">Jilid/Surat</th>
                      <th className="border border-emerald-700 px-1 py-1 text-emerald-900">Hal/Ayat</th>
                      <th className="border border-emerald-700 px-1 py-1 text-emerald-900">Guru</th>
                      <th className="border border-emerald-700 px-1 py-1 text-emerald-900">Ortu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phList.map((p) => (
                      <tr key={p.id} className="hover:bg-emerald-50/30">
                        <td className="border border-emerald-700 px-1 py-0.5 text-center font-semibold">{p.tatapMuka}</td>
                        <td className="border border-emerald-700 px-1 py-0.5 text-center whitespace-nowrap">
                          {isGuru ? (
                            <input
                              type="date"
                              value={p.tanggal}
                              onChange={(e) => handleUpdate(p.id, { tanggal: e.target.value })}
                              className="w-full text-[11px] bg-transparent text-center outline-none border-0 print:hidden"
                            />
                          ) : null}
                          <span className={isGuru ? "hidden print:inline" : ""}>
                            {p.tanggal ? new Date(p.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" }) : ""}
                          </span>
                        </td>
                        <CellEditable value={p.hafalanSurat} editable={isGuru} onChange={(v) => handleUpdate(p.id, { hafalanSurat: v })} />
                        <CellEditable value={p.hafalanAyat} editable={isGuru} onChange={(v) => handleUpdate(p.id, { hafalanAyat: v })} align="center" />
                        <CellEditable value={p.ummiJilidSurat} editable={isGuru} onChange={(v) => handleUpdate(p.id, { ummiJilidSurat: v })} />
                        <CellEditable value={p.ummiHalAyat} editable={isGuru} onChange={(v) => handleUpdate(p.id, { ummiHalAyat: v })} align="center" />
                        <CellEditable value={p.materi} editable={isGuru} onChange={(v) => handleUpdate(p.id, { materi: v })} />
                        <td className="border border-emerald-700 px-1 py-0.5 text-center">
                          {isGuru ? (
                            <select
                              value={p.nilai}
                              onChange={(e) => handleUpdate(p.id, { nilai: e.target.value })}
                              className="w-full bg-amber-50 text-amber-900 font-bold text-[11px] text-center outline-none border-0 print:hidden"
                            >
                              {nilaiOptions.map((o) => <option key={o} value={o}>{o || "-"}</option>)}
                            </select>
                          ) : null}
                          <span className={`${isGuru ? "hidden print:inline" : ""} font-bold text-amber-700`}>{p.nilai}</span>
                        </td>
                        <CellEditable value={p.disimakGuru} editable={isGuru} onChange={(v) => handleUpdate(p.id, { disimakGuru: v })} align="center" />
                        <CellEditable value={p.disimakOrtu} editable={isGuru} onChange={(v) => handleUpdate(p.id, { disimakOrtu: v })} align="center" />
                        <CellEditable value={p.keterangan} editable={isGuru} onChange={(v) => handleUpdate(p.id, { keterangan: v })} />
                        {isGuru && (
                          <td className="border border-emerald-700 px-1 py-0.5 text-center print:hidden">
                            <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-50 p-0.5 rounded transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {Array.from({ length: emptyRows }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td className="border border-emerald-700 h-6"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        <td className="border border-emerald-700"></td>
                        {isGuru && <td className="border border-emerald-700 print:hidden"></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-[10px] text-gray-500 print:hidden">
                <b>Status:</b> 🟢 Auto-save aktif - Setiap perubahan langsung tersimpan
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500">Pilih siswa untuk melihat kartu prestasi</div>
      )}
    </div>
  );
}

function CellEditable({ value, editable, onChange, align = "left" }: {
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
  align?: "left" | "center" | "right";
}) {
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  if (!editable) {
    return <td className={`border border-emerald-700 px-1 py-0.5 ${alignClass}`}>{value}</td>;
  }
  return (
    <td className={`border border-emerald-700 px-0.5 py-0 ${alignClass}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent text-[11px] px-1 py-0.5 outline-none border-0 focus:bg-emerald-50 transition-colors ${alignClass}`}
      />
    </td>
  );
}