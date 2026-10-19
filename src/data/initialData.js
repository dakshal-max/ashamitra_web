export const INITIAL_BENEFICIARIES = [
  {
    id: "BEN-001",
    name: "Kavita Ramesh Sharma",
    age: 23,
    type: "PREGNANT_WOMAN",
    rchId: "MH-THN-984210",
    phone: "+91 98231 44512",
    husbandName: "Ramesh Sharma",
    village: "Navghar Pada",
    ward: "Ward 4",
    anganwadiCenter: "AWC-12 (Navghar East)",
    lmp: "2026-03-15",
    edd: "2026-12-20",
    gestationalWeeks: 31,
    parity: 2,
    gravida: 2,
    hb: 6.8, // Severe anemia
    systolicBp: 146, // Pre-eclampsia
    diastolicBp: 96,
    weightKg: 51,
    dangerSigns: ["Severe headache", "Pedal edema", "Extreme fatigue"],
    previousCesarean: false,
    ancVisits: [
      { visit: "ANC 1", date: "2026-05-10", hb: 8.5, bp: "124/82", weight: 46, status: "Done" },
      { visit: "ANC 2", date: "2026-07-14", hb: 7.4, bp: "134/88", weight: 48, status: "Done" },
      { visit: "ANC 3", date: "2026-09-22", hb: 6.8, bp: "146/96", weight: 51, status: "Urgent Flagged" }
    ],
    ifaDistributed: 100,
    calciumDistributed: 60,
    tdVaccineGiven: 2,
    status: "Active",
    registeredDate: "2026-04-12"
  },
  {
    id: "BEN-002",
    name: "Aarav Santosh Gaikwad",
    ageMonths: 9,
    gender: "male",
    type: "CHILD",
    rchId: "MH-THN-882103",
    motherName: "Sunita Gaikwad",
    fatherName: "Santosh Gaikwad",
    phone: "+91 97654 32189",
    village: "Koliwada",
    ward: "Ward 2",
    anganwadiCenter: "AWC-04 (Koliwada Jetty)",
    dob: "2026-01-14",
    weightKg: 5.8, // WHO SAM cutoff for 9mo boy is < 6.4kg
    heightCm: 68.2,
    muacCm: 11.1, // < 11.5 cm is SAM (Red)
    oedema: false,
    feedingStatus: "Complementary feeding started, low appetite",
    preschoolAttending: false,
    thrReceived: true,
    vaccinesGiven: ["bcg", "opv_0", "hepb_birth", "penta_1", "opv_1", "rota_1", "pcv_1"],
    status: "Active",
    registeredDate: "2026-01-16"
  },
  {
    id: "BEN-003",
    name: "Anjali Sachin Patil",
    age: 25,
    type: "PREGNANT_WOMAN",
    rchId: "MH-THN-912440",
    phone: "+91 99887 12345",
    husbandName: "Sachin Patil",
    village: "Talav Pada",
    ward: "Ward 1",
    anganwadiCenter: "AWC-01 (Talav Chowk)",
    lmp: "2026-06-10",
    edd: "2027-03-17",
    gestationalWeeks: 19,
    parity: 1,
    gravida: 1,
    hb: 11.2,
    systolicBp: 118,
    diastolicBp: 76,
    weightKg: 55,
    dangerSigns: [],
    previousCesarean: false,
    ancVisits: [
      { visit: "ANC 1", date: "2026-08-05", hb: 11.4, bp: "116/74", weight: 53, status: "Done" }
    ],
    ifaDistributed: 60,
    calciumDistributed: 30,
    tdVaccineGiven: 1,
    status: "Active",
    registeredDate: "2026-07-20"
  },
  {
    id: "BEN-004",
    name: "Diya Nilesh Rathod",
    ageMonths: 6,
    gender: "female",
    type: "INFANT",
    rchId: "MH-THN-773194",
    motherName: "Lata Rathod",
    fatherName: "Nilesh Rathod",
    phone: "+91 91234 56780",
    village: "Navghar Pada",
    ward: "Ward 4",
    anganwadiCenter: "AWC-12 (Navghar East)",
    dob: "2026-04-18",
    weightKg: 5.6, // MAM range for 6mo girl
    heightCm: 63.5,
    muacCm: 12.1, // Yellow (MAM)
    oedema: false,
    feedingStatus: "Exclusive breastfeeding ending, initiating mash",
    preschoolAttending: false,
    thrReceived: true,
    vaccinesGiven: ["bcg", "opv_0", "hepb_birth", "penta_1", "opv_1", "rota_1"],
    status: "Active",
    registeredDate: "2026-04-20"
  },
  {
    id: "BEN-005",
    name: "Priyanka Manoj Kadam",
    age: 27,
    type: "LACTATING_MOTHER",
    rchId: "MH-THN-664812",
    phone: "+91 93214 78901",
    husbandName: "Manoj Kadam",
    village: "Bunder Road",
    ward: "Ward 3",
    anganwadiCenter: "AWC-08 (Bunder)",
    deliveryDate: "2026-10-06",
    deliveryPlace: "Navghar PHC (Institutional)",
    deliveryType: "Normal Vaginal",
    childName: "Baby of Priyanka",
    childDob: "2026-10-06",
    childGender: "male",
    birthWeight: 2.9,
    hb: 10.4,
    pncVisits: [
      { visit: "PNC 1 (Day 1)", date: "2026-10-06", status: "Done", notes: "Breastfeeding initiated within 1hr" },
      { visit: "PNC 2 (Day 3)", date: "2026-10-09", status: "Done", notes: "Umbilical stump clean" },
      { visit: "PNC 3 (Day 7)", date: "2026-10-13", status: "Done", notes: "Baby weight 2.85kg, healthy" }
    ],
    status: "Active",
    registeredDate: "2026-02-14"
  },
  {
    id: "BEN-006",
    name: "Radha Dilip More",
    age: 15,
    type: "ADOLESCENT_GIRL",
    rchId: "MH-THN-554109",
    phone: "+91 94051 88321",
    guardianName: "Dilip More",
    village: "Talav Pada",
    ward: "Ward 1",
    anganwadiCenter: "AWC-01 (Talav Chowk)",
    schoolStatus: "Attending Zilla Parishad High School",
    hb: 10.1, // Mild anemia
    ifaTabletsGiven: "Weekly WIFS scheme",
    menstrualHygieneCounseling: true,
    bmi: 17.2,
    status: "Active",
    registeredDate: "2026-05-18"
  },
  {
    id: "BEN-007",
    name: "Rohan Vinod Jadhav",
    ageMonths: 14,
    gender: "male",
    type: "CHILD",
    rchId: "MH-THN-449811",
    motherName: "Pooja Jadhav",
    fatherName: "Vinod Jadhav",
    phone: "+91 98112 34567",
    village: "Koliwada",
    ward: "Ward 2",
    anganwadiCenter: "AWC-04 (Koliwada Jetty)",
    dob: "2025-08-12",
    weightKg: 10.2, // Normal
    heightCm: 79.5,
    muacCm: 14.2, // Green
    oedema: false,
    feedingStatus: "Family food + Anganwadi hot meal",
    preschoolAttending: true,
    thrReceived: true,
    vaccinesGiven: ["bcg", "opv_0", "hepb_birth", "penta_1", "opv_1", "rota_1", "pcv_1", "penta_2", "opv_2", "rota_2", "penta_3", "opv_3", "rota_3", "pcv_2", "mr_1", "pcv_booster", "vita_1"],
    status: "Active",
    registeredDate: "2025-08-15"
  }
];

