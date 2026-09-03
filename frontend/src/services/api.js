// Mastercade API Service & Mock Fallback Client
// Connects to local FastAPI backend (http://127.0.0.1:8000) or user-provided deployed URL,
// with rich client-side simulated fallback if backend server is unreachable.

let API_BASE_URL = localStorage.getItem('mastercade_api_url') || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000' 
    : (typeof window !== 'undefined' ? window.location.origin : ''));

export const setApiBaseUrl = (url) => {
  API_BASE_URL = url.replace(/\/$/, '');
  localStorage.setItem('mastercade_api_url', API_BASE_URL);
};

export const getApiBaseUrl = () => API_BASE_URL;

// Helper to handle API call with timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Fallback Mock Engine for instant offline UI testing
const MOCK_WARDS = [
  { name: "Cardiology", disease_count: 3, icon: "Heart", description: "Acute cardiac conditions including MI, arrhythmia, and heart failure.", color: "#EF4444", difficulty: "Intermediate" },
  { name: "Neurology", disease_count: 3, icon: "Brain", description: "Neurological disorders including migraines, seizure disorders, and Parkinson's.", color: "#8B5CF6", difficulty: "Advanced" },
  { name: "Respiratory", disease_count: 3, icon: "Wind", description: "Pulmonary illnesses including asthma exacerbations, pneumonia, and COPD.", color: "#3B82F6", difficulty: "Beginner" },
  { name: "GI", disease_count: 3, icon: "Activity", description: "Gastrointestinal disorders including appendicitis, GERD, and IBS.", color: "#F59E0B", difficulty: "Intermediate" },
  { name: "Endocrinology", disease_count: 3, icon: "Zap", description: "Hormonal and metabolic disorders including diabetes and thyroid disease.", color: "#10B981", difficulty: "Intermediate" },
  { name: "Renal", disease_count: 3, icon: "Droplet", description: "Kidney function impairments, acute kidney injury, CKD, and kidney stones.", color: "#06B6D4", difficulty: "Advanced" },
  { name: "Infectious Disease", disease_count: 3, icon: "ShieldAlert", description: "Systemic bacterial, viral, and localized skin or urinary infections.", color: "#EC4899", difficulty: "Beginner" },
  { name: "Orthopedics", disease_count: 3, icon: "Bone", description: "Musculoskeletal traumatic injuries, joint osteoarthritis, and back herniation.", color: "#6366F1", difficulty: "Beginner" }
];

const MOCK_PATIENTS_DB = {
  Cardiology: [
    { name: "Robert Kim", age: 58, gender: "Male", disease: "Myocardial Infarction", symptoms: "crushing chest pain, pain radiating to the left arm, cold sweat", history: "hypertensive, heavy smoker for 20 years", medications: "Aspirin, Atorvastatin", vitals: { BP: "155/95", HR: "112", Temp: "37.1C", SpO2: "92%" } },
    { name: "Mary Alonso", age: 67, gender: "Female", disease: "Atrial Fibrillation", symptoms: "palpitations, irregular heartbeat, sudden dizziness", history: "hyperthyroidism, high caffeine intake", medications: "Warfarin, Bisoprolol", vitals: { BP: "135/85", HR: "138", Temp: "36.8C", SpO2: "97%" } }
  ],
  Neurology: [
    { name: "Lucas Meyer", age: 29, gender: "Male", disease: "Migraine", symptoms: "throbbing one-sided headache, sensitivity to light and sound", history: "high stress at work, poor sleep schedule", medications: "Sumatriptan", vitals: { BP: "118/76", HR: "74", Temp: "36.6C", SpO2: "99%" } },
    { name: "Priya Nair", age: 34, gender: "Female", disease: "Epilepsy (Seizure Disorder)", symptoms: "brief loss of awareness, confusion after episode, tongue biting", history: "diagnosed in childhood, sleep deprivation trigger", medications: "Levetiracetam", vitals: { BP: "122/80", HR: "82", Temp: "36.9C", SpO2: "98%" } }
  ],
  Respiratory: [
    { name: "Ethan Brooks", age: 24, gender: "Male", disease: "Asthma Exacerbation", symptoms: "wheezing, tight chest, difficulty breathing", history: "asthma since childhood, severe pet allergies", medications: "Salbutamol inhaler", vitals: { BP: "118/78", HR: "108", Temp: "36.9C", SpO2: "91%" } },
    { name: "Delia Fontaine", age: 62, gender: "Female", disease: "Community-Acquired Pneumonia", symptoms: "fever, productive cough with colored phlegm, sharp chest pain", history: "long-time smoker, had flu 1 week ago", medications: "Paracetamol", vitals: { BP: "110/70", HR: "105", Temp: "38.8C", SpO2: "89%" } }
  ]
};

