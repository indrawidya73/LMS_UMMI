import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Calendar, CheckCircle2 } from "lucide-react";
import type { AppData, TahunAjaran } from "../../types";
import { getNextId } from "../../store";

export function TahunAjaranPage({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [editing, setEditing] = useState<TahunAjaran | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (ta: TahunAjaran) => {
    let newTA: TahunAjaran[];
    if (data.tahunAjaran.find((x) => x.id === ta.id)) {
      newTA = data.tahunAjaran.map((x) => (x.id === ta.id ? ta : x));
    } else {
      newTA = [...data.tahunAjaran, { ...ta, id: getNextId(data.tahunAjaran) }];
    }
    onUpdate({ ...data, tahunAjaran: newTA });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (data.tahunAjaran.find((ta) => ta.id === id)?.aktif) {
      alert("Tidak dapat menghapus tahun ajaran yang aktif!");
      return;
    }
    if (confirm("Yakin ingin menghapus?")) {
      onUpdate({ ...data, tahunAjaran: data.tahunAjaran.filter((ta) => ta.id !== id) });
    }
  };

  const handleSetAktif = (id: number) => {
    onUpdate({
      ...data,
      tahunAjaran: data.tahunAjaran.map((ta) => ({ ...ta, aktif: ta.id === id })),
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Tahun Ajaran</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola tahun ajaran dan semester (Ganjil/Genap)</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.tahunAjaran.map((ta) => (
          <div
            key={ta.id}
            className={`bg-white rounded-xl shadow-sm border-2 p-5 transition ${
              ta.aktif ? "border-emerald-500 ring-2 ring-emerald-100" : "border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${ta.aktif ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gray-200"}`}>
                  <Calendar className={`w-6 h-6 ${ta.aktif ? "text-white" : "text-gray-500"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{ta.tahun}</h3>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 text-xs rounded font-medium ${
                      ta.semester === "Ganjil" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    Semester {ta.semester}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditing(ta);
                    setShowForm(true);
                  }}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ta.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              {ta.aktif ? (
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Aktif
                </div>
              ) : (
                <button onClick={() => handleSetAktif(ta.id)} className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                  Aktifkan →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TAForm ta={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function TAForm({ ta, onSave, onClose }: { ta: TahunAjaran | null; onSave: (t: TahunAjaran) => void; onClose: () => void }) {
  const [form, setForm] = useState<TahunAjaran>(
    ta || { id: 0, tahun: "2024/2025", semester: "Ganjil", aktif: false }
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{ta ? "Edit" : "Tambah"} Tahun Ajaran</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <input
              required
              type="text"
              value={form.tahun}
              onChange={(e) => setForm({ ...form, tahun: e.target.value })}
              placeholder="Contoh: 2024/2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value as "Ganjil" | "Genap" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aktif"
              checked={form.aktif}
              onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="aktif" className="text-sm text-gray-700">
              Set sebagai tahun ajaran aktif
            </label>
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