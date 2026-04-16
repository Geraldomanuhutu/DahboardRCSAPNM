import { useState, useMemo } from "react";

const F = "'Source Sans 3', system-ui, sans-serif";
const FURL = "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800;900&display=swap";
const CL = {bg:"#f0f2f5",card:"#fff",dk:"#101828",sub:"#475467",mt:"#98a2b3",lo:"#0d6832",lm:"#4ca768",md:"#d4a843",mh:"#e07020",hi:"#c62828",bl:"#1d4ed8",or:"#ea580c"};
const RMC = [["#0d6832","#0d6832","#0d6832","#4ca768","#4ca768"],["#0d6832","#0d6832","#4ca768","#a8d5a2","#a8d5a2"],["#0d6832","#4ca768","#a8d5a2","#a8d5a2","#f0e68c"],["#f0e0a0","#f0d060","#eaaa30","#eaaa30","#c62828"],["#f0e0a0","#eaaa30","#c62828","#c62828","#8b0000"]];
const EFC = {"Sangat Efektif":"#0d6832","Efektif":"#2e8b57","Cukup Efektif":"#d4a843","Kurang Efektif":"#e07020","Sangat Tidak Efektif":"#c62828"};
const JRC = {"Risiko Operasional":"#1d4ed8","Risiko Kredit":"#ea580c","Risiko Hukum":"#7c3aed","Risiko Kepatuhan":"#059669"};
const EFN = {5:"Sangat Efektif",4:"Efektif",3:"Cukup Efektif",2:"Kurang Efektif",1:"Sangat Tidak Efektif"};
const EF_ORD = ["Sangat Efektif","Efektif","Cukup Efektif","Kurang Efektif","Sangat Tidak Efektif"];

function brCol(b){if(b>=4)return CL.hi;if(b>=3.5)return CL.mh;if(b>=2.8)return CL.md;if(b>=2)return CL.lm;return CL.lo;}

