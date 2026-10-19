import React, { useState } from 'react';
import { FileText, Printer, Download, X, CheckCircle, Calendar, Building, Sparkles } from 'lucide-react';

export default function ReportsModal({ isOpen, onClose, beneficiaries = [], tasks = [], referrals = [] }) {
  if (!isOpen) return null;

  const [reportType, setReportType] = useState('AWW_MPR'); // AWW_MPR or ASHA_DIARY
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  // Stats
  const pregnantCount = beneficiaries.filter(b => b.type === 'PREGNANT_WOMAN').length;
  const childCount = beneficiaries.filter(b => b.type === 'CHILD' || b.type === 'INFANT').length;
  const lactatingCount = beneficiaries.filter(b => b.type === 'LACTATING_MOTHER').length;
  
  const highRiskCount = beneficiaries.filter(b => 
    (b.hb && b.hb < 7.0) || (b.systolicBp && b.systolicBp >= 140)
  ).length;

  const samCount = beneficiaries.filter(b => b.muacCm && b.muacCm < 11.5).length;
  const mamCount = beneficiaries.filter(b => b.muacCm && b.muacCm >= 11.5 && b.muacCm < 12.5).length;

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Count,Sector\n"
      + `Total Beneficiaries,${beneficiaries.length},Navghar Sector\n`
      + `Pregnant Women Registered,${pregnantCount},ASHA Ward 4\n`
      + `High Risk Pregnancies (HRP),${highRiskCount},PHC Navghar\n`
      + `Children (0-6 Years),${childCount},AWC-12\n`
      + `Severe Acute Malnutrition (SAM),${samCount},NRC Tracked\n`
      + `Moderate Acute Malnutrition (MAM),${mamCount},SNP Tracked\n`
      + `Total Referrals Made,${referrals.length},PHC Navghar\n`
      + `Completed Home Visits,${tasks.filter(t => t.status === 'Completed').length},Ward 4\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MPR_Monthly_Progress_Report_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Progress Report (MPR) Exporter</h3>
              <p className="text-xs text-slate-500">Official reporting format for WCD / ICDS & National Health Mission (NHM)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          
          {/* Format selection */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setReportType('AWW_MPR')}
              className={`p-2.5 rounded-xl border text-center font-bold transition ${
                reportType === 'AWW_MPR' ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Anganwadi Sector MPR (ICDS)
            </button>
            <button
              onClick={() => setReportType('ASHA_DIARY')}
              className={`p-2.5 rounded-xl border text-center font-bold transition ${
                reportType === 'ASHA_DIARY' ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              ASHA Diary & Monthly Return (NHM)
            </button>
          </div>

          {/* Printable Report Preview Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 print:p-0 print:border-none">
            
            <div className="text-center border-b border-slate-200 pb-3">
              <h4 className="font-bold text-sm text-slate-900 uppercase">
                {reportType === 'AWW_MPR' 
                  ? 'Integrated Child Development Services (ICDS) - Monthly Progress Report'
                  : 'National Health Mission (NHM) - ASHA Worker Monthly Performance Log'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Anganwadi Center: <strong>AWC-12 Navghar East</strong> · Sub-Center: <strong>Navghar</strong> · PHC: <strong>Navghar PHC</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Reporting Period: <strong>{selectedMonth}</strong> · Generated on: <strong>{new Date().toLocaleDateString()}</strong>
              </p>
            </div>

            {/* Metrics table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[11px] text-slate-600 font-bold uppercase">
                  <th className="py-2">Indicator / Service Parameter</th>
                  <th className="py-2 text-right">Target</th>
                  <th className="py-2 text-right">Achieved This Month</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="py-2 font-medium">1. Total Beneficiaries Registered</td>
                  <td className="py-2 text-right text-slate-500">100</td>
                  <td className="py-2 text-right font-bold text-slate-900">{beneficiaries.length}</td>
                  <td className="py-2 text-right text-emerald-600 font-semibold">Normal</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">2. Pregnant Women Under Active ANC</td>
                  <td className="py-2 text-right text-slate-500">10</td>
                  <td className="py-2 text-right font-bold text-slate-900">{pregnantCount}</td>
                  <td className="py-2 text-right text-emerald-600 font-semibold">100% Tracking</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">3. High Risk Pregnancies (HRP) Flagged</td>
                  <td className="py-2 text-right text-slate-500">-</td>
                  <td className="py-2 text-right font-bold text-rose-600">{highRiskCount}</td>
                  <td className="py-2 text-right text-rose-700 font-bold">Referred to PHC</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">4. Children Screened for Malnutrition</td>
                  <td className="py-2 text-right text-slate-500">25</td>
                  <td className="py-2 text-right font-bold text-slate-900">{childCount}</td>
                  <td className="py-2 text-right text-emerald-600 font-semibold">Completed</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">5. SAM Children (Severe Acute Malnutrition)</td>
                  <td className="py-2 text-right text-slate-500">0</td>
                  <td className="py-2 text-right font-bold text-rose-600">{samCount}</td>
                  <td className="py-2 text-right text-amber-700 font-semibold">NRC Admission</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">6. MAM Children (Moderate Acute Malnutrition)</td>
                  <td className="py-2 text-right text-slate-500">0</td>
                  <td className="py-2 text-right font-bold text-amber-600">{mamCount}</td>
                  <td className="py-2 text-right text-amber-700 font-semibold">Double THR Ration</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">7. Total PHC Referrals Dispatched</td>
                  <td className="py-2 text-right text-slate-500">-</td>
                  <td className="py-2 text-right font-bold text-slate-900">{referrals.length}</td>
                  <td className="py-2 text-right text-teal-700 font-semibold">Feedback Received</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">8. Resolved Home Visits / Encounters</td>
                  <td className="py-2 text-right text-slate-500">15</td>
                  <td className="py-2 text-right font-bold text-slate-900">{tasks.filter(t => t.status === 'Completed').length}</td>
                  <td className="py-2 text-right text-emerald-600 font-semibold">Verified</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
              <div>
                <span>Anganwadi Worker / ASHA Signature:</span>
                <div className="font-bold text-slate-800 mt-0.5">Smt. Rekha Patil / Sunita Devi</div>
              </div>
              <div className="text-right">
                <span>Medical Officer / CDPO Verification:</span>
                <div className="font-bold text-slate-800 mt-0.5">Dr. Arvind Sharma (PHC MO)</div>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official MPR</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
