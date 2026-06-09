import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, School } from "lucide-react";
import type { AppData, Kelas } from "../../types";
import { getNextId } from "../../store";

export function DataKelas({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [editing, setEditing] = useState<Kelas | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (k: Kelas) => {
    let newKelas: Kelas[];
    if (data.kelas.find((x) => x.id === k.id)) {
      newKelas = data.kelas.map((x) => (x.id === k.id ? k : x));
    } else {
      newKelas = [...data.kelas, { ...k, id: getNextId(data.kelas) }];
    }
    onUpdate({ ...data, kelas: newKelas });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    const siswaCount = data.siswa.filter((s) => s.kelasId === id).length;
    if (siswaCount > 0) {
      alert(`Tidak dapat menghapus kelas ini karena masih ada ${siswaCount} siswa!`);
      return;
    }
    if (confirm("Yakin ingin menghapus kelas ini?")) {
      onUpdate({ ...data, kelas: data.kelas.filter((k) => k.id !== id) });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Data Kelas</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola data kelas 1 sampai 6</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.kelas.map((k) => {
          const siswaCount = data.siswa.filter((s) => s.kelasId === k.id).length;
          return (
            <div key={k.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                    <School className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Kelas {k.nama}</h3>
                    <p className="text-xs text-gray-500">Tingkat {k.tingkat}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditing(k);
                      setShowForm(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(k.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wali Kelas</span>
                  <span className="font-medium text-gray-900 text-right">{k.waliKelas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Siswa</span>
                  <span className="font-semibold text-emerald-700">
                    {siswaCount} / {k.kapasitas}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-500" style={{ width: `${(siswaCount / k.kapasitas) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <KelasForm kelas={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function KelasForm({ kelas, onSave, onClose }: { kelas: Kelas | null; onSave: (k: Kelas) => void; onClose: () => void }) {
  const [form, setForm] = useState<Kelas>(
    kelas || { id: 0, nama: "", tingkat: 1, waliKelas: "", kapasitas: 30 }
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{kelas ? "Edit" : "Tambah"} Kelas</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="p-5 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
            <input
              required
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: 1A, 2B"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
            <select
              required
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <option key={t} value={t}>
                  Tingkat {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wali Kelas</label>
            <input
              required
              type="text"
              value={form.waliKelas}
              onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
            <input
              required
              type="number"
              min={1}
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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