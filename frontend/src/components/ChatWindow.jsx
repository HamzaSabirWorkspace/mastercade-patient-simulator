import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bot, User, Sparkles, Stethoscope, HelpCircle } from 'lucide-react';

const QUICK_QUESTIONS = [
  "When did your symptoms first start?",
  "Can you describe the pain or discomfort?",
  "Does the pain radiate to your arm, back, or jaw?",
  "Have you ever had anything like this before?",
  "Are you experiencing any shortness of breath or nausea?",
  "Do you have any allergies to medications?"
];

export default function ChatWindow({
  messages,
  onSendMessage,
  isAsking,
  onOpenDiagnosisModal,
  patientName
}) {
  const [questionInput, setQuestionInput] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionInput.trim() || isAsking) return;
    onSendMessage(questionInput.trim());
    setQuestionInput('');
  };

  const handleQuickQuestion = (qText) => {
    if (isAsking) return;
    onSendMessage(qText);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <MessageSquare size={20} color="#00F0FF" />
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
              Consultation Room • {patientName}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Ask clinical questions to evaluate the patient's symptoms & history.
            </p>
          </div>
        </div>

        <button 
          className="btn-accent"
          onClick={onOpenDiagnosisModal}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}
        >
          <Stethoscope size={16} />
          <span>Submit Diagnosis</span>
        </button>
      </div>

      {/* Quick Suggested Questions Bar */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: 'rgba(4, 7, 17, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        <HelpCircle size={15} color="#38BDF8" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>
          Quick Clinical Questions:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              disabled={isAsking}
              style={{
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93C5FD',
                padding: '0.3rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div style={{
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: 'rgba(4, 7, 17, 0.3)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            color: '#64748B',
            maxWidth: '380px'
          }}>
            <Bot size={42} color="#1E40AF" style={{ marginBottom: '0.75rem' }} />
            <h5 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Consultation Initialized
            </h5>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              Begin by asking {patientName} about their chief complaint, onset of symptoms, or pain characteristics.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748B' }}>
                {msg.sender === 'doctor' ? (
                  <>
                    <span>Doctor (You)</span>
                    <User size={13} color="#60A5FA" />
                  </>
                ) : (
                  <>
                    <Bot size={13} color="#00F0FF" />
                    <span>{patientName} (Patient)</span>
                  </>
                )}
              </div>

              <div style={{
                maxWidth: '82%',
                padding: '0.85rem 1.15rem',
                borderRadius: msg.sender === 'doctor' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'doctor' 
                  ? 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)' 
                  : 'rgba(15, 28, 63, 0.95)',
                border: msg.sender === 'doctor' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid rgba(0, 240, 255, 0.25)',
                color: 'white',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                boxShadow: msg.sender === 'doctor' 
                  ? '0 4px 14px rgba(37, 99, 235, 0.3)' 
                  : '0 4px 14px rgba(0, 0, 0, 0.4)'
              }}>
                {msg.text}
              </div>
            </div>
          ))
        )}

        {/* Typing animation when LLM is formulating response */}
        {isAsking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(15, 28, 63, 0.8)', padding: '0.75rem 1.15rem', borderRadius: '18px', width: 'fit-content', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <span style={{ fontSize: '0.82rem', color: '#00F0FF', fontWeight: 600 }}>{patientName} is speaking</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 13, 27, 0.9)',
        display: 'flex',
        gap: '0.75rem'
      }}>
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder={`Ask ${patientName} a question...`}
          disabled={isAsking}
          style={{
            flex: 1,
            background: '#040711',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '12px',
            padding: '0.85rem 1.15rem',
            color: 'white',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={!questionInput.trim() || isAsking}
          style={{ padding: '0.85rem 1.5rem' }}
        >
          <span>Ask</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
