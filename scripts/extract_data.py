#!/usr/bin/env python3
"""
PNM RCSA Data Extractor
=======================
Reads RCSA Excel file and generates JavaScript data files for the BPM dashboard.

Usage:
  1. Place your updated RCSA Excel file as: data/RCSA.xlsx
  2. Run: python scripts/extract_data.py
  3. JS files will be regenerated in src/data/
  4. Run: npm run build
  5. Deploy!

Requirements:
  pip install openpyxl
"""

import openpyxl
import json
import re
import os
from collections import defaultdict

# ─── CONFIG ───
EXCEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'RCSA.xlsx')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')

# Short name mappings for Major Process
MAJOR_SHORT = {
    'Pertemuan Kelompok Mingguan (Pembayaran Kredit)': 'PKM (Pembayaran Kredit)',
}

# Short name mappings for Sub Major Process
SUB_SHORT = {
    'Pembayaran Klaim Penjaminan ULaMM': 'Pembayaran Klaim',
    'Pengembalian Utang Subrogasi Penjaminan ULaMM': 'Pengembalian Subrogasi',
    'Monitoring Pasca Pencairan ULaMM': 'Monitoring Pasca Pencairan',
    'Monitoring Pembiayaan Kredit ULaMM': 'Monitoring Pembiayaan',
    'Pelunasan Dini ULaMM': 'Pelunasan Dini',
    'Pembayaran Kredit ULaMM': 'Pembayaran Kredit',
    'Pencairan Pembiayaan Mekaar': 'Pencairan Pembiayaan',
    'Pencairan Kredit ULaMM': 'Pencairan Kredit',
    'Monitoring Agunan Sampling Tiga Bulanan': 'Monitoring Agunan 3 Bulanan',
    'Pengembalian Agunan ULaMM': 'Pengembalian Agunan',
    'Pengikatan Agunan ULaMM': 'Pengikatan Agunan',
    'Penilaian Agunan Kembali/Retaksasi Agunan': 'Retaksasi Agunan',
    'Rekonsiliasi Bulanan Jaminan ULaMM': 'Rekonsiliasi Bulanan',
    '3R - Rescheduling / Penjadwalan Kembali': '3R - Rescheduling',
    'Penagihan Nasabah Bermasalah': 'Penagihan Nasabah',
    '3R - Restructuring/Penataan Kembali ULaMM': '3R - Restructuring',
    'Lelang Jaminan Pembiayaan Bermasalah ULaMM': 'Lelang Jaminan',
    'Penerimaan Pembayaran Nasabah Melalui PKM': 'Penerimaan Pembayaran PKM',
    'Penggunaan Dana UP (Uang Pertanggungjawaban)': 'Penggunaan Dana UP',
}

EFK_MAP = {
    'Sangat Efektif': 1,
    'Efektif': 2,
    'Cukup Efektif': 3,
    'Kurang Efektif': 4,
    'Sangat Tidak Efektif': 5,
}

TR_MAP = {
    'Low': 1,
    'Low to Moderate': 2,
    'Moderate': 3,
    'Moderate to High': 4,
    'High': 5,
}


def classify_cause(text):
    """Classify risk cause type: 0=System, 1=Procedure, 2=External, 3=Human"""
    t = text.lower()
    if any(w in t for w in ['sistem', 'error', 'down', 'aplikasi']):
        return 0
    if any(w in t for w in ['sop', 'prosedur', 'pedoman']):
        return 1
    if any(w in t for w in ['eksternal']):
        return 2
    return 3


