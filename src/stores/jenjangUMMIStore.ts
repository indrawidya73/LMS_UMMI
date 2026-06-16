export interface JenjangUMMI {
  id: string;
  nama: string;
  tingkat: number;
  tipe: 'ummi' | 'tahfidz' | 'kombinasi';
  next: string[];
}

export const jenjangUMMI: JenjangUMMI[] = [
  { id: 'J1', nama: 'Jilid 1', tingkat: 1, tipe: 'ummi', next: ['J2'] },
  { id: 'J2', nama: 'Jilid 2', tingkat: 2, tipe: 'ummi', next: ['J3'] },
  { id: 'J3', nama: 'Jilid 3', tingkat: 3, tipe: 'ummi', next: ['J4'] },
  { id: 'J4', nama: 'Jilid 4', tingkat: 4, tipe: 'ummi', next: ['J5'] },
  { id: 'J5', nama: 'Jilid 5', tingkat: 5, tipe: 'ummi', next: ['J6'] },
  { id: 'J6', nama: 'Jilid 6', tingkat: 6, tipe: 'ummi', next: ['T1', 'K1'] },
  { id: 'T1', nama: 'Juz 30', tingkat: 7, tipe: 'tahfidz', next: ['T2'] },
  { id: 'T2', nama: 'Juz 29', tingkat: 8, tipe: 'tahfidz', next: ['T3'] },
  { id: 'T3', nama: 'Juz 1', tingkat: 9, tipe: 'tahfidz', next: ['T4'] },
  { id: 'T4', nama: 'Tajwid', tingkat: 10, tipe: 'tahfidz', next: ['T5'] },
  { id: 'T5', nama: 'Ghorib', tingkat: 11, tipe: 'tahfidz', next: [] },
  { id: 'K1', nama: 'Jilid 6 + Tahfidz', tingkat: 12, tipe: 'kombinasi', next: ['T1'] }
];

export const getJenjangById = (id: string): JenjangUMMI | undefined => 
  jenjangUMMI.find(j => j.id === id);

export const getNextJenjang = (id: string): JenjangUMMI[] => {
  const current = getJenjangById(id);
  return current ? current.next.map(nextId => getJenjangById(nextId)!).filter(Boolean) : [];
};