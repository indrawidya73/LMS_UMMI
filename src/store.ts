import { AppData, Guru, Siswa, Kelas, TahunAjaran, Absensi, Pertemuan, Penilaian, User, JilidType, PenilaianHarian } from './types';

const STORAGE_KEY = 'ummi_mi_islamiyah_data_v4';

function getDefaultData(): AppData {
  const guruList: Guru[] = [
    { id: 1, nip: '198507122005012003', nama: 'Nur Kholifah, S.Pd.I', jabatan: 'Kepala Madrasah', jenisKelamin: 'P', noTelp: '081234567890', alamat: 'Jl. Sulfat Agung No. 172, Malang', jilidAjar: [] },
    { id: 2, nip: '198501012010011001', nama: 'M. Hairul Kamalluddin, S.Pd', jabatan: 'Guru Kelas 6C / Pengampu Al Qur\'an', jenisKelamin: 'L', noTelp: '081234567891', alamat: 'Jl. Veteran No. 45, Malang', kelasId: 13, jilidAjar: ["Al Qur'an", 'Tajwid'] },
    { id: 3, nip: '198601022011012002', nama: 'Siti Aminah, S.Pd.I', jabatan: 'Guru Kelas 1A / Pengampu Jilid 1', jenisKelamin: 'P', noTelp: '081234567892', alamat: 'Jl. Bendungan Sutami No. 12, Malang', kelasId: 1, jilidAjar: ['Jilid 1', 'Jilid 2'] },
    { id: 4, nip: '198702032012011003', nama: 'Ahmad Fauzi, S.Pd', jabatan: 'Guru Kelas 2A / Pengampu Jilid 3', jenisKelamin: 'L', noTelp: '081234567893', alamat: 'Jl. Mayjend Panjaitan No. 78, Malang', kelasId: 3, jilidAjar: ['Jilid 3', 'Jilid 4'] },
    { id: 5, nip: '198803042013012004', nama: 'Fatimah Az-Zahra, S.Pd.I', jabatan: 'Guru Kelas 3A / Pengampu Jilid 5', jenisKelamin: 'P', noTelp: '081234567894', alamat: 'Jl. Gatot Subroto No. 56, Malang', kelasId: 5, jilidAjar: ['Jilid 5', 'Jilid 6'] },
    { id: 6, nip: '198904052014012005', nama: 'Ustadzah Khodijah, S.Pd.I', jabatan: 'Pengampu UMMI GHORIB', jenisKelamin: 'P', noTelp: '081234567895', alamat: 'Jl. Sulfat Selatan No. 8, Malang', jilidAjar: ['GHORIB'] },
    { id: 7, nip: '199001062015011006', nama: 'Ustadz Abdullah, S.Pd', jabatan: 'Pengampu UMMI Tajwid', jenisKelamin: 'L', noTelp: '081234567896', alamat: 'Jl. Kalpataru No. 23, Malang', jilidAjar: ['Tajwid'] },
  ];

  const kelasList: Kelas[] = [
    { id: 1, nama: '1A', tingkat: 1, waliKelas: 'Siti Aminah, S.Pd.I', kapasitas: 30 },
    { id: 2, nama: '1B', tingkat: 1, waliKelas: 'Rina Astuti, S.Pd', kapasitas: 30 },
    { id: 3, nama: '2A', tingkat: 2, waliKelas: 'Ahmad Fauzi, S.Pd', kapasitas: 30 },
    { id: 4, nama: '2B', tingkat: 2, waliKelas: 'Dewi Sartika, S.Pd.I', kapasitas: 30 },
    { id: 5, nama: '3A', tingkat: 3, waliKelas: 'Fatimah Az-Zahra, S.Pd.I', kapasitas: 30 },
    { id: 6, nama: '3B', tingkat: 3, waliKelas: 'Muhammad Ali, S.Pd', kapasitas: 30 },
    { id: 7, nama: '4A', tingkat: 4, waliKelas: 'Khadijah, S.Pd.I', kapasitas: 30 },
    { id: 8, nama: '4B', tingkat: 4, waliKelas: 'Abdullah, S.Pd', kapasitas: 30 },
    { id: 9, nama: '5A', tingkat: 5, waliKelas: 'Aisyah, S.Pd.I', kapasitas: 30 },
    { id: 10, nama: '5B', tingkat: 5, waliKelas: 'Umar, S.Pd', kapasitas: 30 },
    { id: 11, nama: '6A', tingkat: 6, waliKelas: 'Ummu Kultsum, S.Pd.I', kapasitas: 30 },
    { id: 12, nama: '6B', tingkat: 6, waliKelas: 'Bilal, S.Pd', kapasitas: 30 },
    { id: 13, nama: '6C', tingkat: 6, waliKelas: 'M. Hairul Kamalluddin, S.Pd', kapasitas: 30 },
  ];

  const siswaNames: Array<{ nama: string; jilid: JilidType; jk: 'L' | 'P' }> = [
    { nama: 'Ahmad Gibran Argani', jilid: "Al Qur'an", jk: 'L' },
    { nama: 'Aisyah Azzahra Firmansyah', jilid: 'Jilid 5', jk: 'P' },
    { nama: 'Alfiyah Nazihaturrahmah', jilid: 'Jilid 6', jk: 'P' },
    { nama: 'Algaizzam Syahwafi Arramdhan', jilid: 'Jilid 5', jk: 'L' },
    { nama: 'Althaf Naafi Athaaya', jilid: 'Jilid 4', jk: 'L' },
    { nama: 'Almira Shakila Zahra', jilid: "Al Qur'an", jk: 'P' },
    { nama: 'Alvado Alkhumairo Gaahus', jilid: 'Jilid 4', jk: 'L' },
    { nama: 'Aaz Zahra Khal Thifa H Putri', jilid: 'Jilid 6', jk: 'P' },
    { nama: 'Balindra Khani Cato', jilid: 'Jilid 3', jk: 'L' },
    { nama: 'Binta Satria Mahardika', jilid: 'Jilid 4', jk: 'P' },
    { nama: 'Cinta Acarya Zahra', jilid: 'Jilid 4', jk: 'P' },
    { nama: 'Devenisa Amanda Setya Anugraha', jilid: 'Jilid 2', jk: 'P' },
    { nama: 'Gena Fatihah', jilid: "Al Qur'an", jk: 'P' },
    { nama: 'Ismail Muhammad Maulina', jilid: 'Jilid 2', jk: 'L' },
    { nama: 'Kenang Dhadipa Syathir Asyari', jilid: 'Jilid 3', jk: 'L' },
    { nama: 'Muhammad Risqi Mubarrok Ardiyanto', jilid: "Al Qur'an", jk: 'L' },
    { nama: 'Muhammad Zavier Fastinharevi', jilid: "Al Qur'an", jk: 'L' },
    { nama: 'Nailyyara Haniyyah Qoni', jilid: 'Jilid 4', jk: 'P' },
    { nama: 'Qimara Raisa Azizah', jilid: 'Jilid 3', jk: 'P' },
    { nama: 'Rakha Rais Rakhadiansyah', jilid: "Al Qur'an", jk: 'L' },
    { nama: 'Saffana Ghaniya Fatih Azzakiyah', jilid: 'Jilid 2', jk: 'P' },
    { nama: 'Sakinah Aisha Dhiyaulhaq', jilid: "Al Qur'an", jk: 'P' },
    { nama: 'Salsabila Aufa Pustika', jilid: 'Jilid 5', jk: 'P' },
    { nama: 'Sitara Hitzaz', jilid: 'Jilid 4', jk: 'P' },
    { nama: 'Syaqila Adzkiya Aqsha', jilid: 'Jilid 4', jk: 'P' },
  ];

  const siswaList: Siswa[] = siswaNames.map((s, idx) => ({
    id: idx + 1,
    nis: `2024${String(idx + 1).padStart(4, '0')}`,
    nama: s.nama,
    kelasId: 1,
    jilid: s.jilid,
    jenisKelamin: s.jk,
    tanggalLahir: '2015-01-15',
    namaWali: `Wali dari ${s.nama.split(' ')[0]}`,
    noTelpWali: '08123456789' + String(idx).padStart(2, '0'),
    alamat: `Jl. Sulfat Agung No. ${idx + 1}, Malang`,
  }));

  // Add more students for other classes
  const moreNames = [
    { nama: 'Ahmad Firdaus', jilid: 'Jilid 3' as JilidType, jk: 'L' as const },
    { nama: 'Nayla Khairani', jilid: 'Jilid 4' as JilidType, jk: 'P' as const },
    { nama: 'Rafi Pratama', jilid: 'Jilid 2' as JilidType, jk: 'L' as const },
    { nama: 'Zahra Aulia', jilid: 'Jilid 5' as JilidType, jk: 'P' as const },
    { nama: 'Rizky Hidayatullah', jilid: 'Jilid 6' as JilidType, jk: 'L' as const },
  ];
  moreNames.forEach((s, idx) => {
    siswaList.push({
      id: siswaList.length + 1,
      nis: `2024${String(siswaList.length + 1).padStart(4, '0')}`,
      nama: s.nama,
      kelasId: 2,
      jilid: s.jilid,
      jenisKelamin: s.jk,
      tanggalLahir: '2015-02-20',
      namaWali: `Wali ${s.nama.split(' ')[0]}`,
      noTelpWali: '081234567' + String(100 + idx).padStart(3, '0'),
      alamat: `Jl. Bendungan Sutami No. ${idx + 1}, Malang`,
    });
  });

  const tahunAjaranList: TahunAjaran[] = [
    { id: 1, tahun: '2024/2025', semester: 'Ganjil', aktif: false },
    { id: 2, tahun: '2024/2025', semester: 'Genap', aktif: true },
    { id: 3, tahun: '2025/2026', semester: 'Ganjil', aktif: false },
  ];

  const pertemuanList: Pertemuan[] = Array.from({ length: 16 }, (_, i) => ({
    pertemuan: i + 1,
    tanggal: new Date(2025, 5, 2 + i * 7).toISOString().split('T')[0],
  }));

  const absensiList: Absensi[] = [];
  siswaList.forEach((siswa) => {
    pertemuanList.forEach((p) => {
      const rand = Math.random();
      let status: 'H' | 'S' | 'I' | 'A' = 'H';
      if (rand > 0.9) status = 'S';
      else if (rand > 0.85) status = 'I';
      else if (rand > 0.82) status = 'A';
      absensiList.push({
        siswaId: siswa.id,
        kelasId: siswa.kelasId,
        tahunAjaranId: 2,
        pertemuan: p.pertemuan,
        tanggal: p.tanggal,
        status,
      });
    });
  });

  const nilaiHuruf = ['A', 'B+', 'B', 'C+', 'C'];
  const perilakuHuruf = ['A', 'B+', 'B', 'C+', 'C'];

  const penilaianList: Penilaian[] = siswaList.map((siswa) => {
    const tm = {
      hafal: 75 + Math.floor(Math.random() * 20),
      kelancaran: 75 + Math.floor(Math.random() * 20),
      fasoha: 75 + Math.floor(Math.random() * 20),
      tartil: 75 + Math.floor(Math.random() * 20),
    };
    const tz = {
      juz1: Math.floor(Math.random() * 5),
      juz30: Math.floor(Math.random() * 3),
      juz29_28: Math.floor(Math.random() * 3),
    };
    return {
      siswaId: siswa.id,
      kelasId: siswa.kelasId,
      tahunAjaranId: 2,
      jilid: siswa.jilid,
      teoriMembaca: tm,
      tahfidz: tz,
      ketidakhadiran: {
        sakit: Math.floor(Math.random() * 3),
        izin: Math.floor(Math.random() * 2),
        alpha: Math.floor(Math.random() * 2),
      },
      perilaku: {
        disiplin: perilakuHuruf[Math.floor(Math.random() * perilakuHuruf.length)],
        kerapian: perilakuHuruf[Math.floor(Math.random() * perilakuHuruf.length)],
        kesopanan: perilakuHuruf[Math.floor(Math.random() * perilakuHuruf.length)],
        kebersihan: perilakuHuruf[Math.floor(Math.random() * perilakuHuruf.length)],
      },
      teoriMembacaNilai: {
        hafalan: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        kelancaran: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        fasoha: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        tartil: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        juz30: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        juz29_30: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
      },
      tahfidzNilai: {
        hafalan: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        kelancaran: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        fasoha: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
        tartil: nilaiHuruf[Math.floor(Math.random() * nilaiHuruf.length)],
      },
    };
  });

  const usersList: User[] = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator Sistem' },
    { username: 'guru', password: 'guru123', role: 'guru', name: 'Nur Kholifah, S.Pd.I', refId: 1 },
    { username: 'hairul', password: 'hairul123', role: 'guru', name: 'M. Hairul Kamalluddin, S.Pd', refId: 2 },
    { username: 'siswa', password: 'siswa123', role: 'siswa', name: 'Ahmad Gibran Argani', refId: 1 },
    { username: 'aisyah', password: 'aisyah123', role: 'siswa', name: 'Aisyah Azzahra Firmansyah', refId: 2 },
  ];

  // Dummy data Kartu Prestasi Siswa (Penilaian Harian Guru UMMI)
  const suratList = ['Al-Fatihah', 'An-Nas', 'Al-Falaq', 'Al-Ikhlas', 'Al-Kafirun', 'Al-Kausar', 'Al-Maun', 'Quraisy', 'Al-Fil', 'Al-Humazah', 'Al-Asr'];
  const materiList = ['Pokok bahasan halaman', 'Ulangan jilid', 'Hafalan ayat', 'Tadarus surat pendek', 'Drill makhorijul huruf', 'Tartil bacaan'];
  const nilaiPilihan = ['A', 'A', 'B+', 'B+', 'B', 'B', 'C+'];
  const ketPilihan = ['Lancar', 'Cukup', 'Diulang', 'Lanjut', 'Bagus', 'Perlu latihan'];

  const penilaianHarianList: PenilaianHarian[] = [];
  let phId = 1;
  // Buat untuk 5 siswa pertama, masing-masing 8 baris tatap muka
  siswaList.slice(0, 5).forEach((s) => {
    for (let tm = 1; tm <= 8; tm++) {
      const tgl = new Date(2025, 5, 2 + tm * 3).toISOString().split('T')[0];
      const surat = suratList[(s.id + tm) % suratList.length];
      const ayat = String(1 + ((s.id + tm) % 6));
      const jilidPart = s.jilid.includes('Jilid') ? s.jilid.replace('Jilid ', '') : (s.jilid === "Al Qur'an" ? "Al Qur'an" : s.jilid);
      const hal = s.jilid === "Al Qur'an" ? `Juz ${1 + (tm % 5)}` : `Hal ${10 + tm}`;
      penilaianHarianList.push({
        id: phId++,
        siswaId: s.id,
        guruId: 3,
        tahunAjaranId: 2,
        tatapMuka: tm,
        tanggal: tgl,
        hafalanSurat: surat,
        hafalanAyat: ayat,
        ummiJilidSurat: String(jilidPart),
        ummiHalAyat: hal,
        materi: materiList[(s.id + tm) % materiList.length],
        nilai: nilaiPilihan[(s.id + tm) % nilaiPilihan.length],
        disimakGuru: 'Ustadzah Siti',
        disimakOrtu: tm % 2 === 0 ? 'Ortu' : '',
        keterangan: ketPilihan[(s.id + tm) % ketPilihan.length],
      });
    }
  });

  return {
    guru: guruList,
    siswa: siswaList,
    kelas: kelasList,
    tahunAjaran: tahunAjaranList,
    absensi: absensiList,
    pertemuan: pertemuanList,
    penilaian: penilaianList,
    users: usersList,
    penilaianHarian: penilaianHarianList,
  };
}

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load data', e);
  }
  const data = getDefaultData();
  saveData(data);
  return data;
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

export function resetData(): AppData {
  const data = getDefaultData();
  saveData(data);
  return data;
}

export function getNextId(list: { id: number }[]): number {
  if (list.length === 0) return 1;
  return Math.max(...list.map((item) => item.id)) + 1;
}