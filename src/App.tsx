/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  BookOpen, 
  Award, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  ShieldAlert, 
  Check,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STUDENT_RECORDS, SCHOOL_CONFIG } from './data';
import { generateIndividualPDF } from './utils/pdfGenerator';
import Emblem from './components/Emblem';

export default function App() {
  // State variables
  const [searchNoPeserta, setSearchNoPeserta] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<typeof STUDENT_RECORDS[0] | null>(null);
  const [loginError, setLoginError] = useState('');
  
  // Tab states for administrative views
  const [activeTab] = useState<'portal'>('portal');
  
  // Show instructions state
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionsModal, setInstructionsModal] = useState(false);

  // Privacy toggles to hide/sensor student lists
  const [maskNames, setMaskNames] = useState(true);

  // Verification prompt state for individual student detail/raport checks
  const [pendingVerifyStudent, setPendingVerifyStudent] = useState<typeof STUDENT_RECORDS[0] | null>(null);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyError, setVerifyError] = useState('');

  // Helper to mask name for privacy (e.g., "ANNISA RAMADHANI" -> "A****A R*******I")
  const maskName = (name: string) => {
    return name.split(' ').map(part => {
      if (part.length <= 1) return part;
      if (part.length === 2) return part[0] + '*';
      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    }).join(' ');
  };

  // Normalize candidate numbers to avoid login failure on minor formatting differences
  const normalizeInput = (input: string) => {
    return input.trim().toUpperCase().replace(/\s+/g, '');
  };

  // Handle individual verification form submission
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    if (!pendingVerifyStudent) return;

    const normalizedInputVal = normalizeInput(verifyInput);
    const correctNoPeserta = normalizeInput(pendingVerifyStudent.nomorPeserta);
    const correctNisn = normalizeInput(pendingVerifyStudent.nisn);

    if (normalizedInputVal === correctNoPeserta || normalizedInputVal === correctNisn) {
      setLoggedInStudent(pendingVerifyStudent);
      setPendingVerifyStudent(null);
      setVerifyInput('');
      const avg = (pendingVerifyStudent.matematika.score + pendingVerifyStudent.bahasaIndonesia.score) / 2;
      if (avg >= 70) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } else {
      setVerifyError('Verifikasi gagal. Nomor peserta atau NISN tidak cocok dengan data siswa ini.');
    }
  };

  // Handle student login submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!searchNoPeserta.trim()) {
      setLoginError('Silakan masukkan Nomor Peserta ujian Anda terlebih dahulu.');
      return;
    }

    const normalizedSearch = normalizeInput(searchNoPeserta);
    const found = STUDENT_RECORDS.find(
      (student) => 
        normalizeInput(student.nomorPeserta) === normalizedSearch || 
        normalizeInput(student.nisn) === normalizedSearch
    );

    if (found) {
      setLoggedInStudent(found);
      setTimeout(() => {
        // Trigger celebratory confetti if average is great (> 70)
        const avg = (found.matematika.score + found.bahasaIndonesia.score) / 2;
        if (avg >= 70) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }, 100);
    } else {
      setLoginError('Nomor Peserta atau NISN tidak ditemukan. Harap periksa kembali nomor ujian Anda sesuai kartu ujian.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 transition-all">
      {/* Official Government Flag Banner Decor */}
      <div className="h-2 w-full bg-gradient-to-r from-red-500 via-red-500 to-white flex border-b border-rose-300">
        <div className="w-1/2 bg-red-600"></div>
        <div className="w-1/2 bg-white"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Portal Branding Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
          <div className="flex items-center gap-4 text-center md:text-left w-full md:w-auto">
            <div className="p-2.5 bg-white shadow-md rounded-2xl border border-slate-100 flex items-center justify-center mx-auto md:mx-0">
              <Emblem className="w-16 h-16 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Portal Pengumuman Hasil Akademik Resmi
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                SD NEGERI 1 ASEMBAGUS
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium font-bold">
                Dinas Pendidikan dan Kebudayaan Kabupaten Situbondo, Provinsi Jawa Timur
              </p>
            </div>
          </div>
        </header>

        {/* ==================== PORTAL TAB ==================== */}
        {activeTab === 'portal' && (
          <div className="space-y-8">
            {!loggedInStudent ? (
              // Centered Login view container
              <div className="max-w-xl mx-auto w-full">
                {/* Intro, Greetings, and login form */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
                  <div className="space-y-2">
                    <span className="bg-blue-50 text-blue-700 font-bold text-xs uppercase px-3 py-1 rounded-full border border-blue-200">
                      Pengumuman TKA TA 2025/2026
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Cek Hasil Ujian Mandiri Anda
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Selamat datang di portal pencarian mandiri Tes Kemampuan Akademik (TKA) SDN 1 Asembagus. 
                      Sesuai instrumen Dinas Pendidikan Kabupaten Situbondo, murid dapat melihat surat keterangan kelulusan 
                      dan rincian pencapaian subjek ujian secara mandiri dengan memasukkan nomor peserta ujian.
                    </p>
                  </div>

                  {/* Authentication Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="studentNoId" className="block text-sm font-bold text-slate-700">
                        Nomor Peserta Ujian / NISN Murid
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <input
                          id="studentNoId"
                          type="text"
                          value={searchNoPeserta}
                          onChange={(e) => setSearchNoPeserta(e.target.value)}
                          placeholder="Contoh: T1-26-05-32-0338-0003-6"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm sm:text-base focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium tracking-wide outline-none text-slate-800"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        *Masukkan nomor peserta lengkap sesuai dengan kartu atau isikan NISN nasional 10 digit Anda.
                      </p>
                    </div>

                    {loginError && (
                      <div className="flex gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-semibold items-start">
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        id="submit-login"
                        type="submit"
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                      >
                        <Search className="w-4.5 h-4.5" />
                        Periksa Hasil Ujian TKA
                      </button>
                      <button
                        id="instructions-btn"
                        type="button"
                        onClick={() => setInstructionsModal(true)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                      >
                        <HelpCircle className="w-4.5 h-4.5" />
                        Panduan Unduhan
                      </button>
                    </div>
                  </form>

                  {/* Complete instructions embedded */}
                  <div className="border-t border-slate-100 pt-5 mt-4">
                    <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-500" />
                      ALUR & INSTRUKSI PENGUNDUHAN DOKUMEN (PDF)
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2.5">
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                        <span>Isi kolom pencarian di atas dengan <strong>Nomor Peserta Ujian</strong> Anda secara akurat (cocokkan format).</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                        <span>Klik tombol <strong>"Periksa Hasil Ujian TKA"</strong> untuk membuka slip nilai resmi berstempel digital.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                        <span>Tekan tombol <strong>"Unduh Berkas PDF Hasil"</strong> untuk langsung mengonversi sertifikat menjadi dokumen digital berkualitas vektor resmi. Anda juga dapat memilih opsi cetak fisik.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              // Individual Student Report view upon Successful Log In!
              <div className="space-y-6 animate-fadeIn">
                {/* Back Link */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <p className="text-slate-700 text-sm font-bold">
                      Portal Sesi Murid: <span className="text-blue-700">{loggedInStudent.namaPeserta}</span> (Nomor: {loggedInStudent.nomorPeserta})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setLoggedInStudent(null);
                      setSearchNoPeserta('');
                    }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-rose-600 font-black px-4 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Keluar Sesi Portal
                  </button>
                </div>

                {/* Main certificate dashboard display */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Quick Actions, Score Badges, and Print guides */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 text-center space-y-5">
                      <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Award className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-lg text-slate-900">Unduh PDF Resmi</h3>
                        <p className="text-xs text-slate-500">
                          Sertifikat Anda telah selesai diverifikasi oleh Dinas Pendidikan Kabupaten Situbondo.
                        </p>
                      </div>

                      {/* Download Buttons */}
                      <div className="flex flex-col gap-2.5">
                        <button
                          id="btn-download-pdf-direct"
                          onClick={() => generateIndividualPDF(loggedInStudent, SCHOOL_CONFIG)}
                          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                          <Download className="w-4.5 h-4.5" />
                          Simpan Berkas PDF
                        </button>
                        <button
                          id="btn-print-directly"
                          onClick={() => window.print()}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 px-4 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                          <Printer className="w-4.5 h-4.5" />
                          Cetak Slip Nilai
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-3.5 text-left">
                        <button
                          onClick={() => setShowInstructions(!showInstructions)}
                          className="w-full text-xs text-blue-700 hover:underline font-bold flex items-center justify-between cursor-pointer"
                        >
                          <span>💡 Butuh panduan menyimpan ke HP/Laptop?</span>
                          <span className="text-[10px] bg-blue-50 px-2 py-0.5 rounded font-black">
                            {showInstructions ? 'Sembunyikan' : 'Buka'}
                          </span>
                        </button>
                        
                        {showInstructions && (
                          <div className="mt-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-2.5 leading-relaxed">
                            <p className="font-bold text-slate-800">Melalui Tombol "Simpan Berkas PDF":</p>
                            <p>Sistem akan mengompilasi data Anda langsung ke bentuk berkas PDF resmi berkualitas tinggi dan memulai unduhan otomatis ke perangkat Anda.</p>
                            <p className="font-bold text-slate-800">Melalui Tombol "Cetak Slip Nilai":</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Pilih tujuan cetak: <strong>"Simpan sebagai PDF (Save as PDF)"</strong> pada form print.</li>
                              <li>Gunakan tata letak (layout): <strong>"Potret (Portrait)"</strong>.</li>
                              <li>Centang opsi <strong>"Grafis latar belakang (Background graphics)"</strong> agar warna piagam tampil sempurna.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Result Analysis Indicator Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-4">
                      <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                        REKAP PENILAIAN AKADEMIK
                      </h4>
                      
                      {/* Interactive score breakdown */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-xs text-slate-400 uppercase tracking-wider block font-bold">Matematika</span>
                            <span className="text-sm font-mono font-bold text-slate-200">{loggedInStudent.matematika.score.toFixed(2)} / 100</span>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            loggedInStudent.matematika.category.includes('Baik')
                              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
                              : loggedInStudent.matematika.category === 'Memadai'
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                              : 'bg-rose-900/30 text-rose-400 border border-rose-800'
                          }`}>
                            {loggedInStudent.matematika.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-xs text-slate-400 uppercase tracking-wider block font-bold">Bahasa Indonesia</span>
                            <span className="text-sm font-mono font-bold text-slate-200">{loggedInStudent.bahasaIndonesia.score.toFixed(2)} / 100</span>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            loggedInStudent.bahasaIndonesia.category.includes('Baik')
                              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
                              : loggedInStudent.bahasaIndonesia.category === 'Memadai'
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                              : 'bg-rose-900/30 text-rose-400 border border-rose-800'
                          }`}>
                            {loggedInStudent.bahasaIndonesia.category}
                          </span>
                        </div>
                      </div>

                      {/* Cumulative review */}
                      <div className="border-t border-slate-800 pt-4 text-center space-y-1.5">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest block">Rerata Prestasi</span>
                        <div className="text-3xl font-black font-mono text-blue-400">
                          {((loggedInStudent.matematika.score + loggedInStudent.bahasaIndonesia.score) / 2).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-300">
                          Status: <span className="font-extrabold text-blue-300">
                            {((loggedInStudent.matematika.score + loggedInStudent.bahasaIndonesia.score) / 2) >= 60 ? 'Memenuhi Standar Kelayakan' : 'Perlu Bimbingan Tambahan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Physical document high-fidelity paper pratinjau */}
                  <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                    <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-500" />
                        <h3 className="font-bold text-sm text-slate-700">PRATINJAU DOKUMEN RESMI (KERTAS A4)</h3>
                      </div>
                      <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-300 font-bold font-mono">
                        Hasil Terbit
                      </span>
                    </div>

                    {/* Paper Area (Print container with class 'printable-document') */}
                    <div id="printable-area" className="p-8 sm:p-12 md:p-14 bg-white printable-document text-slate-800">
                      
                      {/* Kop Surat Header */}
                      <div className="text-center relative pb-3 border-b-4 border-slate-800">
                        {/* School logo inside preview */}
                        <div className="hidden sm:block absolute left-2 top-1">
                          <Emblem className="w-16 h-16" />
                        </div>
                        <h4 className="text-[11px] sm:text-xs font-extrabold tracking-wider text-slate-700 uppercase">
                          KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH
                        </h4>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                          DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN SITUBONDO
                        </h3>
                        <h2 className="text-sm sm:text-lg font-black text-blue-800 uppercase tracking-wide">
                          SD NEGERI 1 ASEMBAGUS
                        </h2>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 italic font-medium">
                          NPSN: {SCHOOL_CONFIG.npsn} • Provinsi: JAWA TIMUR • Kabupaten: SITUBONDO • Kodepos: 68371
                        </p>
                        {/* Double border under school name */}
                        <div className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-slate-800"></div>
                      </div>

                      {/* Document Title Info */}
                      <div className="text-center mt-8 space-y-1">
                        <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 tracking-wide underline">
                          SURAT KETERANGAN HASIL TES KEMAMPUAN AKADEMIK
                        </h1>
                        <p className="text-[10px] font-mono text-slate-500">
                          Nomor: SK-TKA/0338/{loggedInStudent.noUrut.toString().padStart(4, '0')}/2026
                        </p>
                      </div>

                      {/* Brief info */}
                      <p className="text-xs leading-relaxed text-slate-700 mt-6 indent-8">
                        Kepala Sekolah Dasar Negeri 1 Asembagus, Kecamatan Asembagus, Kabupaten Situbondo menerangkan secara resmi bahwa:
                      </p>

                      {/* Student Biodata Sheet */}
                      <div className="mt-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                        <table className="w-full text-xs text-slate-700 font-medium">
                          <tbody>
                            <tr>
                              <td className="py-1.5 font-bold text-slate-900 w-1/3 sm:w-1/4">Nama Peserta</td>
                              <td className="py-1.5 font-bold text-slate-900 text-[13px] sm:text-[14px]">
                                : {loggedInStudent.namaPeserta}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-1.5 font-bold text-slate-500">Nomor Peserta</td>
                              <td className="py-1.5 font-mono text-slate-800">: {loggedInStudent.nomorPeserta}</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 font-bold text-slate-500">NISN Siswa</td>
                              <td className="py-1.5 font-mono text-slate-800">: {loggedInStudent.nisn}</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 font-bold text-slate-500">Tempat, Tgl Lahir</td>
                              <td className="py-1.5 text-slate-800">: {loggedInStudent.tempatLahir}, {loggedInStudent.tanggalLahir}</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 font-bold text-slate-500">Asal Satuan Pendidikan</td>
                              <td className="py-1.5 text-slate-800">: SD NEGERI 1 ASEMBAGUS</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Table Score Title */}
                      <p className="text-xs leading-relaxed text-slate-700 mt-5">
                        Telah mengikuti serangkaian evaluasi akademik yang diselenggarakan oleh Panitia Seleksi Bersama Dinas Pendidikan Kabupaten Situbondo dengan pencapaian prestasi akademik sebagai berikut:
                      </p>

                      {/* Table design */}
                      <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-slate-800 text-white border-b border-slate-700">
                              <th className="py-2.5 px-3 text-center w-12 border-r border-slate-700 font-bold">No.</th>
                              <th className="py-2.5 px-4 text-left border-r border-slate-700 font-bold">Mata Pelajaran</th>
                              <th className="py-2.5 px-4 text-center w-32 border-r border-slate-700 font-bold">Skor Nilai</th>
                              <th className="py-2.5 px-4 text-left font-bold">Kategori / Predikat</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-200">
                              <td className="py-2.5 px-3 text-center border-r border-slate-200 font-mono">1</td>
                              <td className="py-2.5 px-4 border-r border-slate-200 font-bold">Matematika</td>
                              <td className="py-2.5 px-4 text-center border-r border-slate-200 font-black font-mono">
                                {loggedInStudent.matematika.score.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className={`font-bold ${
                                  loggedInStudent.matematika.category.includes('Baik')
                                    ? 'text-emerald-600'
                                    : loggedInStudent.matematika.category === 'Memadai'
                                    ? 'text-blue-600'
                                    : 'text-rose-600'
                                }`}>
                                  {loggedInStudent.matematika.category}
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-slate-800">
                              <td className="py-2.5 px-3 text-center border-r border-slate-200 font-mono">2</td>
                              <td className="py-2.5 px-4 border-r border-slate-200 font-bold">Bahasa Indonesia</td>
                              <td className="py-2.5 px-4 text-center border-r border-slate-200 font-black font-mono">
                                {loggedInStudent.bahasaIndonesia.score.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className={`font-bold ${
                                  loggedInStudent.bahasaIndonesia.category.includes('Baik')
                                    ? 'text-emerald-600'
                                    : loggedInStudent.bahasaIndonesia.category === 'Memadai'
                                    ? 'text-blue-600'
                                    : 'text-rose-600'
                                }`}>
                                  {loggedInStudent.bahasaIndonesia.category}
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-slate-100 font-bold">
                              <td colSpan={2} className="py-2.5 px-4 text-right border-r border-slate-200">
                                Rerata Pencapaian Akademik
                              </td>
                              <td className="py-2.5 px-4 text-center border-r border-slate-200 font-black font-mono text-blue-800">
                                {((loggedInStudent.matematika.score + loggedInStudent.bahasaIndonesia.score) / 2).toFixed(2)}
                              </td>
                              <td className="py-2.5 px-4 text-slate-800">
                                {((loggedInStudent.matematika.score + loggedInStudent.bahasaIndonesia.score) / 2) >= 80 
                                  ? 'Sangat Memuaskan' 
                                  : ((loggedInStudent.matematika.score + loggedInStudent.bahasaIndonesia.score) / 2) >= 60 
                                  ? 'Memuaskan / Layak' 
                                  : 'Perlu Pendampingan'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Footer signatures */}
                      <div className="mt-10 grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-16">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-500 uppercase text-[10px]">Mengetahui,</p>
                            <p className="font-black text-slate-800">Kepala Dinas Pendidikan & Kebudayaan,</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 underline text-sm">{SCHOOL_CONFIG.kepalaDinas}</p>
                            <p className="text-slate-500 text-[10px]">NIP. {SCHOOL_CONFIG.nipKepalaDinas}</p>
                          </div>
                        </div>

                        <div className="space-y-16 text-right">
                          <div className="space-y-1">
                            <p className="text-slate-500 font-bold uppercase text-[10px]">Asembagus, {SCHOOL_CONFIG.tanggalPengumuman}</p>
                            <p className="font-black text-slate-800">Kepala SDN 1 Asembagus,</p>
                          </div>
                          <div className="relative inline-block text-right">
                            {/* Blue school circle stamp mockup overlay */}
                            <div className="absolute right-2 bottom-8 w-24 h-24 rounded-full border-4 border-blue-500/15 flex items-center justify-center rotate-[-12deg] pointer-events-none">
                              <div className="text-[7px] text-blue-500 font-extrabold text-center uppercase tracking-tighter">
                                SDN 1<br />ASEMBAGUS<br />SITUBONDO
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900 underline text-sm">{SCHOOL_CONFIG.kepalaSekolah}</p>
                              <p className="text-slate-500 text-[10px]">NIP. {SCHOOL_CONFIG.nipKepalaSekolah}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Digital verification bar of paper */}
                      <div className="mt-12 pt-4 border-t border-slate-200 flex items-start sm:items-center justify-between gap-4 text-[9px] text-slate-400">
                        <div className="space-y-1">
                          <p className="font-bold uppercase tracking-wide text-slate-500 text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
                            DOKUMEN SAH & TERVERIFIKASI ELEKTRONIK
                          </p>
                          <p>Kode Dokumen Keaslian: TKA-0338/{loggedInStudent.nisn}/{loggedInStudent.noUrut}</p>
                          <p className="italic">Dicetak dari basis data https://tka.kemendikdasmen.go.id</p>
                        </div>
                        {/* Barcode representation */}
                        <div className="flex gap-0.5 h-10 items-stretch bg-slate-900 p-1 rounded">
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[4px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



      </div>

      {/* FOOTER */}
      <footer className="mt-16 bg-slate-100 border-t border-slate-200 py-10 text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Emblem className="w-8 h-8 opacity-70" />
            <span className="font-extrabold text-slate-700 tracking-tight text-sm">SDN 1 ASEMBAGUS</span>
          </div>
          <p className="text-xs font-medium">
            Copyright © 2026 SDN 1 Asembagus d/h Dinas Pendidikan Situbondo. Seluruh data dilindungi kerahasiaannya.
          </p>
          <div className="text-[10px] text-slate-400 font-mono space-x-3">
            <span>Sistem Rilis: TKA0532D</span>
            <span>•</span>
            <span>Versi: 2.1-Stable</span>
            <span>•</span>
            <span>Ref: https://tka.kemendikdasmen.go.id</span>
          </div>
        </div>
      </footer>

      {/* DIRECT INSTRUCTIONS MODAL (POPUP DIALOG FOR CONVENIENT USE WITH GURU EMAIL METADATA) */}
      {instructionsModal && (
        <div className="fixed inset-0 bg-slate-900/65 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setInstructionsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Petunjuk Lengkap Unduhan</h3>
                <p className="text-xs text-slate-500">Mendukung berkas PDF Resmi Kabupaten Situbondo</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <p>Bagaimana cara mendapatkan dan mengunduh berkas laporan digital murid?</p>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">1. Unduh PDF Instan (Metode Rekomendasi):</p>
                <p>Cukup pilih murid bersangkutan, lalu klik tombol biru <strong>"Simpan Berkas PDF"</strong>. Berkas PDF formal terlisensi lengkap berukuran kecil akan terunduh otomatis.</p>
                
                <p className="font-bold text-slate-800">2. Melalui Printer / Print Dialog (Chrome/Edge):</p>
                <p>Klik tombol <strong>"Cetak Slip Nilai"</strong>. Ubah tujuan cetak/printer Anda ke <strong>"Save as PDF / Simpan sebagai PDF"</strong>, pastikan pilihan layout adalah <strong>Portrait</strong> dan pastikan menyalakan centang <strong>"Background graphics (Grafis Latar Belakang)"</strong> agar stempel kepala sekolah keluar dengan sempurna di lembar.</p>
              </div>

              <div className="flex gap-2 items-start bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-xs text-blue-800">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Format berkas ini valid diakui oleh Kementerian Pendidikan Dasar dan Menengah Tahun Ajaran 2025/2026.</span>
              </div>
            </div>

            <button
              id="close-instruction-modal"
              onClick={() => setInstructionsModal(false)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
            >
              Saya Mengerti & Siap Mengunduh
            </button>
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL FOR PRIVACY PROTECTION */}
      {pendingVerifyStudent && (
        <div className="fixed inset-0 bg-slate-900/65 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => {
                setPendingVerifyStudent(null);
                setVerifyInput('');
                setVerifyError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 leading-tight text-sm sm:text-base">Verifikasi Akses Mandiri</h3>
                <p className="text-[10px] text-slate-500">Hasil nilai siswa bersifat rahasia & dilindungi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <span className="text-slate-400 text-[9px] font-bold block uppercase tracking-wider">Pemilik Berkas</span>
                <span className="font-extrabold text-slate-850 text-slate-900 text-sm block">
                  {maskName(pendingVerifyStudent.namaPeserta)}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  NISN Terdaftar: {pendingVerifyStudent.nisn.substring(0, 4)}******
                </span>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="verifyNoId" className="block text-[11px] font-bold text-slate-700">
                    Masukkan Nomor Ujian Lengkap ATAU NISN 10-Digit
                  </label>
                  <input
                    id="verifyNoId"
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Contoh: T1-26-05-..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-400 font-bold tracking-wide outline-none text-slate-800"
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    *Masukkan data nomor ujian yang valid untuk nama murid di atas guna mengonfirmasi kepemilikan.
                  </p>
                </div>

                {verifyError && (
                  <div className="flex gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-[11px] font-semibold items-center">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1 font-bold text-xs uppercase tracking-wide">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingVerifyStudent(null);
                      setVerifyInput('');
                      setVerifyError('');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-350 py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer text-center font-black"
                  >
                    Buka Hasil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
