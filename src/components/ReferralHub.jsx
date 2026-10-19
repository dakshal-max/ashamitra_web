import React, { useState } from 'react';
import { 
  Stethoscope, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  FileText, 
  Truck, 
  User, 
  Calendar,
  MessageCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ReferralHub({ 
  referrals = [], 
  onAddReferral, 
  onUpdateReferralStatus, 
  beneficiaries = [],
  onOpenWhatsApp
}) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeFeedbackModal, setActiveFeedbackModal] = useState(null);

  // Form states for new referral
  const [selectedBenId, setSelectedBenId] = useState(beneficiaries[0]?.id || '');
  const [referredTo, setReferredTo] = useState('Navghar Primary Health Centre (PHC)');
  const [urgency, setUrgency] = useState('Emergency (Immediate)');
  const [reason, setReason] = useState('');
  const [transport, setTransport] = useState('108 Ambulance');

  // Doctor feedback form states
  const [doctorNotes, setDoctorNotes] = useState('');
  const [doctorAction, setDoctorAction] = useState('Doctor Accepted');

  const handleCreateReferral = (e) => {
    e.preventDefault();
    const ben = beneficiaries.find(b => b.id === selectedBenId) || beneficiaries[0];

    let vitals = "Routine Checkup";
    if (ben.type === 'PREGNANT_WOMAN') {
      vitals = `BP: ${ben.systolicBp || 120}/${ben.diastolicBp || 80} mmHg, Hb: ${ben.hb || 11} g/dL, Wt: ${ben.weightKg || 50}kg`;
    } else if (ben.type === 'CHILD' || ben.type === 'INFANT') {
      vitals = `Wt: ${ben.weightKg || 8}kg, MUAC: ${ben.muacCm || 13} cm, Age: ${ben.ageMonths || 12}mo`;
    }

    const refObj = {
      id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
      beneficiaryId: ben.id,
      beneficiaryName: ben.name,
      age: ben.age || `${ben.ageMonths} Months`,
      referredBy: "Field Frontline Worker (ASHA/AWW)",
      referredTo,
      doctorName: "Dr. Arvind Sharma (Medical Officer - PHC)",
      referralDate: new Date().toISOString().split('T')[0],
      urgency,
      vitalsSummary: vitals,
      reason: reason || "High-risk condition flagged by frontline decision support system",
      doctorStatus: "Pending Doctor Review",
      doctorNotes: "Pending consultation at PHC OPD.",
      transportArranged: transport,
      loopClosed: false
    };

    if (onAddReferral) onAddReferral(refObj);
    setShowNewModal(false);
    setReason('');
  };

  const handleSaveDoctorFeedback = (e) => {
    e.preventDefault();
    if (!activeFeedbackModal) return;

    if (onUpdateReferralStatus) {
      onUpdateReferralStatus(activeFeedbackModal.id, {
        doctorStatus: doctorAction,
        doctorNotes: doctorNotes || "Patient examined at facility. Necessary clinical protocol executed.",
        loopClosed: true
      });
    }

    setActiveFeedbackModal(null);
    setDoctorNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <span>Frontline-to-PHC Referral & Doctor Communication Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Slide 4 Point 4 Solution · Eliminating communication delays between ASHA workers and Medical Officers
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Digital Referral Slip</span>
        </button>
      </div>

      {/* Referrals Cards Grid */}
      <div className="space-y-4">
        {referrals.map(ref => {
          const isEmergency = ref.urgency?.includes('Emergency');
          const isPending = ref.doctorStatus === 'Pending Doctor Review';

          return (
            <div 
              key={ref.id}
              className={`bg-white rounded-2xl border p-5 transition hover:shadow-md ${
                isEmergency 
                  ? 'border-rose-300 ring-1 ring-rose-200/50 bg-gradient-to-r from-rose-50/20 to-white' 
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {ref.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{ref.beneficiaryName}</h3>
                    <span className="text-xs text-slate-500">({ref.age})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Referred by: <strong>{ref.referredBy}</strong> &rarr; <strong>{ref.referredTo}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isEmergency 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ref.urgency}
                  </span>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPending 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {ref.doctorStatus}
                  </span>
                </div>
              </div>

              {/* Vitals Summary & Reason */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Field Vitals Recorded by ASHA:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{ref.vitalsSummary}</p>
                  <p className="text-slate-600 mt-1"><strong>Reason:</strong> {ref.reason}</p>
                  <div className="mt-2 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Transport: {ref.transportArranged}</span>
                  </div>
                </div>

                <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100 flex flex-col justify-between">
                  <div>
                    <span className="text-teal-700 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor / Medical Officer Clinical Feedback:</span>
                    </span>
                    <p className="text-slate-800 font-medium mt-1 leading-relaxed italic">
                      "{ref.doctorNotes}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-teal-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-teal-800 font-semibold">
                      Consultant: {ref.doctorName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (onOpenWhatsApp) {
                            const foundBen = beneficiaries.find(b => b.id === ref.beneficiaryId) || { name: ref.beneficiaryName };
                            onOpenWhatsApp(foundBen, 'CUSTOM');
                          }
                        }}
                        className="text-xs font-bold text-[#075E54] hover:bg-[#25D366]/20 bg-[#25D366]/10 border border-[#25D366]/30 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
                        title="Share referral slip on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Share Slip</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveFeedbackModal(ref);
                          setDoctorNotes(ref.doctorNotes);
                          setDoctorAction(ref.doctorStatus);
                        }}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-white border border-teal-200 px-2.5 py-1 rounded-xl transition shadow-2xs"
                      >
                        Update Doctor Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loop Closure Status */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date: {ref.referralDate}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Referral Feedback Loop: {ref.loopClosed ? 'Closed & Verified' : 'In Progress'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Referral Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>Generate Digital Referral Slip</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantly transmit high-risk patient details to PHC/CHC Medical Officer.
            </p>

            <form onSubmit={handleCreateReferral} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Beneficiary</label>
                <select
                  value={selectedBenId}
                  onChange={(e) => setSelectedBenId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.rchId}) · {b.village}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Referred Facility</label>
                  <select
                    value={referredTo}
                    onChange={(e) => setReferredTo(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="Navghar Primary Health Centre (PHC)">Navghar PHC</option>
                    <option value="Sub-District Hospital FRU">Sub-District Hospital FRU</option>
                    <option value="Nutrition Rehabilitation Centre (NRC)">NRC (Malnutrition Ward)</option>
                    <option value="District Civil Hospital">District Civil Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Clinical Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-rose-700 font-bold"
                  >
                    <option value="Emergency (Immediate)">Emergency (Immediate)</option>
                    <option value="Urgent (Within 24 Hours)">Urgent (Within 24 Hours)</option>
                    <option value="Routine Referral">Routine Referral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Transport Mobilized</label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="108 Ambulance">108 Emergency Ambulance</option>
                  <option value="102 Janani Shishu Vahan">102 Janani Shishu Vahan</option>
                  <option value="Family Private / Auto">Family Private / Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinical Reason & Danger Signs</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail high blood pressure, severe anemia, pedal edema, failure to thrive or other clinical red flags..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Referral</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Action Modal */}
      {activeFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>Medical Officer Clinical Review & Response</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Patient: <strong>{activeFeedbackModal.beneficiaryName}</strong> ({activeFeedbackModal.id})
            </p>

            <form onSubmit={handleSaveDoctorFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Referral Disposition / Status</label>
                <select
                  value={doctorAction}
                  onChange={(e) => setDoctorAction(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-teal-800"
                >
                  <option value="Doctor Accepted">Doctor Accepted & Treated</option>
                  <option value="Admitted to NRC">Admitted to NRC Malnutrition Ward</option>
                  <option value="Admitted to FRU / Hospital">Admitted to FRU / Hospital</option>
                  <option value="Outpatient Meds Prescribed">Outpatient Treatment Prescribed</option>
                  <option value="Discharged with Follow-up">Discharged with Follow-up Instructions</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Prescription & Medical Notes for ASHA</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Record diagnosis, medications prescribed, IV therapy, dietary instructions, and when to conduct next home visit..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackModal(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs"
                >
                  Save Doctor Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