// In-memory mock active sessions store
const mockSessions = {};

export const api = {
  // Check API health
  async checkHealth() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/health`, { timeout: 3000 });
      if (res.ok) {
        const data = await res.json();
        return { isOnline: true, ...data };
      }
    } catch {
      // Backend offline
    }
    return { isOnline: false, mode: "Standalone Simulation Engine", active_sessions: Object.keys(mockSessions).length };
  },

  // Fetch Ward List
  async getWards() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/wards`, { timeout: 4000 });
      if (res.ok) {
        const data = await res.json();
        return data.wards;
      }
    } catch {
      // Fallback
    }
    return MOCK_WARDS;
  },

  // Start Patient Session
  async startSession(ward) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward }),
        timeout: 6000
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Mock patient generation logic
    const wardPatients = MOCK_PATIENTS_DB[ward] || [
      { name: "Alex Taylor", age: 42, gender: "Male", disease: `${ward} Condition`, symptoms: "acute discomfort and fatigue", history: "no significant history", medications: "None", vitals: { BP: "120/80", HR: "80", Temp: "36.8C", SpO2: "97%" } }
    ];
    const patient = wardPatients[Math.floor(Math.random() * wardPatients.length)];
    const sessionId = "mock-session-" + Date.now();
    mockSessions[sessionId] = { patient, ward, conversation: [] };

    return {
      session_id: sessionId,
      patient: { ...patient, ward }
    };
  },

  // Ask Question to Patient
  async askQuestion(sessionId, question) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/session/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, question }),
        timeout: 16000
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const sess = mockSessions[sessionId];
    let answer = "I'm feeling quite unwell, doctor.";
    const q = question.toLowerCase();

    if (sess && sess.patient) {
      const p = sess.patient;
      if (q.includes("pain") || q.includes("feel") || q.includes("symptom")) {
        answer = `Honestly doctor, I've had severe ${p.symptoms}.`;
      } else if (q.includes("history") || q.includes("before") || q.includes("past")) {
        answer = `I do have a history of ${p.history}.`;
      } else if (q.includes("medication") || q.includes("drug") || q.includes("taking")) {
        answer = `I'm currently taking ${p.medications}.`;
      } else if (q.includes("when") || q.includes("start") || q.includes("long")) {
        answer = "It started a couple of days ago and has been getting noticeably worse.";
      } else if (q.includes("name") || q.includes("who")) {
        answer = `My name is ${p.name}.`;
      } else {
        answer = `Mainly it's the ${p.symptoms.split(',')[0]} that's bothering me the most right now.`;
      }
    }

    return {
      session_id: sessionId,
      question,
      answer,
      elapsed_ms: 350,
      turn_count: sess ? sess.conversation.length + 1 : 1
    };
  },

  // Submit Diagnosis
  async submitDiagnosis(sessionId, diagnosis, notes = "") {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/session/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, diagnosis, notes }),
        timeout: 6000
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const sess = mockSessions[sessionId];
    const actualDisease = sess?.patient?.disease || "Myocardial Infarction";
    const userDx = diagnosis.trim().toLowerCase();
    const trueDx = actualDisease.toLowerCase();

    const isMatch = userDx.includes(trueDx) || trueDx.includes(userDx);
    const score = isMatch ? 100 : 45;

    return {
      session_id: sessionId,
      user_diagnosis: diagnosis,
      actual_disease: actualDisease,
      accuracy_score: score,
      verdict: isMatch ? "Exact Match - Outstanding Diagnosis!" : "Partial Match - Review Key Symptoms",
      color: isMatch ? "#10B981" : "#F59E0B",
      patient_summary: sess?.patient || { name: "Patient", ward: "General", symptoms: "Chest pain", history: "Smoker", vitals: {} },
      feedback: `The patient was presenting with symptoms of ${actualDisease}. Review the vitals and clinical presentation carefully.`
    };
  }
};
