import React, { useState } from 'react';
import { UserPlus, X, HeartPulse, Baby, Calendar, Phone, MapPin } from 'lucide-react';

export default function NewBeneficiaryModal({ isOpen, onClose, onAddBeneficiary }) {
  if (!isOpen) return null;

  const [type, setType] = useState('PREGNANT_WOMAN');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [village, setVillage] = useState('Navghar Pada');
  const [ward, setWard] = useState('Ward 4');
  const [anganwadiCenter, setAnganwadiCenter] = useState('AWC-12 (Navghar East)');

  // Pregnant Woman fields
  const [husbandName, setHusbandName] = useState('');
  const [lmp, setLmp] = useState('');
  const [edd, setEdd] = useState('');
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [hb, setHb] = useState(11.0);

  // Child / Infant fields
  const [motherName, setMotherName] = useState('');
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('');
  const [ageMonths, setAgeMonths] = useState(6);
  const [weightKg, setWeightKg] = useState(7.0);
  const [heightCm, setHeightCm] = useState(65.0);
  const [muacCm, setMuacCm] = useState(13.0);

  const handleLmpChange = (val) => {
    setLmp(val);
    if (val) {
      const d = new Date(val);
      const computedEdd = new Date(d.getTime() + 280 * 24 * 60 * 60 * 1000);
      setEdd(computedEdd.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `BEN-${Math.floor(100 + Math.random() * 900)}`;
    const rchId = `MH-THN-${Math.floor(100000 + Math.random() * 900000)}`;

    let benData = {
      id: newId,
      name,
      phone,
      village,
      ward,
      anganwadiCenter,
      type,
      rchId,
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    if (type === 'PREGNANT_WOMAN') {
      benData = {
        ...benData,
        husbandName,
        lmp,
        edd: edd || '2027-04-15',
        gestationalWeeks: 16,
        systolicBp: Number(systolicBp),
        diastolicBp: Number(diastolicBp),
        hb: Number(hb),
        dangerSigns: systolicBp >= 140 ? ['Elevated BP'] : [],
        ancVisits: [{ visit: 'ANC 1', date: new Date().toISOString().split('T')[0], hb: Number(hb), bp: `${systolicBp}/${diastolicBp}`, weight: 48, status: 'Done' }]
      };
    } else {
      benData = {
        ...benData,
        motherName,
        gender,
        dob: dob || '2026-04-01',
        ageMonths: Number(ageMonths),
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        muacCm: Number(muacCm),
        vaccinesGiven: ['bcg', 'opv_0', 'hepb_birth']
      };
    }

    if (onAddBeneficiary) onAddBeneficiary(benData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Register New Beneficiary</h3>
              <p className="text-xs text-slate-500">Add to Master Community Health Register (RCH Portal Aligned)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Beneficiary Type selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Beneficiary Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('PREGNANT_WOMAN')}
                className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                  type === 'PREGNANT_WOMAN' ? 'bg-pink-50 border-pink-400 text-pink-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Pregnant Woman</span>
              </button>

              <button
                type="button"
                onClick={() => setType('CHILD')}
                className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                  type === 'CHILD' ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Child / Infant (0-5y)</span>
              </button>
            </div>
          </div>

          {/* Common Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Smt. Pooja Mane"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Mobile Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Village / Pada</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Navghar Pada">Navghar Pada</option>
                <option value="Talav Pada">Talav Pada</option>
                <option value="Koliwada">Koliwada</option>
                <option value="Bunder Road">Bunder Road</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Anganwadi Center</label>
              <input
                type="text"
                value={anganwadiCenter}
                onChange={(e) => setAnganwadiCenter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>

          {/* Conditional Pregnant Fields */}
          {type === 'PREGNANT_WOMAN' && (
            <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-200 space-y-3">
              <h4 className="font-bold text-pink-900 text-xs flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-pink-600" />
                <span>Maternal Care & Clinical Indicators</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Husband's Name</label>
                  <input
                    type="text"
                    placeholder="Husband Name"
                    value={husbandName}
                    onChange={(e) => setHusbandName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">LMP Date</label>
                  <input
                    type="date"
                    value={lmp}
                    onChange={(e) => handleLmpChange(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Hemoglobin (Hb g/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hb}
                    onChange={(e) => setHb(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Child Fields */}
          {type === 'CHILD' && (
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
              <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-amber-600" />
                <span>Child Details & Anthropometry</span>
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mother Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Age (Months)</label>
                  <input
                    type="number"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">MUAC (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={muacCm}
                    onChange={(e) => setMuacCm(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="male">Boy</option>
                    <option value="female">Girl</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              Save Beneficiary Record
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
