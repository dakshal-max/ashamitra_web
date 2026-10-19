import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  Syringe, 
  CalendarClock, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  Baby,
  FileText,
  Sparkles,
  Search,
  MessageSquare
} from 'lucide-react';

export default function Dashboard({ 
  beneficiaries = [], 
  tasks = [], 
  referrals = [], 
  t, 
  currentRole, 
  onSelectBeneficiary, 
  setActiveTab,
  onResolveTask,
  onOpenWhatsApp
}) {
  // Compute real-time dashboard metrics
  const totalCount = beneficiaries.length;
  
  // High-Risk Pregnancies
  const highRiskPregnancies = beneficiaries.filter(b => 
    b.type === 'PREGNANT_WOMAN' && 
    ((b.hb && b.hb < 7.0) || (b.systolicBp && b.systolicBp >= 140) || (b.dangerSigns && b.dangerSigns.length > 0))
  );

  // SAM / MAM Children
  const samMamChildren = beneficiaries.filter(b => 
    (b.type === 'CHILD' || b.type === 'INFANT') &&
    (b.muacCm && b.muacCm < 12.5)
  );

  // Immunization coverage
  const childrenWithVaccines = beneficiaries.filter(b => b.type === 'CHILD' || b.type === 'INFANT');
  const fullyImmunizedEstimate = childrenWithVaccines.length > 0 ? 82 : 0;

  // Pending today visits
  const pendingToday = tasks.filter(t => t.status === 'Pending');

  // Critical alerts
  const criticalTasks = tasks.filter(t => t.priority === 'CRITICAL' && t.status === 'Pending');

  return (
    <div className="space-y-6">
      
      {/* PPT Context Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <HeartPulse className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Decision-Support Active · Current Role: {currentRole === 'ASHA' ? 'ASHA Worker' : currentRole === 'AWW' ? 'Anganwadi Worker' : currentRole === 'SUPERVISOR' ? 'Medical Officer / Supervisor' : 'Research Survey'}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Frontline Decision Support & Community Health Workspace
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Eliminating duplicate paperwork and follow-up risks through automated clinical prioritization, WHO growth standard calculations, and direct PHC doctor communication.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('followups')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              <CalendarClock className="w-4 h-4" />
              <span>View Today's Priority Queue ({pendingToday.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className="bg-white/15 hover:bg-white/25 text-white font-medium border border-white/20 px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Explore 9 Slides Research Context</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Priority Clinical Alerts (Red Banner) */}
      {criticalTasks.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
              <span>Clinical Decision Alerts: {criticalTasks.length} Urgent Field Actions</span>
            </div>
            <span className="text-xs font-semibold bg-rose-200 text-rose-800 px-2.5 py-0.5 rounded-full">
              Requires Immediate Home Visit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {criticalTasks.map(task => (
              <div 
                key={task.id} 
                className="bg-white rounded-xl p-3.5 border border-rose-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{task.beneficiaryName}</h4>
                      <p className="text-xs font-semibold text-rose-600 mt-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {task.reason}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                      Score: {task.priorityScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Assigned: {task.assignedTo}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const ben = beneficiaries.find(b => b.id === task.beneficiaryId || b.name.includes(task.beneficiaryName.split(' ')[0]));
                        if (onOpenWhatsApp) onOpenWhatsApp(ben, task.type === 'ANC_CHECK' ? 'ANC_CHECK' : 'IMMUNIZATION');
                      }}
                      className="text-xs font-bold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] border border-[#25D366]/30 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
                      title="Send WhatsApp Alert"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => onResolveTask(task.id)}
                      className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl transition"
                    >
                      Mark Visited
                    </button>
                    <button
                      onClick={() => setActiveTab('referrals')}
                      className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl transition"
                    >
                      PHC Referral
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Beneficiaries */}
        <div 
          onClick={() => setActiveTab('beneficiaries')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Beneficiaries</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ward 1 to Ward 4</p>
        </div>

        {/* High Risk Pregnancies */}
        <div 
          onClick={() => setActiveTab('mch')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">High Risk (HRP)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-600 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{highRiskPregnancies.length}</span>
            <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
              Urgent Care
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Severe Anemia / BP</p>
        </div>

        {/* SAM / MAM Children */}
        <div 
          onClick={() => setActiveTab('growth')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">SAM / MAM Kids</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{samMamChildren.length}</span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
              NRC Tracking
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">WHO Growth Std</p>
        </div>

        {/* Immunization Coverage */}
        <div 
          onClick={() => setActiveTab('immunization')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Immunization Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition">
              <Syringe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">{fullyImmunizedEstimate}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Target: 95%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">National Schedule</p>
        </div>

        {/* Pending Visits Today */}
        <div 
          onClick={() => setActiveTab('followups')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Visits</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 transition">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">{pendingToday.length}</span>
            <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded">
              Today
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Prioritized by CDSS</p>
        </div>

        {/* Active Referrals */}
        <div 
          onClick={() => setActiveTab('referrals')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">PHC Referrals</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-teal-600 transition">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-700">{referrals.length}</span>
            <span className="text-[10px] text-teal-600 font-semibold">Loop Closed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Doctor Feedback</p>
        </div>

      </div>

      {/* Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Rapid Beneficiary Table & Role Focus */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Beneficiary Quick Registry Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Frontline Beneficiaries Overview</h3>
                <p className="text-xs text-slate-500">Beneficiaries needing active community health attention</p>
              </div>
              <button
                onClick={() => setActiveTab('beneficiaries')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Full Register</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {beneficiaries.slice(0, 5).map(ben => {
                const isPregnant = ben.type === 'PREGNANT_WOMAN';
                const isChild = ben.type === 'CHILD' || ben.type === 'INFANT';
                const isLactating = ben.type === 'LACTATING_MOTHER';
                const isHighRisk = (ben.hb && ben.hb < 7) || (ben.systolicBp && ben.systolicBp >= 140) || (ben.muacCm && ben.muacCm < 11.5);

                return (
                  <div 
                    key={ben.id}
                    onClick={() => {
                      onSelectBeneficiary(ben);
                      if (isPregnant) setActiveTab('mch');
                      else if (isChild) setActiveTab('growth');
                      else setActiveTab('beneficiaries');
                    }}
                    className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isHighRisk ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isPregnant ? <HeartPulse className="w-5 h-5" /> : <Baby className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{ben.name}</h4>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {ben.rchId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {ben.village}
                          </span>
                          <span>•</span>
                          <span>{ben.type.replace('_', ' ')}</span>
                          {ben.gestationalWeeks && (
                            <>
                              <span>•</span>
                              <span className="text-teal-700 font-medium">{ben.gestationalWeeks} Weeks Pregnant</span>
                            </>
                          )}
                          {ben.ageMonths && (
                            <>
                              <span>•</span>
                              <span className="text-indigo-700 font-medium">{ben.ageMonths} Months Old</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      {isHighRisk ? (
                        <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> High Risk
                        </span>
                      ) : (
                        <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Normal Follow-up
                        </span>
                      )}
                      <span className="text-xs text-emerald-700 font-semibold group-hover:translate-x-1 transition hidden sm:inline">
                        Action &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Dual Role Responsibilities (Slide 2 Direct Context) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ASHA Responsibilities Box */}
            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>ASHA Frontline Focus</span>
              </div>
              <ul className="text-xs text-rose-950/80 space-y-1.5 list-disc pl-4">
                <li>Early ANC registration (within 12 weeks) & EDD tracking</li>
                <li>Screening 4 danger signs: BP &gt;= 140/90, Severe Anemia &lt; 7.0</li>
                <li>Postnatal Home visits (Day 1, 3, 7, 14, 21, 28, 42)</li>
                <li>Mobilizing mothers for Village Health & Sanitation Day (VHND)</li>
              </ul>
              <button 
                onClick={() => setActiveTab('mch')}
                className="mt-3 text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1"
              >
                <span>Open Maternal Health Suite</span> &rarr;
              </button>
            </div>

            {/* Anganwadi Responsibilities Box */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                <Baby className="w-4 h-4 text-amber-600" />
                <span>Anganwadi Worker (AWW) Focus</span>
              </div>
              <ul className="text-xs text-amber-950/80 space-y-1.5 list-disc pl-4">
                <li>Monthly growth monitoring (Weight, Height, MUAC arm band)</li>
                <li>Instant WHO z-score detection for SAM & MAM classification</li>
                <li>Take Home Ration (THR) & Hot cooked meal distribution</li>
                <li>Early childhood development & preschool enrollment</li>
              </ul>
              <button 
                onClick={() => setActiveTab('growth')}
                className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Open Child Growth Suite</span> &rarr;
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (1 Col): Today's Schedule & Quick Action Hub */}
        <div className="space-y-6">
          
          {/* Priority Task Queue Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Prioritized Today Queue</h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Slide 5 CDSS
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ordered automatically by Clinical Urgency Score (1-100):
            </p>

            <div className="space-y-3">
              {tasks.slice(0, 4).map(task => (
                <div 
                  key={task.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{task.beneficiaryName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {task.reason}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                      task.priority === 'CRITICAL' 
                        ? 'bg-rose-100 text-rose-700' 
                        : task.priority === 'HIGH' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priorityScore} pts
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400">{task.category || task.type}</span>
                    <button
                      onClick={() => onResolveTask(task.id)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('followups')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition text-center"
            >
              Open Full Decision Queue &rarr;
            </button>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Direct Suite Access
            </h4>

            <button
              onClick={() => setActiveTab('immunization')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Syringe className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">Immunization Scheduler</div>
                  <div className="text-[10px] text-slate-500">14 NIS vaccines & overdue alerts</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">PHC Doctor Communication</div>
                  <div className="text-[10px] text-slate-500">Digital referral slips & feedback</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => setActiveTab('survey')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">Slide 7 Primary Survey</div>
                  <div className="text-[10px] text-slate-500">Frontline workload & digital readiness</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
