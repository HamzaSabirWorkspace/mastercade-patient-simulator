import React from 'react';
import { Heart, Brain, Wind, Activity, Zap, Droplet, ShieldAlert, Bone, ArrowRight, UserPlus, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Heart,
  Brain,
  Wind,
  Activity,
  Zap,
  Droplet,
  ShieldAlert,
  Bone
};

export default function WardSelector({ wards, onSelectWard, isLoading }) {
  return (
    <div style={{ maxWidth: '1300px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Banner */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(14, 23, 44, 0.9) 0%, rgba(10, 31, 74, 0.7) 100%)',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-cyan">
            <Sparkles size={13} />
            Mastercade Medical Simulation Hub
          </span>
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Select Clinical Ward & Admit Patient
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '750px', lineHeight: 1.6 }}>
          Every consultation generates a <strong style={{ color: 'white' }}>brand-new, clinically coherent patient profile</strong> with randomized vital signs, medical history, and presenting symptoms. Interrogate the patient in real time via Gemini AI.
        </p>
      </div>

      {/* Grid of Wards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {wards.map((ward) => {
          const IconComponent = ICON_MAP[ward.icon] || Activity;
          return (
            <div
              key={ward.name}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => !isLoading && onSelectWard(ward.name)}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `rgba(${parseInt((ward.color || '#2563EB').slice(1,3), 16)}, ${parseInt((ward.color || '#2563EB').slice(3,5), 16)}, ${parseInt((ward.color || '#2563EB').slice(5,7), 16)}, 0.15)`,
                    border: `1px solid ${ward.color || '#2563EB'}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={26} color={ward.color || '#3B82F6'} />
                  </div>
                  <span className="badge badge-blue">
                    {ward.difficulty || 'Standard'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>
                  {ward.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {ward.description}
                </p>
              </div>

              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  {ward.disease_count || 3} Disease Pools
                </span>

                <button 
                  className="btn-accent" 
                  disabled={isLoading}
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <UserPlus size={14} />
                  <span>Admit</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
