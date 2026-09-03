import React from 'react';
import { Heart, Activity, Thermometer, Wind, Gauge } from 'lucide-react';

export default function VitalsMonitor({ vitals }) {
  if (!vitals) return null;

  const bp = vitals.BP || '120/80';
  const hr = parseInt(vitals.HR) || 75;
  const temp = vitals.Temp || '37.0C';
  const spo2 = parseInt(vitals.SpO2) || 98;

  // Determine vital health colors
  const isHrHigh = hr > 100 || hr < 60;
  const isSpo2Low = spo2 < 94;

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="#00F0FF" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Telemetry & Vitals Monitor
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 10px #10B981',
            display: 'inline-block'
          }} />
          <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            LIVE ECG
          </span>
        </div>
      </div>

      {/* SVG ECG Waveform Display */}
      <div style={{
        background: '#02050E',
        borderRadius: '10px',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        padding: '0.5rem',
        marginBottom: '1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg viewBox="0 0 500 60" style={{ width: '100%', height: '50px', display: 'block' }}>
          {/* Background grid line */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="1" />
          {/* Animated ECG Pulse Curve */}
          <path
            className="ecg-path"
            d="M 0 30 L 70 30 L 80 25 L 90 35 L 100 30 L 120 30 L 130 5 L 140 55 L 150 15 L 160 30 L 220 30 L 230 25 L 240 35 L 250 30 L 270 30 L 280 5 L 290 55 L 300 15 L 310 30 L 370 30 L 380 25 L 390 35 L 400 30 L 420 30 L 430 5 L 440 55 L 450 15 L 460 30 L 500 30"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Vitals Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.85rem'
      }}>
        {/* Blood Pressure */}
        <div className="vital-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span>Blood Pressure</span>
            <Gauge size={14} color="#60A5FA" />
          </div>
          <div className="vital-value" style={{ color: 'white' }}>
            {bp}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>mmHg</span>
        </div>

        {/* Heart Rate */}
        <div className="vital-box" style={{ borderColor: isHrHigh ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span>Heart Rate</span>
            <Heart size={14} className="pulse-heart" color="#EF4444" />
          </div>
          <div className="vital-value" style={{ color: isHrHigh ? '#F87171' : '#34D399' }}>
            {hr}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>BPM</span>
        </div>

        {/* Temperature */}
        <div className="vital-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span>Temperature</span>
            <Thermometer size={14} color="#F59E0B" />
          </div>
          <div className="vital-value" style={{ color: 'white' }}>
            {temp}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Celsius</span>
        </div>

        {/* Oxygen Saturation */}
        <div className="vital-box" style={{ borderColor: isSpo2Low ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span>SpO2</span>
            <Wind size={14} color="#06B6D4" />
          </div>
          <div className="vital-value" style={{ color: isSpo2Low ? '#FBBF24' : '#38BDF8' }}>
            {spo2}%
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Oxygen Sat.</span>
        </div>
      </div>
    </div>
  );
}