const R=[
{i:0,s:"Mekaar",m:"Pencairan Kredit",ev:"Dokumen PDPKM fiktif/tidak lengkap",j:"Risiko Hukum",tl:3.04,td:3.16,br:10.1,bR:2.98,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUM reviu dan approval PDPKM"},
{i:1,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Pembiayaan belum disetujui nasabah/pejabat",j:"Risiko Hukum",tl:2.45,td:3.38,br:9.48,bR:2.47,tr:"Moderate",tR:"Low",ef:"Sangat Efektif",ct:"KUU proses akad tanda tangan"},
{i:2,s:"Mekaar",m:"Pencairan Kredit",ev:"Pencairan tidak sesuai syarat ketentuan",j:"Risiko Kepatuhan",tl:2.98,td:2.93,br:8.74,bR:3.53,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"KUM/SAO tandatangani FP4"},
{i:3,s:"ULaMM",m:"Pembayaran Kredit ULaMM",ev:"Pelunasan dini tidak terotorisasi",j:"Risiko Kepatuhan",tl:2.1,td:2.48,br:5.72,bR:2.16,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Pejabat tanda tangan Memo"},
{i:4,s:"Mekaar",m:"Inisiasi Kredit",ev:"Perhitungan angsuran nasabah tidak akurat",j:"Risiko Kredit",tl:3.8,td:3.85,br:15.56,bR:3.73,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi hitung angsuran"},
{i:5,s:"Mekaar",m:"Inisiasi Kredit",ev:"Informasi pembiayaan nasabah tidak akurat",j:"Risiko Kredit",tl:2.79,td:2.64,br:7.47,bR:3.22,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat reviu FP4"},
{i:6,s:"Mekaar",m:"Inisiasi Kredit",ev:"Penilaian pemberian kredit tidak akurat",j:"Risiko Kredit",tl:3.34,td:3.63,br:12.86,bR:3.34,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi notifikasi error"},
{i:7,s:"Mekaar",m:"Inisiasi Kredit",ev:"Calon nasabah tidak sanggup lolos",j:"Risiko Kredit",tl:3.3,td:2.96,br:10.16,bR:3.38,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi tolak melebihi kapasitas"},
{i:8,s:"Mekaar",m:"Inisiasi Kredit",ev:"Perhitungan biaya jasa tidak akurat",j:"Risiko Kredit",tl:3.46,td:3.8,br:13.68,bR:3.5,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi hitung jasa/margin"},
{i:9,s:"Mekaar",m:"Inisiasi Kredit",ev:"Nasabah tidak mampu bayar angsuran",j:"Risiko Kredit",tl:3.15,td:2.9,br:9.35,bR:3.28,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi blokir nasabah bermasalah"},
{i:10,s:"Mekaar",m:"Inisiasi Kredit",ev:"Info pembiayaan tidak akurat (lanjutan)",j:"Risiko Kredit",tl:2.76,td:2.7,br:7.55,bR:3.16,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat reviu FP4"},
{i:11,s:"Mekaar",m:"Inisiasi Kredit",ev:"Penilaian kredit tidak akurat (lanjutan)",j:"Risiko Kredit",tl:3.38,td:2.85,br:9.75,bR:3.03,tr:"Moderate",tR:"Moderate",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi notifikasi error"},
{i:12,s:"Mekaar",m:"Inisiasi Kredit",ev:"Nasabah tidak sanggup lolos (lanjutan)",j:"Risiko Kredit",tl:3.37,td:3.59,br:12.68,bR:3.76,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi tolak melebihi kapasitas"},
{i:13,s:"Mekaar",m:"Inisiasi Kredit",ev:"Biaya jasa tidak akurat (lanjutan)",j:"Risiko Kredit",tl:3.49,td:3.5,br:12.97,bR:3.41,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi hitung margin"},
{i:14,s:"Mekaar",m:"Inisiasi Kredit",ev:"Angsuran tidak akurat (lanjutan)",j:"Risiko Kredit",tl:3.9,td:3.89,br:16.17,bR:3.72,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi hitung angsuran"},
{i:15,s:"Mekaar",m:"Pencairan Kredit",ev:"Ketidaksesuaian data angsuran per minggu",j:"Risiko Kredit",tl:3.95,td:4.05,br:16.98,bR:3.83,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"BR.Net hitung installment"},
{i:16,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"Perhitungan penerimaan tidak akurat",j:"Risiko Kredit",tl:2.96,td:2.74,br:8.14,bR:3.2,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"BR.Net tampilkan angsuran"},
{i:17,s:"Mekaar",m:"Penyelesaian Kredit",ev:"Nominal pembayaran tidak sesuai",j:"Risiko Kredit",tl:2.82,td:2.7,br:7.81,bR:3.27,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"KUM approval input FAO"},
{i:18,s:"Mekaar",m:"Penyelesaian Kredit",ev:"Rescheduling fiktif/tidak sesuai",j:"Risiko Kredit",tl:3.83,td:3.83,br:15.33,bR:3.77,tr:"High",tR:"High",ef:"Efektif",ct:"AO/SAO KUM verifikasi"},
{i:19,s:"Mekaar",m:"Penyelesaian Kredit",ev:"Info rescheduling tidak akurat",j:"Risiko Kredit",tl:3.04,td:3.02,br:9.22,bR:2.85,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUM/KAB verifikasi data"},
{i:20,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Analisa kolektibilitas tidak akurat",j:"Risiko Kredit",tl:2.34,td:2.72,br:6.64,bR:2.22,tr:"Moderate",tR:"Moderate",ef:"Efektif",ct:"Marketline validasi field"},
{i:21,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Repayment capacity tidak tepat",j:"Risiko Kredit",tl:2.71,td:2.88,br:8.05,bR:2.53,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Marketline hitung RC"},
{i:22,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Angsuran tidak sesuai",j:"Risiko Kredit",tl:2.12,td:2.64,br:6.0,bR:2.17,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Marketline cross collateral"},
{i:23,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Analisa struktur/agunan tidak akurat",j:"Risiko Kredit",tl:2.5,td:2.81,br:7.26,bR:2.53,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUU reviu kunjungan"},
{i:24,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Proposal tidak sesuai kemampuan",j:"Risiko Kredit",tl:3.17,td:3.38,br:11.47,bR:3.19,tr:"Moderate",tR:"High",ef:"Efektif",ct:"CRA reviu dokumen"},
{i:25,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Angsuran tidak sesuai (pengikatan)",j:"Risiko Kredit",tl:2.0,td:2.0,br:4.0,bR:3.0,tr:"Moderate",tR:"Moderate",ef:"Cukup Efektif",ct:"MMS hitung angsuran"},
{i:26,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Perpindahan dokumen agunan tidak terdeteksi",j:"Risiko Kredit",tl:2.0,td:4.0,br:8.0,bR:5.0,tr:"Moderate",tR:"High",ef:"Cukup Efektif",ct:"KUU tandatangani BAST"},
{i:27,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Proposal tidak sesuai (3R)",j:"Risiko Kredit",tl:3.33,td:3.47,br:13.1,bR:3.31,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"CRA reviu dokumen"},
{i:28,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Agunan perbedaan nilai (lelang)",j:"Risiko Kredit",tl:2.0,td:2.0,br:4.0,bR:2.0,tr:"Moderate",tR:"Low to Moderate",ef:"Efektif",ct:"AOM retaksasi agunan"},
{i:29,s:"Mekaar",m:"Inisiasi Kredit",ev:"Output info nasabah tidak sesuai",j:"Risiko Operasional",tl:3.32,td:3.46,br:12.41,bR:3.37,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi validasi NIK"},
{i:30,s:"Mekaar",m:"Inisiasi Kredit",ev:"Persetujuan pihak tidak berwenang",j:"Risiko Operasional",tl:2.51,td:2.79,br:7.36,bR:2.76,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi jalur approval"},
{i:31,s:"Mekaar",m:"Inisiasi Kredit",ev:"Pencairan ke pihak bukan peminjam",j:"Risiko Operasional",tl:2.55,td:2.76,br:7.25,bR:3.08,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi BO blocker"},
{i:32,s:"Mekaar",m:"Inisiasi Kredit",ev:"Uji Kelayakan tidak lengkap",j:"Risiko Operasional",tl:3.31,td:2.93,br:9.79,bR:3.55,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"KUM/SAO approval checker"},
{i:33,s:"Mekaar",m:"Inisiasi Kredit",ev:"Kehadiran PP 1-3 tidak benar",j:"Risiko Operasional",tl:2.87,td:2.82,br:8.37,bR:2.81,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUM periksa foto PP"},
{i:34,s:"Mekaar",m:"Inisiasi Kredit",ev:"Pencairan bukan peminjam (lanjutan)",j:"Risiko Operasional",tl:2.8,td:2.85,br:8.24,bR:3.26,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi verifikasi nama"},
{i:35,s:"Mekaar",m:"Inisiasi Kredit",ev:"Persetujuan tidak berwenang (lanjutan)",j:"Risiko Operasional",tl:2.46,td:2.67,br:6.92,bR:3.04,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Mekaar Digi jalur approval"},
{i:36,s:"Mekaar",m:"Pencairan Kredit",ev:"Pencatatan realisasi tidak lengkap",j:"Risiko Operasional",tl:2.75,td:2.84,br:7.88,bR:3.39,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pengecekan input PDPKM"},
{i:37,s:"Mekaar",m:"Pencairan Kredit",ev:"Data tidak sinkron antar aplikasi",j:"Risiko Operasional",tl:3.41,td:3.01,br:10.24,bR:3.11,tr:"Moderate",tR:"Moderate",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi BO interface"},
{i:38,s:"Mekaar",m:"Pencairan Kredit",ev:"Perhitungan pencairan tidak akurat",j:"Risiko Operasional",tl:4.06,td:4.3,br:18.29,bR:3.95,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"BR.Net hitung UP dan dana"},
{i:39,s:"Mekaar",m:"Pencairan Kredit",ev:"Dana Unit tidak sesuai pengajuan",j:"Risiko Operasional",tl:3.31,td:3.77,br:13.74,bR:3.39,tr:"High",tR:"High",ef:"Efektif",ct:"FAO cocokkan nominal PDPKM"},
{i:40,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"Info penerimaan pembayaran tidak akurat",j:"Risiko Operasional",tl:2.78,td:2.82,br:7.93,bR:3.28,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"FAO input sesuai uang"},
{i:41,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"Data tidak sinkron (PKM)",j:"Risiko Operasional",tl:3.41,td:3.42,br:12.19,bR:3.29,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi BO interface"},
{i:42,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"Hilangnya uang angsuran",j:"Risiko Operasional",tl:2.88,td:3.6,br:11.93,bR:3.22,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"FAO setoran Bank/BRILink+KUM"},
{i:43,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"AO kecelakaan menuju PKM",j:"Risiko Operasional",tl:3.74,td:3.74,br:14.93,bR:3.59,tr:"High",tR:"High",ef:"Kurang Efektif",ct:"Sosialisasi safety riding"},
{i:44,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"Memo UP tidak lengkap",j:"Risiko Operasional",tl:2.63,td:2.62,br:7.02,bR:2.31,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Mekaar Digi BO interface"},
{i:45,s:"Mekaar",m:"PKM (Pembayaran Kredit)",ev:"Data tidak sinkron (UP)",j:"Risiko Operasional",tl:3.3,td:3.51,br:12.5,bR:3.22,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Mekaar Digi BO interface"},
{i:46,s:"Mekaar",m:"Monitoring Kredit",ev:"Surprise visit tidak terdokumentasi",j:"Risiko Operasional",tl:3.1,td:2.89,br:8.99,bR:2.83,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUM tandatangani ekspedisi"},
{i:47,s:"Mekaar",m:"Penyelesaian Kredit",ev:"Cash berbeda nominal LPUH",j:"Risiko Operasional",tl:3.3,td:3.97,br:14.1,bR:3.75,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"FAO AO mengisi LPUH"},
{i:48,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Tidak ada pemisahan tugas sistem",j:"Risiko Operasional",tl:2.74,td:3.0,br:9.98,bR:2.9,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Marketline jalur approval BWM"},
{i:49,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Kehilangan data saat interfacing",j:"Risiko Operasional",tl:2.47,td:2.52,br:6.5,bR:2.91,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Marketline interface SIMAPAN"},
{i:50,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Sistem gagal peringatan dokumen",j:"Risiko Operasional",tl:2.41,td:2.53,br:6.52,bR:2.88,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Marketline restriction/blocker"},
{i:51,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Perpindahan data otomatis tidak lengkap",j:"Risiko Operasional",tl:2.28,td:2.36,br:5.72,bR:2.67,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Marketline interface MMS"},
{i:52,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Output Sistem tidak sesuai",j:"Risiko Operasional",tl:2.7,td:2.75,br:7.72,bR:3.07,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Marketline validasi field"},
{i:53,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Input bunga kurang standar",j:"Risiko Operasional",tl:1.98,td:2.55,br:5.31,bR:2.33,tr:"Moderate",tR:"Low",ef:"Cukup Efektif",ct:"Marketline validasi bunga"},
{i:54,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Angsuran tidak sesuai jenis/periode",j:"Risiko Operasional",tl:2.86,td:3.18,br:10.42,bR:3.04,tr:"High",tR:"High",ef:"Efektif",ct:"MMS hitung angsuran"},
{i:55,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Dokumen pasca akad upload tidak lengkap",j:"Risiko Operasional",tl:2.36,td:2.53,br:6.07,bR:2.6,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"MO approval upload"},
{i:56,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Serah-terima agunan tidak terdokumentasi",j:"Risiko Operasional",tl:2.22,td:2.52,br:6.03,bR:2.02,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Staf Admin catat BAST"},
{i:57,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Approval gagal kirim ke pejabat",j:"Risiko Operasional",tl:2.76,td:3.19,br:9.59,bR:2.93,tr:"Moderate",tR:"High",ef:"Efektif",ct:"PCS approval berjenjang"},
{i:58,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Dokumen agunan upload tidak sesuai",j:"Risiko Operasional",tl:2.14,td:2.48,br:5.59,bR:2.07,tr:"Moderate",tR:"Moderate",ef:"Efektif",ct:"Pejabat reviu upload"},
{i:59,s:"ULaMM",m:"Inisiasi Kredit ULaMM",ev:"Dokumen agunan hilang/dicuri",j:"Risiko Operasional",tl:2.33,td:2.57,br:6.31,bR:2.16,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Staf Admin brankas"},
{i:60,s:"ULaMM",m:"Pencairan Kredit ULaMM",ev:"Info nasabah/struktur tidak sesuai",j:"Risiko Operasional",tl:2.33,td:2.66,br:6.21,bR:2.24,tr:"Moderate",tR:"Moderate",ef:"Efektif",ct:"MO kesesuaian dana"},
{i:61,s:"ULaMM",m:"Pencairan Kredit ULaMM",ev:"PDPC tidak sesuai DRP Pooling",j:"Risiko Operasional",tl:2.21,td:2.45,br:5.6,bR:2.45,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat penarikan PDPC"},
{i:62,s:"ULaMM",m:"Pencairan Kredit ULaMM",ev:"Nominal pencairan tidak sesuai",j:"Risiko Operasional",tl:2.07,td:2.38,br:5.14,bR:2.5,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"MO kesesuaian Treasury"},
{i:63,s:"ULaMM",m:"Pembayaran Kredit ULaMM",ev:"Pencatatan angsuran tidak akurat",j:"Risiko Operasional",tl:2.86,td:3.43,br:10.86,bR:2.91,tr:"High",tR:"Moderate",ef:"Efektif",ct:"AOM cek dana berkala"},
{i:64,s:"ULaMM",m:"Pembayaran Kredit ULaMM",ev:"Penyesuaian NPL tidak sesuai (PC)",j:"Risiko Operasional",tl:3.22,td:3.41,br:12.53,bR:3.38,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Pemimpin Cabang reviu"},
{i:65,s:"ULaMM",m:"Pembayaran Kredit ULaMM",ev:"Penyesuaian NPL tidak sesuai (MO)",j:"Risiko Operasional",tl:2.86,td:3.31,br:11.02,bR:3.05,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"MO reviu approval"},
{i:66,s:"ULaMM",m:"Pembayaran Kredit ULaMM",ev:"Pencatatan angsuran tidak akurat (pelunasan)",j:"Risiko Operasional",tl:2.98,td:3.38,br:11.24,bR:3.1,tr:"High",tR:"High",ef:"Efektif",ct:"AOM cek tiap jam"},
{i:67,s:"ULaMM",m:"Pembayaran Kredit ULaMM",ev:"Input nominal/rekening tidak akurat",j:"Risiko Operasional",tl:2.71,td:3.16,br:9.16,bR:2.98,tr:"Moderate",tR:"High",ef:"Efektif",ct:"Pejabat reviu input"},
{i:68,s:"ULaMM",m:"Monitoring Kredit ULaMM",ev:"Laporan monitoring tidak akurat",j:"Risiko Operasional",tl:2.67,td:2.67,br:7.45,bR:2.59,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"MBU monitoring"},
{i:69,s:"ULaMM",m:"Monitoring Kredit ULaMM",ev:"Pencatatan angsuran tidak akurat (mon)",j:"Risiko Operasional",tl:2.78,td:3.21,br:10.26,bR:2.93,tr:"Moderate",tR:"Low to Moderate",ef:"Efektif",ct:"AOM cek tiap jam"},
{i:70,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Perpindahan dokumen tidak terdeteksi",j:"Risiko Operasional",tl:2.72,td:3.16,br:9.47,bR:2.95,tr:"High",tR:"Low",ef:"Efektif",ct:"KUU tandatangani dokumen"},
{i:71,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Pelepasan agunan tanpa autorisasi",j:"Risiko Operasional",tl:2.02,td:2.52,br:5.6,bR:2.38,tr:"Moderate to High",tR:"Low",ef:"Cukup Efektif",ct:"Pejabat reviu pelunasan"},
{i:72,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Dokumen ke pihak tidak berwenang",j:"Risiko Operasional",tl:2.64,td:3.34,br:10.07,bR:2.98,tr:"High",tR:"Low",ef:"Sangat Tidak Efektif",ct:"MO verifikasi identitas"},
{i:73,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Perpindahan dokumen tidak terdeteksi (retur)",j:"Risiko Operasional",tl:2.02,td:2.55,br:5.59,bR:2.07,tr:"Moderate",tR:"Moderate",ef:"Efektif",ct:"MO tandatangani penyerahan"},
{i:74,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Approval gagal kirim (agunan)",j:"Risiko Operasional",tl:2.85,td:3.32,br:10.93,bR:2.93,tr:"High",tR:"High",ef:"Efektif",ct:"PCS approval berjenjang"},
{i:75,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Dokumen upload tidak lengkap (retur)",j:"Risiko Operasional",tl:2.33,td:2.6,br:6.4,bR:2.78,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat reviu dokumen"},
{i:76,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Penyimpanan dokumen tidak diketahui",j:"Risiko Operasional",tl:2.26,td:2.72,br:6.45,bR:2.69,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Staf Admin rekonsiliasi"},
{i:77,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Penyimpanan dokumen tidak diketahui (mon)",j:"Risiko Operasional",tl:2.17,td:2.71,br:6.38,bR:2.22,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Monitoring 3 bulan"},
{i:78,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Dokumen asli rusak/hilang",j:"Risiko Operasional",tl:2.02,td:2.57,br:5.31,bR:2.31,tr:"Moderate to High",tR:"Low",ef:"Cukup Efektif",ct:"Pemimpin Cabang approval SO"},
{i:79,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Agunan perbedaan nilai (SO)",j:"Risiko Operasional",tl:2.43,td:2.66,br:6.78,bR:2.84,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"MO assessment dokumen"},
{i:80,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Nilai tidak sama dengan pinjaman",j:"Risiko Operasional",tl:2.29,td:2.79,br:6.78,bR:2.36,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"AOM survei bersama KUU"},
{i:81,s:"ULaMM",m:"Pengelolaan Agunan ULaMM",ev:"Penilaian agunan tidak tepat",j:"Risiko Operasional",tl:2.31,td:2.83,br:7.09,bR:2.64,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat approval LPA"},
{i:82,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Dokumen restrukturisasi tidak lengkap",j:"Risiko Operasional",tl:2.47,td:2.73,br:6.88,bR:2.44,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"CRA reviu dokumen"},
{i:83,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Perpindahan data tidak lengkap (3R)",j:"Risiko Operasional",tl:2.36,td:2.72,br:6.71,bR:2.88,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Marketline interface MMS"},
{i:84,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Restrukturisasi nasabah tidak tepat",j:"Risiko Operasional",tl:2.38,td:2.69,br:6.76,bR:2.33,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Pemimpin Cabang approval"},
{i:85,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Kolektibilitas tidak akurat (3R)",j:"Risiko Operasional",tl:2.38,td:2.81,br:7.02,bR:2.34,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUU reviu SLIK/INI"},
{i:86,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Kemampuan melunasi tidak dinilai tepat",j:"Risiko Operasional",tl:2.5,td:2.6,br:6.86,bR:2.9,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"AOM survei verifikasi"},
{i:87,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Tidak ada pemisahan tugas (3R)",j:"Risiko Operasional",tl:2.93,td:3.26,br:10.97,bR:3.07,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Marketline jalur approval"},
{i:88,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Kehilangan data interfacing (3R)",j:"Risiko Operasional",tl:2.48,td:2.69,br:6.97,bR:2.93,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Marketline interface realtime"},
{i:89,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Agunan perbedaan nilai (lelang OPS)",j:"Risiko Operasional",tl:2.54,td:2.75,br:7.36,bR:3.0,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"AOM retaksasi"},
{i:90,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Data pengajuan lelang tidak lengkap",j:"Risiko Operasional",tl:2.28,td:2.57,br:6.17,bR:2.66,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat verifikasi memo"},
{i:91,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Hasil lelang tidak valid",j:"Risiko Operasional",tl:2.21,td:2.57,br:5.86,bR:2.09,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"Pemimpin Cabang tanda tangan"},
{i:92,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Pencatatan hasil lelang tidak tepat",j:"Risiko Operasional",tl:2.19,td:2.48,br:5.91,bR:2.57,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"MO posting jurnal"},
{i:93,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Approval gagal kirim (lelang)",j:"Risiko Operasional",tl:3.05,td:3.34,br:11.72,bR:3.02,tr:"Moderate",tR:"High",ef:"Efektif",ct:"PCS approval berjenjang"},
{i:94,s:"ULaMM",m:"Penyelesaian Kredit ULaMM",ev:"Dokumen upload tidak lengkap (lelang)",j:"Risiko Operasional",tl:2.43,td:2.66,br:6.6,bR:2.84,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"Pejabat reviu dokumen"},
{i:95,s:"ULaMM",m:"Asuransi ULaMM",ev:"Pembayaran premi tanpa autorisasi",j:"Risiko Operasional",tl:2.9,td:3.4,br:11.45,bR:3.12,tr:"High",tR:"High",ef:"Sangat Tidak Efektif",ct:"Pejabat reviu Nota Premi"},
{i:96,s:"ULaMM",m:"Asuransi ULaMM",ev:"Jurnal pembayaran premi tidak sesuai",j:"Risiko Operasional",tl:2.22,td:2.53,br:6.03,bR:2.67,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"MO reviu jurnal"},
{i:97,s:"ULaMM",m:"Asuransi ULaMM",ev:"Jurnal penerimaan klaim tidak sesuai",j:"Risiko Operasional",tl:2.33,td:2.6,br:6.43,bR:2.81,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"KUU reviu jurnal klaim"},
{i:98,s:"ULaMM",m:"Asuransi ULaMM",ev:"Pembayaran subrogasi belum bayar",j:"Risiko Operasional",tl:2.47,td:2.66,br:6.98,bR:3.0,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"AOM penagihan nasabah"},
{i:99,s:"ULaMM",m:"Asuransi ULaMM",ev:"Jurnal penerimaan tidak sesuai",j:"Risiko Operasional",tl:2.28,td:2.53,br:6.24,bR:2.16,tr:"Moderate to High",tR:"Moderate",ef:"Efektif",ct:"KUU reviu penerimaan"},
{i:100,s:"ULaMM",m:"Asuransi ULaMM",ev:"Jurnal pembayaran subrogasi tidak sesuai",j:"Risiko Operasional",tl:2.22,td:2.4,br:5.84,bR:2.66,tr:"Moderate to High",tR:"Moderate to High",ef:"Cukup Efektif",ct:"MO reviu pembayaran"},
];

const CR={"Aceh":"31412235524243452454321310010424224242324335123552223124112222152221223111135515431112424411124111121","Ambon":"31422433143441234353211150040412333131334234233211213141122334123333333141334324222313134422222334423","Balikpapan":"31311435514243324453132320020014221131524124213433322221112221211322312111222222222232222222222222223","Bandung":"45424135144325245253442320010152243244511153154354442323243332122321331212541324222233322121222221223","Bangka Belitung":"43435225434253542453332330040433544433524313133534333333323333334333333432332344343433344333333333333","Banjarmasin":"35435425544455554453233350050144434443554355353554444254351314455555355453544344343433454343454544434","Banjarnegara":"51423234342243334253222253532244534404554552353233124402222133322225340242224233332322234043412332222","Banyuwangi":"21415244533355243453321220010534433432443535233411231213111121111111121111111112111211112112112111111","Bau Bau":"21231313123132111423232350010342342221132222112322424214323314133232322243243344242413414111124142212","Bekasi":"32424445454344555453334330040544434432544525323443344342333223235434223112442113343333353433343334223","Blitar":"34433212222122134331321250050431222143243323333314433354332323235424224343442344342323354212334523332","Bogor":"45433124114243351454333350050443433433322141214454444454353334455553355453544344343433454543454542434","Bojonegoro":"35435122134253544253233320020224433433554525353514341134153321215553352432532344342433324441244333332","Cirebon":"31421232333442424341232320020342434341443532333322113232223222322122224222222114113322341222224232222","Denpasar":"33415455542555554433332330030544434435353555353322122112321312421151322111322111223223343111142211411","Depok":"15433411322121344453333330050112414141544325333354444454333334255555355453544324343433454443454544434","Garut":"55413432322323354433133110010544434443554555353512211212111111113111311111111112111111111411111111111","Indramayu":"35433453354553354233333350050544434445354555353554444454353324455555355253544344343433454443454544434","Jakarta":"31313331312231332232121230030512442143322332133224412121111142122141331111211111123122113111112111311","Jambi":"35433431334315551352133350050532442443444353114354444434353334455555355453544344344433434443452524434","Jember":"12121255111111111431433450050511531111554115111533442134132231135543354432242214343442453432234444322","Kabanjahe":"21414322214112432343111110010112224132433232123311111111111111111111111111111111111111111111111111111","Kediri":"31433232322325334233122340050444434443554555353512113121232223355233325353334344343433454441454544434","Kendari":"31412212222121212422311110010312434411222213323211114111111111411111111111111111111111111111111111111","Lamongan":"45432224234142234453133330050224443241423535324554423224132222453555355453544323353433433443424544433","Lampung":"25435412541341222433333340050422434423521155112354434444253324345553353453544344343433434443452543334","Madiun":"35435252344353554433333350050444434223554555353554444354353334455555355453544344453433454443454544434","Magelang":"21411233342232223223111110010324333343543355444311112211111111111111111111111111111111111111111114111","Makassar":"33223421332133243433122230030144232341411414223134312242232232335144213232414222322432234212242542433","Malang":"35432414142142254453333350050424434444544515353554444454351334455555355453544342323433454443454544434","Manado":"12221115411131111131341450050411211111111515352152114244152334235534435443434344344233453444444544434","Mataram":"51412444524555554153233350050444232445524355553554444451353222434334323151224323333433444442234544433","Medan":"31433214444244324233111110010211432413113212124311112111111121131111311111114111111111114211111144411","Mojokerto":"31324334442244423233221220020323423232324232232244444344333331134334333332344343333321322232223211312","Padang":"55434443444344453453233350050424434445544413343554444452353334435555355453544342343433454443454544434","Palembang":"42425454544445544443322220010434434445534443343322223322122222212211222212222221111111111211111111122","Palopo":"31412455544341334433122120010514514141324325233511112111111111111111121151141121111111111111111112211","Palu":"35232212212222222233313350050512224121222135352154444454353334455555335453542144443433452443454544414","Pati":"11223454223142334453233230040344312411351515353311344333341222123353221111212111312333312343423333423","Pekanbaru":"35435454544555552453133350050144434445344353153554444454353124453555355453344344345433454443454544424","Pematang Siantar":"11225352443224533443243320030244434445334222324524334312232223334333224352434344333332444443443544434","Pontianak":"31415425544245534343221210010212433443533345333322223112111221113311312111111111222222412411124311112","Probolinggo":"23433354143141424133123220020211431125212525353114424223343322422222322223214322312431221423224222423","Purwokerto":"31324234444424531453111230030112433112323131123333333251131111223235121141211211115312231321153113411","Semarang":"51425454542555554453432330050442434444454333311523223321223133135434334453221314111423433342354542344","Serang":"21411234113123233423111110010421312441224124231111121111111111111112111111111111111111111111111111111","Sintang":"23435415444453433223333350050431311433343113113554444153333334455555355453542324343433454443454544434","Solo":"43434455554555554435243320030452254444522555353524444343143334235555354323444323213432243241432114432","Subang":"31434454544545554433433420050544444345554555353544443232332334444444322122222212223233432443432324434","Sukabumi":"31425454542555344431231320020544234445554554353521222121141221222222322121132113213231422322211322322","Surabaya":"32425455554355554453322320030434434444554535353322333333323222333232333433333333333333333333333333333","Tangerang":"21232423222222222222232340030232332222222231212232424244241221445321354313433214333414444433334223424","Tarakan":"31415055324045354000133350050544414005550555301014324152221221212112212111111111124122114211221244221","Tasikmalaya":"32444444444444534433453350050451434444334334343544444154333334444443453223534324443433444432234324434","Tegal":"31212412324545555433232330050411434445552353223524334433222132435323323343243234343333354443454544424","Tulungagung":"11215134111351332431211120010211332231543114112211111111111131111111111111141111111111111411111111111","Wonogiri":"21211422233142113113211220030112234132513112111112221111121111122222221111221112112222222111121312211","Yogyakarta":"35435414544545514433333350050514434441214552353554444454353334455555353453544344341433454443454544434"};

const CE={"Aceh":"45342353133534433314444450050453333334543413444114444443444444524445444444443353454544343355443555544","Ambon":"44445455544145543414555530040344444434443414444155454545544443444444444444443443444444433344444443343","Balikpapan":"45255352153545533324544440040043345535343334434154444445554445445444454555444444444444444444444444444","Bandung":"31344551533233441314444440050534334332254514414433334343424443544145445554235443444444454545444445444","Bangka Belitung":"44343343453435343334444440030434343331343154414343444444444444444444444344444433434344433444444444444","Banjarmasin":"41341333133321113314444410010333343331123112414113333413424443321122423314233433434344313434323133343","Banjarnegara":"35341312133431113334444413334433343301123314424544443304444543445443440444443444444344433034354434444","Banyuwangi":"45253412144122434314344440050122244334443233444145435253555545555545545555544554554455454555554554445","Bau Bau":"55545454554545555354444410050435445455545555555144333453444453444444344433434333434344353444443534454","Bekasi":"43243312323133121334443440030133343344343242444133333444454543443343444444434443434444433344444343344","Blitar":"43345554555545543444444420020455555534434444444443344333444444443444444444434433434444333444343344443","Bogor":"41345554554545535334444410010445445441544535454113333313424443321122423314233433434344313234323133343","Bojonegoro":"41341453543533143314444430040353344344123142414153335353524445451124425344344433434344453335543444444","Cirebon":"45345333343333343334444440050434343334444134444155554445554544444544444444455553444445445544543444544","Denpasar":"54341311133111113344444440040133343301424112414044444444444444324424434444444444444444344444444444344","Depok":"51345354553555543334444410010553353535343552454113333313424443321122423314233433434344313334323133343","Garut":"11351313133131113344544550050133343331123112414135355553555544555553435555555554455555555355554555545","Indramayu":"41341313113121113314444410010133343331123112414113333313424443321122423314233433434344313334323133343","Jakarta":"45551255553455455455555450050155345532554155414533155555555523555545445555555555544554554555555555455","Jambi":"41241345113541115434444410010144334331443132442113333343424443321122423314233433433344313334323133343","Jember":"54545311555545555314444430010155245555123552555132434553455545542343434344434443434345334334443333444","Kabanjahe":"45354443443544444434555550050544543434344414444355555555555545555555555555555555555555555555555555545","Kediri":"45341313333131113314444440010333343331123112414144443444444444331423443314233433434344313334323133343","Kendari":"55354351533535455233455550050543343355343555454354553555555555355555555555555555555555555555555545545","Lamongan":"31344443443534443334444410010443334434444133443313333313424443321122423314233433434344313334323133343","Lampung":"31341353135145333344444430010354343331135512453113333333424443331122423314233433434344343334323133343","Madiun":"41341313133121113344444410010333343331123112414113333413424443321122423314233433434344313334323133343","Magelang":"45354313133431113344555550050343343331123112113155555555555545555555555555555555555555555555555543545","Makassar":"45555345543545544344555550050533443435454454554553445545555545453544555555453555455345553555545335344","Malang":"41345353533535513314444410010343343333143152414113333313424443321122423314233433434344313334323133343","Manado":"55545553355545555544435320010353455555555352435534553443424443441343442334433332423434313333233333343","Mataram":"15354333143111113514444420020333344333143112134113333325424444343443444515443443444344333334443133344","Medan":"45343313333433443444555450050433344343443344433455555555555545555554454555453555545555553355545533345","Mojokerto":"44443333324433343444444440040343343434443434434433333333444445543343444334433433434444333434443444344","Padang":"31344344333343333334444410010343343331343344434313333313424443321122423314233433434344313334323133343","Palembang":"34343333333333333334444440050333343333143324434244443344544444454455444454444445555555555455555555544","Palopo":"44245313133545553344444440050153343535553552454354444554455445554554445515535535555555555455555554345","Palu":"41444454454444444444444410010154443544444432414513333313424443321122423314233433334344313334323133343","Pati":"53545313553535553314444430030533445355525152414114333333424443343333443444443433434344344334343333343","Pekanbaru":"41341313133121113314544410010533343331143112414113333313424443321122423314233433431344313334323133343","Pematang Siantar":"55441414334443154344224440040443343331553444443343333254444443342324544334433433434344323334343333343","Pontianak":"45352352333533343444445450050554344334243433444144444554555445554555455555555555444444354355553455544","Probolinggo":"45245313423534153544444440040455445541554142413553333544444444344444444444443444444344444344443443344","Purwokerto":"41344443333253355324444410020454444454554545544113333313424443321122544314433433431344313334323133343","Semarang":"25343313333233113324444440030333343332423334444144444245544544533334434314454553554354414335423134443","Serang":"44345413443544543334444440040445454335443544444444434444444444444444444445444444444444444445444444454","Sintang":"55343352433434453354444410010434455344544555554113333514444443331132423314233433434344313334323133343","Solo":"45344333123121113343444540040123333334135112414143333134524443341123424344433444454344434435344553344","Subang":"45344313133131113344333340030133333331123112414133333344444443344444444444444444444444344334344443333","Sukabumi":"45341313133111113344445440040333343331123112414145444545545545445444445555544554454445344444455444444","Surabaya":"44341312123321313314444340040343343333223112414144333313343444344444444344444444444444444444444444444","Tangerang":"45454343444444444444544440050444444444444434444455353433545445341545424554444553453344344344344444343","Tarakan":"45351012133031113000444420030133343001120112404053343514445445454554454555434545443444553455445433345","Tasikmalaya":"44333333333333343344434430030335343332443234444113333533444443343334434444343443333333343333343333343","Tegal":"45443353143131111344444430010355343331124414444133333333444434333343444334433433434344313334323133343","Tulungagung":"55441554555535153355444450040555445545144554554544444444444444444444444444434444444444444344444444444","Wonogiri":"45455344444534454554444440030553441534154535555554444555545545544444445555444454554444444455545454445","Yogyakarta":"41341313133131153344444410010153343335453114414113333313424443321122423314233433434344313334323133343"};

const CITIES = Object.keys(CR).sort();
const ALL_MAJOR = [...new Set(R.map(x => x.m))].sort();

function getFiltered(seg, major, cab) {
  let risks = R.slice();
  if (seg !== "Semua") risks = risks.filter(x => x.s === seg);
  if (major !== "Semua") risks = risks.filter(x => x.m === major);
  if (cab !== "Semua" && CR[cab]) {
    const cbr = CR[cab];
    const cbe = CE[cab];
    risks = risks.map(x => {
      const v = parseInt(cbr.charAt(x.i)) || 0;
      const e = parseInt(cbe.charAt(x.i)) || 0;
      if (v === 0) return null;
      return { ...x, bR: v, ef: EFN[e] || x.ef, _c: true };
    }).filter(Boolean);
  }
  return risks;
}

function RiskMapGrid({ data, title }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: CL.dk, marginBottom: 8, textAlign: "center", fontFamily: F }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2 }}>
        {[5,4,3,2,1].flatMap(l => [1,2,3,4,5].map(d => {
          const v = data[l+","+d] || 0;
          return (
            <div key={l+","+d} style={{ width: 46, height: 46, background: RMC[l-1][d-1], borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", opacity: v === 0 ? 0.12 : 1 }}>
              <span style={{ fontSize: v > 99 ? 10 : 13, fontWeight: 800, color: (l >= 4 && d >= 3) ? "#fff" : "#1e293b", fontFamily: F }}>{v || "–"}</span>
            </div>
          );
        }))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("riskmap");
  const [seg, setSeg] = useState("Semua");
  const [major, setMajor] = useState("Semua");
  const [cab, setCab] = useState("Semua");

  const majors = useMemo(() => {
    if (seg === "Semua") return ALL_MAJOR;
    return [...new Set(R.filter(x => x.s === seg).map(x => x.m))].sort();
  }, [seg]);

  const filtered = useMemo(() => getFiltered(seg, major, cab), [seg, major, cab]);
  const totalR = filtered.length;

  const stats = useMemo(() => {
    const trI = {}, trR = {}, efk = {}, inhM = {}, resM = {};
    filtered.forEach(r => {
      trI[r.tr] = (trI[r.tr] || 0) + 1;
      trR[r.tR] = (trR[r.tR] || 0) + 1;
      efk[r.ef] = (efk[r.ef] || 0) + 1;
      const li = Math.min(5, Math.max(1, Math.round(r.tl)));
      const di = Math.min(5, Math.max(1, Math.round(r.td)));
      inhM[li+","+di] = (inhM[li+","+di] || 0) + 1;
      const rl = Math.min(5, Math.max(1, Math.round(r.bR)));
      resM[rl+","+rl] = (resM[rl+","+rl] || 0) + 1;
    });
    const hiI = trI["High"] || 0;
    const hiR = trR["High"] || 0;
    const efP = (efk["Sangat Efektif"] || 0) + (efk["Efektif"] || 0);
    return { trI, trR, efk, inhM, resM, hiI, hiR, efP };
  }, [filtered]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => b.bR - a.bR), [filtered]);

  const unitData = useMemo(() => {
    const idxs = filtered.map(r => r.i);
    return CITIES.map(city => {
      const cbr = CR[city];
      const vals = idxs.map(i => parseInt(cbr.charAt(i)) || 0).filter(v => v > 0);
      const avg = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
      return { city, avg: Math.round(avg * 100) / 100, c: vals.length, hi: vals.filter(v => v >= 5).length };
    }).sort((a, b) => b.avg - a.avg);
  }, [filtered]);

  const efkArcs = useMemo(() => {
    const total = EF_ORD.reduce((s, k) => s + (stats.efk[k] || 0), 0);
    if (total === 0) return { arcs: [], total: 0 };
    let cum = -90;
    const arcs = EF_ORD.filter(k => (stats.efk[k] || 0) > 0).map(label => {
      const v = stats.efk[label];
      const a = (v / total) * 360;
      const st = cum; cum += a;
      const sR = st * Math.PI / 180, eR = cum * Math.PI / 180;
      const la = a > 180 ? 1 : 0;
      const cx = 90, cy = 90, ri = 72, ir = 44;
      const d = "M "+(cx+ri*Math.cos(sR))+" "+(cy+ri*Math.sin(sR))+" A "+ri+" "+ri+" 0 "+la+" 1 "+(cx+ri*Math.cos(eR))+" "+(cy+ri*Math.sin(eR))+" L "+(cx+ir*Math.cos(eR))+" "+(cy+ir*Math.sin(eR))+" A "+ir+" "+ir+" 0 "+la+" 0 "+(cx+ir*Math.cos(sR))+" "+(cy+ir*Math.sin(sR))+" Z";
      return { label, v, d, c: EFC[label] };
    });
    return { arcs, total };
  }, [stats.efk]);

  const label = seg + (major !== "Semua" ? " > " + major : "") + (cab !== "Semua" ? " > " + cab : "");
  const selStyle = { padding: "5px 10px", borderRadius: 6, border: "none", background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 11, fontFamily: F, fontWeight: 600, maxWidth: 260 };
  const TABS = [{id:"riskmap",l:"Risk Map"},{id:"top10",l:"Top 10 Risiko"},{id:"topunit",l:"Top 10 Unit Kerja"},{id:"efk",l:"Efektivitas Kontrol"},{id:"detail",l:"Detail Risiko"}];
  const cardSt = { background: CL.card, borderRadius: 14, padding: "20px 18px", boxShadow: "0 1px 6px rgba(0,0,0,.05)" };

  return (
    <div style={{ minHeight: "100vh", background: CL.bg, fontFamily: F }}>
      <link href={FURL} rel="stylesheet" />
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b 60%,#334155)", padding: "18px 22px 10px", color: "#fff" }}>
        <div style={{ fontSize: 8.5, textTransform: "uppercase", letterSpacing: 3, color: "#38bdf8", fontWeight: 600 }}>PNM — Manajemen Risiko Operasional</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginTop: 2 }}>Dashboard RCSA</div>
        <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 1 }}>101 Risiko Unik (37 Mekaar + 64 ULaMM) | Menampilkan: {totalR}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          <select value={seg} onChange={e => { setSeg(e.target.value); setMajor("Semua"); }} style={selStyle}>
            <option value="Semua" style={{color:"#000"}}>Semua Segment</option>
            <option value="Mekaar" style={{color:"#000"}}>Mekaar</option>
            <option value="ULaMM" style={{color:"#000"}}>ULaMM</option>
          </select>
          <select value={major} onChange={e => setMajor(e.target.value)} style={selStyle}>
            <option value="Semua" style={{color:"#000"}}>Semua Proses Bisnis</option>
            {majors.map(m => <option key={m} value={m} style={{color:"#000"}}>{m}</option>)}
          </select>
          <select value={cab} onChange={e => setCab(e.target.value)} style={{...selStyle, maxWidth: 200}}>
            <option value="Semua" style={{color:"#000"}}>Semua Cabang</option>
            {CITIES.map(c => <option key={c} value={c} style={{color:"#000"}}>{c}</option>)}
          </select>
          {(seg !== "Semua" || major !== "Semua" || cab !== "Semua") && (
            <button onClick={() => { setSeg("Semua"); setMajor("Semua"); setCab("Semua"); }} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F }}>Reset</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 2, marginTop: 10, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", border: "none", cursor: "pointer", borderRadius: "7px 7px 0 0", background: tab === t.id ? CL.bg : "transparent", color: tab === t.id ? CL.dk : "#64748b", fontWeight: tab === t.id ? 700 : 500, fontSize: 11, fontFamily: F, whiteSpace: "nowrap" }}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 18px", maxWidth: 1000, margin: "0 auto" }}>

        {tab === "riskmap" && (
          <div style={cardSt}>
            <div style={{ fontSize: 16, fontWeight: 800, color: CL.dk, fontFamily: F }}>Risk Map — Inheren vs Residual</div>
            <div style={{ fontSize: 11, color: CL.sub, marginTop: 2, marginBottom: 14, fontFamily: F }}>Pergerakan {totalR} risiko ({label})</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <RiskMapGrid data={stats.inhM} title="Inheren" />
              <div style={{ fontSize: 28, color: CL.lo, fontWeight: 800 }}>→</div>
              <RiskMapGrid data={stats.resM} title="Residual" />
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              <div style={{ background: "#fef2f2", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: CL.hi }}>Zona Merah</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: CL.hi }}>{stats.hiI} → {stats.hiR}</div>
              </div>
              <div style={{ background: "#fffbeb", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: CL.md }}>Zona Kuning</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: CL.md }}>{totalR - stats.hiI - (stats.trI["Low"]||0)} → {totalR - stats.hiR - (stats.trR["Low"]||0)}</div>
              </div>
              <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: CL.lo }}>Zona Hijau</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: CL.lo }}>{stats.trI["Low"]||0} → {stats.trR["Low"]||0}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "top10" && (
          <div style={cardSt}>
            <div style={{ fontSize: 16, fontWeight: 800, color: CL.dk, fontFamily: F }}>Top 10 Risiko Tertinggi</div>
            <div style={{ fontSize: 11, color: CL.sub, marginTop: 2, marginBottom: 14, fontFamily: F }}>{label} — {cab !== "Semua" ? "Skor "+cab : "Agregasi"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sorted.slice(0,10).map((r, idx) => (
                <div key={r.i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: idx < 3 ? "#fef2f2" : "#f8fafc", borderRadius: 9, borderLeft: "3px solid " + (idx < 3 ? CL.hi : idx < 6 ? CL.mh : CL.lm) }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: idx < 3 ? CL.hi : CL.mt, minWidth: 24, textAlign: "center" }}>{idx+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: CL.dk, lineHeight: 1.3 }}>{r.ev}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 8.5, padding: "1px 6px", borderRadius: 3, background: (JRC[r.j]||"#999")+"15", color: JRC[r.j]||"#999", fontWeight: 600 }}>{r.j.replace("Risiko ","")}</span>
                      <span style={{ fontSize: 8.5, color: CL.mt }}>{r.m}</span>
                      <span style={{ fontSize: 8.5, padding: "1px 6px", borderRadius: 3, background: r.s==="Mekaar" ? "#1d4ed815" : "#ea580c15", color: r.s==="Mekaar" ? CL.bl : CL.or, fontWeight: 600 }}>{r.s}</span>
                    </div>
                    <div style={{ fontSize: 9.5, color: CL.sub, marginTop: 3 }}>Kontrol: {r.ct}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 48 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: brCol(r.bR) }}>{r._c ? r.bR : r.bR.toFixed(1)}</div>
                    <div style={{ fontSize: 8, color: CL.mt }}>BR Res</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "topunit" && (
          <div style={cardSt}>
            <div style={{ fontSize: 16, fontWeight: 800, color: CL.dk, fontFamily: F }}>Top 10 Unit Kerja Risiko Tertinggi</div>
            <div style={{ fontSize: 11, color: CL.sub, marginTop: 2, marginBottom: 14, fontFamily: F }}>{label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {unitData.slice(0,10).map((u, i) => (
                <div key={u.city} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: i < 3 ? CL.hi : CL.mt, minWidth: 24, textAlign: "center" }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: CL.dk }}>Cabang PNM {u.city}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: brCol(u.avg) }}>{u.avg.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 9, background: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: (u.avg/5*100)+"%", background: brCol(u.avg), borderRadius: 5 }} />
                    </div>
                    <div style={{ fontSize: 9.5, color: CL.sub, marginTop: 3 }}>{u.c} risiko | High: {u.hi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "efk" && (
          <div style={cardSt}>
            <div style={{ fontSize: 16, fontWeight: 800, color: CL.dk, fontFamily: F }}>Nilai Efektivitas Kontrol</div>
            <div style={{ fontSize: 11, color: CL.sub, marginTop: 2, marginBottom: 14, fontFamily: F }}>{efkArcs.total} risiko — {label}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              <svg width={180} height={180} viewBox="0 0 180 180">
                {efkArcs.arcs.map(a => <path key={a.label} d={a.d} fill={a.c} stroke="#fff" strokeWidth={2} />)}
                <text x={90} y={86} textAnchor="middle" fontSize={22} fontWeight={800} fill={CL.dk} fontFamily={F}>{efkArcs.total > 0 ? ((stats.efP/efkArcs.total)*100).toFixed(1) : 0}%</text>
                <text x={90} y={102} textAnchor="middle" fontSize={9} fill={CL.mt} fontFamily={F}>Efektif+</text>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {efkArcs.arcs.map(a => (
                  <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: a.c, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: CL.dk }}>{a.label}</div>
                      <div style={{ fontSize: 10, color: CL.sub }}>{a.v} ({((a.v/efkArcs.total)*100).toFixed(1)}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "detail" && (
          <div style={cardSt}>
            <div style={{ fontSize: 16, fontWeight: 800, color: CL.dk, fontFamily: F }}>Detail Seluruh Risiko</div>
            <div style={{ fontSize: 11, color: CL.sub, marginTop: 2, marginBottom: 14, fontFamily: F }}>{totalR} risiko — {label}</div>
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, fontFamily: F }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>#</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>Risk Event</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>Proses</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>Seg</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>BR Inh</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>BR Res</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 10 }}>Efektivitas</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr key={r.i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "6px 4px", color: CL.mt, fontWeight: 700 }}>{i+1}</td>
                      <td style={{ padding: "6px 4px", color: CL.dk, maxWidth: 220 }}>{r.ev}</td>
                      <td style={{ padding: "6px 4px", color: CL.sub, fontSize: 9.5 }}>{r.m}</td>
                      <td style={{ padding: "6px 4px" }}>
                        <span style={{ fontSize: 8.5, padding: "1px 5px", borderRadius: 3, background: r.s==="Mekaar"?"#1d4ed815":"#ea580c15", color: r.s==="Mekaar"?CL.bl:CL.or, fontWeight: 600 }}>{r.s}</span>
                      </td>
                      <td style={{ padding: "6px 4px", fontWeight: 700, color: brCol(r.br) }}>{r.br.toFixed(1)}</td>
                      <td style={{ padding: "6px 4px", fontWeight: 800, color: brCol(r.bR) }}>{r._c ? r.bR : r.bR.toFixed(1)}</td>
                      <td style={{ padding: "6px 4px" }}>
                        <span style={{ fontSize: 8.5, padding: "1px 5px", borderRadius: 3, background: (EFC[r.ef]||"#999")+"20", color: EFC[r.ef]||"#999", fontWeight: 600 }}>{r.ef || "-"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "16px 0 6px", fontSize: 9, color: CL.mt }}>PNM RCSA Dashboard | 101 Risiko Unik | {new Date().toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"})}</div>
      </div>
    </div>
  );
}
