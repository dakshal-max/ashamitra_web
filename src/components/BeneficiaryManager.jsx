import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  HeartPulse, 
  Baby, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  ChevronRight, 
  ExternalLink,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  MessageSquare,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';

export default function BeneficiaryManager({ 
  beneficiaries = [], 
  onAddBeneficiary, 
  onUpdateBeneficiary,
  onDeleteBeneficiary,
  onSelectBeneficiary,
  selectedBeneficiary,
  setActiveTab,
  onOpenWhatsApp
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeModalBen, setActiveModalBen] = useState(null);

  // Edit mode inside dossier modal
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editSystolic, setEditSystolic] = useState(120);
  const [editDiastolic, setEditDiastolic] = useState(80);
  const [editHb, setEditHb] = useState(11.0);
  const [editWeight, setEditWeight] = useState(50);
  const [editMuac, setEditMuac] = useState(13.0);

  // Filter logic
  const filteredBeneficiaries = beneficiaries.filter(ben => {
    // Type filter
    if (selectedFilter !== 'ALL' && ben.type !== selectedFilter) return false;

    // Risk filter
    const isHighRisk = (ben.hb && ben.hb < 7.0) || 
                       (ben.systolicBp && ben.systolicBp >= 140) || 
                       (ben.muacCm && ben.muacCm < 11.5) || 
                       (ben.dangerSigns && ben.dangerSigns.length > 0);

    if (riskFilter === 'HIGH_RISK' && !isHighRisk) return false;
    if (riskFilter === 'NORMAL' && isHighRisk) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ben.name?.toLowerCase().includes(q);
      const matchRch = ben.rchId?.toLowerCase().includes(q);
      const matchPhone = ben.phone?.includes(q);
      const matchVillage = ben.village?.toLowerCase().includes(q);
      if (!matchName && !matchRch && !matchPhone && !matchVillage) return false;
    }

    return true;
  });

  const openDossier = (ben) => {
    setActiveModalBen(ben);
    setEditPhone(ben.phone || '');
    setEditSystolic(ben.systolicBp || 120);
    setEditDiastolic(ben.diastolicBp || 80);
    setEditHb(ben.hb || 11.0);
    setEditWeight(ben.weightKg || 50);
    setEditMuac(ben.muacCm || 13.0);
    setIsEditing(false);
    setShowDetailModal(true);
  };

  const handleSaveEdits = () => {
    if (!activeModalBen) return;
    const updates = {
      phone: editPhone,
      systolicBp: Number(editSystolic),
      diastolicBp: Number(editDiastolic),
      hb: Number(editHb),
      weightKg: Number(editWeight),
      muacCm: Number(editMuac)
    };

    if (onUpdateBeneficiary) {
      onUpdateBeneficiary(activeModalBen.id, updates);
    }

    setActiveModalBen({ ...activeModalBen, ...updates });
    setIsEditing(false);
  };

  const handleDelete = (benId) => {
    if (window.confirm("Are you sure you want to discharge / remove this beneficiary from the registry?")) {
      if (onDeleteBeneficiary) {
        onDeleteBeneficiary(benId);
      }
      setShowDetailModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>Beneficiary Management & Digital Health Records</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Single-view master beneficiary dossier · Instant WhatsApp messaging, vitals tracking & clinical history
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <span>Active Registry:</span>
          <span className="text-emerald-700 font-bold">{filteredBeneficiaries.length} of {beneficiaries.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, RCH ID, phone number or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Risk Level Filter Pills */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Risk:
            </span>
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                riskFilter === 'ALL' 
                  ? 'bg-slate-900 text-white font-bold' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRiskFilter('HIGH_RISK')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                riskFilter === 'HIGH_RISK' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>High Risk Only</span>
            </button>
            <button
              onClick={() => setRiskFilter('NORMAL')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                riskFilter === 'NORMAL' 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Normal
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Category:
          </span>
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'PREGNANT_WOMAN', label: 'Pregnant Women' },
            { id: 'CHILD', label: 'Children (0-5y)' },
            { id: 'INFANT', label: 'Infants (0-1y)' },
            { id: 'LACTATING_MOTHER', label: 'Lactating Mothers' },
            { id: 'ADOLESCENT_GIRL', label: 'Adolescent Girls' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedFilter === cat.id 
                  ? 'bg-emerald-700 text-white font-bold shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Beneficiary Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeneficiaries.map(ben => {
          const isPregnant = ben.type === 'PREGNANT_WOMAN';
          const isChild = ben.type === 'CHILD' || ben.type === 'INFANT';
          const isLactating = ben.type === 'LACTATING_MOTHER';
          const isAdolescent = ben.type === 'ADOLESCENT_GIRL';

          const isHighRisk = (ben.hb && ben.hb < 7.0) || 
                             (ben.systolicBp && ben.systolicBp >= 140) || 
                             (ben.muacCm && ben.muacCm < 11.5) || 
                             (ben.dangerSigns && ben.dangerSigns.length > 0);

          return (
            <div 
              key={ben.id}
              className={`bg-white rounded-2xl border p-4.5 transition flex flex-col justify-between hover:shadow-md ${
                isHighRisk 
                  ? 'border-rose-300 ring-1 ring-rose-300/40 bg-gradient-to-b from-rose-50/20 to-white' 
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div>
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isHighRisk 
                        ? 'bg-rose-100 text-rose-700' 
                        : isPregnant 
                        ? 'bg-pink-100 text-pink-700' 
                        : isChild 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isPregnant ? <HeartPulse className="w-5 h-5" /> : <Baby className="w-5 h-5" />}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{ben.name}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {ben.rchId}
                        </span>
                        <span>•</span>
                        <span>{ben.village}</span>
                      </div>
                    </div>
                  </div>

                  {isHighRisk && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                      High Risk
                    </span>
                  )}
                </div>

                {/* Vitals & Specific clinical indicators */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {isPregnant && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gestation / EDD:</span>
                        <span className="font-semibold text-slate-800">{ben.gestationalWeeks} Wks (EDD: {ben.edd})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Blood Pressure:</span>
                        <span className={`font-semibold ${ben.systolicBp >= 140 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                          {ben.systolicBp}/{ben.diastolicBp} mmHg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hemoglobin (Hb):</span>
                        <span className={`font-semibold ${ben.hb < 7 ? 'text-rose-600 font-bold' : ben.hb < 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                          {ben.hb} g/dL
                        </span>
                      </div>
                    </>
                  )}

                  {isChild && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Age / Gender:</span>
                        <span className="font-semibold text-slate-800">{ben.ageMonths} Months ({ben.gender})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weight & Height:</span>
                        <span className="font-semibold text-slate-800">{ben.weightKg} kg · {ben.heightCm} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">MUAC (Arm band):</span>
                        <span className={`font-bold ${ben.muacCm < 11.5 ? 'text-rose-600' : ben.muacCm < 12.5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {ben.muacCm} cm {ben.muacCm < 11.5 ? '(SAM)' : ben.muacCm < 12.5 ? '(MAM)' : '(Normal)'}
                        </span>
                      </div>
                    </>
                  )}

                  {isLactating && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Child Delivery Date:</span>
                        <span className="font-semibold text-slate-800">{ben.deliveryDate} ({ben.deliveryType})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">PNC Status:</span>
                        <span className="font-semibold text-emerald-700">PNC Day 14 Home Visit Due</span>
                      </div>
                    </>
                  )}

                  {isAdolescent && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">School / Scheme:</span>
                        <span className="font-semibold text-slate-800">{ben.ifaTabletsGiven}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hemoglobin / BMI:</span>
                        <span className="font-semibold text-slate-800">{ben.hb} g/dL (BMI {ben.bmi})</span>
                      </div>
                    </>
                  )}

                  {/* Danger signs tag */}
                  {ben.dangerSigns && ben.dangerSigns.length > 0 && (
                    <div className="mt-2 bg-rose-50 border border-rose-200 p-2 rounded-xl text-[11px] text-rose-800">
                      <span className="font-bold">Danger Signs:</span> {ben.dangerSigns.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${ben.phone}`}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                    title="Call beneficiary phone"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  {/* WhatsApp Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenWhatsApp) {
                        onOpenWhatsApp(ben, isPregnant ? 'ANC_CHECK' : isChild ? 'IMMUNIZATION' : 'NUTRITION');
                      }
                    }}
                    className="p-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/25 text-[#075E54] transition"
                    title="Send WhatsApp message directly"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openDossier(ben)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => {
                      onSelectBeneficiary(ben);
                      if (isPregnant) setActiveTab('mch');
                      else if (isChild) setActiveTab('growth');
                      else setActiveTab('followups');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-2xs"
                  >
                    <span>Record Visit</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dossier Modal */}
      {showDetailModal && activeModalBen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeModalBen.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    RCH ID: {activeModalBen.rchId} · {activeModalBen.village} ({activeModalBen.ward})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Vitals'}</span>
                </button>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Content */}
            <div className="mt-4 space-y-4 text-xs">
              
              {/* Demographics card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block">Category:</span>
                  <span className="font-semibold text-slate-800">{activeModalBen.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="p-1 rounded border border-slate-300 font-bold w-full"
                    />
                  ) : (
                    <span className="font-semibold text-slate-800">{activeModalBen.phone}</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block">Anganwadi Center:</span>
                  <span className="font-semibold text-slate-800">{activeModalBen.anganwadiCenter}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Family Contact:</span>
                  <span className="font-semibold text-slate-800">{activeModalBen.husbandName || activeModalBen.motherName || activeModalBen.guardianName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Registered On:</span>
                  <span className="font-semibold text-slate-800">{activeModalBen.registeredDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status:</span>
                  <span className="font-bold text-emerald-700">{activeModalBen.status}</span>
                </div>
              </div>

              {/* Clinical Assessment */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-emerald-700" />
                    <span>Clinical Observations & History</span>
                  </h4>
                  {isEditing && (
                    <button
                      onClick={handleSaveEdits}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>

                {activeModalBen.type === 'PREGNANT_WOMAN' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">LMP Date</span>
                      <span className="font-bold text-slate-800">{activeModalBen.lmp}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">EDD Date</span>
                      <span className="font-bold text-slate-800">{activeModalBen.edd}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Blood Pressure (mmHg)</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={editSystolic}
                            onChange={(e) => setEditSystolic(e.target.value)}
                            className="w-12 p-1 border rounded text-xs"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            value={editDiastolic}
                            onChange={(e) => setEditDiastolic(e.target.value)}
                            className="w-12 p-1 border rounded text-xs"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-slate-800">{activeModalBen.systolicBp}/{activeModalBen.diastolicBp}</span>
                      )}
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Hemoglobin (g/dL)</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editHb}
                          onChange={(e) => setEditHb(e.target.value)}
                          className="w-16 p-1 border rounded text-xs font-bold mt-1"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{activeModalBen.hb} g/dL</span>
                      )}
                    </div>
                  </div>
                )}

                {(activeModalBen.type === 'CHILD' || activeModalBen.type === 'INFANT') && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Weight (kg)</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className="w-16 p-1 border rounded text-xs font-bold mt-1"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{activeModalBen.weightKg} kg</span>
                      )}
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">MUAC Arm Band</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editMuac}
                          onChange={(e) => setEditMuac(e.target.value)}
                          className="w-16 p-1 border rounded text-xs font-bold mt-1"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{activeModalBen.muacCm} cm</span>
                      )}
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                      <span className="font-bold text-slate-800">{activeModalBen.dob}</span>
                    </div>
                  </div>
                )}

                {/* Visit History Log */}
                {activeModalBen.ancVisits && (
                  <div className="mt-3">
                    <h5 className="font-semibold text-slate-700 mb-1">ANC Visits History:</h5>
                    <div className="space-y-1">
                      {activeModalBen.ancVisits.map((v, i) => (
                        <div key={i} className="flex justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-800">{v.visit} ({v.date})</span>
                          <span className="text-slate-600">BP: {v.bp} · Hb: {v.hb} g/dL · Wt: {v.weight}kg</span>
                          <span className="font-bold text-emerald-700">{v.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleDelete(activeModalBen.id)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discharge / Remove</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onOpenWhatsApp) {
                      onOpenWhatsApp(
                        activeModalBen, 
                        activeModalBen.type === 'PREGNANT_WOMAN' ? 'ANC_CHECK' : 'IMMUNIZATION'
                      );
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white transition flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    onSelectBeneficiary(activeModalBen);
                    if (activeModalBen.type === 'PREGNANT_WOMAN') setActiveTab('mch');
                    else if (activeModalBen.type === 'CHILD') setActiveTab('growth');
                    else setActiveTab('followups');
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                >
                  Open Clinical Suite
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