export const INITIAL_TASKS = [
  {
    id: "TSK-101",
    beneficiaryId: "BEN-001",
    beneficiaryName: "Kavita Sharma",
    type: "ANC_CHECK",
    priority: "CRITICAL",
    priorityScore: 98,
    riskLevel: "HIGH",
    reason: "Pre-eclampsia (BP 146/96) & Severe Anemia (Hb 6.8). Follow up on PHC Referral.",
    scheduledDate: "2026-10-20", // Today
    assignedTo: "Sunita Devi (ASHA)",
    status: "Pending",
    category: "Maternal Health"
  },
  {
    id: "TSK-102",
    beneficiaryId: "BEN-002",
    beneficiaryName: "Aarav Gaikwad (9mo)",
    type: "GROWTH_MONITORING",
    priority: "CRITICAL",
    priorityScore: 92,
    riskLevel: "HIGH",
    category: "SAM",
    reason: "Severe Acute Malnutrition (MUAC 11.1 cm, Wt 5.8kg). Verify NRC admission & RUTF intake.",
    scheduledDate: "2026-10-20",
    assignedTo: "Rekha Patil (Anganwadi Worker)",
    status: "Pending"
  },
  {
    id: "TSK-103",
    beneficiaryId: "BEN-004",
    beneficiaryName: "Diya Rathod (6mo)",
    type: "IMMUNIZATION",
    priority: "HIGH",
    priorityScore: 84,
    riskLevel: "MODERATE",
    isOverdue: true,
    reason: "Pentavalent 2 & 3, PCV 1 are overdue. Mobilize mother for Wednesday RI session.",
    scheduledDate: "2026-10-21",
    assignedTo: "Sunita Devi (ASHA)",
    status: "Pending",
    category: "Immunization"
  },
  {
    id: "TSK-104",
    beneficiaryId: "BEN-005",
    beneficiaryName: "Priyanka Kadam",
    type: "PNC_CHECK",
    priority: "MEDIUM",
    priorityScore: 68,
    riskLevel: "NORMAL",
    reason: "PNC Day 14 Home Visit. Check umbilical cord, neonatal jaundice & maternal nutrition.",
    scheduledDate: "2026-10-20",
    assignedTo: "Sunita Devi (ASHA)",
    status: "Pending",
    category: "Postnatal Care"
  },
  {
    id: "TSK-105",
    beneficiaryId: "BEN-003",
    beneficiaryName: "Anjali Sachin Patil",
    type: "ANC_CHECK",
    priority: "MEDIUM",
    priorityScore: 55,
    riskLevel: "NORMAL",
    reason: "Second Trimester Routine ANC 2 Visit & Ultrasound scan verification.",
    scheduledDate: "2026-10-23",
    assignedTo: "Sunita Devi (ASHA)",
    status: "Scheduled",
    category: "Maternal Health"
  }
];

