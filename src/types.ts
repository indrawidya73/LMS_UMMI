export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  refId?: number;
}

export interface Guru {
  id: number;
  nip: string;
  nama: string;
  jabatan: string;
  jenisKelamin: 'L' | 'P';
  noTelp: string;
  alamat: string;
  kelasId?: number;
  jilidAjar?: JilidType[];
}

export type JilidType =
  | 'Jilid 1'
  | 'Jilid 2'
  | 'Jilid 3'
  | 'Jilid 4'
  | 'Jilid 5'
  | 'Jilid 6'
  | "Al Qur'an"
  | 'Tajwid'
  | 'GHORIB';

export const JILID_OPTIONS: JilidType[] = [
  'Jilid 1',
  'Jilid 2',
  'Jilid 3',
  'Jilid 4',
  'Jilid 5',
  'Jilid 6',
  "Al Qur'an",
  'Tajwid',
  'GHORIB',
];

export interface Siswa {
  id: number;
  nis: string;
  nama: string;
  kelasId: number;
  jilid: JilidType;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  namaWali: string;
  noTelpWali: string;
  alamat: string;
}

export interface Kelas {
  id: number;
  nama: string;
  tingkat: number;
  waliKelas: string;
  kapasitas: number;
}

export interface TahunAjaran {
  id: number;
  tahun: string;
  semester: 'Ganjil' | 'Genap';
  aktif: boolean;
}

export type StatusAbsen = 'H' | 'S' | 'I' | 'A';

export interface Absensi {
  siswaId: number;
  kelasId: number;
  tahunAjaranId: number;
  pertemuan: number;
  tanggal: string;
  status: StatusAbsen;
}

export interface Pertemuan {
  pertemuan: number;
  tanggal: string;
}

export interface Penilaian {
  siswaId: number;
  kelasId: number;
  tahunAjaranId: number;
  jilid: JilidType;
  teoriMembaca: {
    hafal: number;
    kelancaran: number;
    fasoha: number;
    tartil: number;
  };
  tahfidz: {
    juz1: number;
    juz30: number;
    juz29_28: number;
  };
  ketidakhadiran: {
    sakit: number;
    izin: number;
    alpha: number;
  };
  perilaku: {
    disiplin: string;
    kerapian: string;
    kesopanan: string;
    kebersihan: string;
  };
  teoriMembacaNilai: {
    hafalan: string;
    kelancaran: string;
    fasoha: string;
    tartil: string;
    juz30: string;
    juz29_30: string;
  };
  tahfidzNilai: {
    hafalan: string;
    kelancaran: string;
    fasoha: string;
    tartil: string;
  };
}

export interface AppData {
  guru: Guru[];
  siswa: Siswa[];
  kelas: Kelas[];
  tahunAjaran: TahunAjaran[];
  absensi: Absensi[];
  pertemuan: Pertemuan[];
  penilaian: Penilaian[];
  users: User[];
  penilaianHarian?: PenilaianHarian[];
}

// ===== Kartu Prestasi Siswa (Penilaian Harian Guru UMMI) =====
export interface PenilaianHarian {
  id: number;
  siswaId: number;
  guruId?: number;
  tahunAjaranId: number;
  tatapMuka: number;
  tanggal: string;
  hafalanSurat: string;
  hafalanAyat: string;
  ummiJilidSurat: string;
  ummiHalAyat: string;
  materi: string;
  nilai: string;
  disimakGuru: string;
  disimakOrtu: string;
  keterangan: string;
}