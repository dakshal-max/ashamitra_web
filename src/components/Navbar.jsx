import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Baby, 
  ShieldCheck, 
  FileSpreadsheet, 
  Mic, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  UserPlus, 
  BookOpen, 
  Globe,
  Bell,
  Stethoscope,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  currentLang, 
  setCurrentLang, 
  t, 
  isOnline, 
  setIsOnline, 
  onSync, 
  onOpenNewBeneficiary, 
  onOpenVoiceAssistant,
  onOpenWhatsApp,
  onOpenSlideGuide,
  activeTab,
  setActiveTab,
  criticalAlertCount = 2
}) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const roles = [
    { id: 'ASHA', label: t.roleAsha, icon: HeartHandshake, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'AWW', label: t.roleAww, icon: Baby, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'SUPERVISOR', label: t.roleSupervisor, icon: Stethoscope, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'SURVEY', label: t.roleSurvey, icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Main Header (Upper green bar with Kinjal's name is completely removed) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Project Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                    {t.appTitle}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live CDSS v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenWhatsApp}
                className="p-2 rounded-lg bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold"
                title="Send WhatsApp Message"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
              </button>

              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
                  isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Actions & Role Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Online / Offline Sync Mode */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
                }`}
                title="Toggle Online / Offline Sync Simulation"
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isOnline ? 'Online Sync' : 'Offline Mode'}</span>
              </button>

              <button
                onClick={onSync}
                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                title="Sync local data with cloud"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिंदी' : 'मराठी'}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  <button
                    onClick={() => { setCurrentLang('en'); setShowLangDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${currentLang === 'en' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => { setCurrentLang('hi'); setShowLangDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${currentLang === 'hi' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    हिंदी (HI)
                  </button>
                  <button
                    onClick={() => { setCurrentLang('mr'); setShowLangDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${currentLang === 'mr' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    मराठी (MR)
                  </button>
                </div>
              )}
            </div>

            {/* Fully Functional WhatsApp Health Messenger Button */}
            <button
              onClick={onOpenWhatsApp}
              className="px-3 py-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              title="Send WhatsApp Health Reminders directly to mothers & families"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp Messenger</span>
            </button>

            {/* Voice Assistant Trigger */}
            <button
              onClick={onOpenVoiceAssistant}
              className="px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
              title="Dictate symptoms & clinical observations"
            >
              <Mic className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
              <span className="hidden sm:inline">{t.voiceAssistant}</span>
            </button>

            {/* Add Beneficiary CTA Button */}
            <button
              onClick={onOpenNewBeneficiary}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.addBeneficiary}</span>
            </button>
          </div>

        </div>

        {/* Role Switcher Pills */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Workspace Role:
            </span>
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap border ${
                    isActive 
                      ? `${r.color} font-bold shadow-xs ring-2 ring-emerald-500/20`
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick PPT Guide Access */}
            <button
              onClick={onOpenSlideGuide}
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl transition shrink-0"
              title="View 9 Slides Research Presentation Companion"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>PPT Guide (9 Slides)</span>
            </button>

            {/* Quick Alert Bell */}
            <button 
              onClick={() => setActiveTab('followups')}
              className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-xl transition shrink-0"
            >
              <Bell className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
              <span>{criticalAlertCount} High Priority Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
