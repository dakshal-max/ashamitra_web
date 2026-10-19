import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, CheckCircle, Copy } from 'lucide-react';

export default function VoiceNoteModal({ isOpen, onClose, onInsertNotes }) {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');

  const sampleVoicePrompts = [
    {
      lang: 'English',
      text: 'Beneficiary Kavita Sharma, gestational week 31, blood pressure 146 over 96, severe headache and pedal edema reported. Emergency PHC referral initiated.'
    },
    {
      lang: 'हिंदी (Hindi)',
      text: 'बच्चा आरव गायकवाड़, उम्र 9 माह, एमयूएसी 11.1 सेमी लाल पट्टी। गंभीर कुपोषण (सैम) पाया गया। एनआरसी केंद्र में भर्ती हेतु रेफरल भेजा गया।'
    },
    {
      lang: 'मराठी (Marathi)',
      text: 'दीया राठोड, वय ६ महिने, पेंटा २ आणि रोटा २ लस बाकी आहे. आईला बुधवारच्या लसीकरण सत्रासाठी बोलावले आहे.'
    }
  ];

  // Try Web Speech API if supported
  useEffect(() => {
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    if (isListening && recognition) {
      try {
        recognition.start();
      } catch (e) {
        // Already started
      }
    } else if (!isListening && recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // Stopped
      }
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch(e) {}
      }
    };
  }, [isListening, selectedLanguage]);

  const toggleListen = () => {
    if (!isListening) {
      setIsListening(true);
      // If web speech isn't supported or fails, simulate recognition for smooth demo
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        setTimeout(() => {
          setTranscript("Beneficiary Kavita Sharma: BP 146/96 mmHg with severe headache and pedal edema. Immediate referral recommended.");
          setIsListening(false);
        }, 3000);
      }
    } else {
      setIsListening(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Voice-Assisted Field Entry</h3>
              <p className="text-xs text-slate-500">Slide 9 Future Scope · Hands-free speech-to-text dictation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          
          {/* Language selector */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600">Dictation Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 font-bold"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">हिंदी (Hindi)</option>
              <option value="mr-IN">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Microphone Recording Button */}
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={toggleListen}
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition shadow-lg ${
                isListening 
                  ? 'bg-rose-600 text-white animate-ping ring-4 ring-rose-200' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30'
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            <p className="font-bold text-slate-800 text-xs mt-3">
              {isListening ? 'Listening... Speak symptoms or vitals now' : 'Tap to start voice recording'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ideal for workers during village home visits or VHND sessions
            </p>
          </div>

          {/* Transcribed text box */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Transcribed Clinical Notes:</label>
              {transcript && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-purple-700 hover:text-purple-800 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              rows="4"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Spoken words will appear here automatically..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Sample Prompts */}
          <div>
            <span className="font-bold text-slate-400 block text-[10px] uppercase mb-1.5">
              Click a sample field recording to test:
            </span>
            <div className="space-y-1.5">
              {sampleVoicePrompts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTranscript(s.text)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-purple-50/50 border border-slate-200 text-slate-700 text-[11px] transition"
                >
                  <strong className="text-purple-700 mr-1">[{s.lang}]</strong>
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (onInsertNotes) onInsertNotes(transcript);
                onClose();
              }}
              disabled={!transcript}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition shadow-sm"
            >
              Use in Active Encounter
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
