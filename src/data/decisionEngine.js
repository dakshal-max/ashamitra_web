import { WHO_GROWTH_STANDARDS, VACCINE_SCHEDULE } from './vaccineSchedule';

/**
 * Clinical Decision Support Engine for Frontline Health Workers
 * Aligned with National Health Mission (NHM) and ICDS Guidelines
 */

// 1. Maternal Risk Evaluation (Antenatal Care CDSS)
export function evaluateMaternalRisk(patient) {
  const flags = [];
  const recommendations = [];
  let riskScore = 0;

  const age = Number(patient.age) || 25;
  const hb = Number(patient.hb) || 11.5;
  const sysBp = Number(patient.systolicBp) || 120;
  const diaBp = Number(patient.diastolicBp) || 80;
  const dangerSigns = patient.dangerSigns || [];
  const parity = Number(patient.parity) || 1;

  // Age risk
  if (age < 18) {
    flags.push("Teenage Pregnancy (High maternal & fetal complication risk)");
    recommendations.push("Nutritional counseling & close monitoring by ANM");
    riskScore += 25;
  } else if (age >= 35) {
    flags.push("Advanced Maternal Age (Increased chromosomal & hypertensive risk)");
    recommendations.push("Doctor consultation at PHC for detailed anomaly scan");
    riskScore += 15;
  }

  // Blood Pressure / Pre-eclampsia
  if (sysBp >= 140 || diaBp >= 90) {
    flags.push(`Gestational Hypertension (${sysBp}/${diaBp} mmHg - Pre-eclampsia danger)`);
    recommendations.push("Immediate Medical Officer evaluation, urine albumin check, rest & antihypertensive protocol");
    riskScore += 40;
  }

  // Anemia classification (WHO / MoHFW)
  if (hb < 7.0) {
    flags.push(`Severe Anemia (Hb: ${hb} g/dL - Critical)`);
    recommendations.push("Immediate PHC/FRU referral for IV Iron Sucrose or blood transfusion");
    riskScore += 45;
  } else if (hb < 10.0) {
    flags.push(`Moderate Anemia (Hb: ${hb} g/dL)`);
    recommendations.push("Double dose Iron-Folic Acid (IFA) tablets daily + dietary iron counseling");
    riskScore += 20;
  }

  // High parity
  if (parity >= 4) {
    flags.push("Grand Multipara (Parity >= 4, postpartum hemorrhage risk)");
    recommendations.push("Plan institutional delivery at Community Health Centre (CHC) or District Hospital");
    riskScore += 15;
  }

  // Danger signs (Bleeding, severe edema, convulsions, etc.)
  if (dangerSigns.length > 0) {
    dangerSigns.forEach(sign => {
      flags.push(`Obstetric Danger Sign: ${sign}`);
      riskScore += 35;
    });
    recommendations.push("IMMEDIATE EMERGENCY REFERRAL TO FRU/DISTRICT HOSPITAL");
  }

  // Previous obstetric history
  if (patient.previousCesarean) {
    flags.push("Previous C-Section (Trial of labor/uterine rupture risk)");
    recommendations.push("Must deliver in well-equipped facility with 24x7 C-section facility");
    riskScore += 15;
  }

  let riskLevel = "NORMAL";
  let referralUrgency = "NONE";

  if (riskScore >= 40 || dangerSigns.length > 0) {
    riskLevel = "HIGH";
    referralUrgency = dangerSigns.length > 0 ? "EMERGENCY" : "WITHIN_24_HOURS";
  } else if (riskScore >= 20) {
    riskLevel = "MODERATE";
    referralUrgency = "ROUTINE_PHC";
  }

  return {
    riskLevel,
    riskScore,
    flags,
    recommendations,
    referralUrgency
  };
}

