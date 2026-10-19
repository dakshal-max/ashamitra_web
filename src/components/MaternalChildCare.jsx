import React, { useState } from 'react';
import { 
  HeartPulse, 
  Baby, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Stethoscope, 
  Plus, 
  FileText,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  Save,
  MessageSquare
} from 'lucide-react';
import { evaluateMaternalRisk } from '../data/decisionEngine';

export default function MaternalChildCare({ 
  beneficiaries = [], 
  selectedBeneficiary, 
  onSelectBeneficiary,
  onUpdateBeneficiary,
  setActiveTab,
  onCreateReferral,
  onOpenWhatsApp
}) {
  const pregnantMothers = beneficiaries.filter(b => b.type === 'PREGNANT_WOMAN');
  const lactatingMothers = beneficiaries.filter(b => b.type === 'LACTATING_MOTHER');

  const [activeMother, setActiveMother] = useState(
    selectedBeneficiary?.type === 'PREGNANT_WOMAN' ? selectedBeneficiary : pregnantMothers[0] || null
  );

  // Form states for clinical evaluation
  const [systolicBp, setSystolicBp] = useState(activeMother?.systolicBp || 120);
  const [diastolicBp, setDiastolicBp] = useState(activeMother?.diastolicBp || 80);
  const [hb, setHb] = useState(activeMother?.hb || 11.0);
  const [weightKg, setWeightKg] = useState(activeMother?.weightKg || 50);
  const [selectedDangerSigns, setSelectedDangerSigns] = useState(activeMother?.dangerSigns || []);
  const [previousCSection, setPreviousCSection] = useState(activeMother?.previousCesarean || false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // EDD Calculator states
  const [calculatorLmp, setCalculatorLmp] = useState('');
  const [calculatedEdd, setCalculatedEdd] = useState('');
  const [calculatedWeeks, setCalculatedWeeks] = useState(null);

  // Run CDSS evaluation on the current input values
  const riskResult = evaluateMaternalRisk({
    age: activeMother?.age || 24,
    hb: Number(hb),
    systolicBp: Number(systolicBp),
    diastolicBp: Number(diastolicBp),
    dangerSigns: selectedDangerSigns,
    parity: activeMother?.parity || 1,
    previousCesarean: previousCSection
  });

  const toggleDangerSign = (sign) => {
    if (selectedDangerSigns.includes(sign)) {
      setSelectedDangerSigns(selectedDangerSigns.filter(s => s !== sign));
    } else {
      setSelectedDangerSigns([...selectedDangerSigns, sign]);
    }
  };

  const handleCalculateEdd = (lmpDate) => {
    setCalculatorLmp(lmpDate);
    if (!lmpDate) return;

    const lmp = new Date(lmpDate);
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    setCalculatedEdd(edd.toISOString().split('T')[0]);

    const today = new Date();
    const diffWeeks = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
    setCalculatedWeeks(Math.max(1, Math.min(42, diffWeeks)));
  };

  const handleSelectMother = (mother) => {
    setActiveMother(mother);
    setSystolicBp(mother.systolicBp || 120);
    setDiastolicBp(mother.diastolicBp || 80);
    setHb(mother.hb || 11.0);
    setWeightKg(mother.weightKg || 50);
    setSelectedDangerSigns(mother.dangerSigns || []);
    setPreviousCSection(mother.previousCesarean || false);
    setSaveSuccess(false);
    if (onSelectBeneficiary) onSelectBeneficiary(mother);
  };

  // Fully functional save encounter
  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!activeMother) return;

    const newVisitNumber = (activeMother.ancVisits?.length || 0) + 1;
    const newVisitObj = {
      visit: `ANC ${newVisitNumber > 4 ? 'Follow-up' : newVisitNumber}`,
      date: new Date().toISOString().split('T')[0],
      hb: Number(hb),
      bp: `${systolicBp}/${diastolicBp}`,
      weight: Number(weightKg),
      status: riskResult.riskLevel === 'HIGH' ? 'Urgent Flagged' : 'Done'
    };

    const updatedVisits = [...(activeMother.ancVisits || []), newVisitObj];

    const updates = {
      systolicBp: Number(systolicBp),
      diastolicBp: Number(diastolicBp),
      hb: Number(hb),
      weightKg: Number(weightKg),
      dangerSigns: selectedDangerSigns,
      previousCesarean: previousCSection,
      ancVisits: updatedVisits
    };

    if (onUpdateBeneficiary) {
      onUpdateBeneficiary(activeMother.id, updates);
    }

    setActiveMother({ ...activeMother, ...updates });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Fully functional push referral
  const handlePushEmergencyReferral = () => {
    if (!activeMother || !onCreateReferral) return;

    const refObj = {
      id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
      beneficiaryId: activeMother.id,
      beneficiaryName: activeMother.name,
      age: `${activeMother.age || 24} Years`,
      referredBy: "ASHA Worker (Field Clinical Decision Support)",
      referredTo: "Navghar Primary Health Centre (PHC)",
      doctorName: "Dr. Arvind Sharma (Medical Officer - PHC)",
      referralDate: new Date().toISOString().split('T')[0],
      urgency: riskResult.referralUrgency === 'EMERGENCY' ? 'Emergency (Immediate)' : 'Urgent (Within 24 Hours)',
      vitalsSummary: `BP: ${systolicBp}/${diastolicBp} mmHg, Hb: ${hb} g/dL, Wt: ${weightKg}kg, Gestation: ${activeMother.gestationalWeeks}wks`,
      reason: `High-risk triage flags: ${riskResult.flags.join(', ') || 'Obstetric Red Flag'}`,
      doctorStatus: "Pending Doctor Review",
      doctorNotes: "Emergency clinical referral transmitted from field. Ready for triage.",
      transportArranged: "108 Emergency Ambulance",
      loopClosed: false
    };

    onCreateReferral(refObj);
    setActiveTab('referrals');
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <span>Maternal & Child Health (MCH) Decision Support</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clinical decision support for High-Risk Pregnancy (HRP) triage, ANC 1-4, & Postnatal Care
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeMother && (
            <button
              onClick={() => {
                if (onOpenWhatsApp) onOpenWhatsApp(activeMother, 'ANC_CHECK');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Mother</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('referrals')}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>PHC Referral Center</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Mother Selector & Clinical Form, Right CDSS Decision Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Pregnant Mother Selector & Assessment Inputs */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Select Registered Mother */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Pregnant Mother for Assessment:
            </label>
            <select
              value={activeMother?.id || ''}
              onChange={(e) => {
                const found = pregnantMothers.find(m => m.id === e.target.value);
                if (found) handleSelectMother(found);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
            >
              {pregnantMothers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.rchId}) · {m.gestationalWeeks} Wks · {m.village}
                </option>
              ))}
            </select>

            {activeMother && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Husband Name:</span>
                  <span className="font-semibold text-slate-700">{activeMother.husbandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">LMP / EDD:</span>
                  <span className="font-semibold text-slate-700">{activeMother.lmp} &rarr; {activeMother.edd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gestational Age:</span>
                  <span className="font-bold text-rose-700">{activeMother.gestationalWeeks} Weeks</span>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Vital Signs Input */}
          <form onSubmit={handleSaveAssessment} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>Current Vital Signs & Vitals Entry</span>
              </h3>
              <span className="text-[10px] text-slate-400">Live CDSS Evaluation</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-bold ${
                    systolicBp >= 140 ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {systolicBp >= 140 && <span className="text-[10px] text-rose-600 font-bold">Hypertension &ge;140</span>}
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-bold ${
                    diastolicBp >= 90 ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {diastolicBp >= 90 && <span className="text-[10px] text-rose-600 font-bold">Hypertension &ge;90</span>}
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Hemoglobin (Hb g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={hb}
                  onChange={(e) => setHb(e.target.value)}
                  className={`w-full p-2 rounded-xl border font-bold ${
                    hb < 7 ? 'border-rose-400 bg-rose-50 text-rose-700' : hb < 10 ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {hb < 7 ? (
                  <span className="text-[10px] text-rose-600 font-bold">Severe Anemia (&lt;7.0)</span>
                ) : hb < 10 ? (
                  <span className="text-[10px] text-amber-600 font-medium">Moderate Anemia</span>
                ) : null}
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Maternal Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Obstetric Danger Signs Checkbox Pills */}
            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-2">
                Screen for Obstetric Danger Signs:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Severe headache",
                  "Pedal edema",
                  "Vaginal bleeding",
                  "Blurred vision",
                  "Decreased fetal movement",
                  "Convulsions",
                  "High fever"
                ].map(sign => {
                  const isChecked = selectedDangerSigns.includes(sign);
                  return (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => toggleDangerSign(sign)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                        isChecked 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sign}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Previous C-Section toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Previous C-Section / Scarred Uterus:</span>
              <button
                type="button"
                onClick={() => setPreviousCSection(!previousCSection)}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  previousCSection ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {previousCSection ? 'Yes (High Risk)' : 'No'}
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Vitals Saved to Record!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Updates ANC encounter history</span>
              )}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Assessment</span>
              </button>
            </div>

          </form>

          {/* Quick EDD & Gestational Calculator Tool */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-2xl border border-teal-200/80 shadow-xs">
            <h4 className="font-bold text-teal-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Instant EDD & Gestational Age Calculator</span>
            </h4>
            <div className="flex gap-2">
              <input
                type="date"
                value={calculatorLmp}
                onChange={(e) => handleCalculateEdd(e.target.value)}
                className="p-2 text-xs rounded-xl border border-teal-200 bg-white text-slate-800 flex-1"
                placeholder="Enter LMP Date"
              />
            </div>
            {calculatedEdd && (
              <div className="mt-2.5 p-2.5 bg-white/80 rounded-xl border border-teal-200 text-xs flex justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">Estimated Delivery (EDD)</span>
                  <span className="font-bold text-teal-800">{calculatedEdd}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Gestational Age</span>
                  <span className="font-bold text-teal-800">{calculatedWeeks} Weeks</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (7 cols): CDSS Clinical Output & Action Protocol */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Automated Decision-Support Diagnostic Banner */}
          <div className={`rounded-2xl p-5 border-2 shadow-sm transition ${
            riskResult.riskLevel === 'HIGH' 
              ? 'bg-rose-50 border-rose-300' 
              : riskResult.riskLevel === 'MODERATE' 
              ? 'bg-amber-50 border-amber-300' 
              : 'bg-emerald-50 border-emerald-300'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Clinical Decision Engine Analysis:
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    riskResult.riskLevel === 'HIGH' 
                      ? 'bg-rose-600 text-white' 
                      : riskResult.riskLevel === 'MODERATE' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {riskResult.riskLevel} RISK PREGNANCY
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {riskResult.riskLevel === 'HIGH' 
                    ? 'Immediate Attention & Medical Officer Referral Required' 
                    : riskResult.riskLevel === 'MODERATE' 
                    ? 'Close Field Surveillance & Nutrition Support' 
                    : 'Routine Antenatal Care Progression'}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
                <span className={`text-2xl font-black ${
                  riskResult.riskLevel === 'HIGH' ? 'text-rose-600' : 'text-slate-800'
                }`}>
                  {riskResult.riskScore}/100
                </span>
              </div>
            </div>

            {/* Identified Clinical Flags */}
            {riskResult.flags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Clinical Risk Flags Detected:</span>
                </h4>
                <ul className="space-y-1">
                  {riskResult.flags.map((flag, i) => (
                    <li key={i} className="text-xs font-medium text-rose-900 bg-white/70 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Automated Decision Recommendations */}
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Protocol-Based Actions Recommended for Frontline Worker:</span>
              </h4>
              <ul className="space-y-1">
                {riskResult.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-slate-800 bg-white/70 px-2.5 py-1 rounded-xl border border-slate-200 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-700 font-semibold">
                Triage Urgency: <strong className="text-rose-700">{riskResult.referralUrgency}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenWhatsApp && activeMother) onOpenWhatsApp(activeMother, 'ANC_CHECK');
                  }}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Mother</span>
                </button>

                <button
                  type="button"
                  onClick={handlePushEmergencyReferral}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Push Emergency Referral to PHC</span>
                </button>
              </div>
            </div>
          </div>

          {/* ANC 1 to 4 Schedule Roadmap */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Mandatory 4 Antenatal Care (ANC) Visits Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
              {[
                { title: 'ANC 1', timing: 'Within 12 Weeks', focus: 'Registration, Blood/Urine, IFA, Td 1', done: (activeMother?.ancVisits?.length || 0) >= 1 },
                { title: 'ANC 2', timing: '14 - 26 Weeks', focus: 'Anomaly Scan, Weight gain, BP, Td 2', done: (activeMother?.ancVisits?.length || 0) >= 2 },
                { title: 'ANC 3', timing: '28 - 34 Weeks', focus: 'Preeclampsia, Hb retest, Fetal growth', done: (activeMother?.ancVisits?.length || 0) >= 3, active: (activeMother?.ancVisits?.length || 0) === 2 },
                { title: 'ANC 4', timing: '36 Weeks to Delivery', focus: 'Birth planning, 108 ambulance, FRU choice', done: (activeMother?.ancVisits?.length || 0) >= 4 }
              ].map((anc, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                    anc.done 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : anc.active 
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{anc.title}</span>
                      {anc.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : anc.active ? (
                        <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-1.5 rounded">Due</span>
                      ) : null}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 mt-1">{anc.timing}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-tight">{anc.focus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Postnatal Care (PNC) & Home-Based Newborn Care (HBNC) Module */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Baby className="w-4 h-4 text-purple-600" />
                  <span>Postnatal Care (PNC) & Home Based Newborn Care (HBNC)</span>
                </h3>
                <p className="text-xs text-slate-500">7 visits for home deliveries, 6 visits for institutional births</p>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                NHM Aligned
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {[
                { day: "Day 1", label: "Delivery", status: "Done" },
                { day: "Day 3", label: "Cord & Milk", status: "Done" },
                { day: "Day 7", label: "Jaundice check", status: "Done" },
                { day: "Day 14", label: "Weight Check", status: "Due Today", active: true },
                { day: "Day 21", label: "Vaccine review", status: "Upcoming" },
                { day: "Day 28", label: "Growth check", status: "Upcoming" },
                { day: "Day 42", label: "Final PNC/PPIUCD", status: "Upcoming" }
              ].map((pnc, i) => (
                <div 
                  key={i}
                  className={`p-2.5 rounded-xl border text-center shrink-0 min-w-[90px] ${
                    pnc.active 
                      ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/20' 
                      : pnc.status === 'Done' 
                      ? 'bg-slate-50 border-slate-200' 
                      : 'bg-white border-slate-200 opacity-70'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800">{pnc.day}</div>
                  <div className="text-[10px] text-slate-500">{pnc.label}</div>
                  <div className={`text-[10px] font-bold mt-1 ${pnc.active ? 'text-purple-700' : 'text-slate-400'}`}>
                    {pnc.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
