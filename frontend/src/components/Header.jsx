import React, { useState } from 'react';
import { Activity, Server, Rocket, RefreshCw, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl } from '../services/api';

export default function Header({ isOnline, onResetSession, onOpenDeploymentModal, onHealthCheck }) {
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getApiBaseUrl());

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    setApiBaseUrl(apiUrlInput);
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
          {/* Server Connection Status */}
          <div 
            onClick={() => setShowConfig(!showConfig)}
            title="Click to configure API backend endpoint"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: isOnline ? '#34D399' : '#FBBF24'
            }}
          >
            {isOnline ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{isOnline ? 'API Server Live' : 'Standalone Mode'}</span>
            <Settings size={13} style={{ opacity: 0.7 }} />
          </div>

          {/* Deployment Guide Trigger */}
          <button 
            className="btn-primary" 
            onClick={onOpenDeploymentModal}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Rocket size={16} />
            <span>Free Server Deployment</span>
          </button>

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

      {/* API Endpoint Config Drawer/Popover */}
      {showConfig && (
        <div style={{
          maxWidth: '1400px',
          margin: '0.75rem auto 0 auto',
          background: 'rgba(14, 23, 44, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Server size={18} color="#00F0FF" />
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Backend Server URL</p>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Connect your front end to local FastAPI (`http://127.0.0.1:8000`) or deployed production server URL.
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveApiUrl} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={apiUrlInput}
              onChange={(e) => setApiUrlInput(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              style={{
                background: '#040711',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                width: '260px'
              }}
            />
            <button type="submit" className="btn-accent" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
              Save & Test
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