export const INITIAL_REFERRALS = [
  {
    id: "REF-2026-081",
    beneficiaryId: "BEN-001",
    beneficiaryName: "Kavita Ramesh Sharma",
    age: 23,
    referredBy: "Sunita Devi (ASHA - Ward 4)",
    referredTo: "Navghar Primary Health Centre (PHC)",
    doctorName: "Dr. Arvind Sharma (Medical Officer)",
    referralDate: "2026-10-18",
    urgency: "Emergency (Immediate)",
    vitalsSummary: "BP: 146/96 mmHg, Hb: 6.8 g/dL, Gestation: 31 Weeks",
    reason: "Suspected Pre-eclampsia with Severe Nutritional Anemia & bilateral pitting pedal edema.",
    doctorStatus: "Doctor Accepted",
    doctorNotes: "Patient examined at PHC. 200mg IV Iron Sucrose started. Tab Labetalol 100mg prescribed. Next review in 3 days. FRU standby arranged.",
    transportArranged: "108 Ambulance",
    loopClosed: true
  },
  {
    id: "REF-2026-082",
    beneficiaryId: "BEN-002",
    beneficiaryName: "Aarav Santosh Gaikwad",
    age: "9 Months",
    referredBy: "Rekha Patil (Anganwadi Worker)",
    referredTo: "Sub-District Hospital NRC (Nutrition Rehabilitation Centre)",
    doctorName: "Dr. Meera Chitnis (Pediatrician)",
    referralDate: "2026-10-17",
    urgency: "Urgent (Within 24 Hours)",
    vitalsSummary: "Wt: 5.8 kg, MUAC: 11.1 cm, App: Poor, No edema",
    reason: "Severe Acute Malnutrition (SAM) with failed appetite test. Weight stagnation over 2 months.",
    doctorStatus: "Admitted to NRC",
    doctorNotes: "Admitted to NRC Ward Bed 4. F-75 therapeutic formula initiated. Mother receiving counseling on infant feeding.",
    transportArranged: "Family Private / Auto",
    loopClosed: true
  }
];

