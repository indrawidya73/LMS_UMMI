import { useState } from 'react';
import { createKelompok, getKelompok, KelompokUMMI } from '../../stores/kelompokUMMIStore';
import { getJenjangById, jenjangUMMI } from '../../stores/jenjangUMMIStore';
import { Plus, Trash2, Users, BookOpen } from 'lucide-react';
import TemplateKelompokUMMI from './TemplateKelompokUMMI';

export default function AdminKelompokUMMI() {
  const [kelompok, setKelompok] = useState<KelompokUMMI[]>(getKelompok());
  const [showForm, setShowForm] = useState(false);
  
  const [nama, setNama] = useState('');
  const [jenjangId, setJenjangId] = useState('');
  const [guruId, setGuruId] = useState('');
  const [tingkat, setTingkat] = useState(1);
  const [kelasSumber, setKelasSumber] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');
  const [kapasitas, setKapasitas] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newKelompok = createKelompok({
      nama,
      jenjang_id: jenjangId,
      guru_pengampu_id: guruId,
      tingkat_sekolah: tingkat,
      kelas_sumber: kelasSumber.split(',').map(k => k.trim()).filter(Boolean),
      tahun_ajaran: tahunAjaran,
      kapasitas
    });
    
    setKelompok([...kelompok, newKelompok]);
    setShowForm(false);
    
    setNama('');
    setJenjangId('');
    setGuruId('');
    setTingkat(1);
    setKelasSumber('');
    setKapasitas(30);
  };

  const handleDelete = (id: string) => {
    const updated = kelompok.filter(k => k.id !== id);
    localStorage.setItem('lms_kelompok_ummi', JSON.stringify(updated));
    setKelompok(updated);
  };

  // ⭐ TAMBAH: Handle upload dari CSV
  const handleUpload = (data: any[]) => {
    const newKelompoks: KelompokUMMI[] = [];
    
    data.forEach(row => {
      try {
        const newKelompok = createKelompok({
          nama: row.nama,
          jenjang_id: row.jenjang_id,
          guru_pengampu_id: row.guru_pengampu_id,
          tingkat_sekolah: parseInt(row.tingkat_sekolah) || 1,
          kelas_sumber: row.kelas_sumber.split(',').map((k: string) => k.trim()).filter(Boolean),
          tahun_ajaran: row.tahun_ajaran || '2026/2027',
          kapasitas: parseInt(row.kapasitas) || 30
        });
        newKelompoks.push(newKelompok);
      } catch (err) {
        console.error('Error creating kelompok:', row, err);
      }
    });
    
    setKelompok([...kelompok, ...newKelompoks]);
    alert(`Berhasil import ${newKelompoks.length} kelompok!`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelompok UMMI</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
        >
          <Plus size={20} />
          {showForm ? 'Tutup' : 'Tambah Kelompok'}
        </button>
      </div>

      {/* ⭐ TAMBAH: Template & Upload */}
      <TemplateKelompokUMMI onUpload={handleUpload} />

      {/* Form tetap sama */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          {/* ... form fields ... */}
        </form>
      )}

      {/* List tetap sama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ... */}
      </div>
    </div>
  );
}