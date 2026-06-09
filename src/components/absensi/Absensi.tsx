import { useState, useMemo } from "react";
import { FileText, X, Save } from "lucide-react";
import type { AppData, Absensi, StatusAbsen } from "../../types";

export function Absensi({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [selectedKelas, setSelectedKelas] = useState<number>(data.kelas[0]?.id || 1);
  const [showExcel, setShowExcel] = useState(false);
  const [activeTA, setActiveTA] = useState<number>(data.tahunAjaran.find((ta) => ta.aktif)?.id || 1);

  const siswaKelas = data.siswa.filter((s) => s.kelasId === selectedKelas);
  const pertemuanList = data.pertemuan;

  const getStatus = (siswaId: number, pertemuan: number): StatusAbsen => {
    return data.absensi.find((a) => a.siswaId === siswaId && a.pertemuan === pertemuan && a.tahunAjaranId === activeTA)?.status || "H";
  };

  const summary = useMemo(() => {
    return siswaKelas.map((s) => {
      const abs = data.absensi.filter((a) => a.siswaId === s.id && a.tahunAjaranId === activeTA);
      return {
        siswa: s,
        H: abs.filter((a) => a.status === "H").length,
        S: abs.filter((a) => a.status === "S").length,
        I: abs.filter((a) => a.status === "I").length,
        A: abs.filter((a) => a.status === "A").length,
        total: abs.length,
      };
    });
  }, [siswaKelas, data.absensi, activeTA]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Absensi</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola absensi siswa per kelas</p>
        </div>
        <button
          onClick={() => setShowExcel(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg"
        >
          <FileText className="w-4 h-4" /> Buka Excel Editor
        </button>
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
                <option key={k.id} value={k.id}>
                  Kelas {k.nama}
                </option>
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
                <option key={ta.id} value={ta.id}>
                  {ta.tahun} - {ta.semester}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-xs text-green-700">Total Hadir</p>
            <p className="text-xl font-bold text-green-800">{summary.reduce((a, b) => a + b.H, 0)}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-700">Total Sakit</p>
            <p className="text-xl font-bold text-yellow-800">{summary.reduce((a, b) => a + b.S, 0)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-700">Total Izin</p>
            <p className="text-xl font-bold text-blue-800">{summary.reduce((a, b) => a + b.I, 0)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xs text-red-700">Total Alpha</p>
            <p className="text-xl font-bold text-red-800">{summary.reduce((a, b) => a + b.A, 0)}</p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900">
                <th className="px-3 py-2 text-left font-semibold border border-emerald-200 sticky left-0 bg-emerald-50 z-10">No</th>
                <th className="px-3 py-2 text-left font-semibold border border-emerald-200 sticky left-12 bg-emerald-50 z-10 min-w-[180px]">Nama</th>
                {pertemuanList.map((p) => (
                  <th key={p.pertemuan} className="px-1.5 py-2 text-center font-semibold border border-emerald-200 min-w-[40px]">
                    P{p.pertemuan}
                  </th>
                ))}
                <th className="px-2 py-2 text-center font-semibold border border-emerald-200 bg-green-100">H</th>
                <th className="px-2 py-2 text-center font-semibold border border-emerald-200 bg-yellow-100">S</th>
                <th className="px-2 py-2 text-center font-semibold border border-emerald-200 bg-blue-100">I</th>
                <th className="px-2 py-2 text-center font-semibold border border-emerald-200 bg-red-100">A</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row, idx) => (
                <tr key={row.siswa.id} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 text-gray-600 border border-gray-200 sticky left-0 bg-white">{idx + 1}</td>
                  <td className="px-3 py-1.5 text-gray-900 font-medium border border-gray-200 sticky left-12 bg-white whitespace-nowrap">{row.siswa.nama}</td>
                  {pertemuanList.map((p) => {
                    const status = getStatus(row.siswa.id, p.pertemuan);
                    const colorClass =
                      status === "H"
                        ? "bg-green-100 text-green-800"
                        : status === "S"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "I"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800";
                    return (
                      <td key={p.pertemuan} className={`px-1 py-1 text-center border border-gray-200 font-bold text-xs ${colorClass}`}>
                        {status}
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-center border border-gray-200 font-bold text-green-700 bg-green-50">{row.H}</td>
                  <td className="px-2 py-1.5 text-center border border-gray-200 font-bold text-yellow-700 bg-yellow-50">{row.S}</td>
                  <td className="px-2 py-1.5 text-center border border-gray-200 font-bold text-blue-700 bg-blue-50">{row.I}</td>
                  <td className="px-2 py-1.5 text-center border border-gray-200 font-bold text-red-700 bg-red-50">{row.A}</td>
                </tr>
              ))}
              {summary.length === 0 && (
                <tr>
                  <td colSpan={pertemuanList.length + 6} className="px-3 py-8 text-center text-gray-500">
                    Tidak ada siswa di kelas ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showExcel && (
        <ExcelPopup data={data} kelasId={selectedKelas} tahunAjaranId={activeTA} onUpdate={onUpdate} onClose={() => setShowExcel(false)} />
      )}
    </div>
  );
}

function ExcelPopup({
  data,
  kelasId,
  tahunAjaranId,
  onUpdate,
  onClose,
}: {
  data: AppData;
  kelasId: number;
  tahunAjaranId: number;
  onUpdate: (d: AppData) => void;
  onClose: () => void;
}) {
  const siswaKelas = data.siswa.filter((s) => s.kelasId === kelasId);
  const [localAbs, setLocalAbs] = useState<Record<string, StatusAbsen>(() => {
    const map: Record<string, StatusAbsen> = {};
    siswaKelas.forEach((s) => {
      data.pertemuan.forEach((p) => {
        const key = `${s.id}_${p.pertemuan}`;
        map[key] = data.absensi.find((a) => a.siswaId === s.id && a.pertemuan === p.pertemuan && a.tahunAjaranId === tahunAjaranId)?.status || "H";
      });
    });
    return map;
  });

  const [localDates, setLocalDates] = useState<Record<number, string>(() => {
    const map: Record<number, string> = {};
    data.pertemuan.forEach((p) => {
      map[p.pertemuan] = p.tanggal;
    });
    return map;
  });

  const handleCellChange = (siswaId: number, pertemuan: number, value: StatusAbsen) => {
    setLocalAbs({ ...localAbs, [`${siswaId}_${pertemuan}`]: value });
  };

  const handleDateChange = (pertemuan: number, value: string) => {
    setLocalDates({ ...localDates, [pertemuan]: value });
  };

  const handleSave = () => {
    const newAbsensi: Absensi[] = [];
    Object.entries(localAbs).forEach(([key, status]) => {
      const [siswaIdStr, pertemuanStr] = key.split("_");
      const siswaId = Number(siswaIdStr);
      const pertemuan = Number(pertemuanStr);
      newAbsensi.push({
        siswaId,
        kelasId,
        tahunAjaranId,
        pertemuan,
        tanggal: localDates[pertemuan] || new Date().toISOString().split("T")[0],
        status,
      });
    });
    const filtered = data.absensi.filter((a) => !(a.kelasId === kelasId && a.tahunAjaranId === tahunAjaranId));
    onUpdate({ ...data, absensi: [...filtered, ...newAbsensi] });
    onClose();
  };

  const handleFillAll = (pertemuan: number, status: StatusAbsen) => {
    const newLocal = { ...localAbs };
    siswaKelas.forEach((s) => {
      newLocal[`${s.id}_${pertemuan}`] = status;
    });
    setLocalAbs(newLocal);
  };

  const getStatusColor = (s: StatusAbsen) => {
    switch (s) {
      case "H":
        return "bg-green-500 text-white";
      case "S":
        return "bg-yellow-500 text-white";
      case "I":
        return "bg-blue-500 text-white";
      case "A":
        return "bg-red-500 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Excel Editor - Absensi</h3>
              <p className="text-xs text-emerald-100">
                Kelas {data.kelas.find((k) => k.id === kelasId)?.nama} • {data.tahunAjaran.find((ta) => ta.id === tahunAjaranId)?.tahun} - {data.tahunAjaran.find((ta) => ta.id === tahunAjaranId)?.semester}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-gray-700">Legenda:</span>
          <span className="px-2 py-1 bg-green-500 text-white rounded font-medium">H = Hadir</span>
          <span className="px-2 py-1 bg-yellow-500 text-white rounded font-medium">S = Sakit</span>
          <span className="px-2 py-1 bg-blue-500 text-white rounded font-medium">I = Izin</span>
          <span className="px-2 py-1 bg-red-500 text-white rounded font-medium">A = Alpha</span>
          <span className="ml-auto text-gray-500">Klik cell untuk mengubah status</span>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-100 sticky top-0 z-20">
                  <th className="px-2 py-2 text-left font-bold border-2 border-emerald-300 sticky left-0 bg-emerald-100 z-30 min-w-[40px]">No</th>
                  <th className="px-2 py-2 text-left font-bold border-2 border-emerald-300 sticky left-10 bg-emerald-100 z-30 min-w-[160px]">Nama</th>
                  {data.pertemuan.map((p) => (
                    <th key={p.pertemuan} className="px-1 py-1 text-center border-2 border-emerald-300 min-w-[60px]">
                      <div className="font-bold">P{p.pertemuan}</div>
                      <input
                        type="date"
                        value={localDates[p.pertemuan] || ""}
                        onChange={(e) => handleDateChange(p.pertemuan, e.target.value)}
                        className="mt-1 w-full text-[10px] px-1 py-0.5 border border-emerald-200 rounded"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {siswaKelas.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-emerald-50/50">
                    <td className="px-2 py-1 text-center text-gray-600 border border-gray-300 font-medium sticky left-0 bg-white z-10">{idx + 1}</td>
                    <td className="px-2 py-1 text-gray-900 font-medium border border-gray-300 sticky left-10 bg-white z-10 whitespace-nowrap">{s.nama}</td>
                    {data.pertemuan.map((p) => {
                      const status = localAbs[`${s.id}_${p.pertemuan}`] || "H";
                      return (
                        <td key={p.pertemuan} className="p-0.5 border border-gray-300 text-center">
                          <select
                            value={status}
                            onChange={(e) => handleCellChange(s.id, p.pertemuan, e.target.value as StatusAbsen)}
                            className={`w-full px-1 py-1 text-center font-bold text-xs border-0 cursor-pointer focus:ring-2 focus:ring-emerald-500 ${getStatusColor(status)}`}
                          >
                            <option value="H">H</option>
                            <option value="S">S</option>
                            <option value="I">I</option>
                            <option value="A">A</option>
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-900 mb-2">Quick Fill (Set semua siswa):</p>
            <div className="flex flex-wrap gap-2">
              {data.pertemuan.map((p) => (
                <div key={p.pertemuan} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-amber-200">
                  <span className="text-xs font-medium text-gray-700">P{p.pertemuan}:</span>
                  <button onClick={() => handleFillAll(p.pertemuan, "H")} className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded font-bold">
                    H
                  </button>
                  <button onClick={() => handleFillAll(p.pertemuan, "S")} className="px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded font-bold">
                    S
                  </button>
                  <button onClick={() => handleFillAll(p.pertemuan, "I")} className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded font-bold">
                    I
                  </button>
                  <button onClick={() => handleFillAll(p.pertemuan, "A")} className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-bold">
                    A
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" /> Simpan Absensi
          </button>
        </div>
      </div>
    </div>
  );
}