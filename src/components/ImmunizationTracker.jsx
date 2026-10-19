import React, { useState } from 'react';
import { 
  Syringe, 
  Baby, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Printer, 
  Share2, 
  MessageSquare, 
  Plus, 
  Check, 
  Search,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VACCINE_SCHEDULE } from '../data/vaccineSchedule';
import { evaluateImmunizationStatus } from '../data/decisionEngine';

export default function ImmunizationTracker({ 
  beneficiaries = [], 
  onUpdateBeneficiaryVaccines,
  selectedBeneficiary,
  setActiveTab,
  onOpenWhatsApp
}) {
  const children = beneficiaries.filter(b => b.type === 'CHILD' || b.type === 'INFANT');
  const [activeChild, setActiveChild] = useState(
    selectedBeneficiary?.type === 'CHILD' || selectedBeneficiary?.type === 'INFANT' 
      ? selectedBeneficiary 
      : children[0] || null
  );

  const [administeredList, setAdministeredList] = useState(activeChild?.vaccinesGiven || []);
  const [showMcpCard, setShowMcpCard] = useState(false);

  // Evaluate status
  const immuStatus = evaluateImmunizationStatus(activeChild?.dob, administeredList);

  const handleSelectChild = (child) => {
    setActiveChild(child);
    setAdministeredList(child.vaccinesGiven || []);
  };

  const handleToggleVaccine = (vacId) => {
    let updated;
    if (administeredList.includes(vacId)) {
      updated = administeredList.filter(id => id !== vacId);
    } else {
      updated = [...administeredList, vacId];
      // Celebrate vaccine completion
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
    setAdministeredList(updated);
    if (activeChild && onUpdateBeneficiaryVaccines) {
      onUpdateBeneficiaryVaccines(activeChild.id, updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-blue-600" />
            <span>National Immunization Schedule (NIS) & Due-Date Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated calculation of overdue doses, missed vaccines, and digital MCP cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMcpCard(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>View Digital MCP Card</span>
          </button>
          
          <button
            onClick={() => {
              if (onOpenWhatsApp && activeChild) {
                onOpenWhatsApp(activeChild, 'IMMUNIZATION');
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send WhatsApp Reminder</span>
          </button>
        </div>
      </div>

      {/* Child Selector & Quick Coverage Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 cols): Child Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Child / Infant:
            </label>
            <select
              value={activeChild?.id || ''}
              onChange={(e) => {
                const found = children.find(c => c.id === e.target.value);
                if (found) handleSelectChild(found);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {children.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.ageMonths} mo) · {c.village}
                </option>
              ))}
            </select>

            {activeChild && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Baby className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{activeChild.name}</h4>
                    <p className="text-[11px] text-slate-500">RCH: {activeChild.rchId} · DOB: {activeChild.dob}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Mother:</span>
                    <span className="font-semibold text-slate-700">{activeChild.motherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <span className="font-semibold text-slate-700">{activeChild.phone}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-600">Vaccine Coverage</span>
                    <span className="text-blue-700 font-bold">{immuStatus.coverageRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${immuStatus.coverageRate}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overdue Alert Widget */}
          {immuStatus.overdue.length > 0 && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
                <AlertCircle className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>Missed / Overdue Doses ({immuStatus.overdue.length})</span>
              </div>
              <p className="text-[11px] text-rose-700 mb-2.5">
                These vaccinations are past the due window. Mobilize family for immediate catch-up:
              </p>
              <div className="space-y-1.5">
                {immuStatus.overdue.map(vac => (
                  <div key={vac.id} className="bg-white p-2 rounded-xl border border-rose-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{vac.name}</span>
                      <span className="text-[10px] text-rose-600 block">{vac.timingLabel} ({vac.weeksOverdue} wks overdue)</span>
                    </div>
                    <button
                      onClick={() => handleToggleVaccine(vac.id)}
                      className="text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg transition"
                    >
                      Administer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* National Immunization Guidelines Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Immunization Key Milestones:
            </h5>
            <p>• <strong>Birth:</strong> BCG, OPV-0, Hep-B birth dose within 24 hours.</p>
            <p>• <strong>6, 10, 14 Weeks:</strong> Pentavalent, Rotavirus, OPV, PCV.</p>
            <p>• <strong>9-12 Months:</strong> Measles-Rubella (MR-1), PCV Booster, Vit-A.</p>
            <p>• <strong>16-24 Months:</strong> DPT Booster 1, MR-2, OPV Booster.</p>
          </div>
        </div>

        {/* Right Column (8 cols): Complete Interactive Schedule Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Universal Immunization Program (UIP) Record</h3>
                <p className="text-xs text-slate-500">Click dose checkbox to record or view batch administration</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {administeredList.length} of {VACCINE_SCHEDULE.length} Given
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Vaccine</th>
                    <th className="py-2.5 px-3">Protects Against</th>
                    <th className="py-2.5 px-3">Recommended Timing</th>
                    <th className="py-2.5 px-3">Dose & Route</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {VACCINE_SCHEDULE.map(vac => {
                    const isGiven = administeredList.includes(vac.id);
                    const isOverdue = immuStatus.overdue.some(o => o.id === vac.id);
                    const isDueSoon = immuStatus.dueSoon.some(d => d.id === vac.id);

                    return (
                      <tr 
                        key={vac.id}
                        className={`hover:bg-slate-50/80 transition ${
                          isGiven 
                            ? 'bg-emerald-50/20' 
                            : isOverdue 
                            ? 'bg-rose-50/30' 
                            : isDueSoon 
                            ? 'bg-amber-50/20' 
                            : ''
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          {isGiven ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Given
                            </span>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3 text-rose-600" /> Overdue
                            </span>
                          ) : isDueSoon ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-amber-600" /> Due Now
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Upcoming
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {vac.name}
                        </td>

                        <td className="py-2.5 px-3 text-slate-600">
                          {vac.disease}
                        </td>

                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {vac.timingLabel}
                        </td>

                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {vac.dose} ({vac.route})
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleToggleVaccine(vac.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                              isGiven 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' 
                                : isOverdue 
                                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            }`}
                          >
                            {isGiven ? 'Undo' : 'Record'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Digital MCP Card Modal */}
      {showMcpCard && activeChild && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  MCP
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Mother & Child Protection (MCP) Digital Card</h3>
                  <p className="text-xs text-slate-500">Ministry of Health & Family Welfare · Government of India</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMcpCard(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Child Name:</span>
                <span className="font-bold text-slate-900">{activeChild.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">RCH ID:</span>
                <span className="font-bold font-mono text-slate-900">{activeChild.rchId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date of Birth:</span>
                <span className="font-semibold text-slate-800">{activeChild.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Village / Center:</span>
                <span className="font-semibold text-slate-800">{activeChild.village} ({activeChild.anganwadiCenter})</span>
              </div>
            </div>

            {/* List of vaccines */}
            <div className="mt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">Vaccination Record:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {VACCINE_SCHEDULE.map(v => {
                  const given = administeredList.includes(v.id);
                  return (
                    <div key={v.id} className={`p-2 rounded-lg border flex items-center justify-between ${
                      given ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <span className="font-medium">{v.name}</span>
                      <span className="text-[10px] font-bold">{given ? '✓ Done' : 'Pending'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Card</span>
              </button>
              <button
                onClick={() => setShowMcpCard(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
