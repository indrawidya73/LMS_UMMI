import { useState } from "react";
import { Plus, Edit2, Trash2, Save, Search, X } from "lucide-react";
import type { AppData, Guru, Kelas } from "../../types";
import { JILID_OPTIONS } from "../../types";
import { getNextId } from "../../store";

export function DataGuru({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [editing, setEditing] = useState<Guru | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = data.guru.filter((g) =>
    g.nama.toLowerCase().includes(search.toLowerCase()) ||
    g.nip.includes(search) ||
    g.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (g: Guru) => {
    let newGuru: Guru[];
    if (data.guru.find((x) => x.id === g.id)) {
      newGuru = data.guru.map((x) => (x.id === g.id ? g : x));
    } else {
      newGuru = [...data.guru, { ...g, id: getNextId(data.guru) }];
    }
    onUpdate({ ...data, guru: newGuru });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus data guru ini?")) {
      onUpdate({ ...data, guru: data.guru.filter((g) => g.id !== id) });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Data Guru</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola data guru MI Islamiyah</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Guru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari guru berdasarkan nama, NIP, atau jabatan..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900">
                <th className="px-3 py-2.5 text-left font-semibold">No</th>
                <th className="px-3 py-2.5 text-left font-semibold">NIP</th>
                <th className="px-3 py-2.5 text-left font-semibold">Nama</th>
                <th className="px-3 py-2.5 text-left font-semibold">Jabatan</th>
                <th className="px-3 py-2.5 text-left font-semibold">JK</th>
                <th className="px-3 py-2.5 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((g, idx) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-600">{idx + 1}</td>
                  <td className="px-3 py-2.5 text-gray-700 font-mono text-xs">{g.nip}</td>
                  <td className="px-3 py-2.5 text-gray-900 font-medium">{g.nama}</td>
                  <td className="px-3 py-2.5 text-gray-700">{g.jabatan}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${g.jenisKelamin === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                      {g.jenisKelamin}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setEditing(g); setShowForm(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(g.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <GuruForm guru={editing} kelasList={data.kelas} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function GuruForm({ guru, kelasList, onSave, onClose }: { guru: Guru | null; kelasList: Kelas[]; onSave: (g: Guru) => void; onClose: () => void }) {
  const [form, setForm] = useState<Guru>(
    guru || { id: 0, nip: "", nama: "", jabatan: "", jenisKelamin: "L", noTelp: "", alamat: "" }
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{guru ? "Edit" : "Tambah"} Guru</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
            <input required type="text" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input required type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
            <input required type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select value={form.jenisKelamin} onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value as "L" | "P" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Telp</label>
              <input required type="text" value={form.noTelp} onChange={(e) => setForm({ ...form, noTelp: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wali Kelas (Opsional)</label>
            <select value={form.kelasId || ""} onChange={(e) => setForm({ ...form, kelasId: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white">
              <option value="">- Bukan Wali Kelas -</option>
              {kelasList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jilid yang Diajar (UMMI)</label>
            <div className="grid grid-cols-3 gap-2">
              {JILID_OPTIONS.map((j) => {
                const checked = (form.jilidAjar || []).includes(j);
                return (
                  <label key={j} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border cursor-pointer text-xs transition ${checked ? "bg-amber-50 border-amber-400 text-amber-800 font-medium" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      const current = form.jilidAjar || [];
                      setForm({ ...form, jilidAjar: e.target.checked ? [...current, j] : current.filter((x) => x !== j) });
                    }} className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500" />
                    {j}
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea required rows={2} value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Batal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}