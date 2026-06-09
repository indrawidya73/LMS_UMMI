import { useState } from "react";
import { Plus, Edit2, Trash2, Save, Search, X, Eye, EyeOff, KeyRound, Users, Settings } from "lucide-react";
import type { AppData, User, Guru, Siswa } from "../../types";

export function AdminUsers({ data, onUpdate }: { data: AppData; onUpdate: (d: AppData) => void }) {
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "guru" | "siswa">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const filteredUsers = data.users.filter((u) => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchSearch =
      !search.trim() ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleSave = (u: User, oldUsername?: string) => {
    if (oldUsername) {
      onUpdate({
        ...data,
        users: data.users.map((x) => (x.username === oldUsername ? u : x)),
      });
    } else {
      if (data.users.find((x) => x.username === u.username)) {
        alert("Username sudah digunakan!");
        return;
      }
      onUpdate({ ...data, users: [...data.users, u] });
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (username: string) => {
    if (username === "admin") {
      alert("User admin utama tidak dapat dihapus!");
      return;
    }
    if (!confirm(`Hapus user "${username}"?`)) return;
    onUpdate({ ...data, users: data.users.filter((u) => u.username !== username) });
  };

  const handleResetPassword = (username: string) => {
    const newPw = prompt("Masukkan password baru:", "password123");
    if (!newPw) return;
    onUpdate({
      ...data,
      users: data.users.map((u) => (u.username === username ? { ...u, password: newPw } : u)),
    });
    alert(`Password user "${username}" berhasil direset.`);
  };

  const togglePw = (uname: string) => setShowPasswords({ ...showPasswords, [uname]: !showPasswords[uname] });

  const stats = {
    total: data.users.length,
    admin: data.users.filter((u) => u.role === "admin").length,
    guru: data.users.filter((u) => u.role === "guru").length,
    siswa: data.users.filter((u) => u.role === "siswa").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola akun login Guru, Siswa, dan Admin</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-xl p-4">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs opacity-90">Total User</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-4">
          <Settings className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs opacity-90">Admin</p>
          <p className="text-2xl font-bold">{stats.admin}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl p-4">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs opacity-90">Guru</p>
          <p className="text-2xl font-bold">{stats.guru}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-4">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs opacity-90">Siswa</p>
          <p className="text-2xl font-bold">{stats.siswa}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari username atau nama..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Administrator</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rose-50 text-rose-900">
                <th className="px-3 py-2.5 text-left font-semibold">No</th>
                <th className="px-3 py-2.5 text-left font-semibold">Username</th>
                <th className="px-3 py-2.5 text-left font-semibold">Password</th>
                <th className="px-3 py-2.5 text-left font-semibold">Nama</th>
                <th className="px-3 py-2.5 text-left font-semibold">Role</th>
                <th className="px-3 py-2.5 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u, idx) => (
                <tr key={u.username} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-600">{idx + 1}</td>
                  <td className="px-3 py-2.5 font-mono text-xs font-semibold text-gray-900">{u.username}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{showPasswords[u.username] ? u.password : "••••••••"}</span>
                      <button onClick={() => togglePw(u.username)} className="text-gray-400 hover:text-gray-700">
                        {showPasswords[u.username] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-900">{u.name}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-rose-100 text-rose-700"
                          : u.role === "guru"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {u.role === "admin" ? "Administrator" : u.role === "guru" ? "Guru" : "Siswa"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleResetPassword(u.username)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        title="Reset Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(u);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.username)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                    Tidak ada user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <UserForm
          user={editing}
          guruList={data.guru}
          siswaList={data.siswa}
          existingUsers={data.users}
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

function UserForm({
  user,
  guruList,
  siswaList,
  existingUsers,
  onSave,
  onClose,
}: {
  user: User | null;
  guruList: Guru[];
  siswaList: Siswa[];
  existingUsers: User[];
  onSave: (u: User, oldUsername?: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<User>(
    user || {
      username: "",
      password: "",
      role: "guru",
      name: "",
      refId: undefined,
    }
  );
  const [showPw, setShowPw] = useState(false);

  const refOptions = form.role === "guru" ? guruList : form.role === "siswa" ? siswaList : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && existingUsers.find((x) => x.username === form.username)) {
      alert("Username sudah digunakan!");
      return;
    }
    onSave(form, user?.username);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{user ? "Edit User" : "Tambah User"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any, refId: undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              disabled={!!user}
            >
              <option value="admin">Administrator</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              required
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              disabled={!!user}
              placeholder="contoh: ahmad01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                required
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="Min. 6 karakter"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          {form.role !== "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tautkan ke Data {form.role === "guru" ? "Guru" : "Siswa"} (opsional)
              </label>
              <select
                value={form.refId || ""}
                onChange={(e) => setForm({ ...form, refId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">- Tidak ditautkan -</option>
                {refOptions.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.nama}
                  </option>
                ))}
              </select>
            </div>
          )}
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
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}