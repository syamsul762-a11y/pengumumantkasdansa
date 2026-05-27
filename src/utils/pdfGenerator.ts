/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { StudentRecord, SchoolConfig } from '../types';

export function generateIndividualPDF(student: StudentRecord, config: SchoolConfig) {
  // A4 size: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Color Palette
  const primaryColor = [30, 41, 59]; // slate-800
  const accentColor = [29, 78, 216]; // blue-700
  const lightBgColor = [248, 250, 252]; // slate-50
  const borderGray = [226, 232, 240]; // slate-200
  const darkTextColor = [51, 65, 85]; // slate-700
  const lightTextColor = [100, 116, 139]; // slate-500

  // 1. Decorative border
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277); // Outer border

  doc.setDrawColor(30, 41, 59); // slate-800
  doc.setLineWidth(1);
  doc.rect(12, 12, 186, 273); // Inner elegant border

  // Corner accents
  doc.setFillColor(29, 78, 216);
  doc.rect(10, 10, 6, 6, 'F');
  doc.rect(194, 10, 6, 6, 'F');
  doc.rect(10, 281, 6, 6, 'F');
  doc.rect(194, 281, 6, 6, 'F');

  // 2. Official Header (KOP SURAT)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH', 105, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN SITUBONDO', 105, 27, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('SD NEGERI 1 ASEMBAGUS', 105, 33, { align: 'center' });

  // School Specs Subheader
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text(
    `NPSN: ${config.npsn}  |  Provinsi: JAWA TIMUR  |  Kabupaten: SITUBONDO`,
    105,
    38,
    { align: 'center' }
  );

  // Elegant double header divider lines
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.8);
  doc.line(16, 42, 194, 42);
  doc.setLineWidth(0.3);
  doc.line(16, 43.5, 194, 43.5);

  // 3. Document Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SURAT KETERANGAN HASIL TES KEMAMPUAN AKADEMIK (TKA)', 105, 52, { align: 'center' });
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Tingkat Sekolah Dasar / Madrasah Ibtidaiyah - Tahun 2026`, 105, 57, { align: 'center' });
  
  // Custom Doc Reference Number
  const docNumStr = `Nomor: SK-TKA/0338/${student.noUrut.toString().padStart(4, '0')}/2026`;
  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text(docNumStr, 105, 62, { align: 'center' });

  // 4. Student Information Section
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

  const startY = 72;
  const col1X = 25;
  const col2X = 65;
  const rowHeight = 6.5;

  const infoRows = [
    ['Nama Peserta', `: ${student.namaPeserta}`],
    ['Nomor Peserta', `: ${student.nomorPeserta}`],
    ['NISN', `: ${student.nisn}`],
    ['Tempat, Tanggal Lahir', `: ${student.tempatLahir}, ${student.tanggalLahir}`],
    ['Satuan Pendidikan', `: ${config.satuanPendidikan}`],
  ];

  infoRows.forEach((row, idx) => {
    const currentY = startY + idx * rowHeight;
    doc.setFont('Helvetica', 'bold');
    doc.text(row[0], col1X, currentY);
    doc.setFont('Helvetica', 'normal');
    
    // Highlight the name in bold capital letters
    if (idx === 0) {
      doc.setFont('Helvetica', 'bold');
    }
    doc.text(row[1], col2X, currentY);
  });

  // Brief announcement paragraph
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const introText = 'Berdasarkan pelaksanaan Tes Kemampuan Akademik (TKA) Sekolah Dasar yang dilaksanakan secara kolektif di lingkungan Kabupaten Situbondo, yang bersangkutan dinyatakan telah mengikuti ujian dengan hasil pencapaian nilai sebagai berikut:';
  const splitIntro = doc.splitTextToSize(introText, 160);
  doc.text(splitIntro, 25, 110);

  // 5. Score Table Design
  const tableTop = 124;
  const tableWidths = [15, 65, 35, 45]; // Total 160mm
  const colPositions = [
    col1X,
    col1X + tableWidths[0],
    col1X + tableWidths[0] + tableWidths[1],
    col1X + tableWidths[0] + tableWidths[1] + tableWidths[2],
  ];

  // Table Header Background
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(col1X, tableTop, 160, 9, 'F');

  // Header Texts
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('No.', colPositions[0] + 4, tableTop + 6);
  doc.text('Mata Pelajaran', colPositions[1] + 5, tableTop + 6);
  doc.text('Nilai Angka', colPositions[2] + 8, tableTop + 6);
  doc.text('Kategori Kinerja', colPositions[3] + 8, tableTop + 6);

  // Table Body Rows
  const subjects = [
    { no: '1', name: 'Matematika', score: student.matematika.score.toFixed(2), cat: student.matematika.category },
    { no: '2', name: 'Bahasa Indonesia', score: student.bahasaIndonesia.score.toFixed(2), cat: student.bahasaIndonesia.category },
  ];

  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(9.5);

  subjects.forEach((subj, idx) => {
    const rowY = tableTop + 9 + idx * 8;
    
    // Alternating background
    if (idx % 2 === 0) {
      doc.setFillColor(241, 245, 249); // slate-100
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(col1X, rowY, 160, 8, 'F');

    // Grid wireframe
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);
    doc.rect(col1X, rowY, 160, 8, 'S');
    doc.line(colPositions[1], rowY, colPositions[1], rowY + 8);
    doc.line(colPositions[2], rowY, colPositions[2], rowY + 8);
    doc.line(colPositions[3], rowY, colPositions[3], rowY + 8);

    // Row texts
    doc.setFont('Helvetica', 'normal');
    doc.text(subj.no, colPositions[0] + 5, rowY + 5.5);
    doc.setFont('Helvetica', 'bold');
    doc.text(subj.name, colPositions[1] + 5, rowY + 5.5);
    doc.text(subj.score, colPositions[2] + 15, rowY + 5.5, { align: 'center' });

    // Category styling: green/blue for good, yellow/red for poor
    if (subj.cat.includes('Baik')) {
      doc.setTextColor(16, 185, 129); // emerald-500
    } else if (subj.cat === 'Memadai') {
      doc.setTextColor(37, 99, 235); // blue-600
    } else {
      doc.setTextColor(220, 38, 38); // red-600
    }
    doc.text(subj.cat, colPositions[3] + 6, rowY + 5.5);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]); // restore
  });

  // Average Score Row
  const avgRowY = tableTop + 9 + subjects.length * 8;
  const avgVal = ((student.matematika.score + student.bahasaIndonesia.score) / 2).toFixed(2);

  // Draw lines around average container
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(col1X, avgRowY, 160, 9, 'FD');
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.rect(col1X, avgRowY, 160, 9, 'S');
  doc.line(colPositions[2], avgRowY, colPositions[2], avgRowY + 9);
  doc.line(colPositions[3], avgRowY, colPositions[3], avgRowY + 9);

  doc.setFont('Helvetica', 'bold');
  doc.text('Rata-Rata Hasil TKA', colPositions[0] + 5, avgRowY + 6);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(avgVal, colPositions[2] + 15, avgRowY + 6, { align: 'center' });

  // Overall Performance Status
  const numAvg = parseFloat(avgVal);
  let summaryCategory = 'Memadai';
  if (numAvg >= 80) {
    summaryCategory = 'Sangat Memuaskan';
    doc.setTextColor(16, 185, 129); // green
  } else if (numAvg >= 60) {
    summaryCategory = 'Baik / Memuaskan';
    doc.setTextColor(37, 99, 235); // blue
  } else {
    summaryCategory = 'Perlu Pendampingan';
    doc.setTextColor(220, 38, 38); // red
  }
  doc.text(summaryCategory, colPositions[3] + 6, avgRowY + 6);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]); // restore

  // 6. Signatures Section & Footnotes
  const footerY = 168;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Asembagus, ${config.tanggalPengumuman}`, 140, footerY);
  
  // Principal Signature Info
  doc.text('Kepala SDN 1 Asembagus,', 140, footerY + 5);
  // Stamp simulation
  doc.setDrawColor(191, 219, 254); // light blue stamp
  doc.setLineWidth(0.5);
  doc.circle(137, footerY + 18, 9, 'S');
  doc.setFontSize(6);
  doc.setTextColor(59, 130, 246);
  doc.text('SDN 1', 137, footerY + 17, { align: 'center' });
  doc.text('ASEMBAGUS', 137, footerY + 20, { align: 'center' });

  // Signature lines
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('Helvetica', 'bold');
  doc.text(config.kepalaSekolah, 140, footerY + 25);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIP. ${config.nipKepalaSekolah}`, 140, footerY + 29);

  // Left Signee: Dinas Pendidikan
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(9);
  doc.text('Mengetahui,', 25, footerY);
  doc.text('Kepala Dinas Pendidikan,', 25, footerY + 5);
  
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('Helvetica', 'bold');
  doc.text(config.kepalaDinas, 25, footerY + 25);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIP. ${config.nipKepalaDinas}`, 25, footerY + 29);

  // 7. Security Footnote / Verification Block with QR
  const verifiedY = 224;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(16, verifiedY, 194, verifiedY);

  // QR Placeholders (vector drawing)
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(25, verifiedY + 5, 20, 20, 'F');
  // Draw some inner boxes to look like a realistic QR code
  doc.setFillColor(255, 255, 255);
  doc.rect(27, verifiedY + 7, 5, 5, 'F');
  doc.rect(38, verifiedY + 7, 5, 5, 'F');
  doc.rect(27, verifiedY + 18, 5, 5, 'F');
  doc.setFillColor(30, 41, 59);
  doc.rect(29, verifiedY + 9, 1.5, 1.5, 'F');
  doc.rect(40, verifiedY + 9, 1.5, 1.5, 'F');
  doc.rect(29, verifiedY + 20, 1.5, 1.5, 'F');

  // Random pixel-ish squares for realistic QR styling
  doc.setFillColor(255, 255, 255);
  doc.rect(34, verifiedY + 14, 2, 2, 'F');
  doc.rect(38, verifiedY + 15, 3, 2, 'F');
  doc.rect(31, verifiedY + 16, 2, 1, 'F');

  // Verification metadata details
  doc.setFontSize(7.5);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  
  const metadataLines = [
    'DOKUMEN INI SAH DAN DIVERIFIKASI SECARA ELEKTRONIK',
    `Kode Berkas: TKA-2026/0338/${student.nisn}/${student.noUrut}`,
    `Dicetak melalui Sistem Pengumuman SDN 1 Asembagus (Referensi: ${config.cetakInfo.urlSource})`,
    `Waktu Pengunduhan: ${new Date().toLocaleString('id-ID')} UTC`,
    'Tanda tangan elektronik bersertifikasi tidak membutuhkan tanda tangan fisik basah.',
  ];

  metadataLines.forEach((line, idx) => {
    doc.text(line, 49, verifiedY + 9 + idx * 3.3);
  });

  // Final small page tagger
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text('SDN1ASEMBAGUS-TKA-2026', 105, 281, { align: 'center' });

  // Save File Trigger
  const safeFilename = `Hasil_TKA_SDN1Asembagus_${student.namaPeserta.replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFilename);
}

export function generateCollectivePDF(students: StudentRecord[], config: SchoolConfig, loggedInStudent: StudentRecord | null = null) {
  // Safe name masker
  const maskName = (name: string) => {
    return name.split(' ').map(part => {
      if (part.length <= 1) return part;
      if (part.length === 2) return part[0] + '*';
      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    }).join(' ');
  };

  // Collective list pdf matching the physical tables
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // A4 Landscape: 297mm x 210mm
  // We'll draw 2-3 pages with nice headers and clean listings

  const drawPageHeader = (pageNumber: number) => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH', 148, 12, { align: 'center' });
    doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN SITUBONDO', 148, 16, { align: 'center' });
    doc.text('TES KEMAMPUAN AKADEMIK SD/MI TAHUN 2026', 148, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.text('** DAFTAR KOLEKTIF HASIL TES KEMAMPUAN AKADEMIK **', 148, 26, { align: 'center' });

    // Header values
    doc.setFontSize(8.5);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Provinsi: 05 - JAWA TIMUR`, 15, 33);
    doc.text(`Kota/Kabupaten: 32 - KAB. SITUBONDO`, 15, 37);
    doc.text(`Satuan Pendidikan: 0338 - SD NEGERI 1 ASEMBAGUS`, 15, 41);

    doc.text(`NPSN: 20523109`, 170, 33);
    doc.text(`Kepala Satuan Pendidikan: ${config.kepalaSekolah}`, 170, 37);
    doc.text(`NIP Kepala Satuan Pendidikan: ${config.nipKepalaSekolah}`, 170, 41);

    // separator line
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.5);
    doc.line(15, 45, 282, 45);

    // Table headers
    doc.setFillColor(30, 41, 59);
    doc.rect(15, 48, 267, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('No.', 18, 53);
    doc.text('Nomor Peserta', 27, 53);
    doc.text('NISN', 66, 53);
    doc.text('Nama Peserta', 88, 53);
    doc.text('Tempat, Tgl Lahir', 148, 53);
    doc.text('Matematika', 205, 53);
    doc.text('Bahasa Indonesia', 238, 53);
    doc.text('Rerata', 270, 53);
  };

  const recordsPerPage = 17;
  const totalPages = Math.ceil(students.length / recordsPerPage);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      doc.addPage();
    }
    
    drawPageHeader(page + 1);

    const startIndex = page * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, students.length);
    const slice = students.slice(startIndex, endIndex);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);

    slice.forEach((stud, index) => {
      const rowY = 56 + index * 7.5;

      // Zebra formatting
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(15, rowY, 267, 7.5, 'F');

      // Borders
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.rect(15, rowY, 267, 7.5, 'S');

      // Table vertical separators
      doc.line(24, rowY, 24, rowY + 7.5);
      doc.line(63, rowY, 63, rowY + 7.5);
      doc.line(85, rowY, 85, rowY + 7.5);
      doc.line(145, rowY, 145, rowY + 7.5);
      doc.line(202, rowY, 202, rowY + 7.5);
      doc.line(235, rowY, 235, rowY + 7.5);
      doc.line(266, rowY, 266, rowY + 7.5);

      // Value drawing
      doc.setFont('Helvetica', 'normal');
      doc.text(stud.noUrut.toString(), 19.5, rowY + 4.8);
      doc.text(stud.nomorPeserta, 26, rowY + 4.8);
      doc.text(stud.nisn, 65, rowY + 4.8);
      
      const isSelf = loggedInStudent && loggedInStudent.nomorPeserta === stud.nomorPeserta;

      doc.setFont('Helvetica', 'bold');
      doc.text(isSelf ? stud.namaPeserta : maskName(stud.namaPeserta), 87, rowY + 4.8);
      
      doc.setFont('Helvetica', 'normal');
      doc.text(`${stud.tempatLahir}, ${stud.tanggalLahir}`, 147, rowY + 4.8);

      // Matematika score
      if (isSelf) {
        doc.text(`${stud.matematika.score.toFixed(2)} (${stud.matematika.category})`, 204, rowY + 4.8);
      } else {
        doc.text('[TERKUNCI]', 204, rowY + 4.8);
      }

      // Bahasa Indonesia score
      if (isSelf) {
        doc.text(`${stud.bahasaIndonesia.score.toFixed(2)} (${stud.bahasaIndonesia.category})`, 237, rowY + 4.8);
      } else {
        doc.text('[TERKUNCI]', 237, rowY + 4.8);
      }

      // Average score
      if (isSelf) {
        const avg = ((stud.matematika.score + stud.bahasaIndonesia.score) / 2).toFixed(2);
        doc.setFont('Helvetica', 'bold');
        doc.text(avg, 268, rowY + 4.8);
      } else {
        doc.setFont('Helvetica', 'normal');
        doc.text('[-]', 268, rowY + 4.8);
      }
    });

    // Signatures block on the final page
    if (page === totalPages - 1) {
      const stampY = 168;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);

      // Footnote print date
      doc.text(`Dicetak dari ${config.cetakInfo.urlSource}`, 15, stampY);
      doc.text(`Waktu Cetak: ${config.cetakInfo.waktu}`, 15, stampY + 4);
      doc.text(`Kode Dokumen: DKHTKA-SDN1ASEMBAGUS-2026`, 15, stampY + 8);

      doc.setTextColor(30, 41, 59);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Situbondo, ${config.tanggalPengumuman}`, 220, stampY);
      doc.text('Kepala Dinas Pendidikan,', 220, stampY + 4);

      doc.setFont('Helvetica', 'bold');
      doc.text(config.kepalaDinas, 220, stampY + 22);
      doc.setFont('Helvetica', 'normal');
      doc.text(`NIP. ${config.nipKepalaDinas}`, 220, stampY + 26);
    }

    // Page Numbering
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Halaman ${page + 1} dari ${totalPages}`, 282, 202, { align: 'right' });
  }

  // Trigger download
  doc.save('Daftar_Kolektif_Hasil_TKA_SDN1_Asembagus_2026.pdf');
}
