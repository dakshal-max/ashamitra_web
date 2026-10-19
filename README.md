# 🌿 AshaMitra (आशा मित्र)

> **Frontline Community Healthcare Assistant & Clinical Decision Support System (CDSS)**  
> *Aligned with the National Health Mission (NHM) and the Ministry of Women and Child Development (WCD / ICDS / Poshan Abhiyaan)*

---

## 📖 Overview

**AshaMitra** is a digital clinical decision-support and workflow optimization platform purpose-built for frontline community health workers in India:
* **ASHA Workers (Accredited Social Health Activists)**: Maternal care, Antenatal Care (ANC 1–4), High-Risk Pregnancy (HRP) identification, postnatal home visits (HBNC), immunization mobilization, and PHC doctor referrals.
* **Anganwadi Workers (AWW)**: Early childhood development (0–6 years), supplementary nutrition (Take Home Ration - THR / Balbhog), monthly growth monitoring with WHO standard z-scores, and Severe Acute Malnutrition (SAM) triage.
* **Primary Health Centre (PHC) Medical Officers & Supervisors**: Real-time review of field referrals, doctor feedback loop closure, high-risk case oversight, and automated Monthly Progress Report (MPR) generation.

---

## ✨ Key Features & Capabilities

### 1. 📋 Unified Beneficiary Management & Single Health Dossier
- Master registry for **Pregnant Women**, **Lactating Mothers**, **Infants (0–1y)**, **Children (1–5y)**, and **Adolescent Girls**.
- Instant search by Name, RCH ID, Phone Number, or Village/Ward.
- Real-time filtering by clinical risk category (High Risk vs. Normal).
- Single-view digital dossier with vitals history, ANC milestones, vaccination records, and quick-edit functionality.

### 2. 🤰 Maternal & Child Health (MCH) Clinical Decision Support
- **Automated High-Risk Pregnancy (HRP) Triage**: Evaluates Systolic/Diastolic BP (identifying Pre-eclampsia $\ge 140/90\text{ mmHg}$), Severe Anemia ($\text{Hb} < 7.0\text{ g/dL}$), previous C-sections, and 7 obstetric danger signs.
- **Protocol Recommendations**: Suggests immediate clinical actions (e.g. double-dose IFA, Calcium, Td booster, IV Iron Sucrose referral).
- **Mandatory 4 ANC Visits Roadmap**: Guided visit tracker with nutritional supplements distribution.
- **Interactive EDD & Gestational Calculator**: Automatic calculation based on Last Menstrual Period (LMP) using Naegele's rule.
- **PNC & Home-Based Newborn Care (HBNC)**: Guided checklist for Day 1, 3, 7, 14, 21, 28, and 42 home visits.

### 3. 💉 Universal Immunization Schedule (NIS) Tracker
- Pre-loaded with all 14 National Immunization Schedule vaccines (BCG, OPV, Hep-B, Pentavalent, Rotavirus, PCV, fIPV, MR, Vit-A, DPT boosters, Td).
- Real-time calculation of **Overdue Doses (>4 weeks)**, **Due Today**, and **Upcoming Vaccines** based on child's Date of Birth.
- 1-Click vaccination recording with batch logging and celebration confetti.
- **Digital Mother & Child Protection (MCP) Card** with printable view.

### 4. ⚖️ Anganwadi Child Growth & Nutrition Suite (WHO Standards)
- Anthropometry inputs: Age (Months), Gender, Weight (kg), Height (cm), and Mid-Upper Arm Circumference (MUAC in cm).
- Real-time WHO Standard classification:
  - 🔴 **SAM (Severe Acute Malnutrition)**: $\text{MUAC} < 11.5\text{ cm}$ or Weight $< -3\text{ SD}$.
  - 🟡 **MAM (Moderate Acute Malnutrition)**: $\text{MUAC } 11.5\text{--}12.5\text{ cm}$ or Weight $< -2\text{ SD}$.
  - 🟢 **Normal Healthy Growth**.
- **Interactive SVG WHO Weight-for-Age Growth Curve**: Dynamic visual plot of child's coordinates against Median, -2 SD, and -3 SD curves.
- Supplementary Nutrition (Take Home Ration / THR) distribution tracker and instant **NRC (Nutrition Rehabilitation Centre)** referral generator.

### 5. ⚡ Decision Support Queue & Priority Visit Engine
- Calculates a dynamic **Clinical Urgency Score (1 to 100)** for all pending home visits.
- Automatically prioritizes critical emergencies (pre-eclampsia, severe anemia, SAM children) to the top of the morning field visit queue.
- 1-click visit resolution, rescheduling, or doctor escalation.

