import { useState, useMemo } from "react";
import { Search, Filter, BookOpen, AlertCircle } from "lucide-react";
import type { AppData } from "../../types";
import { JILID_OPTIONS } from "../../types";

const jilidColors: Record<string, string> = {
  "Jilid 1": "from-emerald-500 to-emerald-600",
  "Jilid 2": "from-teal-500 to-teal-600",
  "Jilid 3": "from-cyan-500 to-cyan-600",
  "Jilid 4": "from-sky-500 to-sky-600",
  "Jilid 5": "from-blue-500 to-blue-600",
  "Jilid 6": "from-indigo-500 to-indigo-600",
  "Al Qur'an": "from-amber-500 to-amber-600",
  Tajwid: "from-orange-500 to-orange-600",
  GHORIB: "from-rose-500 to-rose-600",
};

export function PengampuUMMI({ data }: { data: AppData }) {
  const [search, setSearch] = useState("");
  const [filterJilid, setFilterJilid] = useState<string>("all");

  const groups = useMemo(() => {
    return JILID_OPTIONS.map((jilid) => {
      const pengampu = data.guru.filter((g) => (g.jilidAjar || []).includes(jilid));
      const siswa = data.siswa.filter((s) => s.jilid === jilid);
      return { jilid, pengampu, siswa };
    });
  }, [data.guru, data.siswa]);

  const visibleGroups = groups.filter((g) => {
    const matchJilid = filterJilid === "all" || g.jilid === filterJilid;
    if (!matchJilid) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const inSiswa = g.siswa.some((s) => s.nama.toLowerCase().includes(q));
    const inGuru = g.pengampu.some((gr) => gr.nama.toLowerCase().includes(q));
    return inSiswa || inGuru || g.jilid.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Pengampu UMMI</h1>
        <p className="text-gray-600 text-sm mt-1">Data guru pengampu per Jilid beserta siswanya</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama guru atau siswa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterJilid}
              onChange={(e) => setFilterJilid(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none bg-white"
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleGroups.map((group) => (
          <div key={group.jilid} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${jilidColors[group.jilid] || "from-gray-500 to-gray-600"} px-5 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-lg">{group.jilid}</h3>
              </div>
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{group.siswa.length} Siswa</span>
            </div>

            <div className="p-4">
              {/* Guru Pengampu */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Guru Pengampu</p>
                {group.pengampu.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {group.pengampu.map((g) => (
                      <div key={g.id} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                          {g.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-900 leading-tight">{g.nama}</p>
                          <p className="text-[10px] text-emerald-600">{g.jabatan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
                    <AlertCircle className="w-4 h-4" /> Belum ada guru pengampu. Tetapkan di menu Data Guru.
                  </div>
                )}
              </div>

              {/* Siswa */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daftar Siswa</p>
                {group.siswa.length > 0 ? (
                  <div className="border border-gray-100 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0">
                        <tr className="bg-gray-50 text-gray-600">
                          <th className="px-2 py-1.5 text-left font-semibold w-8">No</th>
                          <th className="px-2 py-1.5 text-left font-semibold">Nama</th>
                          <th className="px-2 py-1.5 text-left font-semibold">Kelas</th>
                          <th className="px-2 py-1.5 text-center font-semibold">JK</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.siswa.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-2 py-1.5 text-gray-500">{idx + 1}</td>
                            <td className="px-2 py-1.5 text-gray-900 font-medium whitespace-nowrap">{s.nama}</td>
                            <td className="px-2 py-1.5">
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium">
                                {data.kelas.find((k) => k.id === s.kelasId)?.nama || "-"}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  s.jenisKelamin === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                }`}
                              >
                                {s.jenisKelamin}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-3 text-center bg-gray-50 rounded-lg">Belum ada siswa pada jilid ini</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleGroups.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-500">Tidak ada data yang cocok</div>}
    </div>
  );
}