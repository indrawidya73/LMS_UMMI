import { useState, useEffect } from "react";
import { Download, BookOpen, CheckCircle2 } from "lucide-react";
import type { AppData, Penilaian as PenilaianType, JilidType } from "../../types";
import { JILID_OPTIONS } from "../../types";
import { exportToExcel, exportToCSV, exportToPDF, buildHTMLTable } from "../../utils/exportUtils";

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

// ==================== PENILAIAN ====================
export function Penilaian({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [selectedKelas, setSelectedKelas] = useState<number>(data.kelas[0]?.id || 1);
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

  const siswaKelas = data.siswa.filter((s) => s.kelasId === selectedKelas);

  const getPenilaian = (siswaId: number): PenilaianType => {
    return data.penilaian.find((p) => p.siswaId === siswaId && p.tahunAjaranId === activeTA) || {
      siswaId,
      kelasId: selectedKelas,
      tahunAjaranId: activeTA,
      jilid: "Jilid 1",
      teoriMembaca: { hafal: 0, kelancaran: 0, fasoha: 0, tartil: 0 },
      tahfidz: { juz1: 0, juz30: 0, juz29_28: 0 },
      ketidakhadiran: { sakit: 0, izin: 0, alpha: 0 },
      perilaku: { disiplin: "B", kerapian: "B", kesopanan: "B", kebersihan: "B" },
      teoriMembacaNilai: { hafalan: "B", kelancaran: "B", fasoha: "B", tartil: "B", juz30: "B", juz29_30: "B" },
      tahfidzNilai: { hafalan: "B", kelancaran: "B", fasoha: "B", tartil: "B" },
    };
  };

  const calculateJumlah = (p: PenilaianType): number => {
    return (
      p.teoriMembaca.hafal +
      p.teoriMembaca.kelancaran +
      p.teoriMembaca.fasoha +
      p.teoriMembaca.tartil +
      p.tahfidz.juz1 * 5 +
      p.tahfidz.juz30 * 5 +
      p.tahfidz.juz29_28 * 5
    );
  };

  const updatePenilaian = (siswaId: number, updater: (p: PenilaianType) => PenilaianType) => {
    const existing = data.penilaian.find((p) => p.siswaId === siswaId && p.tahunAjaranId === activeTA);
    const updated = updater(getPenilaian(siswaId));
    if (existing) {
      onUpdate({
        ...data,
        penilaian: data.penilaian.map((p) => (p.siswaId === siswaId && p.tahunAjaranId === activeTA ? updated : p)),
      });
    } else {
      onUpdate({ ...data, penilaian: [...data.penilaian, updated] });
    }
    showToast("✅ Nilai tersimpan otomatis");
  };

  const nilaiOptions = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "D"];
  const perilakuOptions = ["", "A", "B+", "B", "C+", "C"];

  const kelasNama = data.kelas.find((k) => k.id === selectedKelas)?.nama || "-";
  const taInfo = data.tahunAjaran.find((t) => t.id === activeTA);
  const taLabel = taInfo ? `${taInfo.tahun} - ${taInfo.semester}` : "-";

  const buildExportData = () => {
    const headerRows = [
      [
        "No", "Nama", "Jilid", "Hafal", "Kelancaran", "Fasoha", "Tartil",
        "Juz 1", "Juz 30", "Juz 29&28", "Sakit", "Izin", "Alpha",
        "Disiplin", "Kerapian", "Kesopanan", "Kebersihan",
        "TM-Hafalan", "TM-Kelancaran", "TM-Fasoha", "TM-Tartil", "TM-Juz30", "TM-Juz2930",
        "TF-Hafalan", "TF-Kelancaran", "TF-Fasoha", "TF-Tartil", "Jumlah",
      ],
    ];
    const rows = siswaKelas.map((s, idx) => {
      const p = getPenilaian(s.id);
      return [
        idx + 1, s.nama, p.jilid,
        p.teoriMembaca.hafal, p.teoriMembaca.kelancaran, p.teoriMembaca.fasoha, p.teoriMembaca.tartil,
        p.tahfidz.juz1, p.tahfidz.juz30, p.tahfidz.juz29_28,
        p.ketidakhadiran.sakit, p.ketidakhadiran.izin, p.ketidakhadiran.alpha,
        p.perilaku.disiplin, p.perilaku.kerapian, p.perilaku.kesopanan, p.perilaku.kebersihan,
        p.teoriMembacaNilai.hafalan, p.teoriMembacaNilai.kelancaran, p.teoriMembacaNilai.fasoha, p.teoriMembacaNilai.tartil, p.teoriMembacaNilai.juz30, p.teoriMembacaNilai.juz29_30,
        p.tahfidzNilai.hafalan, p.tahfidzNilai.kelancaran, p.tahfidzNilai.fasoha, p.tahfidzNilai.tartil,
        calculateJumlah(p),
      ];
    });
    return { headerRows, rows };
  };

  const handleExportExcel = () => {
    const { headerRows, rows } = buildExportData();
    exportToExcel({
      filename: `Penilaian_${kelasNama}_${taLabel}`.replace(/[/\s]/g, "_"),
      title: "PENILAIAN HASIL BELAJAR MENGAJI - METODE UMMI",
      subtitle: [`MI Islamiyah Malang`, `Kelas ${kelasNama} • Tahun Ajaran ${taLabel}`],
      headerRows, rows,
    });
  };

  const handleExportCSV = () => {
    const { headerRows, rows } = buildExportData();
    exportToCSV({ filename: `Penilaian_${kelasNama}_${taLabel}`.replace(/[/\s]/g, "_"), headerRows, rows });
  };

  const handleExportPDF = () => {
    const { headerRows, rows } = buildExportData();
    exportToPDF({
      title: "PENILAIAN HASIL BELAJAR MENGAJI - METODE UMMI",
      subtitle: ["MI Islamiyah Malang", `Kelas ${kelasNama} • Tahun Ajaran ${taLabel}`],
      htmlContent: buildHTMLTable(headerRows, rows, []),
      landscape: true,
    });
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Penilaian</h1>
          <p className="text-gray-600 text-sm mt-1">Input nilai mengaji siswa</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportExcel} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={handleExportCSV} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={handleExportPDF} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        <span>
          <b>Auto-save aktif:</b> Setiap perubahan langsung tersimpan ke localStorage. Tidak perlu klik tombol simpan.
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
            >
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>Kelas {k.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tahun Ajaran</label>
            <select
              value={activeTA}
              onChange={(e) => setActiveTA(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
            >
              {data.tahunAjaran.map((ta) => (
                <option key={ta.id} value={ta.id}>{ta.tahun} - {ta.semester}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-700 text-white">
                <th rowSpan={2} className="px-2 py-2 border border-emerald-800 sticky left-0 bg-emerald-700 z-10 min-w-[30px]">No</th>
                <th rowSpan={2} className="px-2 py-2 border border-emerald-800 sticky left-8 bg-emerald-700 z-10 min-w-[150px]">Nama</th>
                <th rowSpan={2} className="px-2 py-2 border border-emerald-800 min-w-[100px]">Jilid</th>
                <th colSpan={4} className="px-2 py-1 border border-emerald-800 bg-emerald-600">Teori Membaca</th>
                <th colSpan={3} className="px-2 py-1 border border-emerald-800 bg-emerald-600">Tahfidz</th>
                <th colSpan={3} className="px-2 py-1 border border-emerald-800 bg-amber-600">Ketidakhadiran</th>
                <th colSpan={4} className="px-2 py-1 border border-emerald-800 bg-blue-600">Perilaku</th>
                <th colSpan={6} className="px-2 py-1 border border-emerald-800 bg-purple-600">Teori Membaca (Nilai)</th>
                <th colSpan={4} className="px-2 py-1 border border-emerald-800 bg-indigo-600">Tahfidz (Nilai)</th>
                <th rowSpan={2} className="px-2 py-2 border border-emerald-800 bg-yellow-500 text-yellow-900 min-w-[50px]">Jumlah</th>
              </tr>
              <tr className="bg-emerald-600 text-white">
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Hafal</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Kelancaran</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Fasoha</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Tartil</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px] bg-amber-500/20">Juz 1</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px] bg-amber-500/20">Juz 30</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px] bg-amber-500/20">Juz 29&28</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Sakit</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Izin</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Alpha</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Disiplin</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Kerapian</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Kesopanan</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Kebersihan</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Hafalan</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Kelancaran</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Fasoha</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Tartil</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Juz 30</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Juz 29 30</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Hafalan</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Kelancaran</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Fasoha</th>
                <th className="px-1 py-1 border border-emerald-800 min-w-[50px]">Tartil</th>
              </tr>
            </thead>
            <tbody>
              {siswaKelas.map((s, idx) => {
                const p = getPenilaian(s.id);
                const jumlah = calculateJumlah(p);
                return (
                  <tr key={s.id} className="hover:bg-amber-50/30">
                    <td className="px-2 py-1 text-center text-gray-600 border border-gray-300 sticky left-0 bg-white z-10">{idx + 1}</td>
                    <td className="px-2 py-1 text-gray-900 font-medium border border-gray-300 sticky left-8 bg-white z-10 whitespace-nowrap">{s.nama}</td>
                    <td className="px-1 py-1 border border-gray-300">
                      <select
                        value={p.jilid}
                        onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, jilid: e.target.value as JilidType }))}
                        className="w-full px-1 py-0.5 border border-amber-300 rounded text-xs bg-amber-50 font-medium text-amber-800 focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        {JILID_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </td>
                    {(["hafal", "kelancaran", "fasoha", "tartil"] as const).map((field) => (
                      <td key={field} className="px-1 py-1 border border-gray-300">
                        <input
                          type="number" min={0} max={100}
                          value={p.teoriMembaca[field]}
                          onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, teoriMembaca: { ...prev.teoriMembaca, [field]: Number(e.target.value) } }))}
                          className="w-full px-1 py-0.5 text-center text-xs border border-gray-200 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </td>
                    ))}
                    {(["juz1", "juz30", "juz29_28"] as const).map((field) => (
                      <td key={field} className="px-1 py-1 border border-gray-300 bg-amber-50/30">
                        <input
                          type="number" min={0}
                          value={p.tahfidz[field]}
                          onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, tahfidz: { ...prev.tahfidz, [field]: Number(e.target.value) } }))}
                          className="w-full px-1 py-0.5 text-center text-xs border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                        />
                      </td>
                    ))}
                    {(["sakit", "izin", "alpha"] as const).map((field) => (
                      <td key={field} className="px-1 py-1 border border-gray-300">
                        <input
                          type="number" min={0}
                          value={p.ketidakhadiran[field]}
                          onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, ketidakhadiran: { ...prev.ketidakhadiran, [field]: Number(e.target.value) } }))}
                          className="w-full px-1 py-0.5 text-center text-xs border border-gray-200 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </td>
                    ))}
                    {(["disiplin", "kerapian", "kesopanan", "kebersihan"] as const).map((field) => (
                      <td key={field} className="px-1 py-1 border border-gray-300 bg-blue-50/30">
                        <select
                          value={p.perilaku[field]}
                          onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, perilaku: { ...prev.perilaku, [field]: e.target.value } }))}
                          className="w-full px-1 py-0.5 text-center text-xs border border-blue-200 rounded font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          {perilakuOptions.map((opt) => <option key={opt} value={opt}>{opt || "-"}</option>)}
                        </select>
                      </td>
                    ))}
                    {(["hafalan", "kelancaran", "fasoha", "tartil", "juz30", "juz29_30"] as const).map((field) => (
                      <td key={field} className="px-1 py-1 border border-gray-300 bg-purple-50/30">
                        <select
                          value={p.teoriMembacaNilai[field]}
                          onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, teoriMembacaNilai: { ...prev.teoriMembacaNilai, [field]: e.target.value } }))}
                          className="w-full px-1 py-0.5 text-center text-xs border border-purple-200 rounded font-bold focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                        >
                          {nilaiOptions.map((opt) => <option key={opt} value={opt}>{opt || "-"}</option>)}
                        </select>
                      </td>
                    ))}
                    {(["hafalan", "kelancaran", "fasoha", "tartil"] as const).map((field) => (
                      <td key={field} className="px-1 py-1 border border-gray-300 bg-indigo-50/30">
                        <select
                          value={p.tahfidzNilai[field]}
                          onChange={(e) => updatePenilaian(s.id, (prev) => ({ ...prev, tahfidzNilai: { ...prev.tahfidzNilai, [field]: e.target.value } }))}
                          className="w-full px-1 py-0.5 text-center text-xs border border-indigo-200 rounded font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                          {nilaiOptions.map((opt) => <option key={opt} value={opt}>{opt || "-"}</option>)}
                        </select>
                      </td>
                    ))}
                    <td className="px-2 py-1 text-center border border-gray-300 bg-yellow-100 font-bold text-yellow-900 text-sm">{jumlah}</td>
                  </tr>
                );
              })}
              {siswaKelas.length === 0 && (
                <tr><td colSpan={26} className="px-3 py-8 text-center text-gray-500">Tidak ada siswa di kelas ini</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] text-gray-500 text-center">
        🟢 Auto-save aktif - Setiap perubahan langsung tersimpan ke localStorage
      </div>
    </div>
  );
}