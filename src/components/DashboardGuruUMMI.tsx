import { useState, useEffect } from 'react';
import { getKelompokByGuru } from '../stores/kelompokUMMIStore';
import { getJenjangById } from '../stores/jenjangUMMIStore';
import NaikJenjangModal from './NaikJenjangModal';

export default function DashboardGuruUMMI({ guruId }) {
  const [kelompok, setKelompok] = useState([]);
  const [modalSiswa, setModalSiswa] = useState(null);
  const [modalKelompokId, setModalKelompokId] = useState(null);
  
  useEffect(() => {
    setKelompok(getKelompokByGuru(guruId));
  }, [guruId]);
  
  const handleNaikJenjang = (siswa, kelompokId) => {
    setModalSiswa(siswa);
    setModalKelompokId(kelompokId);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Kelompok UMMI Saya</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kelompok.map(k => {
          const jenjang = getJenjangById(k.jenjang_id);
          return (
            <div key={k.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{jenjang?.nama}</h3>
                  <p className="text-sm text-gray-500">{k.anggota.length}/{k.kapasitas} siswa</p>
                  <p className="text-xs text-gray-400">Kelas: {k.kelas_sumber.join(', ')}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  jenjang?.tipe === 'tahfidz' ? 'bg-green-100 text-green-700' :
                  jenjang?.tipe === 'kombinasi' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {jenjang?.tipe}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Siswa Aktif</p>
                {k.anggota.filter(a => a.status === 'aktif').map(siswa => (
                  <div key={siswa.siswa_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{siswa.nama}</p>
                      <p className="text-xs text-gray-400">{siswa.asal_kelas}</p>
                    </div>
                    <button 
                      onClick={() => handleNaikJenjang({
                        id: siswa.siswa_id,
                        nama: siswa.nama,
                        jenjang_saat_ini: k.jenjang_id
                      }, k.id)}
                      className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs hover:bg-orange-200"
                    >
                      🚀 Naik
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {modalSiswa && (
        <NaikJenjangModal 
          siswa={modalSiswa}
          kelompokId={modalKelompokId}
          onClose={() => {
            setModalSiswa(null);
            setModalKelompokId(null);
          }}
          onSuccess={() => {
            setKelompok(getKelompokByGuru(guruId));
          }}
        />
      )}
    </div>
  );
}