export const INITIAL_SURVEY_RESPONSES = [
  {
    id: "SRV-01",
    respondentType: "ASHA Worker",
    name: "Sunita D.",
    experienceYears: 7,
    dailyPaperworkHours: 4.5,
    registersMaintained: 12,
    biggestPainPoint: "Repeatedly writing the same mother and child details in 4 different physical registers",
    digitalToolUsed: "Basic Smartphone, WhatsApp, Poshan Tracker (partial)",
    comfortWithTech: 3,
    mostWantedFeature: "Automated due date alerts for pending vaccinations and high-risk pregnancy visits",
    offlineNeed: "Crucial, network drops often in inland padas",
    date: "2026-10-12"
  },
  {
    id: "SRV-02",
    respondentType: "Anganwadi Worker",
    name: "Rekha P.",
    experienceYears: 11,
    dailyPaperworkHours: 3.8,
    registersMaintained: 15,
    biggestPainPoint: "Manually calculating WHO growth charts and z-scores for 60 children each month",
    digitalToolUsed: "Poshan Tracker App",
    comfortWithTech: 4,
    mostWantedFeature: "Instant SAM/MAM color categorization and printable Monthly Progress Report (MPR)",
    offlineNeed: "Very important, AWC center has weak 4G",
    date: "2026-10-14"
  },
  {
    id: "SRV-03",
    respondentType: "Medical Officer / PHC Doctor",
    name: "Dr. Arvind S.",
    experienceYears: 5,
    dailyPaperworkHours: 2.5,
    registersMaintained: 8,
    biggestPainPoint: "Late notification of high-risk pregnant women arriving only at active labor in emergency",
    digitalToolUsed: "HMIS, RCH Portal",
    comfortWithTech: 5,
    mostWantedFeature: "Direct emergency referral push from ASHA with real-time BP/Hb vitals",
    offlineNeed: "Useful for field camps",
    date: "2026-10-15"
  },
  {
    id: "SRV-04",
    respondentType: "Parent / Community Member",
    name: "Sachin P.",
    experienceYears: 0,
    dailyPaperworkHours: 0,
    registersMaintained: 0,
    biggestPainPoint: "Forgetting child's vaccination dates and losing paper immunization card",
    digitalToolUsed: "WhatsApp, UPI",
    comfortWithTech: 4,
    mostWantedFeature: "Digital vaccination card & SMS reminder before clinic day",
    offlineNeed: "Good to have",
    date: "2026-10-16"
  }
];

