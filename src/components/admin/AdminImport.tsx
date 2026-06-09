import { useState } from "react";
import { FileText, CheckCircle2, AlertCircle, Save, Upload, Download, X, GraduationCap, UserCog } from "lucide-react";
import type { AppData, JilidType } from "../../types";
import { JILID_OPTIONS } from "../../types";

type ImportType = "guru" | "siswa";

interface ImportRow {
  no: number;
  data: Record<string, string>;
  valid: boolean;
  errors: string[];
}

export function AdminImport({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [tipe, setTipe] = useState<ImportType>("siswa");
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [imported, setImported] = useState<number | null>(null);

  const templateGuru = `username,password,nip,nama,jabatan,jenis_kelamin,no_telp,alamat,jilid_ajar
ustadz1,ustadz123,198801012015011001,Ustadz Fulan S.Pd,Guru Pengampu Jilid 1,L,081234567001,Jl. Sulfat No. 1,Jilid 1;Jilid 2
ustadzah1,ustadzah123,199002022016012002,Ustadzah Fulanah S.Pd.I,Guru Pengampu Al Quran,P,081234567002,Jl. Veteran No. 2,Al Qur'an;Tajwid
ustadz2,ustadz456,199103032017011003,Ustadz Ahmad S.Pd,Guru Pengampu GHORIB,L,081234567003,Jl. Kalpataru No. 3,GHORIB`;

  const templateSiswa = `username,password,nis,nama,kelas,jilid,jenis_kelamin,tanggal_lahir,nama_wali,no_telp_wali,alamat
siswa01,siswa123,20240001,Ahmad Budi Santoso,1A,Jilid 1,L,2018-01-15,Bapak Budi,08111111111,Jl. Merdeka No. 1
siswa02,siswa123,20240002,Aisyah Putri Sari,1A,Jilid 2,P,2018-02-20,Bapak Sari,08111111112,Jl. Merdeka No. 2
siswa03,siswa123,20240003,Muhammad Rizki,1B,Jilid 1,L,2018-03-10,Bapak Rizki,08111111113,Jl. Merdeka No. 3`;

  const currentTemplate = tipe === "guru" ? templateGuru : templateSiswa;

  const downloadTemplate = (format: "csv" | "xls") => {
    const blob =
      format === "csv"
        ? new Blob([currentTemplate], { type: "text/csv;charset=utf-8;" })
        : new Blob([`\uFEFF${currentTemplate.replace(/,/g, "\t")}`], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template_import_${tipe}.${format === "csv" ? "csv" : "xls"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) {
      setRows([]);
      return;
    }
    const sep = lines[0].includes("\t") ? "\t" : ",";
    const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase());
    const parsed: ImportRow[] = lines.slice(1).map((line, idx) => {
      const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = cols[i] || "";
      });
      const errors: string[] = [];

      if (!row.username) errors.push("username kosong");
      if (!row.password) errors.push("password kosong");
      if (!row.nama) errors.push("nama kosong");
      if (data.users.find((u) => u.username === row.username)) errors.push("username sudah ada");

      if (tipe === "siswa") {
        if (!row.nis) errors.push("nis kosong");
        if (!row.kelas) errors.push("kelas kosong");
        if (row.kelas && !data.kelas.find((k) => k.nama.toLowerCase() === row.kelas.toLowerCase())) {
          errors.push(`kelas "${row.kelas}" tidak ditemukan`);
        }
      } else {
        if (!row.nip) errors.push("nip kosong");
      }

      return {
        no: idx + 1,
        data: row,
        valid: errors.length === 0,
        errors,
      };
    });
    setRows(parsed);
  };

  const handleParseManual = () => parseCSV(csvText);

  const handleImport = () => {
    const validRows = rows.filter((r) => r.valid);
    if (validRows.length === 0) {
      alert("Tidak ada data valid untuk diimport!");
      return;
    }
    if (!confirm(`Import ${validRows.length} ${tipe}? Data dengan error akan dilewati.`)) return;

    let newGuru = [...data.guru];
    let newSiswa = [...data.siswa];
    const newUsers = [...data.users];

    validRows.forEach((r) => {
      const d = r.data;
      if (tipe === "guru") {
        const guruId = newGuru.length > 0 ? Math.max(...newGuru.map((g) => g.id)) + 1 : 1;
        const jilidAjar = d.jilid_ajar
          ? (d.jilid_ajar.split(";").map((j) => j.trim()).filter(Boolean) as JilidType[])
          : [];
        newGuru.push({
          id: guruId,
          nip: d.nip,
          nama: d.nama,
          jabatan: d.jabatan || "-",
          jenisKelamin: d.jenis_kelamin?.toUpperCase() === "P" ? "P" : "L",
          noTelp: d.no_telp || "-",
          alamat: d.alamat || "-",
          jilidAjar,
        });
        newUsers.push({
          username: d.username,
          password: d.password,
          role: "guru",
          name: d.nama,
          refId: guruId,
        });
      } else {
        const siswaId = newSiswa.length > 0 ? Math.max(...newSiswa.map((s) => s.id)) + 1 : 1;
        const kelas = data.kelas.find((k) => k.nama.toLowerCase() === d.kelas.toLowerCase());
        newSiswa.push({
          id: siswaId,
          nis: d.nis,
          nama: d.nama,
          kelasId: kelas?.id || 1,
          jilid: (d.jilid as JilidType) || "Jilid 1",
          jenisKelamin: d.jenis_kelamin?.toUpperCase() === "P" ? "P" : "L",
          tanggalLahir: d.tanggal_lahir || "",
          namaWali: d.nama_wali || "-",
          noTelpWali: d.no_telp_wali || "-",
          alamat: d.alamat || "-",
        });
        newUsers.push({
          username: d.username,
          password: d.password,
          role: "siswa",
          name: d.nama,
          refId: siswaId,
        });
      }
    });

    onUpdate({ ...data, guru: newGuru, siswa: newSiswa, users: newUsers });
    setImported(validRows.length);
    setRows([]);
    setCsvText("");
  };

  const validCount = rows.filter((r) => r.valid).length;
  const invalidCount = rows.length - validCount;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Import Massal</h1>
        <p className="text-gray-600 text-sm mt-1">Import data Guru atau Siswa beserta akun login secara bersamaan</p>
      </div>

      {imported !== null && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Berhasil mengimport {imported} {tipe}!</p>
            <p className="text-sm text-green-700 mt-1">Data dan akun login telah ditambahkan.</p>
            <button onClick={() => setImported(null)} className="mt-2 text-xs text-green-700 underline">
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Step 1 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3">1. Pilih Tipe Data</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setTipe("siswa");
              setRows([]);
              setCsvText("");
            }}
            className={`p-4 rounded-xl border-2 text-left transition ${tipe === "siswa" ? "border-amber-500 bg-amber-50" : "border-gray-200"}`}
          >
            <GraduationCap className={`w-8 h-8 mb-2 ${tipe === "siswa" ? "text-amber-600" : "text-gray-400"}`} />
            <p className={`font-semibold ${tipe === "siswa" ? "text-amber-900" : "text-gray-700"}`}>Import Siswa</p>
          </button>
          <button
            onClick={() => {
              setTipe("guru");
              setRows([]);
              setCsvText("");
            }}
            className={`p-4 rounded-xl border-2 text-left transition ${tipe === "guru" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}
          >
            <UserCog className={`w-8 h-8 mb-2 ${tipe === "guru" ? "text-emerald-600" : "text-gray-400"}`} />
            <p className={`font-semibold ${tipe === "guru" ? "text-emerald-900" : "text-gray-700"}`}>Import Guru</p>
          </button>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-900 mb-1">2. Download Template</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => downloadTemplate("csv")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Template .CSV
          </button>
          <button
            onClick={() => downloadTemplate("xls")}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Template .XLS
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
          <p className="text-xs font-semibold text-gray-700 mb-2">Format kolom ({tipe}):</p>
          <code className="text-[11px] text-gray-700 whitespace-pre-wrap break-all block font-mono">
            {currentTemplate.split("\n")[0]}
          </code>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3">3. Upload File atau Paste Data</p>
        <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-rose-400 transition mb-3">
          <Upload className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">Pilih file CSV atau XLS</span>
          <input type="file" accept=".csv,.xls,.xlsx,.txt,.tsv" onChange={handleFileUpload} className="hidden" />
        </label>
        <details className="mb-3">
          <summary className="text-xs text-gray-600 cursor-pointer">atau paste isi CSV/Excel langsung di sini ↓</summary>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Paste isi file CSV/Excel..."
            className="mt-2 w-full h-32 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
          />
          <button onClick={handleParseManual} className="mt-2 px-3 py-1.5 bg-gray-700 text-white rounded text-xs font-medium">
            Parse Data
          </button>
        </details>
      </div>

      {/* Step 4 */}
      {rows.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                4. Preview Data ({rows.length} baris)
              </p>
              <p className="text-xs mt-1">
                <span className="text-green-700 font-semibold">{validCount} valid</span>
                {invalidCount > 0 && <span className="text-red-700 font-semibold ml-3">{invalidCount} error</span>}
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={validCount === 0}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm disabled:bg-gray-300"
            >
              <Save className="w-4 h-4" /> Import {validCount} Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">No</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-left">Username</th>
                  <th className="px-2 py-2 text-left">Nama</th>
                  {tipe === "siswa" ? (
                    <>
                      <th className="px-2 py-2 text-left">NIS</th>
                      <th className="px-2 py-2 text-left">Kelas</th>
                    </>
                  ) : (
                    <>
                      <th className="px-2 py-2 text-left">NIP</th>
                      <th className="px-2 py-2 text-left">Jabatan</th>
                    </>
                  )}
                  <th className="px-2 py-2 text-left">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.no} className={r.valid ? "" : "bg-red-50"}>
                    <td className="px-2 py-1.5">{r.no}</td>
                    <td className="px-2 py-1.5">
                      {r.valid ? (
                        <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> Error
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 font-mono">{r.data.username}</td>
                    <td className="px-2 py-1.5">{r.data.nama}</td>
                    {tipe === "siswa" ? (
                      <>
                        <td className="px-2 py-1.5 font-mono">{r.data.nis}</td>
                        <td className="px-2 py-1.5">{r.data.kelas}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-1.5 font-mono">{r.data.nip}</td>
                        <td className="px-2 py-1.5">{r.data.jabatan}</td>
                      </>
                    )}
                    <td className="px-2 py-1.5 text-red-700 text-[11px]">{r.errors.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}