import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Layers,
  HeartPulse,
  Baby,
  CalendarClock,
  Stethoscope,
  FileSpreadsheet
} from 'lucide-react';
import { PPT_SLIDES_METADATA } from '../data/initialData';

export default function PresentationSlidesView({ setActiveTab }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slide = PPT_SLIDES_METADATA[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < PPT_SLIDES_METADATA.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const getTargetTab = (slideNum) => {
    switch (slideNum) {
      case 1: return 'dashboard';
      case 2: return 'beneficiaries';
      case 3: return 'followups';
      case 4: return 'referrals';
      case 5: return 'mch';
      case 6: return 'dashboard';
      case 7: return 'survey';
      case 8: return 'growth';
      case 9: return 'immunization';
      default: return 'dashboard';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-900">
              Presentation Slide Companion & Research Walkthrough
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exact slide-by-slide mapping of <strong>ASHA_Anganwadi_Digital_Decision_Support_9_Slides_Final.pptx</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <strong>Community Health & Digital Innovation Research</strong>
        </div>
      </div>

      {/* Main Slide Presentation Deck Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* Slide Deck Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md">
              SLIDE 0{slide.slideNumber} / 09
            </span>
            <div>
              <span className="text-xs text-slate-400 font-mono block">COMMUNITY HEALTH · DIGITAL INNOVATION</span>
              <h3 className="text-sm font-bold text-white">{slide.heading}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Quick Stepper Dots */}
            <div className="flex items-center gap-1 px-2">
              {PPT_SLIDES_METADATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlideIndex === i ? 'bg-emerald-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Jump to Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === PPT_SLIDES_METADATA.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Content */}
        <div className="p-6 sm:p-10 min-h-[380px] flex flex-col justify-between bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20">
          
          <div className="space-y-4 max-w-4xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {slide.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {slide.heading}
              </h2>
            </div>

            {/* Slide 1 Special Layout */}
            {slide.slideNumber === 1 && (
              <div className="space-y-4 pt-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950 font-medium">
                  {slide.coreTheme}
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-400 uppercase text-[10px] font-bold">Research Presentation Details</div>
                  <div className="font-bold text-slate-900 text-sm">Community Health Worker Assistant</div>
                  <div className="text-slate-600">Digital Decision Support for Frontline Healthcare Workers</div>
                </div>
              </div>
            )}

            {/* Bullet points for slides 2 to 9 */}
            {slide.points && (
              <div className="space-y-2.5 pt-2">
                {slide.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Feature Link Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-slate-600">
                Mapped Live Application Feature: <strong>{slide.mappedSystemFeature}</strong>
              </span>
            </div>

            <button
              onClick={() => setActiveTab(getTargetTab(slide.slideNumber))}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm self-start sm:self-auto"
            >
              <span>Test This Feature Live in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Grid of All 9 Slides for Rapid Browsing */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3">All 9 Presentation Slides At A Glance</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PPT_SLIDES_METADATA.map((s, idx) => (
            <div
              key={s.slideNumber}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                currentSlideIndex === idx 
                  ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-500 text-[10px] mb-1">
                <span>SLIDE 0{s.slideNumber}</span>
                {currentSlideIndex === idx && <span className="text-emerald-700 font-bold">Active</span>}
              </div>
              <h4 className="font-bold text-slate-900 leading-snug">{s.heading}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
