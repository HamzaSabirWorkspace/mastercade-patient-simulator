import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WardSelector from './components/WardSelector';
import VitalsMonitor from './components/VitalsMonitor';
import PatientInfoCard from './components/PatientInfoCard';
import ChatWindow from './components/ChatWindow';
import DiagnosisModal from './components/DiagnosisModal';
import DeploymentModal from './components/DeploymentModal';
import { api } from './services/api';

export default function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [wards, setWards] = useState([]);
  const [currentWard, setCurrentWard] = useState(null);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Initialize and check health
  const handleHealthCheck = async () => {
    const health = await api.checkHealth();
    setIsOnline(health.isOnline);
    const wardList = await api.getWards();
    setWards(wardList);
  };

  useEffect(() => {
    handleHealthCheck();
  }, []);

  // Handle Ward Selection & Start New Patient Session
  const handleSelectWard = async (wardName) => {
    setIsLoadingSession(true);
    setCurrentWard(wardName);
    try {
      const data = await api.startSession(wardName);
      setSession(data);
      setDoctorNotes('');
      setEvaluationResult(null);

      // Initial greeting message from patient
      const patient = data.patient;
      const initialGreeting = {
        sender: 'patient',
        text: `Hello Doctor... I'm ${patient.name}. I've been suffering from ${patient.symptoms.split(',')[0]} and I'm feeling quite uncomfortable.`
      };
      setMessages([initialGreeting]);
    } catch (err) {
      console.error("Failed to start patient session:", err);
    } finally {
      setIsLoadingSession(false);
    }
  };

  // Handle Sending Clinical Question to Patient
  const handleSendMessage = async (questionText) => {
    if (!session || isAsking) return;

    // Append Doctor message immediately
    const userMsg = { sender: 'doctor', text: questionText };
    setMessages(prev => [...prev, userMsg]);
    setIsAsking(true);

    try {
      const data = await api.askQuestion(session.session_id, questionText);
      const patientMsg = { sender: 'patient', text: data.answer };
      setMessages(prev => [...prev, patientMsg]);
    } catch (err) {
      console.error("Failed to ask question:", err);
      const errorMsg = { sender: 'patient', text: "I'm having trouble answering right now, doctor." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  // Handle Diagnosis Submission
  const handleSubmitDiagnosis = async (diagnosisText) => {
    if (!session) return;
    setIsEvaluating(true);
    try {
      const result = await api.submitDiagnosis(session.session_id, diagnosisText, doctorNotes);
      setEvaluationResult(result);
    } catch (err) {
      console.error("Failed to submit diagnosis:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset to Ward Selection Screen
  const handleResetSession = () => {
    setSession(null);
    setCurrentWard(null);
    setMessages([]);
    setEvaluationResult(null);
    setIsDiagnosisModalOpen(false);
  };

  // Next Patient in same ward
  const handleNextPatient = () => {
    setEvaluationResult(null);
    setIsDiagnosisModalOpen(false);
    if (currentWard) {
      handleSelectWard(currentWard);
    } else {
      handleResetSession();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        isOnline={isOnline}
        onResetSession={handleResetSession}
        onOpenDeploymentModal={() => setIsDeploymentModalOpen(true)}
        onHealthCheck={handleHealthCheck}
      />

      {/* Main Workspace */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {!session ? (
          /* Ward Selector Hub View */
          <WardSelector
            wards={wards}
            onSelectWard={handleSelectWard}
            isLoading={isLoadingSession}
          />
        ) : (
          /* Active Patient Simulation Workplace View */
          <div style={{ maxWidth: '1400px', margin: '1.5rem auto 0 auto', padding: '0 1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 420px) 1fr',
              gap: '1.5rem',
              alignItems: 'start'
            }}>
              {/* Left Column: Vitals Monitor + Patient Info & Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <VitalsMonitor vitals={session.patient.vitals} />
                <PatientInfoCard
                  patient={session.patient}
                  doctorNotes={doctorNotes}
                  setDoctorNotes={setDoctorNotes}
                />
              </div>

              {/* Right Column: AI Q&A Dialogue Room */}
              <div>
                <ChatWindow
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isAsking={isAsking}
                  onOpenDiagnosisModal={() => setIsDiagnosisModalOpen(true)}
                  patientName={session.patient.name}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <DiagnosisModal
        isOpen={isDiagnosisModalOpen}
        onClose={() => {
          setIsDiagnosisModalOpen(false);
          setEvaluationResult(null);
        }}
        onSubmitDiagnosis={handleSubmitDiagnosis}
        patient={session?.patient}
        evaluationResult={evaluationResult}
        onNextPatient={handleNextPatient}
        isLoading={isEvaluating}
      />

      <DeploymentModal
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
      />
    </div>
  );
}
