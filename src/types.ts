/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentScore {
  score: number;
  category: 'Baik - Istimewa' | 'Baik' | 'Memadai' | 'Kurang';
}

export interface StudentRecord {
  noUrut: number;
  nomorPeserta: string;
  nisn: string;
  namaPeserta: string;
  tempatLahir: string;
  tanggalLahir: string;
  matematika: StudentScore;
  bahasaIndonesia: StudentScore;
  keterangan?: string;
}

export interface SchoolConfig {
  provinsi: string;
  kotaKabupaten: string;
  satuanPendidikan: string;
  npsn: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  tanggalPengumuman: string;
  kepalaDinas: string;
  nipKepalaDinas: string;
  cetakInfo: {
    urlSource: string;
    oleh: string;
    waktu: string;
  };
}
