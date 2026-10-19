import React, { useState } from 'react';
import { 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Check, 
  User, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Stethoscope, 
  Filter,
  Plus,
  Sparkles
} from 'lucide-react';

export default function FollowUpManager({ 
  tasks = [], 
  onResolveTask, 
  onAddTask,
  setActiveTab 
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [statusTab, setStatusTab] = useState('PENDING'); // PENDING or RESOLVED
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form states
  const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
  const [newTaskType, setNewTaskType] = useState('ANC_CHECK');
  const [newReason, setNewReason] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newDate, setNewDate] = useState('2026-10-21');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (statusTab === 'PENDING' && task.status === 'Completed') return false;
    if (statusTab === 'RESOLVED' && task.status !== 'Completed') return false;

    if (filterType === 'CRITICAL' && task.priority !== 'CRITICAL') return false;
    if (filterType === 'MATERNAL' && task.type !== 'ANC_CHECK' && task.type !== 'PNC_CHECK') return false;
    if (filterType === 'CHILD' && task.type !== 'GROWTH_MONITORING' && task.type !== 'IMMUNIZATION') return false;

    return true;
  }).sort((a, b) => (b.priorityScore || 50) - (a.priorityScore || 50));

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newBeneficiaryName || !newReason) return;

    const taskObj = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      beneficiaryName: newBeneficiaryName,
      type: newTaskType,
      priority: newPriority,
      priorityScore: newPriority === 'CRITICAL' ? 95 : newPriority === 'HIGH' ? 80 : 55,
      reason: newReason,
      scheduledDate: newDate,
      assignedTo: "Frontline Health Team",
      status: "Pending",
      category: newTaskType === 'ANC_CHECK' ? 'Maternal Care' : newTaskType === 'GROWTH_MONITORING' ? 'Child Nutrition' : 'Immunization'
    };

    if (onAddTask) onAddTask(taskObj);
    setShowNewTaskModal(false);
    setNewBeneficiaryName('');
    setNewReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-700" />
            <span>Intelligent Decision Support & Follow-up Queue</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Slide 3 & 4 Core Research Solution · Automated priority scoring (1-100) preventing missed community visits
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Filter and Status Toggles */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusTab('PENDING')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                statusTab === 'PENDING' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending Actions ({tasks.filter(t => t.status !== 'Completed').length})
            </button>
            <button
              onClick={() => setStatusTab('RESOLVED')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                statusTab === 'RESOLVED' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'Completed').length})
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Tasks' },
              { id: 'CRITICAL', label: 'Critical Only' },
              { id: 'MATERNAL', label: 'Maternal (ANC/PNC)' },
              { id: 'CHILD', label: 'Child (Growth/Vaccine)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  filterType === f.id 
                    ? 'bg-slate-900 text-white font-bold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-sm">No Pending Tasks in this Category!</p>
            <p className="mt-1">All prioritized frontline home visits and checks have been resolved.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCritical = task.priority === 'CRITICAL';
            const isHigh = task.priority === 'HIGH';
            const isCompleted = task.status === 'Completed';

            return (
              <div 
                key={task.id}
                className={`bg-white rounded-2xl border p-4.5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md ${
                  isCompleted 
                    ? 'opacity-70 bg-slate-50 border-slate-200' 
                    : isCritical 
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/15' 
                    : isHigh 
                    ? 'border-amber-300 bg-amber-50/10' 
                    : 'border-slate-200'
                }`}
              >
                {/* Left Side: Beneficiary & Clinical Urgency */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isCompleted 
                      ? 'bg-slate-100 text-slate-500' 
                      : isCritical 
                      ? 'bg-rose-100 text-rose-700' 
                      : isHigh 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-emerald-600 font-bold" />
                    ) : isCritical ? (
                      <ShieldAlert className="w-5 h-5 animate-bounce" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{task.beneficiaryName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCritical 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : isHigh 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority} Priority · {task.priorityScore} Pts
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {task.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                      {task.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-2">
                      <span>Scheduled: <strong className="text-slate-800">{task.scheduledDate}</strong></span>
                      <span>Assigned: <strong className="text-slate-800">{task.assignedTo}</strong></span>
                      <span>Category: <strong className="text-slate-800">{task.category || task.type}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action CTA Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => setActiveTab('referrals')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        Escalate
                      </button>

                      <button
                        onClick={() => onResolveTask(task.id)}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Action Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Task Scheduling Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-emerald-600" />
              <span>Schedule Frontline Follow-up Visit</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new task into the algorithmic decision-support queue.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Radha Patil"
                  value={newBeneficiaryName}
                  onChange={(e) => setNewBeneficiaryName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Task Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="ANC_CHECK">ANC Visit</option>
                    <option value="PNC_CHECK">PNC Home Visit</option>
                    <option value="GROWTH_MONITORING">Growth / Nutrition</option>
                    <option value="IMMUNIZATION">Immunization Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="CRITICAL">Critical (Score 95)</option>
                    <option value="HIGH">High (Score 80)</option>
                    <option value="MEDIUM">Medium (Score 55)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinical Reason & Action Needed</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Follow up on Hb test results, check pedal edema, deliver IFA tablets..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
