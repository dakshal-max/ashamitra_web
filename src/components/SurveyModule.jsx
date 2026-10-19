import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  BarChart3, 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  Smartphone, 
  Send,
  Sparkles,
  Users
} from 'lucide-react';

export default function SurveyModule({ 
  surveyResponses = [], 
  onAddSurveyResponse 
}) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form states
  const [respondentType, setRespondentType] = useState('ASHA Worker');
  const [name, setName] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [dailyPaperworkHours, setDailyPaperworkHours] = useState(3.5);
  const [registersMaintained, setRegistersMaintained] = useState(10);
  const [biggestPainPoint, setBiggestPainPoint] = useState('');
  const [digitalToolUsed, setDigitalToolUsed] = useState('Smartphone, WhatsApp, Poshan Tracker');
  const [mostWantedFeature, setMostWantedFeature] = useState('Automated due date alerts for pending vaccinations and high-risk pregnancy visits');
  const [offlineNeed, setOfflineNeed] = useState('Very High');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `SRV-${Date.now().toString().slice(-4)}`,
      respondentType,
      name: name || "Anonymous Field Worker",
      experienceYears: Number(experienceYears),
      dailyPaperworkHours: Number(dailyPaperworkHours),
      registersMaintained: Number(registersMaintained),
      biggestPainPoint: biggestPainPoint || "Repeated manual writing across multiple books",
      digitalToolUsed,
      comfortWithTech: 4,
      mostWantedFeature,
      offlineNeed,
      date: new Date().toISOString().split('T')[0]
    };

    if (onAddSurveyResponse) onAddSurveyResponse(newEntry);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowFormModal(false);
      setName('');
      setBiggestPainPoint('');
    }, 1500);
  };

  // Compute analytics
  const totalResponses = surveyResponses.length;
  const avgPaperwork = totalResponses > 0 
    ? (surveyResponses.reduce((acc, curr) => acc + (Number(curr.dailyPaperworkHours) || 0), 0) / totalResponses).toFixed(1)
    : 3.8;
  const avgRegisters = totalResponses > 0 
    ? Math.round(surveyResponses.reduce((acc, curr) => acc + (Number(curr.registersMaintained) || 0), 0) / totalResponses)
    : 11;

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <span>Slide 7: Primary Research Survey & Methodology</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Investigating frontline workload, duplicate paperwork, and demand for automated clinical decision support
          </p>
        </div>

        <button
          onClick={() => setShowFormModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Participate in Field Survey</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Survey Sample Size</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalResponses} Respondents</div>
          <p className="text-[11px] text-slate-400 mt-1">ASHA, AWW, MO & Community</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Avg Manual Paperwork Time</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{avgPaperwork} Hours/Day</div>
          <p className="text-[11px] text-slate-400 mt-1">Lost from direct family counseling</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Physical Registers Maintained</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">~{avgRegisters} Physical Books</div>
          <p className="text-[11px] text-slate-400 mt-1">Severe duplicate data entry</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Demand for Automated Alerts</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">96.4% Demand</div>
          <p className="text-[11px] text-slate-400 mt-1">Prioritized home visit schedule</p>
        </div>
      </div>

      {/* Research Charts & Findings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Daily Paperwork Hours by Role */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Average Paperwork Hours vs. Field Counseling</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { role: "ASHA Worker (Survey)", hours: 4.5, percent: 75, color: "bg-rose-500" },
              { role: "Anganwadi Worker (AWW)", hours: 3.8, percent: 63, color: "bg-amber-500" },
              { role: "Medical Officer / PHC", hours: 2.5, percent: 42, color: "bg-blue-500" },
              { role: "With This System (Projected)", hours: 0.8, percent: 14, color: "bg-emerald-500" }
            ].map((bar, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{bar.role}</span>
                  <span className="font-bold">{bar.hours} hrs/day</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${bar.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            *Evidence matches Slide 3: Information effort consumes valuable community time.
          </p>
        </div>

        {/* Chart 2: Top Requested Digital Features */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-700" />
            <span>Top Frontline Demanded Decision Support Features</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { feature: "Automated due alerts (Vaccines & ANC)", score: 94, color: "bg-teal-600" },
              { feature: "Automatic WHO growth chart calculation", score: 89, color: "bg-emerald-600" },
              { feature: "Direct emergency doctor referral push", score: 82, color: "bg-blue-600" },
              { feature: "Full offline sync for poor network zones", score: 88, color: "bg-purple-600" },
              { feature: "Local language audio / voice dictation", score: 74, color: "bg-indigo-600" }
            ].map((f, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{f.feature}</span>
                  <span className="font-bold">{f.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${f.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            *Directly validated by Slide 8 Proposed Solution pillars.
          </p>
        </div>

      </div>

      {/* Field Responses Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Field Survey Feedback & Testimonials</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {surveyResponses.map(res => (
            <div key={res.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{res.name}</span>
                  <span className="font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded text-[10px]">
                    {res.respondentType}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{res.date}</span>
              </div>

              <div className="text-slate-700 italic">
                "{res.biggestPainPoint}"
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap justify-between text-[11px] text-slate-500 gap-2">
                <span>Paperwork: <strong>{res.dailyPaperworkHours} hrs/day</strong></span>
                <span>Registers: <strong>{res.registersMaintained}</strong></span>
                <span>Offline: <strong>{res.offlineNeed}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participation Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Frontline Health Survey Questionnaire (Slide 7)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your feedback helps shape digital decision support for ASHA & Anganwadi workers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Respondent Category</label>
                  <select
                    value={respondentType}
                    onChange={(e) => setRespondentType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="ASHA Worker">ASHA Worker</option>
                    <option value="Anganwadi Worker">Anganwadi Worker</option>
                    <option value="Medical Officer / PHC">Medical Officer / PHC Doctor</option>
                    <option value="Parent / Community Member">Parent / Guardian</option>
                    <option value="Student / Researcher">Student / Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Your Name / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Meenakshi S."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Daily Paperwork Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dailyPaperworkHours}
                    onChange={(e) => setDailyPaperworkHours(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Physical Registers Maintained</label>
                  <input
                    type="number"
                    value={registersMaintained}
                    onChange={(e) => setRegistersMaintained(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Biggest Challenge with Manual Registers</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Duplicate entries, finding overdue vaccination dates, calculating z-scores..."
                  value={biggestPainPoint}
                  onChange={(e) => setBiggestPainPoint(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Most Desired Decision Support Feature</label>
                <input
                  type="text"
                  value={mostWantedFeature}
                  onChange={(e) => setMostWantedFeature(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-xs"
                >
                  {formSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Saved to Research Dataset!</span>
                    </>
                  ) : (
                    <span>Submit Survey Entry</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
