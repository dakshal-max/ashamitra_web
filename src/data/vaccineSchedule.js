export const VACCINE_SCHEDULE = [
  {
    id: "bcg",
    name: "BCG",
    disease: "Tuberculosis",
    recommendedAgeWeeks: 0,
    timingLabel: "At Birth (or up to 1 year)",
    dose: "0.05 ml (0.1ml if >1mo)",
    route: "Intra-dermal, Left Upper Arm"
  },
  {
    id: "opv_0",
    name: "OPV 0",
    disease: "Poliomyelitis",
    recommendedAgeWeeks: 0,
    timingLabel: "At Birth (within 15 days)",
    dose: "2 drops",
    route: "Oral"
  },
  {
    id: "hepb_birth",
    name: "Hepatitis B (Birth)",
    disease: "Hepatitis B",
    recommendedAgeWeeks: 0,
    timingLabel: "At Birth (within 24 hours)",
    dose: "0.5 ml",
    route: "Intra-muscular, Anterolateral mid-thigh"
  },
  {
    id: "penta_1",
    name: "Pentavalent 1",
    disease: "Diphtheria, Pertussis, Tetanus, Hep B, Hib",
    recommendedAgeWeeks: 6,
    timingLabel: "6 Weeks",
    dose: "0.5 ml",
    route: "Intra-muscular, Left Mid-thigh"
  },
  {
    id: "opv_1",
    name: "OPV 1",
    disease: "Polio",
    recommendedAgeWeeks: 6,
    timingLabel: "6 Weeks",
    dose: "2 drops",
    route: "Oral"
  },
  {
    id: "rota_1",
    name: "Rotavirus 1",
    disease: "Rotavirus Diarrhea",
    recommendedAgeWeeks: 6,
    timingLabel: "6 Weeks",
    dose: "5 drops / 2.5 ml",
    route: "Oral"
  },
  {
    id: "pcv_1",
    name: "PCV 1",
    disease: "Pneumococcal Disease",
    recommendedAgeWeeks: 6,
    timingLabel: "6 Weeks",
    dose: "0.5 ml",
    route: "Intra-muscular, Right Mid-thigh"
  },
  {
    id: "penta_2",
    name: "Pentavalent 2",
    disease: "Diphtheria, Pertussis, Tetanus, Hep B, Hib",
    recommendedAgeWeeks: 10,
    timingLabel: "10 Weeks",
    dose: "0.5 ml",
    route: "Intra-muscular, Left Mid-thigh"
  },
  {
    id: "opv_2",
    name: "OPV 2",
    disease: "Polio",
    recommendedAgeWeeks: 10,
    timingLabel: "10 Weeks",
    dose: "2 drops",
    route: "Oral"
  },
  {
    id: "rota_2",
    name: "Rotavirus 2",
    disease: "Rotavirus Diarrhea",
    recommendedAgeWeeks: 10,
    timingLabel: "10 Weeks",
    dose: "5 drops",
    route: "Oral"
  },
  {
    id: "penta_3",
    name: "Pentavalent 3",
    disease: "Diphtheria, Pertussis, Tetanus, Hep B, Hib",
    recommendedAgeWeeks: 14,
    timingLabel: "14 Weeks",
    dose: "0.5 ml",
    route: "Intra-muscular, Left Mid-thigh"
  },
  {
    id: "opv_3",
    name: "OPV 3",
    disease: "Polio",
    recommendedAgeWeeks: 14,
    timingLabel: "14 Weeks",
    dose: "2 drops",
    route: "Oral"
  },
  {
    id: "rota_3",
    name: "Rotavirus 3",
    disease: "Rotavirus Diarrhea",
    recommendedAgeWeeks: 14,
    timingLabel: "14 Weeks",
    dose: "5 drops",
    route: "Oral"
  },
  {
    id: "pcv_2",
    name: "PCV 2",
    disease: "Pneumococcal Disease",
    recommendedAgeWeeks: 14,
    timingLabel: "14 Weeks",
    dose: "0.5 ml",
    route: "Intra-muscular, Right Mid-thigh"
  },
  {
    id: "mr_1",
    name: "MR 1 (Measles-Rubella)",
    disease: "Measles & Rubella",
    recommendedAgeWeeks: 39, // 9 months
    timingLabel: "9-12 Months",
    dose: "0.5 ml",
    route: "Sub-cutaneous, Right Upper Arm"
  },
  {
    id: "pcv_booster",
    name: "PCV Booster",
    disease: "Pneumococcal Disease",
    recommendedAgeWeeks: 39,
    timingLabel: "9 Months",
    dose: "0.5 ml",
    route: "Intra-muscular, Right Mid-thigh"
  },
  {
    id: "vita_1",
    name: "Vitamin A (Dose 1)",
    disease: "Night Blindness / Immunity",
    recommendedAgeWeeks: 39,
    timingLabel: "9 Months",
    dose: "1 ml (1 lakh IU)",
    route: "Oral"
  },
  {
    id: "dpt_booster1",
    name: "DPT Booster 1",
    disease: "Diphtheria, Pertussis, Tetanus",
    recommendedAgeWeeks: 70, // 16-24 months
    timingLabel: "16-24 Months",
    dose: "0.5 ml",
    route: "Intra-muscular, Left Mid-thigh"
  },
  {
    id: "mr_2",
    name: "MR 2 (Measles-Rubella)",
    disease: "Measles & Rubella",
    recommendedAgeWeeks: 70,
    timingLabel: "16-24 Months",
    dose: "0.5 ml",
    route: "Sub-cutaneous, Right Upper Arm"
  },
  {
    id: "dpt_booster2",
    name: "DPT Booster 2",
    disease: "Diphtheria, Pertussis, Tetanus",
    recommendedAgeWeeks: 260, // 5-6 years
    timingLabel: "5-6 Years",
    dose: "0.5 ml",
    route: "Intra-muscular, Upper Arm"
  }
];

