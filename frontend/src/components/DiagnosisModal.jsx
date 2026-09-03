import React, { useState } from 'react';
import { X, Stethoscope, CheckCircle, AlertTriangle, XCircle, Award, RotateCcw, FileText } from 'lucide-react';

const COMMON_TESTS = [
  "12-Lead ECG",
  "Chest X-Ray",
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel (BMP)",
  "Troponin & Cardiac Biomarkers",
  "Abdominal Ultrasound / CT"
];

export default function DiagnosisModal({
  isOpen,
  onClose,
  onSubmitDiagnosis,
  patient,
  evaluationResult,
  onNextPatient,
  isLoading
}) {
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);

  if (!isOpen) return null;

  const toggleTest = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userDiagnosis.trim() || isLoading) return;
    onSubmitDiagnosis(userDiagnosis.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {!evaluationResult ? (
          /* Form Mode */
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(0, 240, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Stethoscope size={24} color="#00F0FF" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>
                  Formulate Final Diagnosis
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Patient: {patient?.name} ({patient?.ward} Ward)
                </p>
              </div>
            </div>

            {/* Input field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                Primary Suspected Condition / Diagnosis:
              </label>
              <input
                type="text"
                value={userDiagnosis}
                onChange={(e) => setUserDiagnosis(e.target.value)}
                placeholder="e.g. Myocardial Infarction, Pneumonia, Appendicitis..."
                required
                style={{
                  width: '100%',
                  background: '#040711',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Order Diagnostic Tests */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                Order Diagnostic Investigations (Optional):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {COMMON_TESTS.map((test) => {
                  const isChecked = selectedTests.includes(test);
                  return (
                    <div
                      key={test}
                      onClick={() => toggleTest(test)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        background: isChecked ? 'rgba(30, 64, 175, 0.4)' : 'rgba(4, 7, 17, 0.5)',
                        border: `1px solid ${isChecked ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: isChecked ? 'white' : '#94A3B8',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ cursor: 'pointer' }} />
                      <span>{test}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-accent" disabled={!userDiagnosis.trim() || isLoading}>
                <span>Submit & Evaluate</span>
              </button>
            </div>
          </form>
        ) : (
          /* Evaluation Score & Results Mode */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: `rgba(${parseInt(evaluationResult.color.slice(1,3), 16)}, ${parseInt(evaluationResult.color.slice(3,5), 16)}, ${parseInt(evaluationResult.color.slice(5,7), 16)}, 0.2)`,
                border: `2px solid ${evaluationResult.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: `0 0 30px ${evaluationResult.color}50`
              }}>
                <Award size={36} color={evaluationResult.color} />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.3rem' }}>
                Diagnostic Accuracy: {evaluationResult.accuracy_score}%
              </h3>
              <p style={{ color: evaluationResult.color, fontWeight: 700, fontSize: '1.05rem' }}>
                {evaluationResult.verdict}
              </p>
            </div>

            <div style={{
              background: 'rgba(4, 7, 17, 0.6)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Submitted Diagnosis:
                </span>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem' }}>
                  {evaluationResult.user_diagnosis}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Actual Underlying Condition:
                </span>
                <p style={{ color: '#00F0FF', fontWeight: 700, fontSize: '1.15rem' }}>
                  {evaluationResult.actual_disease}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Clinical Case Summary:
                </span>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.2rem' }}>
                  {evaluationResult.feedback}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={onClose}>
                <FileText size={16} />
                <span>Review Case Chat</span>
              </button>
              <button className="btn-accent" onClick={onNextPatient}>
                <RotateCcw size={16} />
                <span>Next Patient Consultation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
