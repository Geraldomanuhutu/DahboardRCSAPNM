import { useState, useMemo } from "react";

const F="'Source Sans 3',system-ui,sans-serif";
const FL="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800;900&display=swap";
const C={bg:"#f0f2f5",card:"#fff",dk:"#101828",sub:"#475467",mt:"#98a2b3",low:"#0d6832",lm:"#4ca768",mod:"#d4a843",mh:"#e07020",hi:"#c62828",bl:"#1d4ed8",or:"#ea580c"};
const RM=[["#0d6832","#0d6832","#0d6832","#4ca768","#4ca768"],["#0d6832","#0d6832","#4ca768","#a8d5a2","#a8d5a2"],["#0d6832","#4ca768","#a8d5a2","#a8d5a2","#f0e68c"],["#f0e0a0","#f0d060","#eaaa30","#eaaa30","#c62828"],["#f0e0a0","#eaaa30","#c62828","#c62828","#8b0000"]];
const EC={"Sangat Efektif":"#0d6832","Efektif":"#2e8b57","Cukup Efektif":"#d4a843","Kurang Efektif":"#e07020","Sangat Tidak Efektif":"#c62828"};
const JC={"Risiko Operasional":"#1d4ed8","Risiko Kredit":"#ea580c","Risiko Hukum":"#7c3aed","Risiko Kepatuhan":"#059669"};
const brCol=b=>b>=4?C.hi:b>=3.5?C.mh:b>=2.8?C.mod:b>=2?C.lm:C.low;
const brLvl=b=>b>=4?"High":b>=3.5?"Mod-High":b>=2.8?"Moderate":b>=2?"Low-Mod":"Low";
const EN={5:"Sangat Efektif",4:"Efektif",3:"Cukup Efektif",2:"Kurang Efektif",1:"Sangat Tidak Efektif"};