// Simplified WHO Child Growth Standards (Weight in kg for Age in months)
// Boys & Girls median, -2SD (MAM), -3SD (SAM)
export const WHO_GROWTH_STANDARDS = {
  boys: {
    0:  { median: 3.3, m2sd: 2.5, m3sd: 2.1, heightMedian: 49.9 },
    3:  { median: 6.4, m2sd: 5.0, m3sd: 4.4, heightMedian: 61.4 },
    6:  { median: 7.9, m2sd: 6.4, m3sd: 5.7, heightMedian: 67.6 },
    9:  { median: 8.9, m2sd: 7.1, m3sd: 6.4, heightMedian: 72.0 },
    12: { median: 9.6, m2sd: 7.7, m3sd: 6.9, heightMedian: 75.7 },
    18: { median: 10.9, m2sd: 8.8, m3sd: 7.9, heightMedian: 82.3 },
    24: { median: 12.2, m2sd: 9.7, m3sd: 8.6, heightMedian: 87.8 },
    36: { median: 14.3, m2sd: 11.3, m3sd: 10.0, heightMedian: 96.1 },
    48: { median: 16.3, m2sd: 12.7, m3sd: 11.2, heightMedian: 103.3 },
    60: { median: 18.3, m2sd: 14.1, m3sd: 12.4, heightMedian: 110.0 }
  },
  girls: {
    0:  { median: 3.2, m2sd: 2.4, m3sd: 2.0, heightMedian: 49.1 },
    3:  { median: 5.8, m2sd: 4.5, m3sd: 4.0, heightMedian: 59.8 },
    6:  { median: 7.3, m2sd: 5.7, m3sd: 5.1, heightMedian: 65.7 },
    9:  { median: 8.2, m2sd: 6.5, m3sd: 5.8, heightMedian: 70.1 },
    12: { median: 8.9, m2sd: 7.0, m3sd: 6.3, heightMedian: 74.0 },
    18: { median: 10.2, m2sd: 8.1, m3sd: 7.2, heightMedian: 80.7 },
    24: { median: 11.5, m2sd: 9.0, m3sd: 8.1, heightMedian: 86.4 },
    36: { median: 13.9, m2sd: 10.8, m3sd: 9.6, heightMedian: 95.1 },
    48: { median: 16.1, m2sd: 12.3, m3sd: 10.9, heightMedian: 102.7 },
    60: { median: 18.2, m2sd: 13.7, m3sd: 12.1, heightMedian: 109.4 }
  }
};
