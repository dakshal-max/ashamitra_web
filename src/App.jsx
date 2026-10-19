import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BeneficiaryManager from './components/BeneficiaryManager';
import MaternalChildCare from './components/MaternalChildCare';
import ImmunizationTracker from './components/ImmunizationTracker';
import GrowthMonitoring from './components/GrowthMonitoring';
import FollowUpManager from './components/FollowUpManager';
import ReferralHub from './components/ReferralHub';
import SurveyModule from './components/SurveyModule';
import PresentationSlidesView from './components/PresentationSlidesView';
import NewBeneficiaryModal from './components/NewBeneficiaryModal';
import VoiceNoteModal from './components/VoiceNoteModal';
import ReportsModal from './components/ReportsModal';
import WhatsAppSenderModal from './components/WhatsAppSenderModal';

import { translations } from './data/translations';
import { 
  INITIAL_BENEFICIARIES, 
  INITIAL_TASKS, 
  INITIAL_REFERRALS, 
  INITIAL_SURVEY_RESPONSES 
} from './data/initialData';

import { 
  LayoutDashboard, 
  Users, 
  HeartPulse, 
  Syringe, 
  Baby, 
  CalendarClock, 
  Stethoscope, 
  FileSpreadsheet, 
  BookOpen, 
  FileText,
  CheckCircle2,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function App() {
  // Persistence state
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem('app_role') || 'ASHA');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [syncToast, setSyncToast] = useState(null);

  const t = translations[currentLang] || translations.en;

  // Beneficiaries State
  const [beneficiaries, setBeneficiaries] = useState(() => {
    const saved = localStorage.getItem('app_beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('app_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Referrals State
  const [referrals, setReferrals] = useState(() => {
    const saved = localStorage.getItem('app_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  // Survey Responses State
  const [surveyResponses, setSurveyResponses] = useState(() => {
    const saved = localStorage.getItem('app_surveys');
    return saved ? JSON.parse(saved) : INITIAL_SURVEY_RESPONSES;
  });

  // Active selection for clinical tools
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(beneficiaries[0] || null);

  // Modals state
  const [showNewBenModal, setShowNewBenModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  
  // WhatsApp Messenger Modal State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState(null);
  const [whatsAppTemplateType, setWhatsAppTemplateType] = useState('IMMUNIZATION');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('app_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('app_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('app_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('app_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('app_surveys', JSON.stringify(surveyResponses));
  }, [surveyResponses]);

  // Handlers
  const handleAddBeneficiary = (newBen) => {
    setBeneficiaries([newBen, ...beneficiaries]);
    setSelectedBeneficiary(newBen);
    showSyncMessage(`Beneficiary ${newBen.name} registered successfully`);
  };

  const handleUpdateBeneficiary = (benId, updates) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === benId ? { ...b, ...updates } : b
    ));
    showSyncMessage(`Beneficiary record updated`);
  };

  const handleDeleteBeneficiary = (benId) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== benId));
    showSyncMessage(`Beneficiary discharged & removed`);
  };

  const handleUpdateBeneficiaryVaccines = (childId, newVaccineList) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === childId ? { ...b, vaccinesGiven: newVaccineList } : b
    ));
    showSyncMessage(`Vaccine record updated`);
  };

  const handleResolveTask = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'Completed' } : t
    ));
    showSyncMessage(`Task marked completed & resolved`);
  };

  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
    showSyncMessage(`New visit scheduled in decision queue`);
  };

  const handleAddReferral = (newRef) => {
    setReferrals([newRef, ...referrals]);
    showSyncMessage(`Referral slip ${newRef.id} transmitted to PHC`);
  };

  const handleUpdateReferralStatus = (refId, updates) => {
    setReferrals(referrals.map(r => 
      r.id === refId ? { ...r, ...updates } : r
    ));
    showSyncMessage(`Doctor feedback recorded for referral`);
  };

  const handleAddSurveyResponse = (newSurvey) => {
    setSurveyResponses([newSurvey, ...surveyResponses]);
    showSyncMessage(`Survey entry saved to research dataset`);
  };

  const handleSyncCloud = () => {
    showSyncMessage(`All local offline data synced with District Health Cloud`);
  };

  const handleOpenWhatsApp = (recipient = null, templateType = 'IMMUNIZATION') => {
    setWhatsAppRecipient(recipient);
    setWhatsAppTemplateType(templateType);
    setShowWhatsAppModal(true);
  };

  const showSyncMessage = (msg) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Tab configurations
  const navigationTabs = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'beneficiaries', label: t.navBeneficiaries, icon: Users },
    { id: 'mch', label: t.navMCH, icon: HeartPulse },
    { id: 'immunization', label: t.navImmunization, icon: Syringe },
    { id: 'growth', label: t.navGrowth, icon: Baby },
    { id: 'followups', label: t.navFollowUps, icon: CalendarClock },
    { id: 'referrals', label: t.navReferrals, icon: Stethoscope },
    { id: 'survey', label: t.navSurvey, icon: FileSpreadsheet },
    { id: 'slides', label: t.navSlides, icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        onSync={handleSyncCloud}
        onOpenNewBeneficiary={() => setShowNewBenModal(true)}
        onOpenVoiceAssistant={() => setShowVoiceModal(true)}
        onOpenWhatsApp={() => handleOpenWhatsApp(null, 'IMMUNIZATION')}
        onOpenSlideGuide={() => setActiveTab('slides')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalAlertCount={tasks.filter(t => t.priority === 'CRITICAL' && t.status === 'Pending').length}
      />

      {/* Secondary Sub-navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1 sm:gap-2">
              {navigationTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                      isActive 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowReportsModal(true)}
              className="ml-3 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              title="Generate Monthly Progress Report (MPR)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{t.navReports}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            beneficiaries={beneficiaries}
            tasks={tasks}
            referrals={referrals}
            t={t}
            currentRole={currentRole}
            onSelectBeneficiary={setSelectedBeneficiary}
            setActiveTab={setActiveTab}
            onResolveTask={handleResolveTask}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'beneficiaries' && (
          <BeneficiaryManager
            beneficiaries={beneficiaries}
            onAddBeneficiary={handleAddBeneficiary}
            onUpdateBeneficiary={handleUpdateBeneficiary}
            onDeleteBeneficiary={handleDeleteBeneficiary}
            onSelectBeneficiary={setSelectedBeneficiary}
            selectedBeneficiary={selectedBeneficiary}
            setActiveTab={setActiveTab}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'mch' && (
          <MaternalChildCare
            beneficiaries={beneficiaries}
            selectedBeneficiary={selectedBeneficiary}
            onSelectBeneficiary={setSelectedBeneficiary}
            onUpdateBeneficiary={handleUpdateBeneficiary}
            setActiveTab={setActiveTab}
            onCreateReferral={handleAddReferral}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'immunization' && (
          <ImmunizationTracker
            beneficiaries={beneficiaries}
            onUpdateBeneficiaryVaccines={handleUpdateBeneficiaryVaccines}
            selectedBeneficiary={selectedBeneficiary}
            setActiveTab={setActiveTab}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'growth' && (
          <GrowthMonitoring
            beneficiaries={beneficiaries}
            selectedBeneficiary={selectedBeneficiary}
            onSelectBeneficiary={setSelectedBeneficiary}
            onUpdateBeneficiary={handleUpdateBeneficiary}
            setActiveTab={setActiveTab}
            onCreateReferral={handleAddReferral}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'followups' && (
          <FollowUpManager
            tasks={tasks}
            onResolveTask={handleResolveTask}
            onAddTask={handleAddTask}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'referrals' && (
          <ReferralHub
            referrals={referrals}
            onAddReferral={handleAddReferral}
            onUpdateReferralStatus={handleUpdateReferralStatus}
            beneficiaries={beneficiaries}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'survey' && (
          <SurveyModule
            surveyResponses={surveyResponses}
            onAddSurveyResponse={handleAddSurveyResponse}
          />
        )}

        {activeTab === 'slides' && (
          <PresentationSlidesView
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AshaMitra · Frontline Health Decision Support</span>
            <span>•</span>
            <span>National Health Mission · Ministry of Women & Child Development (ICDS)</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <button 
              onClick={() => setActiveTab('slides')}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore 9 Slides Presentation Companion</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <NewBeneficiaryModal
        isOpen={showNewBenModal}
        onClose={() => setShowNewBenModal(false)}
        onAddBeneficiary={handleAddBeneficiary}
      />

      <WhatsAppSenderModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        initialRecipient={whatsAppRecipient}
        defaultType={whatsAppTemplateType}
        beneficiaries={beneficiaries}
      />

      <VoiceNoteModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onInsertNotes={(notes) => {
          showSyncMessage(`Voice notes copied to clipboard`);
        }}
      />

      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        beneficiaries={beneficiaries}
        tasks={tasks}
        referrals={referrals}
      />

    </div>
  );
}
