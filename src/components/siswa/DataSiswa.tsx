import { useState } from "react";
import { Plus, Edit2, Trash2, Save, Search, Filter, X } from "lucide-react";
import type { AppData, Siswa, Kelas } from "../../types";
import { JILID_OPTIONS } from "../../types";
import { getNextId } from "../../store";

export function DataSiswa({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [editing, setEditing] = useState<Siswa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState<string>("all");

  const filtered = data.siswa.filter((s) => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    const matchKelas = filterKelas === "all" || s.kelasId === Number(filterKelas);
    return matchSearch && matchKelas;
  });

  const handleSave = (s: Siswa) => {
    let newSiswa: Siswa[];
    if (data.siswa.find((x) => x.id === s.id)) {
      newSiswa = data.siswa.map((x) => (x.id === s.id ? s : x));
    } else {
      newSiswa = [...data.siswa, { ...s, id: getNextId(data.siswa) }];
    }
    onUpdate({ ...data, siswa: newSiswa });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus data siswa ini?")) {
      onUpdate({
        ...data,
        siswa: data.siswa.filter((s) => s.id !== id),
        absensi: data.absensi.filter((a) => a.siswaId !== id),
        penilaian: data.penilaian.filter((p) => p.siswaId !== id),
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Data Siswa</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola data siswa MI Islamiyah</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Siswa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIS..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none bg-white"
            >
              <option value="all">Semua Kelas</option>
              {data.kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  Kelas {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900">
                <th className="px-3 py-2.5 text-left font-semibold">No</th>
                <th className="px-3 py-2.5 text-left font-semibold">NIS</th>
                <th className="px-3 py-2.5 text-left font-semibold">Nama</th>
                <th className="px-3 py-2.5 text-left font-semibold">Kelas</th>
                <th className="px-3 py-2.5 text-left font-semibold">Jilid</th>
                <th className="px-3 py-2.5 text-left font-semibold">JK</th>
                <th className="px-3 py-2.5 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-600">{idx + 1}</td>
                  <td className="px-3 py-2.5 text-gray-700 font-mono text-xs">{s.nis}</td>
                  <td className="px-3 py-2.5 text-gray-900 font-medium">{s.nama}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                      {data.kelas.find((k) => k.id === s.kelasId)?.nama || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <select
                      value={s.jilid}
                      onChange={(e) =>
                        onUpdate({
                          ...data,
                          siswa: data.siswa.map((x) =>
                            x.id === s.id ? { ...x, jilid: e.target.value as any } : x
                          ),
                        })
                      }
                      className="px-2 py-1 border border-amber-300 rounded text-xs bg-amber-50 font-medium text-amber-800 focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      {JILID_OPTIONS.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        s.jenisKelamin === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {s.jenisKelamin}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditing(s);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <SiswaForm
          siswa={editing}
          kelasList={data.kelas}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function SiswaForm({
  siswa,
  kelasList,
  onSave,
  onClose,
}: {
  siswa: Siswa | null;
  kelasList: Kelas[];
  onSave: (s: Siswa) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Siswa>(
    siswa || {
      id: 0,
      nis: "",
      nama: "",
      kelasId: kelasList[0]?.id || 1,
      jilid: "Jilid 1",
      jenisKelamin: "L",
      tanggalLahir: "",
      namaWali: "",
      noTelpWali: "",
      alamat: "",
    }
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{siswa ? "Edit" : "Tambah"} Siswa</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="p-5 space-y-3 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
              <input
                required
                type="text"
                value={form.nis}
                onChange={(e) => setForm({ ...form, nis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select
                value={form.jenisKelamin}
                onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value as "L" | "P" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              required
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <select
                required
                value={form.kelasId}
                onChange={(e) => setForm({ ...form, kelasId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
              >
                {kelasList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jilid</label>
              <select
                value={form.jilid}
                onChange={(e) => setForm({ ...form, jilid: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
              >
                {JILID_OPTIONS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              required
              type="date"
              value={form.tanggalLahir}
              onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wali</label>
            <input
              required
              type="text"
              value={form.namaWali}
              onChange={(e) => setForm({ ...form, namaWali: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telp Wali</label>
            <input
              required
              type="text"
              value={form.noTelpWali}
              onChange={(e) => setForm({ ...form, noTelpWali: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              required
              rows={2}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}