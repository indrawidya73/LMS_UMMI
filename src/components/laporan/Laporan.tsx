import { useState, useMemo } from "react";
import { Printer, Download, AlertCircle } from "lucide-react";
import type { AppData, User } from "../../types";

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

export function Laporan({ data, user }: { data: AppData; user: User }) {
  const [selectedSiswa, setSelectedSiswa] = useState<number>(
    user.role === "siswa" ? user.refId || 0 : data.siswa[0]?.id || 0
  );
  const [activeTA, setActiveTA] = useState<number>(data.tahunAjaran.find((ta) => ta.aktif)?.id || 1);
  const [tanggalCetak, setTanggalCetak] = useState<string>("Malang, 02 Juni 2025");

  const siswa = data.siswa.find((s) => s.id === selectedSiswa);
  const kelas = data.kelas.find((k) => k.id === siswa?.kelasId);
  const ta = data.tahunAjaran.find((t) => t.id === activeTA);
  const nilai = data.penilaian.find((p) => p.siswaId === selectedSiswa && p.tahunAjaranId === activeTA);
  const absensi = data.absensi.filter((a) => a.siswaId === selectedSiswa && a.tahunAjaranId === activeTA);

  const totalSakit = absensi.filter((a) => a.status === "S").length;
  const totalIzin = absensi.filter((a) => a.status === "I").length;
  const totalAlpha = absensi.filter((a) => a.status === "A").length;

  const guruKelas = data.guru.find((g) => g.kelasId === siswa?.kelasId);

  const nilaiRow = (n: number) => ({
    nilai: n > 0 ? n : "",
    huruf: nilaiHuruf(n),
    ket: n > 0 ? capitalize(terbilang(n)) : "",
  });

  const hafalan = nilaiRow(nilai?.teoriMembaca.hafal || 0);
  const kelancaran = nilaiRow(nilai?.teoriMembaca.kelancaran || 0);
  const fashoha = nilaiRow(nilai?.teoriMembaca.fasoha || 0);
  const tartil = nilaiRow(nilai?.teoriMembaca.tartil || 0);

  const tahfidzScore = (count: number) => (count > 0 ? 85 : 0);
  const juz30 = nilaiRow(tahfidzScore(nilai?.tahfidz.juz30 || 0));
  const juz2829 = nilaiRow(tahfidzScore(nilai?.tahfidz.juz29_28 || 0));
  const juz1 = nilaiRow(tahfidzScore(nilai?.tahfidz.juz1 || 0));

  const jumlahNilai =
    (nilai?.teoriMembaca.hafal || 0) +
    (nilai?.teoriMembaca.kelancaran || 0) +
    (nilai?.teoriMembaca.fasoha || 0) +
    (nilai?.teoriMembaca.tartil || 0) +
    tahfidzScore(nilai?.tahfidz.juz30 || 0) +
    tahfidzScore(nilai?.tahfidz.juz29_28 || 0) +
    tahfidzScore(nilai?.tahfidz.juz1 || 0);

  const jumlahTidakHadir = totalSakit + totalIzin + totalAlpha;

  const handleDownloadLaporanPDF = () => {
    const el = document.getElementById("laporan-print");
    if (!el) {
      window.print();
      return;
    }
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) {
      alert("Mohon izinkan pop-up untuk mengunduh PDF.");
      return;
    }
    win.document.write(`
      <!doctype html><html lang="id"><head><meta charset="UTF-8" />
      <title>Laporan - ${siswa?.nama || ""}</title>
      <script src="https://cdn.tailwindcss.com"><\/script>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { font-family: Arial, sans-serif; }
      </style>
      </head><body>
        <div style="max-width:210mm;margin:0 auto;">${el.innerHTML}</div>
        <script>window.onload=function(){setTimeout(function(){window.print();},600);};<<\/script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Laporan Hasil Belajar</h1>
          <p className="text-gray-600 text-sm mt-1">Cetak laporan penilaian siswa (A4) atau simpan sebagai PDF</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.role === "guru" && (
            <select
              value={selectedSiswa}
              onChange={(e) => setSelectedSiswa(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
            >
              {data.siswa.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} - {data.kelas.find((k) => k.id === s.kelasId)?.nama}
                </option>
              ))}
            </select>
          )}
          <select
            value={activeTA}
            onChange={(e) => setActiveTA(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
          >
            {data.tahunAjaran.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tahun} - {t.semester}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={tanggalCetak}
            onChange={(e) => setTanggalCetak(e.target.value)}
            placeholder="Tanggal Cetak"
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white w-44"
            title="Edit Tanggal Laporan"
          />
          {user.role === "guru" ? (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
            >
              <Printer className="w-4 h-4" /> Cetak / Simpan PDF
            </button>
          ) : (
            <button
              onClick={handleDownloadLaporanPDF}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2 print:hidden">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          {user.role === "guru" ? (
            <>
              Tips: Klik <b>Cetak / Simpan PDF</b>. Pada dialog cetak browser, pilih ukuran kertas <b>A4</b>, lalu pilih tujuan <b>"Save as PDF"</b>. Aktifkan <b>Background graphics</b> agar garis tabel tercetak rapi.
            </>
          ) : (
            <>
              Klik <b>Download PDF</b> untuk menyimpan laporan. Pada dialog yang muncul, pilih tujuan <b>"Save as PDF"</b> dan ukuran kertas <b>A4</b>.
            </>
          )}
        </span>
      </div>

      {siswa && nilai && (
        <div className="flex justify-center">
          <div
            className="laporan-page bg-white rounded-xl shadow-md border border-gray-200 print:shadow-none print:border-0 print:rounded-none"
            id="laporan-print"
          >
            <div className="laporan-inner p-6 md:p-10 print:p-0">
              {/* Kop Surat */}
              <div className="text-center border-b-4 border-double border-gray-800 pb-3 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <img src="/logos/logo-mi-new2.png" alt="Logo MI Islamiyah" className="kop-logo w-22 h-22 object-contain flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-700 font-medium">YAYASAN LEMBAGA PENDIDIKAN ISLAM KEBONSARI</p>
                    <h2 className="text-xl font-serif font-bold text-emerald-900 tracking-wide">MADRASAH IBTIDAIYAH ISLAMIYAH</h2>
                    <p className="text-[10px] text-gray-600">NSM : 111235730037 • NPSN : 60720789</p>
                    <p className="text-[10px] text-gray-600">Jl. S. Supriyadi 172 - Telp. (0341) 877190 Kebonsari - Sukun Malang 65149</p>
                  </div>
                  <img src="/logos/logo-ummi-new2.png" alt="Logo UMMI" className="kop-logo w-16 h-16 object-cover rounded-full flex-shrink-0" />
                </div>
              </div>

              {/* Judul */}
              <div className="text-center mb-4">
                <h1 className="text-base font-bold text-gray-900 uppercase leading-tight">Laporan Penilaian Akhir Tahun Hasil Belajar Mengaji</h1>
                <h2 className="text-lg font-bold text-emerald-700">METODE UMMI</h2>
                <p className="text-sm text-gray-700 font-medium">TAHUN PELAJARAN {ta?.tahun}</p>
              </div>

              {/* Identitas Siswa */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 mb-4 text-sm">
                <div className="flex">
                  <span className="w-28 text-gray-700">Nama Siswa</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{siswa.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-700">Jilid / Al Qur'an</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{nilai.jilid}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-700">Kelas</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{kelas?.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-700">Tahun Pelajaran</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{ta?.tahun}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-700"></span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-700">Semester</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{ta?.semester === "Genap" ? "II / (GENAP)" : "I / (GANJIL)"}</span>
                </div>
              </div>

              {/* Tabel Materi UMMI */}
              <table className="w-full text-sm border-collapse border border-gray-700 mb-4">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-gray-700 px-2 py-1 text-center w-10 bg-gray-100">
                      No.
                    </th>
                    <th rowSpan={2} className="border border-gray-700 px-3 py-1 text-center bg-gray-100">
                      MATERI UMMI
                    </th>
                    <th colSpan={3} className="border border-gray-700 px-2 py-1 text-center bg-gray-100">
                      NILAI KETUNTASAN
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-gray-700 px-2 py-1 text-center w-14 bg-gray-100">Nilai</th>
                    <th className="border border-gray-700 px-2 py-1 text-center w-52 bg-gray-100">Huruf</th>
                    <th className="border border-gray-700 px-2 py-1 text-center w-20 bg-gray-100">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold">1.</td>
                    <td className="border border-gray-700 px-3 py-1 font-semibold" colSpan={4}>
                      Teori Membaca
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">a.</td>
                    <td className="border border-gray-700 px-3 py-1 font-bold">Hafalan</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{hafalan.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{hafalan.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{hafalan.huruf}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">b.</td>
                    <td className="border border-gray-700 px-3 py-1 pl-6">Kelancaran</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{kelancaran.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{kelancaran.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{kelancaran.huruf}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">c.</td>
                    <td className="border border-gray-700 px-3 py-1 pl-6">Fashoha</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{fashoha.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{fashoha.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{fashoha.huruf}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">d.</td>
                    <td className="border border-gray-700 px-3 py-1 pl-6">Tartil</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{tartil.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{tartil.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{tartil.huruf}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold">2.</td>
                    <td className="border border-gray-700 px-3 py-1 font-bold" colSpan={4}>
                      Tahfidz
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">a.</td>
                    <td className="border border-gray-700 px-3 py-1 pl-6">Juz 30</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{juz30.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{juz30.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{juz30.huruf}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">b.</td>
                    <td className="border border-gray-700 px-3 py-1 pl-6">Juz 29</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{juz2829.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{juz2829.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{juz2829.huruf}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center pl-4">c.</td>
                    <td className="border border-gray-700 px-3 py-1 pl-6">Juz 1</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{juz1.nilai}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-semibold whitespace-nowrap">{juz1.ket}</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{juz1.huruf}</td>
                  </tr>
                  <tr className="bg-yellow-100 font-bold">
                    <td className="border border-gray-700 px-2 py-1 text-center" colSpan={2}>
                      Jumlah
                    </td>
                    <td className="border border-gray-700 px-2 py-1 text-center">{jumlahNilai}</td>
                    <td className="border border-gray-700 px-2 py-1" colSpan={2}></td>
                  </tr>
                </tbody>
              </table>

              {/* Ketidakhadiran & Perilaku */}
              <table className="w-full text-sm border-collapse border border-gray-700 mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-700 px-2 py-1 text-center w-8">No.</th>
                    <th className="border border-gray-700 px-2 py-1 text-left">Ketidakhadiran</th>
                    <th className="border border-gray-700 px-2 py-1 text-center w-16">Hari</th>
                    <th className="border border-gray-700 px-2 py-1 text-left">Perilaku</th>
                    <th className="border border-gray-700 px-2 py-1 text-center w-16">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center">1.</td>
                    <td className="border border-gray-700 px-2 py-1">Sakit</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{totalSakit}</td>
                    <td className="border border-gray-700 px-2 py-1">Kedisiplinan</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{nilai.perilaku.disiplin}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center">2.</td>
                    <td className="border border-gray-700 px-2 py-1">Izin</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{totalIzin}</td>
                    <td className="border border-gray-700 px-2 py-1">Kerapian</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{nilai.perilaku.kerapian}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-2 py-1 text-center">3.</td>
                    <td className="border border-gray-700 px-2 py-1">Tanpa Keterangan</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{totalAlpha}</td>
                    <td className="border border-gray-700 px-2 py-1">Kesopanan</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{nilai.perilaku.kesopanan}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="border border-gray-700 px-2 py-1 text-center" colSpan={2}>
                      Jumlah
                    </td>
                    <td className="border border-gray-700 px-2 py-1 text-center">{jumlahTidakHadir}</td>
                    <td className="border border-gray-700 px-2 py-1">Kebersihan</td>
                    <td className="border border-gray-700 px-2 py-1 text-center font-bold">{nilai.perilaku.kebersihan}</td>
                  </tr>
                </tbody>
              </table>

              {/* Tanda Tangan */}
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div></div>
                <div className="text-center">
                  <p>{tanggalCetak}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p>Orang tua / Wali</p>
                  <div className="h-12"></div>
                  <p>(...................................)</p>
                </div>
                <div className="text-center">
                  <p>Ustad / Ustadzah</p>
                  <div className="h-12"></div>
                  <p className="font-bold underline">{guruKelas?.nama || kelas?.waliKelas || "..................................."}</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-sm mt-4">
                <p>Mengetahui,</p>
                <p>Kepala MI Islamiyah</p>
                <div className="h-12"></div>
                <p className="font-bold underline">Nur Kholifah, S.Pd.I</p>
                <p className="text-xs">NIY. 05022003</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!siswa && <div className="bg-white rounded-xl p-10 text-center text-gray-500">Pilih siswa untuk melihat laporan</div>}
    </div>
  );
}