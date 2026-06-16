import { useState } from 'react';
import { getJenjangById, getNextJenjang } from '../stores/jenjangUMMIStore';
import { naikJenjang, getKelompok } from '../stores/kelompokUMMIStore';

export default function NaikJenjangModal({ siswa, kelompokId, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [availableKelompok, setAvailableKelompok] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentJenjang = getJenjangById(siswa.jenjang_saat_ini);
  const nextJenjangs = getNextJenjang(siswa.jenjang_saat_ini);

  const checkKelompok = (jenjangId) => {
    const allKelompok = getKelompok();
    const available = allKelompok.filter(k => 
      k.jenjang_id === jenjangId && 
      k.aktif && 
      k.anggota.length < k.kapasitas
    );
    setAvailableKelompok(available);
    setSelectedJenjang(jenjangId);
    setStep(3);
  };

  const handleNaik = (kelompokBaruId) => {
    setLoading(true);
    setTimeout(() => {
      const result = naikJenjang(siswa.id, kelompokId, selectedJenjang);
      if (result) {
        setStep(4);
        onSuccess?.();
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-xl">
          <h3 className="text-white font-bold text-lg">🚀 Naik Jenjang</h3>
          <p className="text-blue-100 text-sm">{siswa.nama} • {currentJenjang?.nama}</p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Siswa akan <strong>lulus</strong> dari {currentJenjang?.nama} dan pindah ke jenjang berikutnya.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Jenjang saat ini:</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-700">{currentJenjang?.nama}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                <button onClick={() => setStep(2)} className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Lanjutkan</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Pilih jenjang tujuan:</p>
              <div className="space-y-2">
                {nextJenjangs.map(j => (
                  <button key={j.id} onClick={() => checkKelompok(j.id)} className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-800">{j.nama}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${j.tipe === 'tahfidz' ? 'bg-green-100 text-green-700' : j.tipe === 'kombinasi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{j.tipe}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">← Kembali</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Pilih kelompok untuk <strong>{getJenjangById(selectedJenjang)?.nama}</strong>:</p>
              {availableKelompok.length === 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">⚠️ Tidak ada kelompok tersedia. Buat kelompok baru dulu!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableKelompok.map(k => (
                    <button key={k.id} onClick={() => handleNaik(k.id)} disabled={loading} className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left disabled:opacity-50">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{k.nama}</span>
                        <span className="text-sm text-gray-500">{k.anggota.length}/{k.kapasitas} siswa</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Kelas: {k.kelas_sumber.join(', ')}</p>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(2)} className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">← Kembali</button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h4 className="font-bold text-lg text-gray-800">Berhasil!</h4>
              <p className="text-gray-600">{siswa.nama} telah naik ke <strong>{getJenjangById(selectedJenjang)?.nama}</strong></p>
              <button onClick={onClose} className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Tutup</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}