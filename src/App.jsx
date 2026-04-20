import { useState, useMemo } from 'react';
import D from './data/risks';
import { CR, CITIES } from './data/cabang';

const F = "'Source Sans 3', system-ui, sans-serif";
const RED = '#9B1B30', DK = '#6B0F1A', TL = '#0D7377';

const MC = [
  ['#0d6832','#0d6832','#0d6832','#4ca768','#4ca768'],
  ['#0d6832','#0d6832','#4ca768','#a8d5a2','#a8d5a2'],
  ['#0d6832','#4ca768','#a8d5a2','#a8d5a2','#f0e68c'],
  ['#f0e0a0','#f0d060','#eaaa30','#eaaa30','#c62828'],
  ['#f0e0a0','#eaaa30','#c62828','#c62828','#8b0000'],
];

const TRL = ['','Low','Low to Moderate','Moderate','Moderate to High','High'];
const TRC = ['','#0d6832','#4ca768','#d4a843','#e07020','#c62828'];
const EFL = ['','Sangat Efektif','Efektif','Cukup Efektif','Kurang Efektif','Sangat Tidak Efektif'];
const EFC = ['','#0d6832','#2e8b57','#d4a843','#e07020','#c62828'];
const JN = ['Risiko Operasional','Risiko Kredit','Risiko Hukum','Risiko Kepatuhan'];
const CTL = ['[System]','[Procedure]','[External Event]','[Human]'];
const RTL_DESC = [
  'Monitoring dan peningkatan kapasitas sistem',
  'Revisi dan sosialisasi SOP secara berkala',
  'Optimalisasi pengelolaan risiko eksternal',
  'Refreshment dan peningkatan awareness karyawan',
];
const RTL_JENIS = [
  'Peningkatan kecukupan desain kontrol',
  'Peningkatan efektivitas pelaksanaan kontrol',
  'Perbaikan melalui breakthrough project',
  'Peningkatan efektivitas pelaksanaan kontrol',
];

// ─── Sub-components ───