### 6. 🏥 PHC Referral & Doctor Communication Hub
- Frontline workers transmit digital referral slips with pre-filled vital signs, danger signs, and ambulance coordination (108 Emergency Ambulance / 102 Vahan).
- Medical Officers review referrals, prescribe medication (e.g. IV Iron Sucrose, Tab Labetalol, F-75 formula), and send feedback to close the loop.

### 7. 📲 Direct WhatsApp Health Messaging
- Integrated with the **WhatsApp Click-to-Chat API** (`https://api.whatsapp.com/send?phone=...&text=...`).
- Pre-formatted clinical templates:
  - 💉 **Vaccine Due Alerts** with MCP card reminder.
  - 🤰 **High-Risk ANC Reminders** with BP & emergency advice.
  - 🥣 **Anganwadi Nutrition / THR Ration Collection Notices**.
  - 🩺 **Village Health, Sanitation & Nutrition Day (VHND) Camp Invitations**.
  - ✍️ **Custom Messages** with live WhatsApp chat bubble preview.
- Supports any 10-digit Indian mobile number (auto-prefixed with +91) or international format.

### 8. 🌐 Trilingual Support & Offline Capabilities
- **Instant Language Switcher**: **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.
- **Offline Mode Simulation**: Full `localStorage` persistence when working in low-connectivity areas, with a 1-click cloud sync button.
- **Hands-Free Voice Assistant**: Speech-to-text dictation using the Web Speech API with sample multilingual clinical prompts.
- **Monthly Progress Report (MPR) Exporter**: Official ICDS/NHM sector progress reports with print-friendly layout and CSV download.

### 9. 📊 Primary Research Survey Module (Slide 7)
- Interactive field survey measuring paperwork workload, physical register count, and digital readiness.
- Dynamic SVG charts demonstrating the reduction of manual documentation time from 4.5 hours/day to under 1 hour/day.

---

## 🖥️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 8](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Typography**: Plus Jakarta Sans & Noto Sans Devanagari
* **Visuals & Charts**: Custom Responsive SVG Growth Curves & Bar Charts
* **Effects**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0 or higher)
* [npm](https://www.npmjs.com/)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/dakshal-max/ashamitra_web.git

# 2. Navigate to project directory
cd ashamitra_web

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

The application will launch at:  
👉 **`http://localhost:3000`**

### Build for Production

```bash
# Compile and bundle assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
ashamitra_web/
├── index.html                 # App entry HTML & fonts
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite & Tailwind configuration
├── README.md                  # Project documentation
├── public/                    # Static assets
└── src/
    ├── main.jsx               # React DOM entry point
    ├── App.jsx                # Core application container
    ├── index.css              # Tailwind CSS styles
    ├── data/
    │   ├── decisionEngine.js  # Clinical CDSS rules & urgency scoring
    │   ├── vaccineSchedule.js # NIS immunization & WHO growth standards
    │   ├── translations.js    # English, Hindi, Marathi dictionaries
    │   └── initialData.js     # Realistic sample data & slide metadata
    └── components/
        ├── Navbar.jsx               # Navigation bar & role switcher
        ├── Dashboard.jsx            # KPI command center & alert banners
        ├── BeneficiaryManager.jsx   # Master beneficiary dossier & CRUD
        ├── MaternalChildCare.jsx    # ANC/PNC tracker & HRP triage
        ├── ImmunizationTracker.jsx  # NIS schedule & MCP card
        ├── GrowthMonitoring.jsx     # WHO growth curve & malnutrition
        ├── FollowUpManager.jsx      # Priority decision support queue
        ├── ReferralHub.jsx          # PHC doctor communication hub
        ├── SurveyModule.jsx         # Slide 7 primary research survey
        ├── PresentationSlidesView.jsx # 9-slide companion guide
        ├── WhatsAppSenderModal.jsx  # WhatsApp messaging integration
        ├── NewBeneficiaryModal.jsx  # Registration modal
        ├── VoiceNoteModal.jsx       # Hands-free speech-to-text modal
        └── ReportsModal.jsx         # Monthly Progress Report (MPR) exporter
```

---

## 📜 Alignment with Research Presentation
This system is an implementation of the 9-slide research study **`ASHA_Anganwadi_Digital_Decision_Support_9_Slides_Final.pptx`**, bridging the gap between passive digital data entry and proactive frontline clinical decision support.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
