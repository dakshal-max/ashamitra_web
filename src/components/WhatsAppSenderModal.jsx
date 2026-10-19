import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  User, 
  Phone, 
  Calendar,
  CheckCheck
} from 'lucide-react';

export default function WhatsAppSenderModal({ 
  isOpen, 
  onClose, 
  initialRecipient = null, 
  defaultType = 'IMMUNIZATION', 
  beneficiaries = [] 
}) {
  if (!isOpen) return null;

  // Selected beneficiary or manual entry
  const [selectedBenId, setSelectedBenId] = useState(initialRecipient?.id || (beneficiaries[0]?.id || 'custom'));
  const [customPhone, setCustomPhone] = useState(initialRecipient?.phone || '+91 ');
  const [templateType, setTemplateType] = useState(defaultType);
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Find active beneficiary
  const activeBen = beneficiaries.find(b => b.id === selectedBenId) || initialRecipient;

  // Format and generate template text based on active beneficiary and template type
  useEffect(() => {
    const benName = activeBen?.name || "Beneficiary";
    const phoneNum = activeBen?.phone || customPhone;
    if (activeBen?.phone) {
      setCustomPhone(activeBen.phone);
    }

    if (templateType === 'IMMUNIZATION') {
      const childName = activeBen?.type === 'CHILD' || activeBen?.type === 'INFANT' ? activeBen.name : "your child";
      const motherName = activeBen?.motherName || activeBen?.name || "Parent";
      const village = activeBen?.village || "Navghar Center";
      setMessageText(
        `🏥 *ASHA & Anganwadi Health Alert - Vaccination Due*\n\n` +
        `Namaskar ${motherName} ji,\n\n` +
        `This is a health reminder from your Anganwadi Worker and ASHA team.\n` +
        `Upcoming vaccination doses for *${childName}* are scheduled this Wednesday at the *${village}* session.\n\n` +
        `📋 *Please bring your Mother & Child Protection (MCP) card.*\n` +
        `Timely vaccination protects your child against 12 preventable diseases.\n\n` +
        `For any assistance, contact your local ASHA worker.\n` +
        `_National Health Mission · Poshan Abhiyaan_`
      );
    } else if (templateType === 'ANC_CHECK') {
      const weeks = activeBen?.gestationalWeeks || 28;
      const village = activeBen?.village || "Navghar";
      setMessageText(
        `🤰 *ASHA Health Reminder - Antenatal Care (ANC) Visit*\n\n` +
        `Namaskar ${benName} ji,\n\n` +
        `Your *${weeks} Weeks* Antenatal Care checkup is due at the Primary Health Centre.\n\n` +
        `⚠️ *Important checkups needed:*\n` +
        `• Blood Pressure & Weight monitoring\n` +
        `• Hemoglobin (Hb) blood test & IFA tablets\n` +
        `• Td Booster injection\n\n` +
        `If you have severe headaches, swelling on feet, or abdominal pain, please notify your ASHA worker immediately or call *108 Ambulance*.\n\n` +
        `_Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)_`
      );
    } else if (templateType === 'NUTRITION') {
      const childName = activeBen?.name || "Child";
      const awc = activeBen?.anganwadiCenter || "Anganwadi Center 12";
      setMessageText(
        `🥣 *Anganwadi Nutrition & Ration Notification*\n\n` +
        `Namaskar,\n\n` +
        `Supplementary nutrition (Take Home Ration - THR / Balbhog) is ready for collection at *${awc}* for *${childName}*.\n\n` +
        `⚖️ *Services this week:*\n` +
        `• Monthly weight and height growth measurement\n` +
        `• Energy-dense fortified nutrition ration distribution\n` +
        `• Early childhood learning activities\n\n` +
        `Please visit the Anganwadi between 9:30 AM and 1:30 PM.\n` +
        `_Integrated Child Development Services (ICDS)_`
      );
    } else if (templateType === 'VHND_CAMP') {
      const village = activeBen?.village || "Navghar Pada";
      setMessageText(
        `🩺 *Village Health, Sanitation & Nutrition Day (VHND) Camp*\n\n` +
        `Dear Community Members of *${village}*,\n\n` +
        `A free Health & Nutrition Camp will be held tomorrow at the Anganwadi Center:\n` +
        `⏰ *Time:* 9:00 AM to 1:00 PM\n\n` +
        `🩺 *Free Services Provided:*\n` +
        `• Routine Child Immunization\n` +
        `• Pregnant Mother ANC Checkups & Hemoglobin Tests\n` +
        `• Free IFA Tablets & Calcium Supplements\n` +
        `• Growth monitoring for all children under 5 years\n\n` +
        `All mothers, pregnant women, and children are requested to attend.\n` +
        `_National Health Mission & Anganwadi Services_`
      );
    }
  }, [templateType, selectedBenId]);

  // Clean phone number for WhatsApp API
  const getCleanPhoneNumber = (raw) => {
    let digits = (raw || '').replace(/\D/g, '');
    // If it's a 10 digit Indian number without country code, prefix with 91
    if (digits.length === 10) {
      digits = '91' + digits;
    }
    return digits;
  };

  const handleSendWhatsApp = () => {
    const cleanNumber = getCleanPhoneNumber(customPhone);
    const encodedMessage = encodeURIComponent(messageText);
    
    // Create direct WhatsApp Web / WhatsApp App click-to-chat URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
    }, 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center font-bold shadow-2xs">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>WhatsApp Health Messenger</span>
                <span className="text-[10px] font-bold bg-[#25D366]/20 text-[#075E54] px-2 py-0.5 rounded-full">
                  Direct API Connected
                </span>
              </h3>
              <p className="text-xs text-slate-500">Send real-time immunization alerts, ANC reminders & health updates</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          
          {/* Recipient Selection & Phone Number Input */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Beneficiary</label>
                <select
                  value={selectedBenId}
                  onChange={(e) => setSelectedBenId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.phone}) · {b.village}
                    </option>
                  ))}
                  <option value="custom">+ Custom Mobile Number</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Recipient WhatsApp Mobile:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210 (or enter your own number)"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-[#25D366]/30"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Tip: You can change this to your own mobile number to test live WhatsApp delivery!
                </span>
              </div>
            </div>
          </div>

          {/* Template Category Pills */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Choose Health Alert Template:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'IMMUNIZATION', label: '💉 Vaccine Due' },
                { id: 'ANC_CHECK', label: '🤰 ANC Pregnancy' },
                { id: 'NUTRITION', label: '🥣 Anganwadi THR' },
                { id: 'VHND_CAMP', label: '🩺 VHND Camp' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateType(t.id)}
                  className={`p-2 rounded-xl border text-center font-bold transition text-[11px] ${
                    templateType === t.id 
                      ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-2xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live WhatsApp Message Preview Container */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Editable Message Preview:</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[#128C7E] hover:text-[#075E54] font-bold text-[11px] flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>

            {/* WhatsApp Bubble Design */}
            <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-slate-300 shadow-inner relative">
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-xs border border-slate-200/60 max-w-full">
                <textarea
                  rows="7"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-transparent resize-y focus:outline-none font-sans leading-relaxed"
                />
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp Web / App has been launched with the pre-filled message!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 text-center sm:text-left">
              Directly opens WhatsApp Web on desktop or WhatsApp App on phone.
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-5 py-2 text-xs font-extrabold rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white transition flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/30 hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp Now</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
