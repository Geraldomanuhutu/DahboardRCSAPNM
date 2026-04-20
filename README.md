# PNM BPM RCSA Dashboard

Dashboard interaktif **Business Process Mapping (BPM)** untuk Risk & Control Self Assessment PT Permodalan Nasional Madani.

## Cara Update Data

### 1. Update Excel
Taruh file Excel RCSA terbaru di `data/RCSA.xlsx`

File Excel harus punya sheet **"Tabel Risk Control"** dengan kolom sesuai format standar Opera/ICoFR.

### 2. Jalankan Extractor
```bash
pip install openpyxl
python3 scripts/extract_data.py
```

### 3. Build & Deploy
```bash
npm install
npm run build
# Push ke GitHub → auto deploy di Vercel
```

## Struktur Project

```
bpm-project/
├── data/
│   ├── RCSA.xlsx                ← Taruh Excel RCSA disini
│   └── Kertas_Kerja_RCSA.xlsx   ← Template kertas kerja
├── scripts/
│   └── extract_data.py          ← Extractor Excel → JS
├── src/
│   ├── data/
│   │   ├── risks.js             ← Auto-generated
│   │   └── cabang.js            ← Auto-generated (58 cabang)
│   ├── App.jsx                  ← BPM Dashboard
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Features
- **9-Panel BPM View** sesuai format PNM
- **Filter Segment**: Mekaar / ULaMM
- **Filter Cabang**: 58 cabang PNM seluruh Indonesia
- **Filter Periode**: Semester 1/2 per tahun
- **101 risiko unik** (37 Mekaar + 64 ULaMM)
- **Interactive navigation**: Major → Sub Major → Activity → Risk Event

## Periode Data
- **Semester 2 — 2025**: Data saat ini

---
*PNM — Direktorat Kepatuhan & Manajemen Risiko*
