import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  HeartPulse, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Syringe, 
  Baby, 
  Activity 
} from 'lucide-react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(10);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const loadingSteps = [
    { title: "Initializing National Immunization Schedule (NIS)", icon: Syringe },
    { title: "Calibrating WHO Child Growth Standards & Z-Scores", icon: Baby },
    { title: "Loading High-Risk Pregnancy Clinical Decision Rules", icon: HeartPulse },
    { title: "Configuring WhatsApp Health Messenger Service", icon: Activity },
    { title: "Verifying Offline Cache & Master Beneficiary Registry", icon: ShieldCheck },
    { title: "System Ready · Launching Frontline Workspace", icon: CheckCircle2 }
  ];

  useEffect(() => {
    // Progress interval
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 12;
        return Math.min(100, prev + increment);
      });
    }, 280);

    return () => clearInterval(progressTimer);
  }, []);

  // Update step based on progress
  useEffect(() => {
    if (progress < 25) setActiveStepIndex(0);
    else if (progress < 45) setActiveStepIndex(1);
    else if (progress < 65) setActiveStepIndex(2);
    else if (progress < 85) setActiveStepIndex(3);
    else if (progress < 98) setActiveStepIndex(4);
    else setActiveStepIndex(5);

    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 500);
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onFinish]);

  const CurrentIcon = loadingSteps[activeStepIndex]?.icon || Sparkles;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 text-white transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-emerald-500/10 animate-ping duration-1000" />
        <div className="w-[700px] h-[700px] rounded-full border border-teal-500/10 animate-pulse duration-700" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4 p-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl text-center space-y-6">
        
        {/* Animated Brand Logo with Glowing Rings */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-25 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-xl border border-emerald-400/30">
            <HeartHandshake className="w-10 h-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
            <CurrentIcon className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Title and Ministry Badges */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>NHM & ICDS Healthcare Suite</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>AshaMitra</span>
            <span className="text-emerald-400 text-xl font-normal font-sans">
              (आशा मित्र)
            </span>
          </h1>

          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Digital Decision Support System for Frontline Healthcare Workers
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold px-1">
            <span className="text-slate-400">System Boot & Calibration</span>
            <span className="text-emerald-400 font-mono font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-300 shadow-md shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Step Checklist */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-300 font-semibold text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate">{loadingSteps[activeStepIndex]?.title}</span>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Clinical Rules Engine: Active</span>
            <span>Local Database: Ready</span>
          </div>
        </div>

        {/* Footer Attribution */}
        <p className="text-[10px] text-slate-500">
          Universal Immunization · Maternal ANC/PNC · WHO Nutrition Standards
        </p>

      </div>
    </div>
  );
}