export const PPT_SLIDES_METADATA = [
  {
    slideNumber: 1,
    title: "Title & Overview",
    subtitle: "Community Health · Digital Innovation",
    heading: "Digital Decision Support for ASHA & Anganwadi Workers",
    author: "Kinjal Mohan Patil (Roll no: 13, Div: C)",
    coreTheme: "A practical approach to organizing community-health information, prioritizing follow-ups and supporting frontline workers.",
    keyTakeaway: "Frontline health workers need intuitive decision tools rather than just passive data entry.",
    mappedSystemFeature: "Role-based unified workspace with instant bilingual support and decision engine."
  },
  {
    slideNumber: 2,
    title: "Community Health at the Frontline",
    subtitle: "Understanding the role of ASHA and Anganwadi workers",
    heading: "ASHA vs. Anganwadi Worker Roles",
    points: [
      "ASHA Workers: Community link to public health system, health awareness, maternal & child health, immunization mobilization, referrals, household follow-up.",
      "Anganwadi Workers: Early childhood development, nutrition services, maintaining beneficiary records, growth monitoring.",
      "Why Their Work Matters: Operating closest to families, directly influencing how quickly citizens are connected with healthcare."
    ],
    mappedSystemFeature: "Dual-Role switcher tailoring interface to ASHA (MCH + Vaccinations) or Anganwadi (Growth + Nutrition)."
  },
  {
    slideNumber: 3,
    title: "The Core Problem",
    subtitle: "Multiple responsibilities make information management difficult",
    heading: "Problem Statement",
    points: [
      "Many activities: Maternal care, child nutrition, immunization, screening, referrals.",
      "Information effort: Repeated recording & manual retrieval consumes valuable field time.",
      "Follow-up risk: Pending actions are hard to prioritize without timely automated prompts."
    ],
    mappedSystemFeature: "Unified Beneficiary Dossier and Smart Decision Support Priority Task Queue."
  },
  {
    slideNumber: 4,
    title: "Why the Challenge Happens",
    subtitle: "5 Root Causes Investigated Through Study",
    heading: "Key Factors & Root Causes",
    points: [
      "1. Manual records create heavy storage and retrieval effort.",
      "2. Repeated documentation across multiple registers.",
      "3. Scattered information across uncoordinated forms.",
      "4. Delayed communication with doctors and supervisors.",
      "5. No automated prompts highlighting missed or upcoming actions."
    ],
    mappedSystemFeature: "Automated Clinical Prompts, Doctor Referral Hub, and Integrated single data entry."
  },
  {
    slideNumber: 5,
    title: "Research Gap & Study Direction",
    subtitle: "Digital data collection exists; the opportunity is stronger decision support",
    heading: "Central Research Idea",
    points: [
      "Digital records exist, but data collected doesn't automatically translate into actionable priorities.",
      "Central question: Can better-integrated digital support help frontline workers prioritize tasks and manage follow-ups more effectively?"
    ],
    mappedSystemFeature: "Algorithmic Decision Support Engine calculating dynamic Priority Urgency Score (1-100)."
  },
  {
    slideNumber: 6,
    title: "Aim, Objectives & Research Questions",
    subtitle: "What the study investigates",
    heading: "Research Scope & Objectives",
    points: [
      "Aim: Study challenges and explore how digital decision-support tools improve frontline efficiency.",
      "Objectives: Understand duties, identify bottlenecks, assess digital tool usage, design user-friendly solution.",
      "Research Questions: How to eliminate duplicate paperwork? Can priority alerts reduce missed visits?"
    ],
    mappedSystemFeature: "System validation criteria matching all 5 research questions."
  },
  {
    slideNumber: 7,
    title: "Survey & Research Methodology",
    subtitle: "Collect evidence before finalizing proposed system",
    heading: "Primary & Secondary Data Collection",
    points: [
      "Primary Data: Structured questionnaires for ASHA, Anganwadi workers, supervisors, parents.",
      "Secondary Data: NHM guidelines, ICDS manuals, research papers, government reports.",
      "Key Areas: Workload, record keeping, follow-up difficulties, digital tools comfort, desired alerts."
    ],
    mappedSystemFeature: "Interactive Slide 7 Survey Form + Live Research Analytics Dashboard with charts."
  },
  {
    slideNumber: 8,
    title: "Proposed Solution",
    subtitle: "Community Health Worker Assistant",
    heading: "6 Pillar Architecture",
    points: [
      "1. Beneficiary Management: Store and retrieve essential beneficiary info.",
      "2. Maternal & Child Health: Track visits, observations, high-risk flags.",
      "3. Immunization: Maintain vaccination status and automated due dates.",
      "4. Screening: Record community screening and triage.",
      "5. Follow-up Manager: Present pending tasks in organized priority view.",
      "6. Alerts & Dashboard: Highlight clinical priorities and summarize progress."
    ],
    mappedSystemFeature: "Full interactive implementation of all 6 pillars in the application."
  },
  {
    slideNumber: 9,
    title: "Conclusion, Limitations & Future Scope",
    subtitle: "Building a more connected frontline workflow",
    heading: "Future Scope & Real-World Enablers",
    points: [
      "Limitations: Connectivity drops, smartphone availability, digital literacy, data privacy.",
      "Future Scope: Local-language support (Hindi/Marathi), voice-based entry, offline synchronization, predictive alerts, intelligent prioritization.",
      "Final Goal: Empower frontline workers with simple, timely digital support without replacing the human touch."
    ],
    mappedSystemFeature: "Multi-language toggle (EN/HI/MR), Offline mode simulator with local sync, Voice assistant speech-to-text, and Monthly Progress Report (MPR) exporter."
  }
];