// 2. Child Growth & Nutrition Classification (WHO / ICDS standards)
export function evaluateChildNutrition(child) {
  const gender = (child.gender || "boys").toLowerCase().startsWith("f") ? "girls" : "boys";
  const ageMonths = Number(child.ageMonths) || 12;
  const weightKg = Number(child.weightKg) || 8.5;
  const heightCm = Number(child.heightCm) || 75;
  const muacCm = Number(child.muacCm) || 13.5;

  const standards = WHO_GROWTH_STANDARDS[gender];
  
  // Find nearest age bracket for comparison
  const ageBrackets = Object.keys(standards).map(Number).sort((a,b) => a-b);
  let closestAge = ageBrackets[0];
  let minDiff = 999;
  for (const b of ageBrackets) {
    if (Math.abs(b - ageMonths) < minDiff) {
      minDiff = Math.abs(b - ageMonths);
      closestAge = b;
    }
  }

  const ref = standards[closestAge];
  const flags = [];
  const interventions = [];

  // Weight-for-Age classification
  let wazStatus = "Normal Weight";
  if (weightKg < ref.m3sd) {
    wazStatus = "Severely Underweight (< -3 SD)";
    flags.push("Severely Underweight by WHO Standards");
  } else if (weightKg < ref.m2sd) {
    wazStatus = "Moderately Underweight (< -2 SD)";
    flags.push("Moderately Underweight");
  }

  // MUAC (Mid-Upper Arm Circumference) for 6 - 59 months
  let muacStatus = "Green (Normal: > 12.5 cm)";
  let samCategory = "NORMAL";

  if (ageMonths >= 6) {
    if (muacCm < 11.5) {
      muacStatus = "Red (SAM - Severe Acute Malnutrition: < 11.5 cm)";
      samCategory = "SAM";
      flags.push("CRITICAL: Severe Acute Malnutrition (MUAC < 11.5 cm)");
      interventions.push("Immediate referral to Nutrition Rehabilitation Centre (NRC)");
      interventions.push("Start Ready-to-Use Therapeutic Food (RUTF) under medical guidance");
      interventions.push("Double Take-Home Ration (THR) supplementary nutrition");
    } else if (muacCm < 12.5) {
      muacStatus = "Yellow (MAM - Moderate Acute Malnutrition: 11.5 - 12.5 cm)";
      samCategory = "MAM";
      flags.push("Moderate Acute Malnutrition (MUAC 11.5 - 12.5 cm)");
      interventions.push("Supplementary Nutrition Programme (SNP) - Daily Energy Dense food");
      interventions.push("Maternal counseling on infant & young child feeding (IYCF)");
      interventions.push("Weekly growth monitoring by Anganwadi Worker");
    } else {
      interventions.push("Continue routine Anganwadi hot cooked meals & SNP");
    }
  }

  // Stunting check
  let stuntingStatus = "Normal Height";
  if (heightCm < (ref.heightMedian * 0.90)) {
    stuntingStatus = "Stunted (Low height for age)";
    flags.push("Chronic Malnutrition / Stunting Detected");
    interventions.push("Ensure micronutrient fortification and protein-rich diet");
  }

  return {
    samCategory,
    wazStatus,
    muacStatus,
    stuntingStatus,
    flags,
    interventions,
    expectedMedianWeight: ref.median,
    m2sdWeight: ref.m2sd,
    m3sdWeight: ref.m3sd
  };
}

// 3. Immunization Due Engine
export function evaluateImmunizationStatus(dobString, administeredVaccineIds = []) {
  if (!dobString) return { overdue: [], dueSoon: [], upcoming: [], completed: [] };
  
  const dob = new Date(dobString);
  const now = new Date();
  const ageInWeeks = Math.floor((now - dob) / (1000 * 60 * 60 * 24 * 7));

  const overdue = [];
  const dueSoon = [];
  const upcoming = [];
  const completed = [];

  VACCINE_SCHEDULE.forEach(vac => {
    if (administeredVaccineIds.includes(vac.id)) {
      completed.push(vac);
    } else {
      const diffWeeks = ageInWeeks - vac.recommendedAgeWeeks;
      if (diffWeeks > 4) {
        overdue.push({ ...vac, weeksOverdue: diffWeeks });
      } else if (diffWeeks >= 0 && diffWeeks <= 4) {
        dueSoon.push({ ...vac, urgency: "Due Now" });
      } else if (vac.recommendedAgeWeeks - ageInWeeks <= 4) {
        upcoming.push({ ...vac, dueInWeeks: vac.recommendedAgeWeeks - ageInWeeks });
      }
    }
  });

  return {
    ageInWeeks,
    overdue,
    dueSoon,
    upcoming,
    completed,
    coverageRate: Math.round((completed.length / (completed.length + overdue.length + dueSoon.length || 1)) * 100)
  };
}

// 4. Priority Decision Support Score for Frontline Task Prioritization
export function computeTaskPriority(task) {
  let score = 50;

  if (task.riskLevel === "HIGH" || task.category === "SAM") score += 35;
  if (task.riskLevel === "MODERATE" || task.category === "MAM") score += 20;
  if (task.isOverdue) score += 25;
  if (task.type === "ANC_CHECK" && task.dangerReported) score += 40;
  if (task.type === "IMMUNIZATION" && task.missedDoses > 1) score += 20;

  return Math.min(100, Math.max(10, score));
}
