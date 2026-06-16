export interface AnggotaKelompok {
  siswa_id: string;
  nama: string;
  asal_kelas: string;
  tanggal_masuk: string;
  status: 'aktif' | 'lulus';
  tanggal_lulus?: string;
}

export interface KelompokUMMI {
  id: string;
  nama: string;
  jenjang_id: string;
  guru_pengampu_id: string;
  tingkat_sekolah: number;
  kelas_sumber: string[];
  tahun_ajaran: string;
  kapasitas: number;
  anggota: AnggotaKelompok[];
  aktif: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'lms_kelompok_ummi';

export const getKelompok = (): KelompokUMMI[] => 
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const saveKelompok = (data: KelompokUMMI[]) => 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const createKelompok = (data: Omit<KelompokUMMI, 'id' | 'anggota' | 'aktif' | 'createdAt'>): KelompokUMMI => {
  const kelompok = getKelompok();
  const newKelompok: KelompokUMMI = {
    id: `KUMMI-${Date.now()}`,
    ...data,
    anggota: [],
    aktif: true,
    createdAt: new Date().toISOString()
  };
  kelompok.push(newKelompok);
  saveKelompok(kelompok);
  return newKelompok;
};

export const addSiswaToKelompok = (kelompokId: string, siswa: { id: string; nama: string; kelas: string }): KelompokUMMI | null => {
  const kelompok = getKelompok();
  const k = kelompok.find(k => k.id === kelompokId);
  if (!k) return null;
  if (k.anggota.find(a => a.siswa_id === siswa.id)) return null;
  
  k.anggota.push({
    siswa_id: siswa.id,
    nama: siswa.nama,
    asal_kelas: siswa.kelas,
    tanggal_masuk: new Date().toISOString(),
    status: 'aktif'
  });
  
  saveKelompok(kelompok);
  return k;
};

export const naikJenjang = (siswaId: string, kelompokIdLama: string, jenjangBaruId: string): KelompokUMMI | null => {
  const kelompok = getKelompok();
  const kLama = kelompok.find(k => k.id === kelompokIdLama);
  if (!kLama) return null;
  
  const anggota = kLama.anggota.find(a => a.siswa_id === siswaId);
  if (anggota) {
    anggota.status = 'lulus';
    anggota.tanggal_lulus = new Date().toISOString();
  }
  
  const kBaru = kelompok.find(k => 
    k.jenjang_id === jenjangBaruId && 
    k.aktif && 
    k.anggota.length < k.kapasitas
  );
  
  saveKelompok(kelompok);
  return kBaru || null;
};

export const getKelompokByGuru = (guruId: string): KelompokUMMI[] => {
  return getKelompok().filter(k => k.guru_pengampu_id === guruId && k.aktif);
};