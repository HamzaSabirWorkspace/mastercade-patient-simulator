import React, { useState } from 'react';
import { Activity, Server, Rocket, RefreshCw, CheckCircle, AlertCircle, Settings, Key } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, getGeminiKey, setGeminiKey } from '../services/api';

export default function Header({ isOnline, onResetSession, onOpenDeploymentModal, onHealthCheck }) {
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getApiBaseUrl());
  const [geminiKeyInput, setGeminiKeyInput] = useState(getGeminiKey());

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setApiBaseUrl(apiUrlInput);
    setGeminiKey(geminiKeyInput);
    setShowConfig(false);
    onHealthCheck();
  };

  return (
    <header style={{
      background: 'rgba(7, 13, 27, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={onResetSession}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E40AF 0%, #00F0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
          }}>
            <Activity size={24} color="#040711" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 60%, #00F0FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              MASTERCADE
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Patient Simulator • Clinical Engine
            </p>
          </div>
        </div>

        {/* Action Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* New Case Button */}
          <button 
            className="btn-secondary" 
            onClick={onResetSession}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} />
            <span>Select Ward</span>
          </button>
        </div>
      </div>

      {/* API Endpoint & Gemini Key Config Drawer/Popover */}
      {showConfig && (
        <div style={{
          maxWidth: '1400px',
          margin: '0.75rem auto 0 auto',
          background: 'rgba(14, 23, 44, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>
                <Server size={14} color="#00F0FF" />
                Backend Server URL:
              </label>
              <input 
                type="text" 
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                placeholder="http://127.0.0.1:8000"
                style={{
                  width: '100%',
                  background: '#040711',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>
                <Key size={14} color="#34D399" />
                Gemini API Key (Optional Override):
              </label>
              <input 
                type="password" 
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy... (Paste Gemini Key here)"
                style={{
                  width: '100%',
                  background: '#040711',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <button type="submit" className="btn-accent" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Save & Activate
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