def extract():
    print(f"Reading: {os.path.abspath(EXCEL_PATH)}")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True, read_only=True)
    ws = wb['Tabel Risk Control']

    records = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        vals = list(row)
        if vals[0] != 'Active':
            continue
        bagian = str(vals[6] or '')
        seg = 'M' if 'Mekaar' in bagian else 'U' if 'Mikro' in bagian else 'X'
        records.append(vals + [seg])

    print(f"  Active records: {len(records)}")

    # Build kode → index mapping
    all_kodes = sorted(set(str(r[3] or '') for r in records if 'Cabang' in str(r[5] or '')))
    kode_idx = {k: i for i, k in enumerate(all_kodes)}
    n_risks = len(all_kodes)

    # ─── Extract unique risks ───
    seen = set()
    risks = []
    for r in records:
        sg = r[-1]
        kode = str(r[3] or '')
        key = f"{sg}|{kode}"
        if key in seen or sg == 'X':
            continue
        seen.add(key)

        ci = kode_idx.get(kode, -1)

        # Parse penyebab
        praw = str(r[17] or '')
        plist = [re.sub(r'^\d+\s*', '', l).strip() for l in praw.split('\n') if l.strip() and l.strip() != '-'][:2]
        if not plist:
            plist = ['Kelalaian proses']

        cause_types = [classify_cause(p) for p in plist]

        try: tl = int(r[27])
        except: tl = 3
        try: td = int(r[29])
        except: td = 3
        try: brR = int(r[51])
        except: brR = 3
        try: nek = round(float(r[48]), 1)
        except: nek = 3.0

        jenis = str(r[16] or '')
        jc = 0 if 'Operasional' in jenis else 1 if 'Kredit' in jenis else 2 if 'Hukum' in jenis else 3

        ef = EFK_MAP.get(str(r[50] or ''), 3)
        tr = TR_MAP.get(str(r[32] or ''), 3)
        tR = TR_MAP.get(str(r[52] or ''), 3)

        major = MAJOR_SHORT.get(str(r[12] or ''), str(r[12] or ''))
        sub = SUB_SHORT.get(str(r[13] or ''), str(r[13] or ''))

        risks.append({
            'ci': ci,
            'sg': sg,
            'mj': major,
            'sm': sub,
            'ev': str(r[14] or ''),
            'jc': jc,
            'tl': tl, 'td': td, 'tr': tr,
            'ct': str(r[33] or ''),
            'ef': ef, 'nk': nek,
            'bR': brR, 'tR': tR,
            'ps': plist,
            'pt': cause_types,
        })

    print(f"  Unique risks: {len(risks)}")

    # ─── Extract per-cabang data ───
    cabang_br = defaultdict(lambda: [0] * n_risks)
    for r in records:
        div = str(r[5] or '')
        if 'Cabang' not in div:
            continue
        city = div.replace('Cabang PNM ', '')
        kode = str(r[3] or '')
        idx = kode_idx.get(kode)
        if idx is None:
            continue
        try:
            cabang_br[city][idx] = int(r[51])
        except:
            pass

    cities = sorted(cabang_br.keys())
    cr = {c: ''.join(str(v) for v in cabang_br[c]) for c in cities}
    print(f"  Cities: {len(cities)}")

    wb.close()

    # ─── Write JS files ───
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # risks.js - array format for compact size
    risk_arrays = []
    for r in risks:
        risk_arrays.append([
            r['ci'], r['sg'], r['mj'], r['sm'], r['ev'],
            r['jc'], r['tl'], r['td'], r['tr'], r['ct'],
            r['ef'], r['nk'], r['bR'], r['tR'],
            r['ps'], r['pt'],
        ])

    risks_js = (
        '// Auto-generated by extract_data.py — do not edit manually\n'
        '// Format: [ci,seg,major,sub,event,jenis,tl,td,tr,kontrol,efk,nek,brR,trR,[penyebab],[cause_types]]\n'
        'const D = ' + json.dumps(risk_arrays, ensure_ascii=False, indent=1) + ';\n\n'
        'export default D;\n'
    )
    with open(os.path.join(OUTPUT_DIR, 'risks.js'), 'w', encoding='utf-8') as f:
        f.write(risks_js)

    # cabang.js
    cabang_js = (
        '// Auto-generated by extract_data.py — do not edit manually\n'
        '// Per-cabang BR residual (string encoded: position = risk index, char = BR 0-5)\n'
        'export const CR = ' + json.dumps(cr, ensure_ascii=False, indent=2) + ';\n\n'
        'export const CITIES = ' + json.dumps(cities, ensure_ascii=False) + ';\n'
    )
    with open(os.path.join(OUTPUT_DIR, 'cabang.js'), 'w', encoding='utf-8') as f:
        f.write(cabang_js)

    print(f"\n✅ Generated:")
    print(f"   {OUTPUT_DIR}/risks.js ({len(risks)} risks)")
    print(f"   {OUTPUT_DIR}/cabang.js ({len(cities)} cities)")
    print(f"\nRun 'npm run build' to rebuild the dashboard.")


if __name__ == '__main__':
    extract()
