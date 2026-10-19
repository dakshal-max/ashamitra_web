import React, { useState } from 'react';
import { 
  Baby, 
  Activity, 
  Scale, 
  Ruler, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Utensils, 
  ShieldAlert, 
  HeartHandshake, 
  Stethoscope,
  Sparkles,
  Save,
  MessageSquare
} from 'lucide-react';
import { evaluateChildNutrition } from '../data/decisionEngine';
import { WHO_GROWTH_STANDARDS } from '../data/vaccineSchedule';

export default function GrowthMonitoring({ 
  beneficiaries = [], 
  selectedBeneficiary, 
  onSelectBeneficiary,
  onUpdateBeneficiary,
  setActiveTab,
  onCreateReferral,
  onOpenWhatsApp
}) {
  const children = beneficiaries.filter(b => b.type === 'CHILD' || b.type === 'INFANT');

  const [activeChild, setActiveChild] = useState(
    selectedBeneficiary?.type === 'CHILD' || selectedBeneficiary?.type === 'INFANT' 
      ? selectedBeneficiary 
      : children[0] || null
  );

  // Form input states
  const [ageMonths, setAgeMonths] = useState(activeChild?.ageMonths || 12);
  const [gender, setGender] = useState(activeChild?.gender || 'male');
  const [weightKg, setWeightKg] = useState(activeChild?.weightKg || 8.5);
  const [heightCm, setHeightCm] = useState(activeChild?.heightCm || 75);
  const [muacCm, setMuacCm] = useState(activeChild?.muacCm || 13.0);
  const [thrDistributed, setThrDistributed] = useState(activeChild?.thrReceived ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Run CDSS evaluation
  const evalResult = evaluateChildNutrition({
    ageMonths: Number(ageMonths),
    gender,
    weightKg: Number(weightKg),
    heightCm: Number(heightCm),
    muacCm: Number(muacCm)
  });

  const handleSelectChild = (child) => {
    setActiveChild(child);
    setAgeMonths(child.ageMonths || 12);
    setGender(child.gender || 'male');
    setWeightKg(child.weightKg || 8.5);
    setHeightCm(child.heightCm || 75);
    setMuacCm(child.muacCm || 13.0);
    setThrDistributed(child.thrReceived ?? true);
    setSaveSuccess(false);
    if (onSelectBeneficiary) onSelectBeneficiary(child);
  };

  // Fully functional save growth record
  const handleSaveGrowthRecord = (e) => {
    e.preventDefault();
    if (!activeChild) return;

    const updates = {
      ageMonths: Number(ageMonths),
      gender,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      muacCm: Number(muacCm),
      thrReceived: thrDistributed
    };

    if (onUpdateBeneficiary) {
      onUpdateBeneficiary(activeChild.id, updates);
    }

    setActiveChild({ ...activeChild, ...updates });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Fully functional NRC Referral Generation
  const handleGenerateNrcReferral = () => {
    if (!activeChild || !onCreateReferral) return;

    const refObj = {
      id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
      beneficiaryId: activeChild.id,
      beneficiaryName: activeChild.name,
      age: `${ageMonths} Months (${gender})`,
      referredBy: "Anganwadi Worker (AWW - Child Growth Monitoring)",
      referredTo: "Nutrition Rehabilitation Centre (NRC) / Sub-District Hospital",
      doctorName: "Dr. Meera Chitnis (Pediatrician / NRC Incharge)",
      referralDate: new Date().toISOString().split('T')[0],
      urgency: "Urgent (Within 24 Hours)",
      vitalsSummary: `Wt: ${weightKg}kg, Ht: ${heightCm}cm, MUAC: ${muacCm}cm (${evalResult.samCategory})`,
      reason: `Severe Malnutrition Alert: ${evalResult.flags.join(', ') || 'Failed appetite / Severe Acute Malnutrition'}`,
      doctorStatus: "Pending Doctor Review",
      doctorNotes: "Admit for medical stabilization, F-75 formula and micronutrient therapy.",
      transportArranged: "102 Janani Shishu Vahan / Local",
      loopClosed: false
    };

    onCreateReferral(refObj);
    setActiveTab('referrals');
  };

  // Helper for SVG WHO Growth Chart plotting
  const standards = WHO_GROWTH_STANDARDS[gender.startsWith('f') ? 'girls' : 'boys'];
  const chartAges = [0, 3, 6, 9, 12, 18, 24, 36, 48, 60];

  const getX = (m) => 50 + (m / 60) * 520;
  const getY = (w) => 270 - (w / 22) * 240;

  const medianPath = chartAges.map((a, i) => `${i === 0 ? 'M' : 'L'} ${getX(a)} ${getY(standards[a].median)}`).join(' ');
  const m2sdPath = chartAges.map((a, i) => `${i === 0 ? 'M' : 'L'} ${getX(a)} ${getY(standards[a].m2sd)}`).join(' ');
  const m3sdPath = chartAges.map((a, i) => `${i === 0 ? 'M' : 'L'} ${getX(a)} ${getY(standards[a].m3sd)}`).join(' ');

  const currentChildX = getX(Math.min(60, Number(ageMonths)));
  const currentChildY = getY(Math.min(22, Number(weightKg)));

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Baby className="w-5 h-5 text-amber-600" />
            <span>Anganwadi Child Growth & Nutrition Monitoring (WHO Standards)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated WHO z-scores, SAM / MAM classification, and Nutrition Rehabilitation Centre (NRC) triage
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeChild && (
            <button
              onClick={() => {
                if (onOpenWhatsApp) onOpenWhatsApp(activeChild, 'NUTRITION');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Mother</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('referrals')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
            <span>NRC / Doctor Referral</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Child Selector & Vitals Input */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Child for Growth Assessment:
            </label>
            <select
              value={activeChild?.id || ''}
              onChange={(e) => {
                const found = children.find(c => c.id === e.target.value);
                if (found) handleSelectChild(found);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              {children.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.ageMonths} mo) · {c.village} · {c.anganwadiCenter}
                </option>
              ))}
            </select>

            {activeChild && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mother:</span>
                  <span className="font-semibold text-slate-700">{activeChild.motherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Birth:</span>
                  <span className="font-semibold text-slate-700">{activeChild.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Anganwadi Center:</span>
                  <span className="font-bold text-amber-800">{activeChild.anganwadiCenter}</span>
                </div>
              </div>
            )}
          </div>

          {/* Growth Measurements Input */}
          <form onSubmit={handleSaveGrowthRecord} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Anthropometric Measurements</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Age (in Months)</label>
                <input
                  type="number"
                  min="0"
                  max="72"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                >
                  <option value="male">Boy (Male)</option>
                  <option value="female">Girl (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-bold ${
                    weightKg < evalResult.m3sdWeight 
                      ? 'border-rose-400 bg-rose-50 text-rose-700' 
                      : weightKg < evalResult.m2sdWeight 
                      ? 'border-amber-400 bg-amber-50 text-amber-700' 
                      : 'border-slate-200 bg-slate-50'
                  }`}
                />
                <span className="text-[10px] text-slate-400">WHO Median: {evalResult.expectedMedianWeight} kg</span>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Height / Length (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* MUAC Input & Color Tape Guide */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  MUAC Arm Band (cm):
                </label>
                <span className="text-[10px] font-bold text-slate-500">6 - 59 Months</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={muacCm}
                onChange={(e) => setMuacCm(e.target.value)}
                className={`w-full p-2 rounded-xl border font-bold ${
                  muacCm < 11.5 
                    ? 'border-rose-500 bg-rose-50 text-rose-700' 
                    : muacCm < 12.5 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-emerald-500 bg-emerald-50 text-emerald-800'
                }`}
              />
              
              {/* MUAC Tape Visualizer */}
              <div className="mt-2 flex h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 w-[35%]" title="Red: < 11.5 cm (SAM)" />
                <div className="bg-amber-400 w-[25%]" title="Yellow: 11.5 - 12.5 cm (MAM)" />
                <div className="bg-emerald-500 w-[40%]" title="Green: > 12.5 cm (Normal)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Red &lt;11.5 (SAM)</span>
                <span>Yellow 11.5-12.5 (MAM)</span>
                <span>Green &gt;12.5 (Normal)</span>
              </div>
            </div>

            {/* Supplementary Nutrition / Take Home Ration (THR) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Supplementary Nutrition (THR) Given:</span>
              <button
                type="button"
                onClick={() => setThrDistributed(!thrDistributed)}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  thrDistributed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {thrDistributed ? '✓ Distributed' : 'Pending'}
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Growth Record Saved!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Updates child profile & WHO plot</span>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Growth Assessment</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right Column (7 cols): WHO Growth Curve & Clinical Decision Output */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Nutrition Triage Status Card */}
          <div className={`rounded-2xl p-5 border-2 shadow-sm transition ${
            evalResult.samCategory === 'SAM' 
              ? 'bg-rose-50 border-rose-300' 
              : evalResult.samCategory === 'MAM' 
              ? 'bg-amber-50 border-amber-300' 
              : 'bg-emerald-50 border-emerald-300'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nutrition Classification (WHO & ICDS):
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    evalResult.samCategory === 'SAM' 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : evalResult.samCategory === 'MAM' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {evalResult.samCategory}
                  </span>
                  <span>
                    {evalResult.samCategory === 'SAM' 
                      ? 'Severe Acute Malnutrition (Red Zone)' 
                      : evalResult.samCategory === 'MAM' 
                      ? 'Moderate Acute Malnutrition (Yellow Zone)' 
                      : 'Healthy Growth (Green Zone)'}
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">MUAC Status</span>
                <span className="text-xs font-bold text-slate-800">{evalResult.muacStatus}</span>
              </div>
            </div>

            {/* Detailed z-score breakdowns */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs">
              <div className="bg-white/70 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Weight-for-Age (WAZ)</span>
                <span className="font-bold text-slate-800">{evalResult.wazStatus}</span>
              </div>
              <div className="bg-white/70 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Height-for-Age (Stunting)</span>
                <span className="font-bold text-slate-800">{evalResult.stuntingStatus}</span>
              </div>
            </div>

            {/* Protocol Interventions */}
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-amber-700" />
                <span>Anganwadi Action Protocol & Interventions:</span>
              </h4>
              <ul className="space-y-1">
                {evalResult.interventions.map((item, i) => (
                  <li key={i} className="text-xs text-slate-800 bg-white/70 px-2.5 py-1 rounded-xl border border-slate-200 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenWhatsApp && activeChild) onOpenWhatsApp(activeChild, 'NUTRITION');
                }}
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Mother</span>
              </button>

              {evalResult.samCategory === 'SAM' && (
                <button
                  type="button"
                  onClick={handleGenerateNrcReferral}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Generate NRC Referral Slip &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* WHO Weight-for-Age Growth Chart (Interactive SVG) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>WHO Weight-for-Age Growth Curve ({gender === 'male' ? 'Boys' : 'Girls'})</span>
                </h3>
                <p className="text-xs text-slate-500">Visual plotting against Median (Green), -2 SD (Yellow), and -3 SD (Red)</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Median
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> -2 SD (MAM)
                </span>
                <span className="flex items-center gap-1 text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> -3 SD (SAM)
                </span>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-200 overflow-x-auto">
              <svg viewBox="0 0 600 300" className="w-full h-48 select-none">
                {/* Grid lines */}
                {[0, 5, 10, 15, 20].map(w => (
                  <g key={w}>
                    <line x1="50" y1={getY(w)} x2="570" y2={getY(w)} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x="42" y={getY(w) + 4} fill="#94a3b8" fontSize="10" textAnchor="end">{w}kg</text>
                  </g>
                ))}

                {[0, 12, 24, 36, 48, 60].map(m => (
                  <g key={m}>
                    <line x1={getX(m)} y1="30" x2={getX(m)} y2="270" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x={getX(m)} y="285" fill="#94a3b8" fontSize="10" textAnchor="middle">{m}m</text>
                  </g>
                ))}

                {/* WHO Standard Curves */}
                <path d={medianPath} fill="none" stroke="#10b981" strokeWidth="2.5" />
                <path d={m2sdPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                <path d={m3sdPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />

                {/* Current Child Position Marker */}
                <circle 
                  cx={currentChildX} 
                  cy={currentChildY} 
                  r="7" 
                  fill={evalResult.samCategory === 'SAM' ? '#ef4444' : evalResult.samCategory === 'MAM' ? '#f59e0b' : '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                
                {/* Marker Label */}
                <g transform={`translate(${currentChildX + 10}, ${currentChildY - 5})`}>
                  <rect x="-2" y="-12" width="85" height="18" rx="4" fill="#0f172a" fillOpacity="0.8" />
                  <text x="40" y="1" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {weightKg}kg @ {ageMonths}m
                  </text>
                </g>
              </svg>
            </div>
            
            <p className="text-[11px] text-slate-400 text-center">
              X-Axis: Age in Months (0 to 60) · Y-Axis: Weight in Kilograms (0 to 22 kg)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