// ═══ 101 RISKS (idx matches kode order) ═══
const RISKS=[
{i:0,k:"R.HKM.MKR-2-1-1",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Dokumen PDPKM fiktif/tidak lengkap/tidak sesuai ketentuan",j:"Risiko Hukum",tl:3.04,td:3.16,br:10.11,bR:2.98,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:116,ct:"KUM reviu dan approval PDPKM"},
{i:1,k:"R.HKM.ULM-1-2-3",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Pembiayaan belum disetujui nasabah/pejabat berwenang",j:"Risiko Hukum",tl:2.45,td:3.38,br:9.48,bR:2.47,tr:"Moderate",tR:"Low",ef:"Sangat Efektif",n:58,ct:"KUU proses akad dan tanda tangan bersama"},
{i:2,k:"R.KPT.MKR-2-1-11",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Pencairan tidak sesuai syarat dan ketentuan",j:"Risiko Kepatuhan",tl:2.98,td:2.93,br:8.74,bR:3.53,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:107,ct:"KUM/SAO menandatangani dokumen FP4"},
{i:3,k:"R.KPT.ULM-3-2-6",s:"ULaMM",m:"Pembayaran Kredit ULaMM",sm:"Pelunasan Dini ULaMM",ev:"Permohonan pelunasan dini tidak terotorisasi",j:"Risiko Kepatuhan",tl:2.1,td:2.48,br:5.72,bR:2.16,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Pejabat Berwenang tanda tangan Memo"},
{i:4,k:"R.KRD.MKR-1-1-10",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Perhitungan angsuran calon nasabah tidak akurat",j:"Risiko Kredit",tl:3.8,td:3.85,br:15.56,bR:3.73,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:112,ct:"Mekaar Digi otomatis menghitung angsuran"},
{i:5,k:"R.KRD.MKR-1-1-12",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Informasi pembiayaan calon nasabah tidak akurat",j:"Risiko Kredit",tl:2.79,td:2.64,br:7.47,bR:3.22,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:110,ct:"Pejabat berwenang reviu FP4"},
{i:6,k:"R.KRD.MKR-1-1-2",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Penilaian pemberian kredit tidak akurat/tidak lengkap",j:"Risiko Kredit",tl:3.34,td:3.63,br:12.86,bR:3.34,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:109,ct:"Mekaar Digi notifikasi error pinjaman aktif"},
{i:7,k:"R.KRD.MKR-1-1-4",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Calon nasabah tidak sanggup lolos menjadi nasabah",j:"Risiko Kredit",tl:3.3,td:2.96,br:10.16,bR:3.38,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:111,ct:"Mekaar Digi menolak pembiayaan melebihi kapasitas"},
{i:8,k:"R.KRD.MKR-1-1-9",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Perhitungan biaya jasa tidak akurat",j:"Risiko Kredit",tl:3.46,td:3.8,br:13.68,bR:3.5,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:113,ct:"Mekaar Digi otomatis menghitung jasa/margin"},
{i:9,k:"R.KRD.MKR-1-2-1",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Nasabah tidak mampu melakukan pembayaran angsuran",j:"Risiko Kredit",tl:3.15,td:2.9,br:9.35,bR:3.28,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:119,ct:"Mekaar Digi blokir nasabah lanjutan bermasalah"},
{i:10,k:"R.KRD.MKR-1-2-10",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Informasi pembiayaan calon nasabah tidak akurat (lanjutan)",j:"Risiko Kredit",tl:2.76,td:2.7,br:7.55,bR:3.16,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:111,ct:"Pejabat berwenang reviu FP4"},
{i:11,k:"R.KRD.MKR-1-2-2",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Penilaian pemberian kredit tidak akurat (lanjutan)",j:"Risiko Kredit",tl:3.38,td:2.85,br:9.75,bR:3.03,tr:"Moderate",tR:"Moderate",ef:"Sangat Tidak Efektif",n:110,ct:"Mekaar Digi notifikasi error pinjaman aktif"},
{i:12,k:"R.KRD.MKR-1-2-3",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Calon nasabah tidak sanggup lolos (lanjutan)",j:"Risiko Kredit",tl:3.37,td:3.59,br:12.68,bR:3.76,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:115,ct:"Mekaar Digi menolak pembiayaan melebihi kapasitas"},
{i:13,k:"R.KRD.MKR-1-2-7",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Perhitungan biaya jasa tidak akurat (lanjutan)",j:"Risiko Kredit",tl:3.49,td:3.5,br:12.97,bR:3.41,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:111,ct:"Mekaar Digi otomatis menghitung jasa/margin"},
{i:14,k:"R.KRD.MKR-1-2-8",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Perhitungan angsuran calon nasabah tidak akurat (lanjutan)",j:"Risiko Kredit",tl:3.9,td:3.89,br:16.17,bR:3.72,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:112,ct:"Mekaar Digi otomatis menghitung angsuran"},
{i:15,k:"R.KRD.MKR-2-1-10",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Ketidaksesuaian data kewajiban angsuran per minggu/2 minggu",j:"Risiko Kredit",tl:3.95,td:4.05,br:16.98,bR:3.83,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:110,ct:"BR.Net otomatis menghitung installment"},
{i:16,k:"R.KRD.MKR-3-1-1",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penerimaan Pembayaran Nasabah",ev:"Perhitungan penerimaan pembayaran tidak akurat",j:"Risiko Kredit",tl:2.96,td:2.74,br:8.14,bR:3.2,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:107,ct:"BR.Net otomatis tampilkan angsuran"},
{i:17,k:"R.KRD.MKR-5-1-3",s:"Mekaar",m:"Penyelesaian Kredit",sm:"Penagihan Nasabah Bermasalah",ev:"Nominal pembayaran di sistem tidak sesuai uang diterima",j:"Risiko Kredit",tl:2.82,td:2.7,br:7.81,bR:3.27,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:108,ct:"KUM approval input FAO di BR.Net"},
{i:18,k:"R.KRD.MKR-5-2-2",s:"Mekaar",m:"Penyelesaian Kredit",sm:"3R - Rescheduling",ev:"Permohonan rescheduling fiktif/tidak sesuai kriteria",j:"Risiko Kredit",tl:3.83,td:3.83,br:15.33,bR:3.77,tr:"High",tR:"High",ef:"Efektif",n:108,ct:"AO/SAO dan KUM verifikasi data nasabah"},
{i:19,k:"R.KRD.MKR-5-2-3",s:"Mekaar",m:"Penyelesaian Kredit",sm:"3R - Rescheduling",ev:"Informasi kredit rescheduling tidak akurat di sistem",j:"Risiko Kredit",tl:3.04,td:3.02,br:9.22,bR:2.85,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:109,ct:"KUM/KAB verifikasi kesesuaian data"},
{i:20,k:"R.KRD.ULM-1-1-1",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Analisa informasi kredit kolektibilitas tidak akurat",j:"Risiko Kredit",tl:2.34,td:2.72,br:6.64,bR:2.22,tr:"Moderate",tR:"Moderate",ef:"Efektif",n:58,ct:"Marketline validasi mandatory field"},
{i:21,k:"R.KRD.ULM-1-1-4",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Perhitungan repayment capacity tidak tepat",j:"Risiko Kredit",tl:2.71,td:2.88,br:8.05,bR:2.53,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Marketline otomatis hitung repayment capacity"},
{i:22,k:"R.KRD.ULM-1-1-5",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Perhitungan rencana angsuran tidak sesuai",j:"Risiko Kredit",tl:2.12,td:2.64,br:6.0,bR:2.17,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Marketline otomatis cross collateral"},
{i:23,k:"R.KRD.ULM-1-1-7",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Analisa struktur pembiayaan/penilaian agunan tidak akurat",j:"Risiko Kredit",tl:2.5,td:2.81,br:7.26,bR:2.53,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"KUU reviu dan approval analisa kunjungan"},
{i:24,k:"R.KRD.ULM-1-1-9",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Proposal pembiayaan tidak sesuai kemampuan nasabah",j:"Risiko Kredit",tl:3.17,td:3.38,br:11.47,bR:3.19,tr:"Moderate",tR:"High",ef:"Efektif",n:58,ct:"CRA reviu dan analisa dokumen permohonan"},
{i:25,k:"R.KRD.ULM-1-2-2",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Perhitungan rencana angsuran tidak sesuai (pengikatan)",j:"Risiko Kredit",tl:2.0,td:2.0,br:4.0,bR:3.0,tr:"Moderate",tR:"Moderate",ef:"Cukup Efektif",n:1,ct:"MMS otomatis hitung angsuran"},
{i:26,k:"R.KRD.ULM-5-1-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengikatan Agunan ULaMM",ev:"Perpindahan dokumen agunan tidak terdeteksi (kredit)",j:"Risiko Kredit",tl:2.0,td:4.0,br:8.0,bR:5.0,tr:"Moderate",tR:"High",ef:"Cukup Efektif",n:1,ct:"KUU terima dokumen dan tandatangani BAST"},
{i:27,k:"R.KRD.ULM-6-1-6",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Proposal pembiayaan tidak sesuai kemampuan nasabah (3R)",j:"Risiko Kredit",tl:3.33,td:3.47,br:13.1,bR:3.31,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:58,ct:"CRA reviu dan analisa dokumen permohonan"},
{i:28,k:"R.KRD.ULM-6-2-1",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Agunan mengalami perbedaan nilai (lelang)",j:"Risiko Kredit",tl:2.0,td:2.0,br:4.0,bR:2.0,tr:"Moderate",tR:"Low to Moderate",ef:"Efektif",n:1,ct:"AOM retaksasi agunan sebelum lelang"},
{i:29,k:"R.OPS.MKR-1-1-1",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Output informasi nasabah tidak sesuai/tidak lengkap",j:"Risiko Operasional",tl:3.32,td:3.46,br:12.41,bR:3.37,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:116,ct:"Mekaar Digi validasi NIK, Nama, TGL Lahir"},
{i:30,k:"R.OPS.MKR-1-1-11",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Persetujuan pembiayaan oleh pihak tidak berwenang",j:"Risiko Operasional",tl:2.51,td:2.79,br:7.36,bR:2.76,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:108,ct:"Mekaar Digi otomatis jalur approval BWM"},
{i:31,k:"R.OPS.MKR-1-1-5",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Pencairan dana kepada pihak bukan peminjam",j:"Risiko Operasional",tl:2.55,td:2.76,br:7.25,bR:3.08,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:110,ct:"Mekaar Digi BO blocker sesuai threshold"},
{i:32,k:"R.OPS.MKR-1-1-6",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Hasil Uji Kelayakan tidak lengkap/tidak sesuai",j:"Risiko Operasional",tl:3.31,td:2.93,br:9.79,bR:3.55,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:110,ct:"KUM/SAO approval sebagai checker"},
{i:33,k:"R.OPS.MKR-1-1-8",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Baru",ev:"Informasi kehadiran nasabah PP 1-3 tidak benar",j:"Risiko Operasional",tl:2.87,td:2.82,br:8.37,bR:2.81,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:111,ct:"KUM periksa foto kegiatan PP"},
{i:34,k:"R.OPS.MKR-1-2-4",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Pencairan dana kepada pihak bukan peminjam (lanjutan)",j:"Risiko Operasional",tl:2.8,td:2.85,br:8.24,bR:3.26,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:106,ct:"Mekaar Digi verifikasi nama nasabah"},
{i:35,k:"R.OPS.MKR-1-2-9",s:"Mekaar",m:"Inisiasi Kredit",sm:"Perekrutan Nasabah Lanjutan",ev:"Persetujuan pembiayaan oleh pihak tidak berwenang (lanjutan)",j:"Risiko Operasional",tl:2.46,td:2.67,br:6.92,bR:3.04,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:110,ct:"Mekaar Digi otomatis jalur approval BWM"},
{i:36,k:"R.OPS.MKR-2-1-12",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Pencatatan realisasi pencairan tidak lengkap/akurat",j:"Risiko Operasional",tl:2.75,td:2.84,br:7.88,bR:3.39,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:105,ct:"Pengecekan input pengajuan PDPKM"},
{i:37,k:"R.OPS.MKR-2-1-2",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Data tidak akurat dan tidak sinkron antar aplikasi",j:"Risiko Operasional",tl:3.41,td:3.01,br:10.24,bR:3.11,tr:"Moderate",tR:"Moderate",ef:"Sangat Tidak Efektif",n:113,ct:"Mekaar Digi BO interface realtime"},
{i:38,k:"R.OPS.MKR-2-1-3",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Perhitungan yang dilakukan tidak akurat",j:"Risiko Operasional",tl:4.06,td:4.3,br:18.29,bR:3.95,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:108,ct:"BR.Net otomatis menghitung UP dan dana"},
{i:39,k:"R.OPS.MKR-2-1-9",s:"Mekaar",m:"Pencairan Kredit",sm:"Pencairan Pembiayaan Mekaar",ev:"Dana diterima Kantor Unit tidak sesuai yang diajukan",j:"Risiko Operasional",tl:3.31,td:3.77,br:13.74,bR:3.39,tr:"High",tR:"High",ef:"Efektif",n:108,ct:"FAO mencocokkan nominal dengan PDPKM"},
{i:40,k:"R.OPS.MKR-3-1-3",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penerimaan Pembayaran Nasabah",ev:"Informasi penerimaan pembayaran yang diinput tidak akurat",j:"Risiko Operasional",tl:2.78,td:2.82,br:7.93,bR:3.28,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:111,ct:"FAO input nominal sesuai uang diterima"},
{i:41,k:"R.OPS.MKR-3-1-4",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penerimaan Pembayaran Nasabah",ev:"Data tidak akurat dan tidak sinkron antar aplikasi",j:"Risiko Operasional",tl:3.41,td:3.42,br:12.19,bR:3.29,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:107,ct:"Mekaar Digi BO interface realtime"},
{i:42,k:"R.OPS.MKR-3-1-6",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penerimaan Pembayaran Nasabah",ev:"Hilangnya uang angsuran",j:"Risiko Operasional",tl:2.88,td:3.6,br:11.93,bR:3.22,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:113,ct:"FAO setoran ke Bank/BRILink bersama KUM"},
{i:43,k:"R.OPS.MKR-3-1-7",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penerimaan Pembayaran Nasabah",ev:"AO kecelakaan lalu lintas menuju lokasi PKM",j:"Risiko Operasional",tl:3.74,td:3.74,br:14.93,bR:3.59,tr:"High",tR:"High",ef:"Kurang Efektif",n:107,ct:"Sosialisasi safety riding"},
{i:44,k:"R.OPS.MKR-3-2-1",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penggunaan Dana UP",ev:"Memo pengajuan dana UP tidak lengkap/tidak akurat",j:"Risiko Operasional",tl:2.63,td:2.62,br:7.02,bR:2.31,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:107,ct:"Mekaar Digi BO interface realtime"},
{i:45,k:"R.OPS.MKR-3-2-3",s:"Mekaar",m:"PKM (Pembayaran Kredit)",sm:"Penggunaan Dana UP",ev:"Data tidak sinkron antar aplikasi (UP)",j:"Risiko Operasional",tl:3.3,td:3.51,br:12.5,bR:3.22,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:111,ct:"Mekaar Digi BO interface realtime"},
{i:46,k:"R.OPS.MKR-4-1-2",s:"Mekaar",m:"Monitoring Kredit",sm:"Surprise Visit",ev:"Sampel surprise visit tidak terdokumentasi",j:"Risiko Operasional",tl:3.1,td:2.89,br:8.99,bR:2.83,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:107,ct:"KUM tandatangani buku ekspedisi"},
{i:47,k:"R.OPS.MKR-5-1-2",s:"Mekaar",m:"Penyelesaian Kredit",sm:"Penagihan Nasabah Bermasalah",ev:"Jumlah cash berbeda dengan nominal di LPUH",j:"Risiko Operasional",tl:3.3,td:3.97,br:14.1,bR:3.75,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:108,ct:"FAO dan AO mengisi LPUH"},
{i:48,k:"R.OPS.ULM-1-1-10",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Tidak terdapat pemisahan tugas pada sistem",j:"Risiko Operasional",tl:2.74,td:3.0,br:9.98,bR:2.9,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:58,ct:"Marketline otomatis jalur approval BWM"},
{i:49,k:"R.OPS.ULM-1-1-11",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Kehilangan data saat proses interfacing",j:"Risiko Operasional",tl:2.47,td:2.52,br:6.5,bR:2.91,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Marketline interface realtime ke SIMAPAN"},
{i:50,k:"R.OPS.ULM-1-1-12",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Sistem gagal beri peringatan dokumen belum lengkap",j:"Risiko Operasional",tl:2.41,td:2.53,br:6.52,bR:2.88,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Marketline otomatis restriction/blocker"},
{i:51,k:"R.OPS.ULM-1-1-13",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Perpindahan data otomatis antar sistem tidak lengkap",j:"Risiko Operasional",tl:2.28,td:2.36,br:5.72,bR:2.67,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Marketline interface ke MMS"},
{i:52,k:"R.OPS.ULM-1-1-2",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Output Sistem tidak sesuai/tidak lengkap/tidak akurat",j:"Risiko Operasional",tl:2.7,td:2.75,br:7.72,bR:3.07,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:57,ct:"Marketline validasi mandatory field"},
{i:53,k:"R.OPS.ULM-1-1-3",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Inisiasi Kredit ULaMM",ev:"Input bunga kurang dari standar bunga",j:"Risiko Operasional",tl:1.98,td:2.55,br:5.31,bR:2.33,tr:"Moderate",tR:"Low",ef:"Cukup Efektif",n:58,ct:"Marketline validasi input bunga"},
{i:54,k:"R.OPS.ULM-1-2-2",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Perhitungan rencana angsuran tidak sesuai jenis/periode",j:"Risiko Operasional",tl:2.86,td:3.18,br:10.42,bR:3.04,tr:"High",tR:"High",ef:"Efektif",n:57,ct:"MMS otomatis menghitung rencana angsuran"},
{i:55,k:"R.OPS.ULM-1-2-4",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Dokumen pembiayaan pasca akad di-upload tidak lengkap",j:"Risiko Operasional",tl:2.36,td:2.53,br:6.07,bR:2.6,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"MO approval dokumen upload"},
{i:56,k:"R.OPS.ULM-1-2-5",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Serah-terima agunan tidak terdokumentasi",j:"Risiko Operasional",tl:2.22,td:2.52,br:6.03,bR:2.02,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Staf Admin catat di BAST Agunan"},
{i:57,k:"R.OPS.ULM-1-2-6",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Proses approval gagal kirim ke pejabat berwenang",j:"Risiko Operasional",tl:2.76,td:3.19,br:9.59,bR:2.93,tr:"Moderate",tR:"High",ef:"Efektif",n:58,ct:"PCS otomatis approval berjenjang"},
{i:58,k:"R.OPS.ULM-1-2-7",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Data/dokumen agunan input/upload tidak sesuai",j:"Risiko Operasional",tl:2.14,td:2.48,br:5.59,bR:2.07,tr:"Moderate",tR:"Moderate",ef:"Efektif",n:58,ct:"Pejabat Berwenang reviu data upload"},
{i:59,k:"R.OPS.ULM-1-2-8",s:"ULaMM",m:"Inisiasi Kredit ULaMM",sm:"Pengikatan Kredit ULaMM",ev:"Dokumen agunan hilang/dicuri saat disimpan",j:"Risiko Operasional",tl:2.33,td:2.57,br:6.31,bR:2.16,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Staf Admin simpan di brankas"},
{i:60,k:"R.OPS.ULM-2-1-2",s:"ULaMM",m:"Pencairan Kredit ULaMM",sm:"Pencairan Kredit ULaMM",ev:"Informasi nasabah/struktur kredit tidak sesuai",j:"Risiko Operasional",tl:2.33,td:2.66,br:6.21,bR:2.24,tr:"Moderate",tR:"Moderate",ef:"Efektif",n:58,ct:"MO pastikan kesesuaian dana"},
{i:61,k:"R.OPS.ULM-2-1-4",s:"ULaMM",m:"Pencairan Kredit ULaMM",sm:"Pencairan Kredit ULaMM",ev:"Nominal PDPC tidak sesuai dengan DRP Pooling",j:"Risiko Operasional",tl:2.21,td:2.45,br:5.6,bR:2.45,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Pejabat Berwenang penarikan PDPC"},
{i:62,k:"R.OPS.ULM-2-1-6",s:"ULaMM",m:"Pencairan Kredit ULaMM",sm:"Pencairan Kredit ULaMM",ev:"Nominal pencairan tidak sesuai permohonan",j:"Risiko Operasional",tl:2.07,td:2.38,br:5.14,bR:2.5,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"MO pastikan kesesuaian dana Treasury"},
{i:63,k:"R.OPS.ULM-3-1-1",s:"ULaMM",m:"Pembayaran Kredit ULaMM",sm:"Pembayaran Kredit ULaMM",ev:"Pencatatan penerimaan angsuran tidak akurat",j:"Risiko Operasional",tl:2.86,td:3.43,br:10.86,bR:2.91,tr:"High",tR:"Moderate",ef:"Efektif",n:58,ct:"AOM cek dana pembayaran berkala"},
{i:64,k:"R.OPS.ULM-3-1-6",s:"ULaMM",m:"Pembayaran Kredit ULaMM",sm:"Pembayaran Kredit ULaMM",ev:"Penyesuaian pencatatan angsuran NPL tidak sesuai (PC)",j:"Risiko Operasional",tl:3.22,td:3.41,br:12.53,bR:3.38,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:58,ct:"Pemimpin Cabang reviu dan approval"},
{i:65,k:"R.OPS.ULM-3-1-7",s:"ULaMM",m:"Pembayaran Kredit ULaMM",sm:"Pembayaran Kredit ULaMM",ev:"Penyesuaian pencatatan angsuran NPL tidak sesuai (MO)",j:"Risiko Operasional",tl:2.86,td:3.31,br:11.02,bR:3.05,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:58,ct:"MO reviu dan approval"},
{i:66,k:"R.OPS.ULM-3-2-1",s:"ULaMM",m:"Pembayaran Kredit ULaMM",sm:"Pelunasan Dini ULaMM",ev:"Pencatatan penerimaan angsuran tidak akurat (pelunasan)",j:"Risiko Operasional",tl:2.98,td:3.38,br:11.24,bR:3.1,tr:"High",tR:"High",ef:"Efektif",n:58,ct:"AOM cek dana pembayaran tiap jam"},
{i:67,k:"R.OPS.ULM-3-2-2",s:"ULaMM",m:"Pembayaran Kredit ULaMM",sm:"Pelunasan Dini ULaMM",ev:"Input nominal/nomer rekening tidak akurat",j:"Risiko Operasional",tl:2.71,td:3.16,br:9.16,bR:2.98,tr:"Moderate",tR:"High",ef:"Efektif",n:58,ct:"Pejabat Berwenang reviu input"},
{i:68,k:"R.OPS.ULM-4-1-2",s:"ULaMM",m:"Monitoring Kredit ULaMM",sm:"Monitoring Pasca Pencairan",ev:"Laporan monitoring pasca pencairan tidak akurat",j:"Risiko Operasional",tl:2.67,td:2.67,br:7.45,bR:2.59,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"MBU monitoring pelaksanaan syarat"},
{i:69,k:"R.OPS.ULM-4-2-1",s:"ULaMM",m:"Monitoring Kredit ULaMM",sm:"Monitoring Pembiayaan Kredit",ev:"Pencatatan penerimaan angsuran tidak akurat (monitoring)",j:"Risiko Operasional",tl:2.78,td:3.21,br:10.26,bR:2.93,tr:"Moderate",tR:"Low to Moderate",ef:"Efektif",n:58,ct:"AOM cek dana pembayaran tiap jam"},
{i:70,k:"R.OPS.ULM-5-1-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengikatan Agunan",ev:"Perpindahan dokumen agunan tidak terdeteksi",j:"Risiko Operasional",tl:2.72,td:3.16,br:9.47,bR:2.95,tr:"High",tR:"Low",ef:"Efektif",n:57,ct:"KUU terima dan tandatangani dokumen"},
{i:71,k:"R.OPS.ULM-5-2-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengembalian Agunan",ev:"Pelepasan agunan tanpa autorisasi",j:"Risiko Operasional",tl:2.02,td:2.52,br:5.6,bR:2.38,tr:"Moderate to High",tR:"Low",ef:"Cukup Efektif",n:58,ct:"Pejabat Berwenang reviu dokumen pelunasan"},
{i:72,k:"R.OPS.ULM-5-2-2",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengembalian Agunan",ev:"Dokumen agunan diserahkan ke pihak tidak berwenang",j:"Risiko Operasional",tl:2.64,td:3.34,br:10.07,bR:2.98,tr:"High",tR:"Low",ef:"Sangat Tidak Efektif",n:58,ct:"MO verifikasi identitas penerima"},
{i:73,k:"R.OPS.ULM-5-2-3",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengembalian Agunan",ev:"Perpindahan dokumen agunan tidak terdeteksi (pengembalian)",j:"Risiko Operasional",tl:2.02,td:2.55,br:5.59,bR:2.07,tr:"Moderate",tR:"Moderate",ef:"Efektif",n:58,ct:"MO tandatangani dokumen penyerahan"},
{i:74,k:"R.OPS.ULM-5-2-4",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengembalian Agunan",ev:"Proses approval gagal kirim (agunan)",j:"Risiko Operasional",tl:2.85,td:3.32,br:10.93,bR:2.93,tr:"High",tR:"High",ef:"Efektif",n:59,ct:"PCS otomatis approval berjenjang"},
{i:75,k:"R.OPS.ULM-5-2-5",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Pengembalian Agunan",ev:"Dokumen agunan diunggah tidak lengkap (pengembalian)",j:"Risiko Operasional",tl:2.33,td:2.6,br:6.4,bR:2.78,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Pejabat Berwenang reviu dokumen"},
{i:76,k:"R.OPS.ULM-5-3-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Rekonsiliasi Bulanan",ev:"Penyimpanan dokumen agunan tidak diketahui",j:"Risiko Operasional",tl:2.26,td:2.72,br:6.45,bR:2.69,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Staf Admin rekonsiliasi bulanan"},
{i:77,k:"R.OPS.ULM-5-4-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Monitoring Agunan 3 Bulanan",ev:"Penyimpanan dokumen agunan tidak diketahui (monitoring)",j:"Risiko Operasional",tl:2.17,td:2.71,br:6.38,bR:2.22,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Staf Admin dan Legal monitoring 3 bulan"},
{i:78,k:"R.OPS.ULM-5-5-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Stock Opname Tahunan",ev:"Dokumen asli agunan rusak/hilang",j:"Risiko Operasional",tl:2.02,td:2.57,br:5.31,bR:2.31,tr:"Moderate to High",tR:"Low",ef:"Cukup Efektif",n:58,ct:"Pemimpin Cabang approval Laporan SO"},
{i:79,k:"R.OPS.ULM-5-5-2",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Stock Opname Tahunan",ev:"Agunan mengalami perbedaan nilai (SO)",j:"Risiko Operasional",tl:2.43,td:2.66,br:6.78,bR:2.84,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"MO assessment dokumen agunan"},
{i:80,k:"R.OPS.ULM-5-6-1",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Retaksasi Agunan",ev:"Nilai agunan tidak sama dengan pinjaman",j:"Risiko Operasional",tl:2.29,td:2.79,br:6.78,bR:2.36,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"AOM survei penilaian bersama KUU"},
{i:81,k:"R.OPS.ULM-5-6-2",s:"ULaMM",m:"Pengelolaan Agunan ULaMM",sm:"Retaksasi Agunan",ev:"Penilaian agunan tidak tepat/akurat",j:"Risiko Operasional",tl:2.31,td:2.83,br:7.09,bR:2.64,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Pejabat Berwenang approval LPA"},
{i:82,k:"R.OPS.ULM-6-1-1",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Dokumen pengajuan restrukturisasi tidak lengkap",j:"Risiko Operasional",tl:2.47,td:2.73,br:6.88,bR:2.44,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:59,ct:"CRA reviu dokumen permohonan"},
{i:83,k:"R.OPS.ULM-6-1-13",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Perpindahan data otomatis antar sistem tidak lengkap (3R)",j:"Risiko Operasional",tl:2.36,td:2.72,br:6.71,bR:2.88,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Marketline interface ke MMS"},
{i:84,k:"R.OPS.ULM-6-1-2",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Restrukturisasi dilakukan pada nasabah tidak tepat",j:"Risiko Operasional",tl:2.38,td:2.69,br:6.76,bR:2.33,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Pemimpin Cabang approval Memorandum"},
{i:85,k:"R.OPS.ULM-6-1-3",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Analisa informasi kredit kolektibilitas tidak akurat (3R)",j:"Risiko Operasional",tl:2.38,td:2.81,br:7.02,bR:2.34,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"KUU reviu SLIK/INI"},
{i:86,k:"R.OPS.ULM-6-1-4",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Kemampuan nasabah melunasi tidak dinilai tepat",j:"Risiko Operasional",tl:2.5,td:2.6,br:6.86,bR:2.9,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"AOM survei verifikasi usaha"},
{i:87,k:"R.OPS.ULM-6-1-7",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Tidak terdapat pemisahan tugas pada sistem (3R)",j:"Risiko Operasional",tl:2.93,td:3.26,br:10.97,bR:3.07,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:58,ct:"Marketline otomatis jalur approval BWM"},
{i:88,k:"R.OPS.ULM-6-1-8",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"3R - Restructuring",ev:"Kehilangan data saat proses interfacing (3R)",j:"Risiko Operasional",tl:2.48,td:2.69,br:6.97,bR:2.93,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Marketline interface realtime"},
{i:89,k:"R.OPS.ULM-6-2-1",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Agunan mengalami perbedaan nilai (lelang)",j:"Risiko Operasional",tl:2.54,td:2.75,br:7.36,bR:3.0,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:56,ct:"AOM retaksasi agunan"},
{i:90,k:"R.OPS.ULM-6-2-2",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Data/dokumen pengajuan lelang tidak lengkap",j:"Risiko Operasional",tl:2.28,td:2.57,br:6.17,bR:2.66,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Pejabat Berwenang verifikasi memo"},
{i:91,k:"R.OPS.ULM-6-2-3",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Hasil lelang tidak valid/tidak terdokumentasi",j:"Risiko Operasional",tl:2.21,td:2.57,br:5.86,bR:2.09,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"Pemimpin Cabang tanda tangan BA"},
{i:92,k:"R.OPS.ULM-6-2-4",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Pencatatan hasil lelang tidak tepat/sesuai",j:"Risiko Operasional",tl:2.19,td:2.48,br:5.91,bR:2.57,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"MO reviu dan posting jurnal"},
{i:93,k:"R.OPS.ULM-6-2-5",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Proses approval gagal kirim (lelang)",j:"Risiko Operasional",tl:3.05,td:3.34,br:11.72,bR:3.02,tr:"Moderate",tR:"High",ef:"Efektif",n:58,ct:"PCS otomatis approval berjenjang"},
{i:94,k:"R.OPS.ULM-6-2-6",s:"ULaMM",m:"Penyelesaian Kredit ULaMM",sm:"Lelang Jaminan",ev:"Dokumen agunan diunggah tidak lengkap (lelang)",j:"Risiko Operasional",tl:2.43,td:2.66,br:6.6,bR:2.84,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"Pejabat Berwenang reviu dokumen"},
{i:95,k:"R.OPS.ULM-7-1-2",s:"ULaMM",m:"Asuransi ULaMM",sm:"Penutupan Penjaminan",ev:"Pembayaran premi tanpa autorisasi",j:"Risiko Operasional",tl:2.9,td:3.4,br:11.45,bR:3.12,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",n:58,ct:"Pejabat Berwenang reviu Nota Premi"},
{i:96,k:"R.OPS.ULM-7-1-3",s:"ULaMM",m:"Asuransi ULaMM",sm:"Penutupan Penjaminan",ev:"Jurnal pembayaran premi tidak sesuai",j:"Risiko Operasional",tl:2.22,td:2.53,br:6.03,bR:2.67,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"MO reviu dan approval jurnal"},
{i:97,k:"R.OPS.ULM-7-3-2",s:"ULaMM",m:"Asuransi ULaMM",sm:"Pembayaran Klaim",ev:"Jurnal penerimaan klaim tidak sesuai",j:"Risiko Operasional",tl:2.33,td:2.6,br:6.43,bR:2.81,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"KUU reviu dan approval jurnal klaim"},
{i:98,k:"R.OPS.ULM-7-5-1",s:"ULaMM",m:"Asuransi ULaMM",sm:"Pengembalian Utang Subrogasi",ev:"Pembayaran utang subrogasi untuk nasabah belum bayar",j:"Risiko Operasional",tl:2.47,td:2.66,br:6.98,bR:3.0,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"AOM penagihan ke nasabah"},
{i:99,k:"R.OPS.ULM-7-5-2",s:"ULaMM",m:"Asuransi ULaMM",sm:"Pengembalian Utang Subrogasi",ev:"Jurnal penerimaan pembayaran nasabah tidak sesuai",j:"Risiko Operasional",tl:2.28,td:2.53,br:6.24,bR:2.16,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",n:58,ct:"KUU reviu input penerimaan"},
{i:100,k:"R.OPS.ULM-7-5-3",s:"ULaMM",m:"Asuransi ULaMM",sm:"Pengembalian Utang Subrogasi",ev:"Jurnal penerimaan pembayaran subrogasi tidak sesuai",j:"Risiko Operasional",tl:2.22,td:2.4,br:5.84,bR:2.66,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",n:58,ct:"MO reviu input pembayaran"},
];

// Per-cabang BR residual per risk index [0..100]
const CR={"Aceh":[3,1,4,1,2,2,3,5,5,2,4,2,4,3,4,5,2,4,5,4,3,2,1,3,1,0,0,1,0,4,2,4,2,2,4,2,4,2,3,2,4,3,3,5,1,2,3,5,5,2,2,2,3,1,2,4,1,1,2,2,2,2,1,5,2,2,2,1,2,2,3,1,1,1,1,3,5,5,1,5,4,3,1,1,1,2,4,2,4,4,1,1,1,2,4,1,1,1,1,2,1],"Ambon":[3,1,4,2,2,4,3,3,1,4,3,4,4,1,2,3,4,3,5,3,2,1,1,1,5,0,0,4,0,4,1,2,3,3,3,1,3,1,3,3,4,2,3,4,2,3,3,2,1,1,2,1,3,1,4,1,1,2,2,3,3,4,1,2,3,3,3,3,3,3,3,1,4,1,3,3,4,3,2,4,2,2,2,3,1,3,1,3,4,4,2,2,2,2,2,3,3,4,4,2,3],"Balikpapan":[3,1,3,1,1,4,3,5,5,1,4,2,4,3,3,2,4,4,5,3,1,3,2,3,2,0,0,2,0,0,1,4,2,2,1,1,3,1,5,2,4,1,2,4,2,1,3,4,3,3,3,2,2,2,2,1,1,1,2,2,2,1,2,1,1,3,2,2,3,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],"Bandung":[4,5,4,2,4,1,3,5,1,4,4,3,2,5,2,4,5,2,5,3,4,4,2,3,2,0,0,1,0,1,5,2,2,4,3,2,4,4,5,1,1,1,5,3,1,5,4,3,5,4,4,4,2,3,2,3,2,4,3,3,3,2,1,2,2,3,2,1,3,3,1,2,1,2,5,4,1,3,2,4,2,2,2,2,3,3,3,2,2,1,2,1,2,2,2,2,2,1,2,2,3],"Bangka Belitung":[4,3,4,3,5,2,2,5,4,3,4,2,5,3,5,4,2,4,5,3,3,3,2,3,3,0,0,4,0,4,3,3,5,4,4,4,3,3,5,2,4,3,1,3,1,3,3,5,3,4,3,3,3,3,3,3,3,2,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3,2,3,3,2,3,4,4,3,4,3,4,3,3,3,4,4,3,3,3,3,3,3,3,3,3,3,3,3],"Banjarmasin":[3,5,4,3,5,4,2,5,5,4,4,4,5,5,5,5,4,4,5,3,2,3,3,3,5,0,0,5,0,1,4,4,4,3,4,4,4,3,5,5,4,3,5,5,3,5,3,5,5,4,4,4,4,2,5,4,3,5,1,3,1,4,4,5,5,5,5,5,3,5,5,4,5,3,5,4,4,3,4,4,3,4,3,4,3,3,4,5,4,3,4,3,4,5,4,5,4,4,4,3,4],"Banjarnegara":[5,1,4,2,3,2,3,4,3,4,2,2,4,3,3,3,4,2,5,3,2,2,2,2,5,3,5,3,2,2,4,4,5,3,4,4,0,4,5,5,4,5,5,2,3,5,3,2,3,3,1,2,4,4,0,2,2,2,2,1,3,3,3,2,2,2,2,5,3,4,0,2,4,2,2,2,4,2,3,3,3,3,2,3,2,2,2,3,4,0,4,3,4,1,2,3,3,2,2,2,2],"Banyuwangi":[2,1,4,1,5,2,4,4,5,3,3,3,5,5,2,4,3,4,5,3,3,2,1,2,2,0,0,1,0,5,3,4,4,3,3,4,3,2,4,4,3,5,3,5,2,3,3,4,1,1,2,3,1,2,1,3,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1],"Bau Bau":[2,1,2,3,1,3,1,3,1,2,3,1,3,2,1,1,1,4,2,3,2,3,2,3,5,0,0,1,0,3,4,2,3,4,2,2,2,1,1,3,2,2,2,2,1,1,2,3,2,2,4,2,4,2,1,4,3,2,3,3,1,4,1,3,3,2,3,2,3,2,2,2,4,3,2,4,3,3,4,4,2,4,2,4,1,3,4,1,4,1,1,1,1,2,4,1,4,2,2,1,2],"Bekasi":[3,2,4,2,4,4,4,5,4,5,4,3,4,4,5,5,5,4,5,3,3,3,4,3,3,0,0,4,0,5,4,4,4,3,4,4,3,2,5,4,4,5,2,5,3,2,3,4,4,3,3,4,4,3,4,2,3,3,3,2,2,3,2,3,5,4,3,4,2,2,3,1,1,2,4,4,2,1,1,3,3,4,3,3,3,3,3,5,3,4,3,3,3,4,3,3,3,4,2,2,3],"Blitar":[3,4,4,3,3,2,1,2,2,2,2,1,2,2,1,3,4,3,3,1,3,2,1,2,5,0,0,5,0,4,3,1,2,2,2,1,4,3,2,4,3,3,2,3,3,3,3,3,1,4,4,3,3,3,5,4,3,3,2,3,2,3,2,3,5,4,2,4,2,2,4,3,4,3,4,4,2,3,4,4,3,4,2,3,2,3,3,5,4,2,1,2,3,3,4,5,2,3,3,3,2],"Bogor":[4,5,4,3,3,1,2,4,1,1,4,2,4,3,3,5,1,4,5,4,3,3,3,3,5,0,0,5,0,4,4,3,4,3,3,4,3,3,3,2,2,1,4,1,2,1,4,4,5,4,4,4,4,4,5,4,3,5,3,3,3,4,4,5,5,5,5,3,3,5,5,4,5,3,5,4,4,3,4,4,3,4,3,4,3,3,4,5,4,5,4,3,4,5,4,5,4,2,4,3,4],"Bojonegoro":[3,5,4,3,5,1,2,2,1,3,4,2,5,3,5,4,4,2,5,3,2,3,3,3,2,0,0,2,0,2,2,4,4,3,3,4,3,3,5,5,4,5,2,5,3,5,3,5,1,4,3,4,1,1,3,4,1,5,3,3,2,1,2,1,5,5,5,3,3,5,2,4,3,2,5,3,2,3,4,4,3,4,2,4,3,3,3,2,4,4,4,1,2,4,4,3,3,3,3,3,2],"Cirebon":[3,1,4,2,1,2,3,2,3,3,3,4,4,2,4,2,4,3,4,1,2,3,2,3,2,0,0,2,0,3,4,2,4,3,4,3,4,1,4,4,3,5,3,2,3,3,3,3,2,2,1,1,3,2,3,2,2,2,3,2,2,2,3,2,2,1,2,2,2,2,4,2,2,2,2,2,2,1,1,4,1,1,3,3,2,2,3,4,1,2,2,2,2,2,4,2,3,2,2,2,2],"Denpasar":[3,3,4,1,5,4,5,5,5,4,2,5,5,5,5,5,4,4,3,3,3,3,2,3,3,0,0,3,0,5,4,4,4,3,4,4,3,5,3,5,3,5,5,5,3,5,3,3,2,2,1,2,2,1,1,2,3,2,1,3,1,2,4,2,1,1,5,1,3,2,2,1,1,1,3,2,2,1,1,1,2,2,3,2,2,3,3,4,3,1,1,1,1,4,2,2,1,1,4,1,1],"Depok":[1,5,4,3,3,4,1,1,3,2,2,1,2,1,3,4,4,4,5,3,3,3,3,3,3,0,0,5,0,1,1,2,4,1,4,1,4,1,5,4,4,3,2,5,3,3,3,3,5,4,4,4,4,4,5,4,3,3,3,3,3,4,2,5,5,5,5,5,3,5,5,4,5,3,5,4,4,3,2,4,3,4,3,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4],"Garut":[5,5,4,1,3,4,3,2,3,2,2,3,2,3,3,5,4,4,3,3,1,3,3,1,1,0,0,1,0,5,4,4,4,3,4,4,4,3,5,5,4,5,5,5,3,5,3,5,1,2,2,1,1,2,1,2,1,1,1,1,1,1,1,1,3,1,1,1,3,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1],"Indramayu":[3,5,4,3,3,4,5,3,3,5,4,5,5,3,3,5,4,2,3,3,3,3,3,3,5,0,0,5,0,5,4,4,4,3,4,4,4,5,3,5,4,5,5,5,3,5,3,5,5,4,4,4,4,4,5,4,3,5,3,3,2,4,4,5,5,5,5,5,3,5,5,2,5,3,5,4,4,3,4,4,3,4,3,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4],"Jakarta":[3,1,3,1,3,3,3,1,3,1,2,2,3,1,3,3,2,2,3,2,1,2,1,2,3,0,0,3,0,5,1,2,4,4,2,1,4,3,3,2,2,3,3,2,1,3,3,2,2,4,4,1,2,1,2,1,1,1,1,1,4,2,1,2,2,1,4,1,3,3,1,1,1,1,2,1,1,1,1,1,1,2,3,1,2,2,1,1,3,1,1,1,1,1,2,1,1,1,3,1,1],"Jambi":[3,5,4,3,3,4,3,1,3,3,4,3,1,5,5,5,1,3,5,2,1,3,3,3,5,0,0,5,0,5,3,2,4,4,2,4,4,3,4,4,4,3,5,3,1,1,4,3,5,4,4,4,4,4,3,4,3,5,3,3,3,4,4,5,5,5,5,5,3,5,5,4,5,3,5,4,4,3,4,4,3,4,4,4,3,3,4,3,4,4,4,3,4,5,2,5,2,4,4,3,4],"Jember":[1,2,1,2,1,2,5,5,1,1,1,1,1,1,1,1,1,4,3,1,4,3,3,4,5,0,0,5,0,5,1,1,5,3,1,1,1,1,5,5,4,1,1,5,1,1,1,5,3,3,4,4,2,1,3,4,1,3,2,2,3,1,1,3,5,5,4,3,3,5,4,4,3,2,2,4,2,2,1,4,3,4,3,4,4,2,4,5,3,4,3,2,2,3,4,4,4,4,3,2,2],"Kabanjahe":[2,1,4,1,4,3,2,2,2,1,4,1,1,2,4,3,2,3,4,3,1,1,1,1,1,0,0,1,0,1,1,2,2,2,4,1,3,2,4,3,3,2,3,2,1,2,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"Kediri":[3,1,4,3,3,2,3,2,3,2,2,3,2,5,3,3,4,2,3,3,1,2,2,3,4,0,0,5,0,4,4,4,4,3,4,4,4,3,5,5,4,5,5,5,3,5,3,5,1,2,1,1,3,1,2,1,2,3,2,2,2,3,3,5,5,2,3,3,3,2,5,3,5,3,3,3,4,3,4,4,3,4,3,4,3,3,4,5,4,4,4,1,4,5,4,5,4,4,4,3,4],"Kendari":[3,1,4,1,2,2,1,2,2,2,2,1,2,1,2,1,2,4,2,2,3,1,1,1,1,0,0,1,0,3,1,2,4,3,4,4,1,1,2,2,2,2,1,3,3,2,3,2,1,1,1,1,4,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"Lamongan":[4,5,4,3,2,2,2,4,2,3,4,1,4,2,2,3,4,4,5,3,1,3,3,3,3,0,0,5,0,2,2,4,4,4,3,2,4,1,4,2,3,5,3,5,3,2,4,5,5,4,4,2,3,2,2,4,1,3,2,2,2,2,4,5,3,5,5,5,3,5,5,4,5,3,5,4,4,3,2,3,3,5,3,4,3,3,4,3,3,4,4,3,4,2,4,5,4,4,4,3,3],"Lampung":[2,5,4,3,5,4,1,2,5,4,1,3,4,1,2,2,2,4,3,3,3,3,3,3,4,0,0,5,0,4,2,2,4,3,4,4,2,3,5,2,1,1,5,5,1,1,2,3,5,4,4,3,4,4,4,4,2,5,3,3,2,4,3,4,5,5,5,3,3,5,3,4,5,3,5,4,4,3,4,4,3,4,3,4,3,3,4,3,4,4,4,3,4,5,2,5,4,3,3,3,4],"Madiun":[3,5,4,3,5,2,5,2,3,4,4,3,5,3,5,5,4,4,3,3,3,3,3,3,5,0,0,5,0,4,4,4,4,3,4,2,2,3,5,5,4,5,5,5,3,5,3,5,5,4,4,4,4,3,5,4,3,5,3,3,3,4,4,5,5,5,5,5,3,5,5,4,5,3,5,4,4,3,4,4,4,5,3,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4],"Magelang":[2,1,4,1,1,2,3,3,3,4,2,2,3,2,2,2,3,2,2,3,1,1,1,1,1,0,0,1,0,3,2,4,3,3,3,3,4,3,5,4,3,3,5,5,4,4,4,3,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1],"Makassar":[3,3,2,2,3,4,2,1,3,3,2,1,3,3,2,4,3,4,3,3,1,2,2,2,3,0,0,3,0,1,4,4,2,3,2,3,4,1,4,1,1,4,1,4,2,2,3,1,3,4,3,1,2,2,4,2,2,3,2,2,3,2,3,3,5,1,4,4,2,1,3,2,3,2,4,1,4,2,2,2,3,2,2,4,3,2,2,3,4,2,1,2,2,4,2,5,4,2,4,3,3],"Malang":[3,5,4,3,2,4,1,4,1,4,2,1,4,2,2,5,4,4,5,3,3,3,3,3,5,0,0,5,0,4,2,4,4,3,4,4,4,4,5,4,4,5,1,5,3,5,3,5,5,4,4,4,4,4,5,4,3,5,1,3,3,4,4,5,5,5,5,5,3,5,5,4,5,3,5,4,4,3,4,2,3,2,3,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4],"Manado":[1,2,2,2,1,1,1,5,4,1,1,1,3,1,1,1,1,1,3,1,3,4,1,4,5,0,0,5,0,4,1,1,2,1,1,1,1,1,1,1,1,5,1,5,3,5,2,1,5,2,1,1,4,2,4,4,1,5,2,3,3,4,2,3,5,5,3,4,4,3,5,4,4,3,4,3,4,3,4,4,3,4,4,2,3,3,4,5,3,4,4,4,4,4,4,5,4,4,4,3,4],"Mataram":[5,1,4,1,2,4,4,4,5,2,4,5,5,5,5,5,4,1,5,3,2,3,3,3,5,0,0,5,0,4,4,4,2,3,2,4,4,5,5,2,4,3,5,5,5,5,3,5,5,4,4,4,4,4,5,1,3,5,3,2,2,2,4,3,4,3,3,4,3,2,3,1,5,1,2,2,4,3,2,3,3,3,3,4,3,3,4,4,4,4,4,2,2,3,4,5,4,4,4,3,3],"Medan":[3,1,4,3,3,2,1,4,4,4,4,2,4,4,3,2,4,2,3,3,1,1,1,1,1,0,0,1,0,2,1,1,4,3,2,4,1,3,1,1,3,2,1,2,1,2,4,3,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,3,1,1,1,1,3,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,4,2,1,1,1,1,1,1,4,4,4,1,1],"Mojokerto":[3,1,3,2,4,3,3,4,4,4,2,2,4,4,4,2,3,2,3,3,2,2,1,2,2,0,0,2,0,3,2,3,4,2,3,2,3,2,3,2,4,2,3,2,2,3,2,2,4,4,4,4,4,3,4,4,3,3,3,3,3,1,1,3,4,3,3,4,3,3,3,3,3,2,3,4,4,3,4,3,3,3,3,3,2,1,3,2,2,2,3,2,2,2,3,2,1,1,3,1,2],"Padang":[5,5,4,3,4,4,4,3,4,4,4,3,4,4,4,5,3,4,5,3,2,3,3,3,5,0,0,5,0,4,2,4,4,3,4,4,4,5,5,4,4,4,1,3,3,4,3,5,5,4,4,4,4,4,5,2,3,5,3,3,3,4,4,3,5,5,5,5,3,5,5,4,5,3,5,4,4,3,4,2,3,4,3,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4],"Palembang":[4,2,4,2,5,4,5,4,5,4,4,4,4,5,5,4,4,4,4,3,3,2,2,2,2,0,0,1,0,4,3,4,4,3,4,4,4,5,5,3,4,4,4,3,3,4,3,3,2,2,2,2,3,3,2,2,1,2,2,2,2,2,2,1,2,2,1,1,2,2,2,2,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,2],"Palopo":[3,1,4,1,2,4,5,5,5,4,4,3,4,1,3,3,4,4,3,3,1,2,2,1,2,0,0,1,0,5,1,4,5,1,4,1,4,1,3,2,4,3,2,5,2,3,3,5,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,5,1,1,4,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1],"Palu":[3,5,2,3,2,2,1,2,2,1,2,2,2,2,2,2,2,2,3,3,3,1,3,3,5,0,0,5,0,5,1,2,2,2,4,1,2,1,2,2,2,1,3,5,3,5,2,1,5,4,4,4,4,4,5,4,3,5,3,3,3,4,4,5,5,5,5,5,3,3,5,4,5,3,5,4,2,1,4,4,4,4,3,4,3,3,4,5,2,4,4,3,4,5,4,5,4,4,4,1,4],"Pati":[1,1,2,2,3,4,5,4,2,2,3,1,4,2,3,3,4,4,5,3,2,3,3,2,3,0,0,4,0,3,4,4,3,1,2,4,1,1,3,5,1,5,1,5,3,5,3,3,1,1,3,4,4,3,3,3,3,4,1,2,2,2,1,2,3,3,5,3,2,2,1,1,1,1,2,1,2,1,1,1,3,1,2,3,3,3,3,1,2,3,4,3,4,2,3,3,3,3,4,2,3],"Pekanbaru":[3,5,4,3,5,4,5,4,5,4,4,5,5,5,5,5,2,4,5,3,1,3,3,3,5,0,0,5,0,1,4,4,4,3,4,4,4,5,3,4,4,3,5,3,1,5,3,5,5,4,4,4,4,4,5,4,3,5,3,1,2,4,4,5,3,5,5,5,3,5,5,4,5,3,3,4,4,3,4,4,3,4,5,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,2,4],"Pematang Siantar":[1,1,2,2,5,3,5,2,4,4,3,2,2,4,5,3,3,4,4,3,2,4,3,3,2,0,0,3,0,2,4,4,4,3,4,4,4,5,3,3,4,2,2,2,3,2,4,5,2,4,3,3,4,3,1,2,2,3,2,2,2,3,3,3,4,3,3,3,2,2,4,3,5,2,4,3,4,3,4,4,3,3,3,3,3,2,4,4,4,4,4,3,4,4,3,5,4,4,4,3,4],"Pontianak":[3,1,4,1,5,4,2,5,5,4,4,2,4,5,5,3,4,3,4,3,2,2,1,2,1,0,0,1,0,2,1,2,4,3,3,4,4,3,5,3,3,3,4,5,3,3,3,3,2,2,2,2,3,1,1,2,1,1,1,2,2,1,1,1,3,3,1,1,3,1,2,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,4,1,2,4,1,1,1,2,4,3,1,1,1,1,2],"Probolinggo":[2,3,4,3,3,3,5,4,1,4,3,1,4,1,4,2,4,1,3,3,1,2,3,2,2,0,0,2,0,2,1,1,4,3,1,1,2,5,2,1,2,5,2,5,3,5,3,1,1,4,4,2,4,2,2,3,3,4,3,3,2,2,4,2,2,2,2,2,3,2,2,2,2,3,2,1,4,3,2,2,3,1,2,4,3,1,2,2,1,4,2,3,2,2,4,2,2,2,4,2,3],"Purwokerto":[3,1,3,2,4,2,3,4,4,4,4,4,2,4,5,3,1,4,5,3,1,1,1,2,3,0,0,3,0,1,1,2,4,3,3,1,1,2,3,2,3,1,3,1,1,2,3,3,3,3,3,3,3,2,5,1,1,3,1,1,1,1,2,2,3,2,3,5,1,2,1,1,4,1,2,1,1,2,1,1,1,1,5,3,1,2,2,3,1,3,2,1,1,5,3,1,1,3,4,1,1],"Semarang":[5,1,4,2,5,4,5,4,5,4,2,5,5,5,5,5,4,4,5,3,4,3,2,3,3,0,0,5,0,4,4,2,4,3,4,4,4,4,4,5,4,3,3,3,3,1,1,5,2,3,2,2,3,3,2,1,2,2,3,1,3,3,1,3,5,4,3,4,3,3,4,4,5,3,2,2,1,3,1,4,1,1,1,4,2,3,4,3,3,3,4,2,3,5,4,5,4,2,3,4,4],"Serang":[2,1,4,1,1,2,3,4,1,1,3,1,2,3,2,3,3,4,2,3,1,1,1,1,1,0,0,1,0,4,2,1,3,1,2,4,4,1,2,2,4,1,2,4,2,3,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"Sintang":[2,3,4,3,5,4,1,5,4,4,4,4,5,3,4,3,3,2,2,3,3,3,3,3,5,0,0,5,0,4,3,1,3,1,1,4,3,3,3,4,3,1,1,3,1,1,3,5,5,4,4,4,4,1,5,3,3,3,3,3,3,4,4,5,5,5,5,5,3,5,5,4,5,3,5,4,2,3,2,4,3,4,3,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4],"Solo":[4,3,4,3,4,4,5,5,5,5,4,5,5,5,5,5,4,4,3,5,2,4,3,3,2,0,0,3,0,4,5,2,2,5,4,4,4,4,5,2,2,5,5,5,3,5,3,5,2,4,4,4,4,3,4,3,1,4,3,3,3,4,2,3,5,5,5,5,3,5,4,3,2,3,4,4,4,3,2,3,2,1,3,4,3,2,2,4,3,2,4,1,4,3,2,1,1,4,4,3,2],"Subang":[3,1,4,3,4,4,5,4,5,4,4,5,4,5,5,5,4,4,3,3,4,3,3,4,2,0,0,5,0,5,4,4,4,4,4,3,4,5,5,5,4,5,5,5,3,5,3,5,4,4,4,4,3,2,3,2,3,3,2,3,3,4,4,4,4,4,4,4,3,2,2,1,2,2,2,2,2,2,1,2,2,2,3,2,3,3,4,3,2,4,4,3,4,3,2,3,2,4,4,3,4],"Sukabumi":[3,1,4,2,5,4,5,4,5,4,2,5,5,5,3,4,4,4,3,1,2,3,1,3,2,0,0,2,0,5,4,4,2,3,4,4,4,5,5,5,4,5,5,4,3,5,3,5,2,1,2,2,2,1,2,1,1,4,1,2,2,1,2,2,2,2,2,2,3,2,2,1,2,1,1,3,2,1,1,3,2,1,3,2,3,1,4,2,2,3,2,2,2,1,1,3,2,2,3,2,2],"Surabaya":[3,2,4,2,5,4,5,5,5,5,4,3,5,5,5,5,4,4,5,3,3,2,2,3,2,0,0,3,0,4,3,4,4,3,4,4,4,4,5,5,4,5,3,5,3,5,3,3,2,2,3,3,3,3,3,3,3,2,3,2,2,2,3,3,3,2,3,2,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],"Tangerang":[2,1,2,3,2,4,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,3,4,0,0,3,0,2,3,2,3,3,2,2,2,2,2,2,2,2,3,1,2,1,2,2,3,2,4,2,4,2,4,4,2,4,1,2,2,1,4,4,5,3,2,1,3,5,4,3,1,3,4,3,3,2,1,4,3,3,3,4,1,4,4,4,4,4,3,3,3,3,4,2,2,3,4,2,4],"Tarakan":[3,1,4,1,5,0,5,5,3,2,4,0,4,5,3,5,4,0,0,0,1,3,3,3,5,0,0,5,0,5,4,4,4,1,4,0,0,5,5,5,0,5,5,5,3,0,1,0,1,4,3,2,4,1,5,2,2,2,1,2,2,1,2,1,2,1,1,2,2,1,2,1,1,1,1,1,1,1,1,1,1,2,4,1,2,2,1,1,4,2,1,1,2,2,1,2,4,4,2,2,1],"Tasikmalaya":[3,2,4,4,4,4,4,4,4,4,4,4,4,4,5,3,4,4,3,3,4,5,3,3,5,0,0,5,0,4,5,1,4,3,4,4,4,4,3,3,4,3,3,4,3,4,3,5,4,4,4,4,4,1,5,4,3,3,3,3,3,4,4,4,4,4,4,3,4,5,3,2,2,3,5,3,4,3,2,4,4,4,3,4,3,3,4,4,4,4,3,2,2,3,4,3,2,4,4,3,4],"Tegal":[3,1,2,1,2,4,1,2,3,2,4,5,4,5,5,5,5,4,3,3,2,3,2,3,3,0,0,5,0,4,1,1,4,3,4,4,4,5,5,5,2,3,5,3,2,2,3,5,2,4,3,3,4,4,3,3,2,2,2,1,3,2,4,3,5,3,2,3,3,2,3,3,4,3,2,4,3,2,3,4,3,4,3,3,3,3,3,5,4,4,4,3,4,5,4,5,4,4,4,2,4],"Tulungagung":[1,1,2,1,5,1,3,4,1,1,1,3,5,1,3,3,2,4,3,1,2,1,1,1,2,0,0,1,0,2,1,1,3,3,2,2,3,1,5,4,3,1,1,4,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1],"Wonogiri":[2,1,2,1,1,4,2,2,2,3,3,1,4,2,1,1,3,1,1,3,2,1,1,2,2,0,0,3,0,1,1,2,2,3,4,1,3,2,5,1,3,1,1,2,1,1,1,1,1,2,2,2,1,1,1,1,1,2,1,1,1,1,1,2,2,2,2,2,2,2,1,1,1,1,2,2,1,1,1,2,1,1,2,2,2,2,2,2,2,1,1,1,1,2,1,3,1,2,2,1,1],"Yogyakarta":[3,5,4,3,5,4,1,4,5,4,4,5,4,5,5,1,4,4,3,3,3,3,3,3,5,0,0,5,0,5,1,4,4,3,4,4,4,1,2,1,4,5,5,2,3,5,3,5,5,4,4,4,4,4,5,4,3,5,3,3,3,4,4,5,5,5,5,5,3,5,3,4,5,3,5,4,4,3,4,4,3,4,1,4,3,3,4,5,4,4,4,3,4,5,4,5,4,4,4,3,4]};
const CE={"Aceh":[4,5,3,4,2,3,5,3,1,3,3,5,3,4,4,3,3,3,1,4,4,4,4,4,5,0,0,5,0,4,5,3,3,3,3,3,3,4,5,4,3,4,1,3,4,4,4,1,1,4,4,4,4,4,4,3,4,4,4,4,4,4,5,2,4,4,4,5,4,4,4,4,4,4,4,4,3,3,5,3,4,5,4,5,4,4,3,4,3,3,5,5,4,4,3,5,5,5,5,4,4],"Ambon":[4,4,4,4,5,4,5,5,5,4,4,1,4,5,5,4,3,4,1,4,5,5,5,5,3,0,0,4,0,3,4,4,4,4,4,4,3,4,4,4,3,4,1,4,4,4,4,1,5,5,4,5,4,5,4,5,5,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,3,4,4,4,4,4,4,4,3,3,3,4,4,4,4,4,4,4,3,3,4,3],"Balikpapan":[4,5,2,5,5,3,5,2,1,5,3,5,4,5,5,3,3,3,2,4,5,4,4,4,4,0,0,4,0,0,4,3,3,4,5,5,3,5,3,4,3,3,3,4,4,3,4,1,5,4,4,4,4,4,4,5,5,5,4,4,4,5,4,4,5,4,4,4,4,5,4,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"Bandung":[3,1,3,4,4,5,5,1,5,3,3,2,3,3,4,4,1,3,1,4,4,4,4,4,4,0,0,5,0,5,3,4,3,3,4,3,3,2,2,5,4,5,1,4,4,1,4,4,3,3,3,3,4,3,4,3,4,2,4,4,4,3,5,4,4,1,4,5,4,4,5,5,5,4,2,3,5,4,4,3,4,4,4,4,4,4,4,5,4,5,4,5,4,4,4,4,4,5,4,4,4],"Bangka Belitung":[4,4,3,4,3,3,4,3,4,5,3,4,3,5,3,4,3,3,3,4,4,4,4,4,4,0,0,3,0,4,3,4,3,4,3,3,3,1,3,4,3,1,5,4,4,1,4,3,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,3,3,4,3,4,3,4,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,4],"Banjarmasin":[4,1,3,4,1,3,3,3,1,3,3,3,2,1,1,1,3,3,1,4,4,4,4,4,1,0,0,1,0,3,3,3,3,4,3,3,3,1,1,2,3,1,1,2,4,1,4,1,1,3,3,3,3,4,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,4,3,4,3,2,3,1,3,3,3,4,3],"Banjarnegara":[3,5,3,4,1,3,1,2,1,3,3,4,3,1,1,1,3,3,3,4,4,4,4,4,1,3,3,3,4,4,3,3,3,4,3,3,0,1,1,2,3,3,1,4,4,2,4,5,4,4,4,4,3,3,0,4,4,4,4,5,4,3,4,4,5,4,4,3,4,4,0,4,4,4,4,4,3,4,4,4,4,4,4,3,4,4,4,3,3,0,3,4,3,5,4,4,3,4,4,4,4],"Banyuwangi":[4,5,2,5,3,4,1,2,1,4,4,1,2,2,4,3,4,3,1,4,3,4,4,4,4,0,0,5,0,1,2,2,2,4,4,3,3,4,4,4,3,2,3,3,4,4,4,1,4,5,4,3,5,2,5,3,5,5,5,5,4,5,5,5,5,5,4,5,5,4,5,5,5,5,5,4,4,5,5,4,5,5,4,4,5,5,4,5,4,5,5,5,5,5,4,5,5,4,4,4,5],"Bau Bau":[5,5,5,4,5,4,5,4,5,5,4,5,4,5,5,5,5,3,5,4,4,4,4,4,1,0,0,5,0,4,3,5,4,4,5,4,5,5,5,4,5,5,5,5,5,5,5,1,4,4,3,3,3,4,5,3,4,4,4,4,5,3,4,4,4,4,4,4,3,4,4,4,3,3,4,3,4,3,3,3,4,3,4,3,4,4,3,5,3,4,4,4,4,4,3,5,3,4,4,5,4],"Bekasi":[4,3,2,4,3,3,1,2,3,2,3,1,3,3,1,2,1,3,3,4,4,4,3,4,4,0,0,3,0,1,3,3,3,4,3,3,4,4,3,4,3,2,4,2,4,4,4,1,3,3,3,3,3,4,4,4,4,5,4,5,4,3,4,4,3,3,4,3,4,4,4,4,4,4,4,3,4,4,4,3,4,3,4,4,4,4,4,3,3,3,4,4,4,4,4,3,4,3,3,4,4],"Blitar":[4,3,3,4,5,5,5,4,5,5,5,5,4,5,5,4,3,4,4,4,4,4,4,4,2,0,0,2,0,4,5,5,5,5,5,5,3,4,4,3,4,4,4,4,4,4,4,4,4,3,3,4,4,3,3,3,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,3,4,4,3,3,4,3,4,4,4,4,3,3,3,4,4,4,3,4,3,3,4,4,4,4,3],"Bogor":[4,1,3,4,5,5,5,4,5,5,4,5,4,5,5,3,5,3,3,4,4,4,4,4,1,0,0,1,0,4,4,5,4,4,5,4,4,1,5,4,4,5,3,5,4,5,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,2,3,4,3,2,3,1,3,3,3,4,3],"Bojonegoro":[4,1,3,4,1,4,5,3,5,4,3,5,3,3,1,4,3,3,1,4,4,4,4,4,3,0,0,4,0,3,5,3,3,4,4,3,4,4,1,2,3,1,4,2,4,1,4,1,5,3,3,3,5,3,5,3,5,2,4,4,4,5,4,5,1,1,2,4,4,2,5,3,4,4,3,4,4,4,3,3,4,3,4,3,4,4,4,5,3,3,3,5,5,4,3,4,4,4,4,4,4],"Cirebon":[4,5,3,4,5,3,3,3,3,4,3,3,3,3,3,4,3,3,3,4,4,4,4,4,4,0,0,5,0,4,3,4,3,4,3,3,3,4,4,4,4,1,3,4,4,4,4,1,5,5,5,5,4,4,4,5,5,5,4,5,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,5,5,5,5,3,4,4,4,4,4,5,4,4,5,5,4,4,5,4,3,4,4,4,5,4,4],"Denpasar":[5,4,3,4,1,3,1,1,1,3,3,1,1,1,1,1,3,3,4,4,4,4,4,4,4,0,0,4,0,1,3,3,3,4,3,3,0,1,4,2,4,1,1,2,4,1,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,4,4,2,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,3,4,4],"Depok":[5,1,3,4,5,3,5,4,5,5,3,5,5,5,5,4,3,3,3,4,4,4,4,4,1,0,0,1,0,5,5,3,3,5,3,5,3,5,3,4,3,5,5,2,4,5,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Garut":[1,1,3,5,1,3,1,3,1,3,3,1,3,1,1,1,3,3,4,4,5,4,4,5,5,0,0,5,0,1,3,3,3,4,3,3,3,1,1,2,3,1,1,2,4,1,4,1,3,5,3,5,5,5,5,3,5,5,5,5,4,4,5,5,5,5,5,3,4,3,5,5,5,5,5,5,5,5,5,4,4,5,5,5,5,5,5,5,5,3,5,5,5,5,4,5,5,5,5,4,5],"Indramayu":[4,1,3,4,1,3,1,3,1,1,3,1,2,1,1,1,3,3,1,4,4,4,4,4,1,0,0,1,0,1,3,3,3,4,3,3,3,1,1,2,3,1,1,2,4,1,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Jakarta":[4,5,5,5,1,2,5,5,5,5,3,4,5,5,4,5,5,4,5,5,5,5,5,4,5,0,0,5,0,1,5,5,3,4,5,5,3,2,5,5,4,1,5,5,4,1,4,5,3,3,1,5,5,5,5,5,5,5,5,5,2,3,5,5,5,5,4,5,4,4,5,5,5,5,5,5,5,5,5,5,5,4,4,5,5,4,5,5,4,5,5,5,5,5,5,5,5,5,4,5,5],"Jambi":[4,1,2,4,1,3,4,5,1,1,3,5,4,1,1,1,5,4,3,4,4,4,4,4,1,0,0,1,0,1,4,4,3,3,4,3,3,1,4,4,3,1,3,2,4,4,2,1,1,3,3,3,3,3,4,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,3,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Jember":[5,4,5,4,5,3,1,1,5,5,5,5,4,5,5,5,5,3,1,4,4,4,4,4,3,0,0,1,0,1,5,5,2,4,5,5,5,5,1,2,3,5,5,2,5,5,5,1,3,2,4,3,4,5,5,3,4,5,5,5,4,5,5,4,2,3,4,3,4,3,4,3,4,4,4,3,4,4,4,3,4,3,4,3,4,5,3,3,4,3,3,4,4,4,3,3,3,3,4,4,4],"Kabanjahe":[4,5,3,5,4,4,4,3,4,4,3,5,4,4,4,4,4,4,3,4,5,5,5,5,5,0,0,5,0,5,4,4,5,4,3,4,3,4,3,4,4,4,1,4,4,4,4,3,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,5],"Kediri":[4,5,3,4,1,3,1,3,3,3,3,1,3,1,1,1,3,3,1,4,4,4,4,4,4,0,0,1,0,3,3,3,3,4,3,3,3,1,1,2,3,1,1,2,4,1,4,1,4,4,4,4,3,4,4,4,4,4,4,4,4,4,3,3,1,4,2,3,4,4,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Kendari":[5,5,3,5,4,3,5,1,5,3,3,5,3,5,4,5,5,2,3,3,4,5,5,5,5,0,0,5,0,5,4,3,3,4,3,3,5,5,3,4,3,5,5,5,4,5,4,3,5,4,5,5,3,5,5,5,5,5,5,5,5,5,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,4,5],"Lamongan":[3,1,3,4,4,4,4,3,4,4,3,5,3,4,4,4,3,3,3,4,4,4,4,4,1,0,0,1,0,4,4,3,3,3,4,4,3,4,4,4,4,1,3,3,4,4,3,3,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Lampung":[3,1,3,4,1,3,5,3,1,3,5,1,4,5,3,3,3,3,4,4,4,4,4,4,3,0,0,1,0,3,5,4,3,4,3,3,3,1,1,3,5,5,1,2,4,5,3,1,1,3,3,3,3,3,3,3,4,2,4,4,4,3,3,3,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,4,3,3,3,4,3,2,3,1,3,3,3,4,3],"Madiun":[4,1,3,4,1,3,1,3,1,3,3,1,2,1,1,1,3,3,4,4,4,4,4,4,1,0,0,1,0,3,3,3,3,4,3,3,3,1,1,2,3,1,1,2,4,1,4,1,1,3,3,3,3,4,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Magelang":[4,5,3,5,4,3,1,3,1,3,3,4,3,1,1,1,3,3,4,4,5,5,5,5,5,0,0,5,0,3,4,3,3,4,3,3,3,1,1,2,3,1,1,2,1,1,3,1,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,3,5,4,5],"Makassar":[4,5,5,5,5,3,4,5,5,4,3,5,4,5,5,4,4,3,4,4,5,5,5,5,5,0,0,5,0,5,3,3,4,4,3,4,3,5,4,5,4,4,5,4,5,5,4,5,5,3,4,4,5,5,4,5,5,5,5,5,4,5,4,5,3,5,4,4,5,5,5,5,5,5,4,5,3,5,5,5,4,5,5,3,4,5,5,5,3,5,5,5,5,4,5,3,3,5,3,4,4],"Malang":[4,1,3,4,5,3,5,3,5,3,3,5,3,5,5,1,3,3,1,4,4,4,4,4,1,0,0,1,0,3,4,3,3,4,3,3,3,3,1,4,3,1,5,2,4,1,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Manado":[5,5,5,4,5,5,5,3,3,5,5,5,4,5,5,5,5,5,4,4,4,3,5,3,2,0,0,1,0,3,5,3,4,5,5,5,5,5,5,5,5,3,5,2,4,3,5,5,3,4,5,5,3,4,4,3,4,2,4,4,4,3,4,4,1,3,4,3,4,4,2,3,3,4,4,3,3,3,3,2,4,2,3,4,3,4,3,1,3,3,3,3,2,3,3,3,3,3,3,4,3],"Mataram":[1,5,3,5,4,3,3,3,1,4,3,1,1,1,1,1,3,5,1,4,4,4,4,4,2,0,0,2,0,3,3,3,3,4,4,3,3,3,1,4,3,1,1,2,1,3,4,1,1,3,3,3,3,3,2,5,4,2,4,4,4,4,3,4,3,4,4,3,4,4,4,5,1,5,4,4,3,4,4,3,4,4,4,3,4,4,3,3,3,3,3,4,4,4,3,1,3,3,3,4,4],"Medan":[4,5,3,4,3,3,1,3,3,3,3,4,3,3,4,4,3,4,4,4,5,5,5,4,5,0,0,5,0,4,3,3,3,4,4,3,4,3,4,4,3,3,4,4,4,3,3,4,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,4,4,5,4,5,5,5,4,5,3,5,5,5,5,4,5,5,5,5,5,5,3,3,5,5,5,4,5,5,3,3,3,4,5],"Mojokerto":[4,4,4,4,3,3,3,3,3,2,4,4,3,3,3,4,3,4,4,4,4,4,4,4,4,0,0,4,0,3,4,3,3,4,3,4,3,4,4,4,3,4,3,4,4,3,4,4,3,3,3,3,3,3,3,3,4,4,4,4,4,5,5,4,3,3,4,3,4,4,4,3,3,4,4,3,3,4,3,3,4,3,4,4,4,4,3,3,3,4,3,4,4,4,3,4,4,4,3,4,4],"Padang":[3,1,3,4,4,3,4,4,3,3,3,3,4,3,3,3,3,3,3,4,4,4,4,4,1,0,0,1,0,3,4,3,3,4,3,3,3,1,3,4,3,3,4,4,4,3,4,3,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Palembang":[3,4,3,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,0,0,5,0,3,3,3,3,4,3,3,3,3,1,4,3,3,2,4,4,3,4,2,4,4,4,4,3,3,4,4,5,4,4,4,4,4,4,5,4,4,5,5,4,4,4,4,5,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,5,5,5,4,4],"Palopo":[4,4,2,4,5,3,1,3,1,3,3,5,4,5,5,5,3,3,4,4,4,4,4,4,4,0,0,5,0,1,5,3,3,4,3,5,3,5,5,5,3,5,5,2,4,5,4,3,5,4,4,4,4,5,5,4,4,5,5,4,4,5,5,5,4,5,5,4,4,4,5,5,1,5,5,3,5,5,3,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,5,4,3,4,5],"Palu":[4,1,4,4,4,4,5,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,1,0,1,5,4,4,4,3,5,4,4,4,4,4,4,3,2,4,1,4,5,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,3,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Pati":[5,3,5,4,5,3,1,3,5,5,3,5,3,5,5,5,3,3,1,4,4,4,4,4,3,0,0,3,0,5,3,3,4,4,5,3,5,5,5,2,5,1,5,2,4,1,4,1,1,4,3,3,3,3,3,3,4,2,4,4,4,3,3,4,3,3,3,3,4,4,3,4,4,4,4,4,3,4,3,3,4,3,4,3,4,4,3,4,4,3,3,4,3,4,3,3,3,3,3,4,3],"Pekanbaru":[4,1,3,4,1,3,1,3,1,3,3,1,2,1,1,1,3,3,1,4,5,4,4,4,1,0,0,1,0,5,3,3,3,4,3,3,3,1,1,4,3,1,1,2,4,1,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,1,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Pematang Siantar":[5,5,4,4,1,4,1,4,3,3,4,4,4,3,1,5,4,3,4,4,2,2,4,4,4,0,0,4,0,4,4,3,3,4,3,3,3,1,5,5,3,4,4,4,4,4,3,3,4,3,3,3,3,2,5,4,4,4,4,4,4,3,3,4,2,3,2,4,5,4,4,3,3,4,4,3,3,4,3,3,4,3,4,3,4,4,3,2,3,3,3,4,3,4,3,3,3,3,3,4,3],"Pontianak":[4,5,3,5,2,3,5,2,3,3,3,5,3,3,3,4,3,4,4,4,4,4,5,4,5,0,0,5,0,5,5,4,3,4,4,3,3,4,2,4,3,4,3,3,4,4,4,1,4,4,4,4,4,5,5,4,5,5,5,4,4,5,5,5,4,5,5,5,4,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4,4,4,3,5,4,3,5,5,5,5,3,4,5,5,5,4,4],"Probolinggo":[4,5,2,4,5,3,1,3,4,2,3,5,3,4,1,5,3,5,4,4,4,4,4,4,4,0,0,4,0,4,5,5,4,4,5,5,4,1,5,5,4,1,4,2,4,1,3,5,5,3,3,3,3,5,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,3,4,4,4,4,4,3,4,4,4,4,3,4,4,3,3,4,4],"Purwokerto":[4,1,3,4,4,4,4,3,3,3,3,2,5,3,3,5,5,3,2,4,4,4,4,4,1,0,0,2,0,4,5,4,4,4,4,4,5,4,5,5,4,5,4,5,5,4,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,5,4,4,3,1,4,4,3,3,4,3,3,4,3,1,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Semarang":[2,5,3,4,3,3,1,3,3,3,3,2,3,3,1,1,3,3,2,4,4,4,4,4,4,0,0,3,0,3,3,3,3,4,3,3,3,2,4,2,3,3,3,4,4,4,4,1,4,4,4,4,4,2,4,5,5,4,4,5,4,4,5,3,3,3,3,4,4,3,4,3,1,4,4,5,4,5,5,3,5,5,4,3,5,4,4,1,4,3,3,5,4,2,3,1,3,4,4,4,3],"Serang":[4,4,3,4,5,4,1,3,4,4,3,5,4,4,5,4,3,3,3,4,4,4,4,4,4,0,0,4,0,4,4,5,4,5,4,3,3,5,4,4,3,5,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,5,4],"Sintang":[5,5,3,4,3,3,5,2,4,3,3,4,3,4,4,5,3,3,5,4,4,4,4,4,1,0,0,1,0,4,3,4,4,5,5,3,4,4,5,4,4,5,5,5,5,5,4,1,1,3,3,3,3,5,1,4,4,4,4,4,4,3,3,3,1,1,3,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Solo":[4,5,3,4,4,3,3,3,1,2,3,1,2,1,1,1,3,3,4,3,4,4,4,5,4,0,0,4,0,1,2,3,3,3,3,3,3,4,1,3,5,1,1,2,4,1,4,1,4,3,3,3,3,1,3,4,5,2,4,4,4,3,3,4,1,1,2,3,4,2,4,3,4,4,4,3,3,4,4,4,4,5,4,3,4,4,4,3,4,4,3,5,3,4,4,5,5,3,3,4,4],"Subang":[4,5,3,4,4,3,1,3,1,3,3,1,3,1,1,1,3,3,4,4,3,3,3,3,4,0,0,3,0,1,3,3,3,3,3,3,3,1,1,2,3,1,1,2,4,1,4,1,3,3,3,3,3,3,4,4,4,4,4,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,3,3,4,3,4,4,4,4,3,3,3,3],"Sukabumi":[4,5,3,4,1,3,1,3,1,3,3,1,1,1,1,1,3,3,4,4,4,4,5,4,4,0,0,4,0,3,3,3,3,4,3,3,3,1,1,2,3,1,1,2,4,1,4,1,4,5,4,4,4,5,4,5,5,4,5,5,4,5,4,4,5,4,4,4,4,4,5,5,5,5,5,4,4,5,5,4,4,5,4,4,4,5,3,4,4,4,4,4,4,5,5,4,4,4,4,4,4],"Surabaya":[4,4,3,4,1,3,1,2,1,2,3,3,2,1,3,1,3,3,1,4,4,4,4,3,4,0,0,4,0,3,4,3,3,4,3,3,3,3,2,2,3,1,1,2,4,1,4,1,4,4,3,3,3,3,1,3,3,4,3,4,4,4,3,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],"Tangerang":[4,5,4,5,4,3,4,3,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,0,0,5,0,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,5,5,3,5,3,4,3,3,5,4,5,4,4,5,3,4,1,5,4,5,4,2,4,5,5,4,4,4,4,5,5,3,4,5,3,3,4,4,3,4,4,3,4,4,3,4,4,4,4,4,3,4,3],"Tarakan":[4,5,3,5,1,0,1,2,1,3,3,0,3,1,1,1,3,0,0,0,4,4,4,4,2,0,0,3,0,1,3,3,3,4,3,0,0,1,1,2,0,1,1,2,4,0,4,0,5,3,3,4,3,5,1,4,4,4,5,4,4,5,4,5,4,5,5,4,4,5,4,5,5,5,4,3,4,5,4,5,4,4,3,4,4,4,5,5,3,4,5,5,4,4,5,4,3,3,3,4,5],"Tasikmalaya":[4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,4,4,4,3,4,4,3,0,0,3,0,3,3,5,3,4,3,3,3,2,4,4,3,2,3,4,4,4,4,1,1,3,3,3,3,5,3,3,4,4,4,4,4,3,3,4,3,3,3,4,4,3,4,4,4,4,3,4,3,4,4,3,3,3,3,3,3,3,3,4,3,3,3,3,3,4,3,3,3,3,3,4,3],"Tegal":[4,5,4,4,3,3,5,3,1,4,3,1,3,1,1,1,1,3,4,4,4,4,4,4,3,0,0,1,0,3,5,5,3,4,3,3,3,1,1,2,4,4,1,4,4,4,4,1,3,3,3,3,3,3,3,3,4,4,4,4,3,4,3,3,3,3,4,3,4,4,4,3,3,4,4,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3],"Tulungagung":[5,5,4,4,1,5,5,4,5,5,5,5,3,5,1,5,3,3,5,5,4,4,4,4,5,0,0,4,0,5,5,5,4,4,5,5,4,5,1,4,4,5,5,4,5,5,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4],"Wonogiri":[4,5,4,5,5,3,4,4,4,4,4,5,3,4,4,5,4,5,5,4,4,4,4,4,4,0,0,3,0,5,5,3,4,4,1,5,3,4,1,5,4,5,3,5,5,5,5,5,5,4,4,4,4,5,5,5,5,4,5,5,4,5,5,4,4,4,4,4,4,4,5,5,5,5,4,4,4,4,5,4,5,5,4,4,4,4,4,4,4,4,5,5,5,4,5,4,5,4,4,4,5],"Yogyakarta":[4,1,3,4,1,3,1,3,1,3,3,1,3,1,1,5,3,3,4,4,4,4,4,4,1,0,0,1,0,1,5,3,3,4,3,3,3,5,4,5,3,1,1,4,4,1,4,1,1,3,3,3,3,3,1,3,4,2,4,4,4,3,3,2,1,1,2,2,4,2,3,3,1,4,2,3,3,4,3,3,4,3,4,3,4,4,3,1,3,3,3,4,3,2,3,1,3,3,3,4,3]};

// Get unique major proses
const ALL_MAJOR=[...new Set(RISKS.map(r=>r.m))].sort();
const MEKAAR_MAJOR=[...new Set(RISKS.filter(r=>r.s==="Mekaar").map(r=>r.m))].sort();
const ULAMM_MAJOR=[...new Set(RISKS.filter(r=>r.s==="ULaMM").map(r=>r.m))].sort();
const CITIES=Object.keys(CR).sort();

const TABS=[
  {id:"riskmap",l:"Risk Map"},
  {id:"top10",l:"Top 10 Risiko"},
  {id:"topunit",l:"Top 10 Unit Kerja"},
  {id:"efk",l:"Efektivitas Kontrol"},
  {id:"unitmap",l:"Peta Unit Kerja"},
  {id:"detail",l:"Detail Risiko"},
];

// ═══ COMPONENTS ═══
const Card=({children,st})=><div style={{background:C.card,borderRadius:14,padding:"20px 18px",boxShadow:"0 1px 6px rgba(0,0,0,.05)",...st}}>{children}</div>;
const Tt=({t,s})=><div style={{marginBottom:s?6:14}}><div style={{fontSize:16,fontWeight:800,color:C.dk,fontFamily:F}}>{t}</div>{s&&<div style={{fontSize:11,color:C.sub,marginTop:2,fontFamily:F}}>{s}</div>}</div>;

function RiskMapGrid({data,title}){
  const LL=["Sangat Jarang (1)","Jarang (2)","Bisa (3)","Sangat Mungkin (4)","Hampir Pasti (5)"];
  const DL=["Sangat Rendah (1)","Rendah (2)","Moderat (3)","Tinggi (4)","Sangat Tinggi (5)"];
  return(<div>
    <div style={{fontSize:13,fontWeight:700,color:C.dk,marginBottom:8,textAlign:"center",fontFamily:F}}>{title}</div>
    <div style={{display:"flex"}}>
      <div style={{writingMode:"vertical-rl",transform:"rotate(180deg)",fontSize:9,fontWeight:700,color:C.sub,display:"flex",alignItems:"center",minWidth:14,letterSpacing:1.5,fontFamily:F}}>LIKELIHOOD</div>
      <div style={{display:"flex",flexDirection:"column-reverse",gap:2,marginRight:3}}>
        {LL.map((l,i)=><div key={i} style={{height:46,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:3}}><span style={{fontSize:8,color:C.mt,textAlign:"right",lineHeight:1.1,fontFamily:F}}>{l}</span></div>)}
      </div>
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2}}>
          {[5,4,3,2,1].map(l=>[1,2,3,4,5].map(d=>{
            const k=`${l},${d}`;const v=data[k]||0;
            return<div key={k} style={{width:46,height:46,background:RM[l-1][d-1],borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",opacity:v===0?.12:1}} title={`L${l}×D${d}: ${v}`}>
              <span style={{fontSize:v>99?10:13,fontWeight:800,color:(l>=4&&d>=3)?"#fff":"#1e293b",textShadow:(l>=4&&d>=3)?"0 1px 2px rgba(0,0,0,.4)":"none",fontFamily:F}}>{v||"–"}</span>
            </div>
          }))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2,marginTop:3}}>
          {DL.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:7.5,color:C.mt,lineHeight:1.1,fontFamily:F}}>{d}</div>)}
        </div>
        <div style={{textAlign:"center",fontSize:9,fontWeight:700,color:C.sub,marginTop:4,letterSpacing:1.5,fontFamily:F}}>DAMPAK</div>
      </div>
    </div>
  </div>);
}

function useFiltered(segment,major,cabang){
  return useMemo(()=>{
    let r=RISKS;
    if(segment!=="Semua") r=r.filter(x=>x.s===segment);
    if(major!=="Semua") r=r.filter(x=>x.m===major);
    // If cabang selected, override bR with cabang-specific value
    if(cabang!=="Semua"&&CR[cabang]){
      const cb=CR[cabang],ce=CE[cabang];
      r=r.map(x=>{
        const v=cb[x.i]||0;
        const e=ce[x.i]||0;
        return {...x,bR:v,ef:EN[e]||x.ef,_cab:true};
      }).filter(x=>x.bR>0);
    }
    return r;
  },[segment,major,cabang]);
}

// ═══ MAIN ═══
export default function Dashboard(){
  const [tab,setTab]=useState("riskmap");
  const [seg,setSeg]=useState("Semua");
  const [major,setMajor]=useState("Semua");
  const [cab,setCab]=useState("Semua");

  const majors=seg==="Semua"?ALL_MAJOR:seg==="Mekaar"?MEKAAR_MAJOR:ULAMM_MAJOR;
  const filtered=useFiltered(seg,major,cab);
  const totalR=filtered.length;

  // Build risk maps from filtered
  const inhM={},resM={};
  filtered.forEach(r=>{
    const li=Math.min(5,Math.max(1,Math.round(r.tl))),di=Math.min(5,Math.max(1,Math.round(r.td)));
    inhM[`${li},${di}`]=(inhM[`${li},${di}`]||0)+1;
    const rl=Math.min(5,Math.max(1,Math.round(r.bR)));
    resM[`${rl},${rl}`]=(resM[`${rl},${rl}`]||0)+1;
  });
  const trI={},trR={},efk={};
  filtered.forEach(r=>{trI[r.tr]=(trI[r.tr]||0)+1;trR[r.tR]=(trR[r.tR]||0)+1;efk[r.ef]=(efk[r.ef]||0)+1;});
  const hiI=trI["High"]||0,hiR=trR["High"]||0;
  const efPlus=(efk["Sangat Efektif"]||0)+(efk["Efektif"]||0);

  // Efk donut
  const efkEntries=["Sangat Efektif","Efektif","Cukup Efektif","Kurang Efektif","Sangat Tidak Efektif"].map(l=>({l,v:efk[l]||0})).filter(x=>x.v>0);
  const efkTotal=efkEntries.reduce((s,x)=>s+x.v,0);
  const sz=180,cx=90,cy=90,ri=72,ir=44;
  let cum=-90;
  const arcs=efkEntries.map(({l,v})=>{
    const a=(v/efkTotal)*360,st=cum;cum+=a;
    const sR=(st*Math.PI)/180,eR=(cum*Math.PI)/180,la=a>180?1:0;
    return{l,v,d:`M ${cx+ri*Math.cos(sR)} ${cy+ri*Math.sin(sR)} A ${ri} ${ri} 0 ${la} 1 ${cx+ri*Math.cos(eR)} ${cy+ri*Math.sin(eR)} L ${cx+ir*Math.cos(eR)} ${cy+ir*Math.sin(eR)} A ${ir} ${ir} 0 ${la} 0 ${cx+ir*Math.cos(sR)} ${cy+ir*Math.sin(sR)} Z`,c:EC[l]};
  });

  // Top 10 unit kerja (only when no cabang filter)
  const unitData=useMemo(()=>{
    const riskIdxs=filtered.map(r=>r.i);
    return CITIES.map(city=>{
      const cb=CR[city];
      const vals=riskIdxs.map(i=>cb[i]||0).filter(v=>v>0);
      const avg=vals.length>0?vals.reduce((s,v)=>s+v,0)/vals.length:0;
      const hi=vals.filter(v=>v>=5).length;
      return{city,avg:Math.round(avg*100)/100,c:vals.length,hi};
    }).sort((a,b)=>b.avg-a.avg);
  },[filtered]);

  const filterLabel=`${seg}${major!=="Semua"?` → ${major}`:""}${cab!=="Semua"?` → ${cab}`:""}`;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:F}}>
      <link href={FL} rel="stylesheet"/>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b 60%,#334155)",padding:"18px 22px 10px",color:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:8.5,textTransform:"uppercase",letterSpacing:3,color:"#38bdf8",fontWeight:600}}>PNM — Manajemen Risiko Operasional</div>
            <div style={{fontSize:22,fontWeight:900,letterSpacing:-.5,marginTop:2}}>Dashboard RCSA</div>
            <div style={{fontSize:10.5,color:"#94a3b8",marginTop:1}}>101 Risiko Unik (37 Mekaar + 64 ULaMM) • {CITIES.length} Cabang</div>
          </div>
          {/* KPIs */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{l:"Risiko Tampil",v:totalR,c:"#38bdf8"},{l:"High (Inh)",v:hiI,c:"#f87171"},{l:"High (Res)",v:hiR,c:"#fb923c"},{l:"Kontrol Efektif+",v:efPlus,c:"#4ade80"}].map(x=>
              <div key={x.l} style={{textAlign:"center",padding:"4px 10px",background:"rgba(255,255,255,.08)",borderRadius:6,minWidth:60}}>
                <div style={{fontSize:8,color:"#94a3b8"}}>{x.l}</div>
                <div style={{fontSize:17,fontWeight:800,color:x.c}}>{x.v}</div>
              </div>
            )}
          </div>
        </div>
        {/* Filters */}
        <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap",alignItems:"center"}}>
          <select value={seg} onChange={e=>{setSeg(e.target.value);setMajor("Semua");}} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11,fontFamily:F,fontWeight:600,cursor:"pointer"}}>
            <option value="Semua" style={{color:"#000"}}>Semua Segment</option>
            <option value="Mekaar" style={{color:"#000"}}>Mekaar</option>
            <option value="ULaMM" style={{color:"#000"}}>ULaMM</option>
          </select>
          <select value={major} onChange={e=>setMajor(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11,fontFamily:F,fontWeight:600,cursor:"pointer",maxWidth:260}}>
            <option value="Semua" style={{color:"#000"}}>Semua Proses Bisnis</option>
            {majors.map(m=><option key={m} value={m} style={{color:"#000"}}>{m}</option>)}
          </select>
          <select value={cab} onChange={e=>setCab(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11,fontFamily:F,fontWeight:600,cursor:"pointer",maxWidth:200}}>
            <option value="Semua" style={{color:"#000"}}>Semua Cabang</option>
            {CITIES.map(c=><option key={c} value={c} style={{color:"#000"}}>{c}</option>)}
          </select>
          {(seg!=="Semua"||major!=="Semua"||cab!=="Semua")&&<button onClick={()=>{setSeg("Semua");setMajor("Semua");setCab("Semua");}} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F}}>✕ Reset</button>}
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:2,marginTop:10,overflowX:"auto"}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 14px",border:"none",cursor:"pointer",borderRadius:"7px 7px 0 0",background:tab===t.id?C.bg:"transparent",color:tab===t.id?C.dk:"#64748b",fontWeight:tab===t.id?700:500,fontSize:11,fontFamily:F,transition:"all .2s",whiteSpace:"nowrap"}}>{t.l}</button>)}
        </div>
      </div>

      <div style={{padding:"16px 18px",maxWidth:1000,margin:"0 auto"}}>
        {filterLabel!=="Semua"&&<div style={{fontSize:11,color:C.sub,marginBottom:10,fontFamily:F,background:"#e2e8f0",padding:"6px 12px",borderRadius:6,display:"inline-block"}}>Filter: <b>{filterLabel}</b> — {totalR} risiko</div>}

        {/* RISK MAP */}
        {tab==="riskmap"&&<Card><Tt t="Risk Map — Inheren vs Residual" s={`Pergerakan ${totalR} risiko setelah kontrol`}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
            <RiskMapGrid data={inhM} title="Risiko Inheren"/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"0 4px"}}>
              <div style={{fontSize:9,fontWeight:700,color:C.sub,fontFamily:F}}>Kontrol</div>
              <svg width={32} height={22}><path d="M3,11 L22,11 M17,5 L24,11 L17,17" fill="none" stroke={C.low} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <RiskMapGrid data={resM} title="Risiko Residual"/>
          </div>
          <div style={{marginTop:16,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {[{l:"Zona Merah",vI:hiI,vR:hiR,bg:"#fef2f2",c:C.hi},{l:"Zona Kuning",vI:totalR-hiI-(trI["Low"]||0),vR:totalR-hiR-(trR["Low"]||0),bg:"#fffbeb",c:C.mod},{l:"Zona Hijau",vI:trI["Low"]||0,vR:trR["Low"]||0,bg:"#f0fdf4",c:C.low}].map(z=>
              <div key={z.l} style={{background:z.bg,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:9.5,color:z.c,fontFamily:F}}>{z.l}</div>
                <div style={{fontSize:20,fontWeight:800,color:z.c,fontFamily:F}}>{z.vI} → {z.vR}</div>
              </div>
            )}
          </div>
        </Card>}

        {/* TOP 10 RISIKO */}
        {tab==="top10"&&<Card><Tt t="Top 10 Risiko Tertinggi" s={`Berdasarkan ${cab!=="Semua"?"besaran risiko cabang "+cab:"rata-rata besaran risiko residual"}`}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[...filtered].sort((a,b)=>b.bR-a.bR).slice(0,10).map((r,i)=>
              <div key={r.k} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:i<3?"#fef2f2":"#f8fafc",borderRadius:9,borderLeft:`3px solid ${i<3?C.hi:i<6?C.mh:C.lm}`}}>
                <div style={{fontSize:18,fontWeight:800,color:i<3?C.hi:C.mt,minWidth:24,textAlign:"center",fontFamily:F}}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.dk,lineHeight:1.3,fontFamily:F}}>{r.ev}</div>
                  <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:8.5,padding:"1px 6px",borderRadius:3,background:JC[r.j]+"15",color:JC[r.j],fontWeight:600,fontFamily:F}}>{r.j.replace("Risiko ","")}</span>
                    <span style={{fontSize:8.5,color:C.mt,fontFamily:F}}>{r.m}</span>
                    <span style={{fontSize:8.5,padding:"1px 6px",borderRadius:3,background:r.s==="Mekaar"?"#1d4ed815":"#ea580c15",color:r.s==="Mekaar"?C.bl:C.or,fontWeight:600,fontFamily:F}}>{r.s}</span>
                  </div>
                  <div style={{fontSize:9.5,color:C.sub,marginTop:3,fontFamily:F}}>Kontrol: {r.ct}</div>
                </div>
                <div style={{textAlign:"right",minWidth:48}}>
                  <div style={{fontSize:20,fontWeight:800,color:brCol(r.bR),fontFamily:F}}>{typeof r.bR==="number"?r.bR.toFixed(r._cab?0:1):r.bR}</div>
                  <div style={{fontSize:8,color:C.mt,fontFamily:F}}>BR Res</div>
                </div>
              </div>
            )}
          </div>
        </Card>}

        {/* TOP 10 UNIT KERJA */}
        {tab==="topunit"&&<Card><Tt t="Top 10 Unit Kerja Risiko Tertinggi" s="Rata-rata besaran risiko residual per cabang (berdasarkan filter aktif)"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {unitData.slice(0,10).map(({city,avg,c,hi},i)=>
              <div key={city} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:16,fontWeight:800,color:i<3?C.hi:C.mt,minWidth:24,textAlign:"center",fontFamily:F}}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12.5,fontWeight:700,color:C.dk,fontFamily:F}}>Cabang PNM {city}</span>
                    <span style={{fontSize:12.5,fontWeight:800,color:brCol(avg),fontFamily:F}}>{avg.toFixed(2)}</span>
                  </div>
                  <div style={{height:9,background:"#f1f5f9",borderRadius:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(avg/5)*100}%`,background:`linear-gradient(90deg,${brCol(avg)}cc,${brCol(avg)})`,borderRadius:5}}/>
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:3}}>
                    <span style={{fontSize:9.5,color:C.sub,fontFamily:F}}>{c} risiko</span>
                    <span style={{fontSize:9.5,color:C.hi,fontWeight:600,fontFamily:F}}>High: {hi}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>}

        {/* EFEKTIVITAS */}
        {tab==="efk"&&<Card><Tt t="Nilai Efektivitas Kontrol" s={`${efkTotal} risiko — ${filterLabel}`}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
            <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
              {arcs.map(a=><path key={a.l} d={a.d} fill={a.c} stroke="#fff" strokeWidth={2}/>)}
              <text x={cx} y={cy-4} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.dk} fontFamily={F}>{efkTotal>0?((efPlus/efkTotal)*100).toFixed(1):0}%</text>
              <text x={cx} y={cy+12} textAnchor="middle" fontSize={9} fill={C.mt} fontFamily={F}>Efektif+</text>
            </svg>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {arcs.map(a=><div key={a.l} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:14,height:14,borderRadius:3,background:a.c,flexShrink:0}}/>
                <div><div style={{fontSize:12,fontWeight:600,color:C.dk,fontFamily:F}}>{a.l}</div><div style={{fontSize:10,color:C.sub,fontFamily:F}}>{a.v} ({((a.v/efkTotal)*100).toFixed(1)}%)</div></div>
              </div>)}
            </div>
          </div>
        </Card>}

        {/* PETA UNIT KERJA */}
        {tab==="unitmap"&&<Card><Tt t="Peta Unit Kerja pada Risk Map" s="Setiap titik = 1 cabang. Y = avg BR residual, X = avg BR residual (berdasarkan filter aktif)"/>
          {(()=>{
            const cells={};
            unitData.forEach(({city,avg,hi,c})=>{
              const b=Math.min(5,Math.max(1,Math.round(avg)));
              const p=avg<2?1:avg<2.5?2:avg<3?3:avg<3.5?4:5;
              const key=`${p},${b}`;
              if(!cells[key])cells[key]=[];
              cells[key].push({city,avg,hi,c});
            });
            return <div style={{display:"flex"}}>
              <div style={{writingMode:"vertical-rl",transform:"rotate(180deg)",fontSize:9,fontWeight:700,color:C.sub,display:"flex",alignItems:"center",minWidth:14,letterSpacing:1.5,fontFamily:F}}>AVG BR RES</div>
              <div style={{display:"flex",flexDirection:"column-reverse",gap:2,marginRight:3}}>
                {["<2.0","2.0-2.5","2.5-3.0","3.0-3.5",">3.5"].map((l,i)=><div key={i} style={{height:60,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:3}}><span style={{fontSize:8.5,color:C.mt,fontFamily:F}}>{l}</span></div>)}
              </div>
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2}}>
                  {[5,4,3,2,1].map(p=>[1,2,3,4,5].map(b=>{
                    const key=`${p},${b}`;const items=cells[key]||[];
                    return<div key={key} style={{width:60,height:60,background:RM[p-1][b-1],borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:2,padding:3,opacity:items.length===0?.1:1}}>
                      {items.length===0&&<span style={{fontSize:10,color:C.mt}}>–</span>}
                      {items.map((it,j)=><div key={j} title={`${it.city}: avg=${it.avg}`} style={{width:8,height:8,borderRadius:5,background:"#fff",border:`2px solid ${brCol(it.avg)}`,cursor:"default"}}/>)}
                    </div>;
                  }))}
                </div>
                <div style={{textAlign:"center",fontSize:9,fontWeight:700,color:C.sub,marginTop:6,letterSpacing:1.5,fontFamily:F}}>AVG BESARAN RISIKO RESIDUAL</div>
              </div>
            </div>;
          })()}
        </Card>}

        {/* DETAIL RISIKO */}
        {tab==="detail"&&<Card><Tt t="Detail Seluruh Risiko" s={`${totalR} risiko — ${filterLabel}`}/>
          <div style={{maxHeight:500,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5,fontFamily:F}}>
              <thead><tr style={{background:"#f1f5f9",position:"sticky",top:0}}>
                {["#","Kode","Risk Event","Proses","Jenis","Seg","BR Inh","BR Res","Efektivitas"].map(h=><th key={h} style={{padding:"8px 6px",textAlign:"left",fontWeight:700,color:C.dk,borderBottom:"2px solid #e2e8f0",fontSize:10}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[...filtered].sort((a,b)=>b.bR-a.bR).map((r,i)=>
                  <tr key={r.k} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"6px",color:C.mt,fontWeight:700}}>{i+1}</td>
                    <td style={{padding:"6px",color:C.sub,fontSize:9}}>{r.k}</td>
                    <td style={{padding:"6px",color:C.dk,fontWeight:500,maxWidth:200}}>{r.ev}</td>
                    <td style={{padding:"6px",color:C.sub,fontSize:9.5}}>{r.m}</td>
                    <td style={{padding:"6px"}}><span style={{fontSize:8.5,padding:"1px 5px",borderRadius:3,background:JC[r.j]+"15",color:JC[r.j],fontWeight:600}}>{r.j.replace("Risiko ","")}</span></td>
                    <td style={{padding:"6px"}}><span style={{fontSize:8.5,padding:"1px 5px",borderRadius:3,background:r.s==="Mekaar"?"#1d4ed815":"#ea580c15",color:r.s==="Mekaar"?C.bl:C.or,fontWeight:600}}>{r.s}</span></td>
                    <td style={{padding:"6px",fontWeight:700,color:brCol(r.br)}}>{typeof r.br==="number"?r.br.toFixed(1):r.br}</td>
                    <td style={{padding:"6px",fontWeight:800,color:brCol(r.bR)}}>{typeof r.bR==="number"?r.bR.toFixed(r._cab?0:1):r.bR}</td>
                    <td style={{padding:"6px"}}><span style={{fontSize:8.5,padding:"1px 5px",borderRadius:3,background:EC[r.ef]+"20",color:EC[r.ef],fontWeight:600}}>{r.ef}</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>}

        <div style={{textAlign:"center",padding:"16px 0 6px",fontSize:9,color:C.mt,fontFamily:F}}>
          PNM RCSA Dashboard • 101 Risiko Unik (Agregasi) • {new Date().toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"})}
        </div>
      </div>
    </div>
  );
}