function Num({ n }) {
  return (
    <div style={{ width: 22, height: 22, borderRadius: 11, background: RED, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {n}
    </div>
  );
}

function RiskMap({ ry, rx, title, yLabels, xLabels, xTitle }) {
  const cells = [];
  for (let y = 5; y >= 1; y--) {
    for (let x = 1; x <= 5; x++) {
      const hit = y === ry && x === rx;
      cells.push(
        <div key={y + ',' + x} style={{
          width: 32, height: 32, background: MC[y - 1][x - 1], borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: hit ? '2.5px solid #1e293b' : 'none', boxSizing: 'border-box',
        }}>
          {hit && (
            <div style={{
              width: 17, height: 17, borderRadius: 9, background: '#1e293b',
              color: '#fff', fontSize: 9, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>R</div>
          )}
        </div>
      );
    }
  }

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', marginBottom: 6, color: '#1e293b' }}>{title}</div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 1, marginRight: 3 }}>
          {yLabels.map((l, i) => (
            <div key={i} style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2 }}>
              <span style={{ fontSize: 7.5, color: '#64748b', textAlign: 'right', lineHeight: 1.1 }}>{l}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>{cells}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, marginTop: 2 }}>
            {xLabels.map((l, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 7, color: '#64748b', lineHeight: 1.1 }}>{l}</div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#64748b', marginTop: 3 }}>{xTitle}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { l: 'High', c: '#c62828' }, { l: 'Mod-High', c: '#eaaa30' }, { l: 'Moderate', c: '#a8d5a2' },
          { l: 'Low-Mod', c: '#4ca768' }, { l: 'Low', c: '#0d6832' },
        ].map((x) => (
          <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 6.5, color: '#475569' }}>
            <div style={{ width: 7, height: 7, borderRadius: 1, background: x.c }} />{x.l}
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Main App ───

export default function App() {
  const [seg, setSeg] = useState('M');
  const [mi, setMi] = useState(0);
  const [si, setSi] = useState(0);
  const [ri, setRi] = useState(0);
  const [cab, setCab] = useState('Selindo');
  const [periode, setPeriode] = useState('S2-2025');

  // Derive navigation
  const majors = useMemo(() => {
    const s = new Set();
    D.forEach((r) => { if (r[1] === seg) s.add(r[2]); });
    return [...s];
  }, [seg]);

  const major = majors[mi] !== undefined ? majors[mi] : majors[0];

  const subs = useMemo(() => {
    const s = new Set();
    D.forEach((r) => { if (r[1] === seg && r[2] === major) s.add(r[3]); });
    return [...s];
  }, [seg, major]);

  const sub = subs[si] !== undefined ? subs[si] : subs[0];

  const risks = useMemo(() => {
    return D.filter((r) => r[1] === seg && r[2] === major && r[3] === sub);
  }, [seg, major, sub]);

  const r = risks[ri] || risks[0];

  if (!r) return <div style={{ padding: 40, fontFamily: F }}>No data</div>;

  // Values
  const ci = r[0];
  const tl = r[6], td = r[7], trN = r[8];
  const efN = r[10], nek = r[11];
  let brR = r[12], trRN = r[13];

  // Cabang override
  if (cab !== 'Selindo' && CR[cab] && ci >= 0) {
    const v = parseInt(CR[cab].charAt(ci)) || 0;
    if (v > 0) {
      brR = v;
      trRN = brR >= 5 ? 5 : brR >= 4 ? 4 : brR >= 3 ? 3 : brR >= 2 ? 2 : 1;
    }
  }

  // NEK bucket for residual
  const nekB = nek <= 1.5 ? 1 : nek <= 2.5 ? 2 : nek <= 3.5 ? 3 : nek <= 4.5 ? 4 : 5;

  const segLabel = seg === 'M' ? 'Pembiayaan Mekaar' : 'Pembiayaan ULaMM';
  const periodeLabel = periode === 'S2-2025' ? 'Semester 2 — 2025' : periode.replace('S1-', 'Semester 1 — ').replace('S2-', 'Semester 2 — ');

  const selStyle = {
    padding: '4px 8px', borderRadius: 5, border: 'none',
    background: 'rgba(255,255,255,.2)', color: '#fff',
    fontSize: 10, fontFamily: F, fontWeight: 600, cursor: 'pointer',
  };

  // Penyebab data
  const penyebab = r[14] || [];
  const causeTypes = r[15] || [];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: F }}>

      {/* ─── HEADER ─── */}
      <div style={{ background: `linear-gradient(135deg, ${DK}, ${RED})`, padding: '14px 20px 10px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              BPM – {segLabel} : {r[3]}
            </div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>
              Penilaian Risiko berdasarkan proses bisnis dan pengendaliannya....
            </div>
            <div style={{ fontSize: 9, opacity: 0.7, marginTop: 1 }}>Periode: {periodeLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={periode} onChange={(e) => setPeriode(e.target.value)} style={selStyle}>
              <option value="S2-2025" style={{ color: '#000' }}>Semester 2 — 2025</option>
              <option value="S1-2025" style={{ color: '#000' }}>Semester 1 — 2025</option>
              <option value="S2-2026" style={{ color: '#000' }}>Semester 2 — 2026</option>
              <option value="S1-2026" style={{ color: '#000' }}>Semester 1 — 2026</option>
            </select>
            <select value={cab} onChange={(e) => setCab(e.target.value)} style={selStyle}>
              <option value="Selindo" style={{ color: '#000' }}>Seluruh Indonesia</option>
              {CITIES.map((c) => <option key={c} value={c} style={{ color: '#000' }}>{c}</option>)}
            </select>
            <button
              onClick={() => { setSeg('M'); setMi(0); setSi(0); setRi(0); }}
              style={{
                padding: '5px 14px', borderRadius: 6, border: 'none',
                background: seg === 'M' ? '#fff' : 'rgba(255,255,255,.2)',
                color: seg === 'M' ? RED : '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: F,
              }}
            >Mekaar</button>
            <button
              onClick={() => { setSeg('U'); setMi(0); setSi(0); setRi(0); }}
              style={{
                padding: '5px 14px', borderRadius: 6, border: 'none',
                background: seg === 'U' ? '#fff' : 'rgba(255,255,255,.2)',
                color: seg === 'U' ? RED : '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: F,
              }}
            >ULaMM</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', maxWidth: 1100, margin: '0 auto' }}>

        {/* 1. MEGA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Num n={1} /><span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Mega Process</span>
        </div>
        <div style={{ background: '#fce4ec', borderRadius: 6, padding: '7px 16px', textAlign: 'center', fontWeight: 700, fontSize: 13, color: RED, marginBottom: 10 }}>
          Pembiayaan
        </div>

        {/* 2. MAJOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Num n={2} /><span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Major Process</span>
        </div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
          {majors.map((m, i) => (
            <button key={m} onClick={() => { setMi(i); setSi(0); setRi(0); }} style={{
              flex: '1 1 0', padding: '7px 6px', borderRadius: 6, minWidth: 90, textAlign: 'center',
              border: mi === i ? '2px solid ' + RED : '2px solid #e2e8f0',
              background: mi === i ? RED : '#fff',
              color: mi === i ? '#fff' : '#334155',
              fontWeight: 700, fontSize: 10, cursor: 'pointer', fontFamily: F,
            }}>{m}</button>
          ))}
        </div>

        {/* 3. SUB MAJOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Num n={3} /><span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Sub Major Process</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {subs.map((s, i) => (
            <button key={s} onClick={() => { setSi(i); setRi(0); }} style={{
              padding: '6px 12px', borderRadius: 6, border: 'none',
              background: si === i ? TL : '#e2e8f0',
              color: si === i ? '#fff' : '#334155',
              fontWeight: 600, fontSize: 9.5, cursor: 'pointer', fontFamily: F, whiteSpace: 'nowrap', flexShrink: 0,
            }}>{s}</button>
          ))}
        </div>

        {/* 4 + 5: Activity & Risk Identification */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {/* 4. Activity */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Num n={4} /><span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Activity</span>
            </div>
            <div style={{ background: '#e8edf3', borderRadius: 8, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📋</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{r[3]}</div>
              <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{risks.length} risk event(s)</div>
            </div>
          </div>

          {/* 5. Risk Identification */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Num n={5} /><span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Risk Identification</span>
            </div>
            <div style={{ background: RED, color: '#fff', borderRadius: 5, padding: '5px 8px', fontSize: 9.5, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>Risk Event</div>
            <select
              value={ri}
              onChange={(e) => setRi(Number(e.target.value))}
              style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1.5px solid #e2e8f0', fontSize: 10, fontFamily: F, fontWeight: 600, color: '#1e293b', marginBottom: 8, background: '#fff' }}
            >
              {risks.map((rr, i) => <option key={i} value={i}>{rr[4]}</option>)}
            </select>
            <div style={{ background: '#1d4ed8', color: '#fff', borderRadius: 5, padding: '4px 8px', fontSize: 9, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>Risk Category</div>
            <div style={{ fontSize: 10.5, color: '#334155', fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>{JN[r[5]]}</div>
            <div style={{ background: '#059669', color: '#fff', borderRadius: 5, padding: '4px 8px', fontSize: 9, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>Risk Impact</div>
            <div style={{ fontSize: 10, color: '#475569', paddingLeft: 8 }}>
              {r[5] === 1 && <div>• Financial</div>}
              {r[5] === 0 && <div>• Operational</div>}
              {r[5] === 2 && <div>• Legal</div>}
              {r[5] === 3 && <div>• Compliance</div>}
              {(tl >= 4 || td >= 4) && <div>• Reputation</div>}
            </div>
          </div>
        </div>

        {/* 6 + 7 + 8: Risk Maps & Control */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          {/* 6. Inherent */}
          <div style={{ background: '#fff', borderRadius: 10, padding: '12px 8px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Num n={6} /><span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Inherent Risk Matrix</span>
            </div>
            <RiskMap
              ry={tl} rx={td}
              title="Inherent Risk Score"
              yLabels={['SJ 1','J 2','B 3','SM 4','HP 5']}
              xLabels={['Sangat Rendah 1','Rendah 2','Moderat 3','Tinggi 4','Sangat Tinggi 5']}
              xTitle="Impact"
            />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 4, background: TRC[trN], color: '#fff' }}>
                {TRL[trN]} (L{tl}×D{td}={tl * td})
              </span>
            </div>
          </div>

          {/* 7. Control */}
          <div style={{ background: '#fff', borderRadius: 10, padding: '12px 8px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Num n={7} /><span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Control Matrix</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginTop: 4 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '6px 4px', textAlign: 'left', fontWeight: 700 }}>Control</th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', fontWeight: 700, width: 65 }}>Efektivitas Kontrol</th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', fontWeight: 700, width: 30 }}>NEK</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 4px', color: '#334155', lineHeight: 1.4, fontSize: 9 }}>{r[9]}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                    <span style={{ fontSize: 7.5, padding: '2px 4px', borderRadius: 3, background: EFC[efN] + '20', color: EFC[efN], fontWeight: 700 }}>
                      {EFL[efN]}<br/>({efN})
                    </span>
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 800, fontSize: 13, color: EFC[efN] }}>{nek}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 3, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { l: 'Tidak Efektif', c: '#c62828' }, { l: 'Kurang Efektif', c: '#e07020' },
                { l: 'Cukup Efektif', c: '#d4a843' }, { l: 'Efektif', c: '#2e8b57' },
                { l: 'Sangat Efektif', c: '#0d6832' },
              ].map((x) => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 6.5, color: '#475569' }}>
                  <div style={{ width: 7, height: 7, borderRadius: 1, background: x.c }} />{x.l}
                </div>
              ))}
            </div>
          </div>

          {/* 8. Residual */}
          <div style={{ background: '#fff', borderRadius: 10, padding: '12px 8px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Num n={8} /><span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Residual Risk Score</span>
            </div>
            <RiskMap
              ry={trN} rx={nekB}
              title="Residual Risk Score"
              yLabels={['Low 1','L-M 2','Mod 3','M-H 4','High 5']}
              xLabels={['Sangat Efektif 1','Efektif 2','Cukup Efektif 3','Kurang Efektif 4','Tidak Efektif 5']}
              xTitle="Nilai Efektivitas Kontrol"
            />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 4, background: TRC[trRN], color: '#fff' }}>
                {TRL[trRN]} (BR={brR})
              </span>
            </div>
          </div>
        </div>

        {/* 9. ACTION PLAN */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Num n={9} /><span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Action Plan</span>
          </div>
          <div style={{ background: RED, color: '#fff', borderRadius: 6, padding: '6px 14px', fontSize: 11, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
            Rencana Tindak Lanjut
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '7px 6px', textAlign: 'left', fontWeight: 700 }}>Risk Cause</th>
                <th style={{ padding: '7px 6px', textAlign: 'center', fontWeight: 700, width: 90 }}>Risk Cause Type</th>
                <th style={{ padding: '7px 6px', textAlign: 'center', fontWeight: 700, width: 80 }}>Risk Taking Unit</th>
                <th style={{ padding: '7px 6px', textAlign: 'left', fontWeight: 700 }}>Rencana Tindak Lanjut</th>
                <th style={{ padding: '7px 6px', textAlign: 'left', fontWeight: 700 }}>Jenis Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(penyebab) ? penyebab : [penyebab]).map((p, i) => {
                const t = Array.isArray(causeTypes) ? (causeTypes[i] || 3) : causeTypes;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '7px 6px', color: '#334155' }}>{p}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontWeight: 600, color: '#1d4ed8' }}>{CTL[t]}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', color: '#475569' }}>{seg === 'M' ? 'Unit Mekaar' : 'Unit ULaMM'}</td>
                    <td style={{ padding: '7px 6px', color: '#334155' }}>{RTL_DESC[t]}</td>
                    <td style={{ padding: '7px 6px', color: '#475569', fontSize: 9 }}>{RTL_JENIS[t]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cabang indicator */}
        {cab !== 'Selindo' && (
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: '#475569', background: '#e8f5e9', padding: '5px 12px', borderRadius: 6, fontWeight: 600 }}>
              Cabang PNM {cab} — BR Residual = <b style={{ color: TRC[trRN] }}>{brR}</b> ({TRL[trRN]})
            </span>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '14px 0 6px', fontSize: 8, color: '#94a3b8' }}>
          ©2025 PT Permodalan Nasional Madani — Direktorat Kepatuhan & Manajemen Risiko
        </div>
      </div>
    </div>
  );
}
