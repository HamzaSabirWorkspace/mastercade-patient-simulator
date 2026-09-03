import React, { useState } from 'react';
import { User, Stethoscope, FileText, Pill, AlertTriangle, Edit3 } from 'lucide-react';

export default function PatientInfoCard({ patient, doctorNotes, setDoctorNotes }) {
  const [activeTab, setActiveTab] = useState('symptoms');

  if (!patient) return null;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Patient Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1D4ED8 0%, #00F0FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
        }}>
          <User size={28} color="#040711" strokeWidth={2.5} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
              {patient.name}
            </h3>
            <span className="badge badge-cyan">
              {patient.ward} Ward
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            {patient.age} years old • {patient.gender} • Patient ID: #{Math.floor(100000 + Math.random() * 900000)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        background: 'rgba(4, 7, 17, 0.5)',
        padding: '0.3rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {[
          { id: 'symptoms', label: 'Symptoms', icon: AlertTriangle },
          { id: 'history', label: 'History', icon: FileText },
          { id: 'meds', label: 'Meds', icon: Pill },
          { id: 'notes', label: 'Doctor Notes', icon: Edit3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '0.5rem 0.25rem',
                borderRadius: '7px',
                border: 'none',
                background: isActive ? '#1E40AF' : 'transparent',
                color: isActive ? 'white' : '#94A3B8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Box */}
      <div style={{
        flex: 1,
        background: 'rgba(4, 7, 17, 0.4)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {activeTab === 'symptoms' && (
          <div>
            <h5 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38BDF8', marginBottom: '0.5rem' }}>
              Presenting Complaints & Symptoms
            </h5>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {patient.symptoms}
            </p>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h5 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8B5CF6', marginBottom: '0.5rem' }}>
              Relevant Medical History
            </h5>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {patient.history}
            </p>
          </div>
        )}

        {activeTab === 'meds' && (
          <div>
            <h5 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10B981', marginBottom: '0.5rem' }}>
              Current Prescribed Medications
            </h5>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {patient.medications}
            </p>
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h5 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#F59E0B', marginBottom: '0.5rem' }}>
              Physician Consultation Notepad
            </h5>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Record diagnostic clues, differential diagnosis, and patient responses..."
              style={{
                width: '100%',
                flex: 1,
                minHeight: '120px',
                background: '#040711',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: 'white',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                resize: 'none'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
