import React from 'react';
import { X, Server, Globe, Rocket, CheckCircle, Copy, ExternalLink, Code } from 'lucide-react';

export default function DeploymentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '750px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E40AF 0%, #00F0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Rocket size={24} color="#040711" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
              Free Server Deployment Guide
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Deploy your Mastercade Backend & Front End online for 100% Free!
            </p>
          </div>
        </div>

        {/* Step 1: Deploy Backend on Render */}
        <div style={{
          background: 'rgba(4, 7, 17, 0.6)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Server size={18} color="#00F0FF" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>
              Step 1: Deploy FastAPI Backend on Render (Free)
            </h4>
          </div>
          <ol style={{ paddingLeft: '1.25rem', color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.7 }}>
            <li>Create a free account on <a href="https://render.com" target="_blank" rel="noreferrer" style={{ color: '#38BDF8' }}>Render.com</a>.</li>
            <li>Click <strong>New +</strong> &rarr; <strong>Web Service</strong>.</li>
            <li>Connect your GitHub repository containing <code>app.py</code> and <code>requirements.txt</code>.</li>
            <li>Configure service settings:
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', color: '#94A3B8' }}>
                <li><strong>Runtime:</strong> Python 3</li>
                <li><strong>Build Command:</strong> <code>pip install -r requirements.txt</code></li>
                <li><strong>Start Command:</strong> <code>uvicorn app:app --host 0.0.0.0 --port $PORT</code></li>
                <li><strong>Instance Type:</strong> Free</li>
              </ul>
            </li>
            <li>Add Environment Variable: <code>GEMINI_API_KEY</code> with your free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#38BDF8' }}>Google AI Studio</a>.</li>
            <li>Click <strong>Create Web Service</strong>. You will receive a live production API URL! (e.g. <code>https://mastercade-api.onrender.com</code>).</li>
          </ol>
        </div>

        {/* Step 2: Deploy Front End on Vercel / Netlify */}
        <div style={{
          background: 'rgba(4, 7, 17, 0.6)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Globe size={18} color="#60A5FA" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>
              Step 2: Deploy React Front End on Vercel / Netlify (Free)
            </h4>
          </div>
          <ol style={{ paddingLeft: '1.25rem', color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.7 }}>
            <li>Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: '#38BDF8' }}>Vercel.com</a> or <a href="https://netlify.com" target="_blank" rel="noreferrer" style={{ color: '#38BDF8' }}>Netlify.com</a>.</li>
            <li>Import the <code>frontend/</code> project folder.</li>
            <li>Set Build Command: <code>npm run build</code>, Output Directory: <code>dist</code>.</li>
            <li>Deploy! Your Mastercade Web Application will be live on a custom URL (e.g. <code>https://mastercade.vercel.app</code>).</li>
            <li>Open the deployed Mastercade UI, click the <strong>API Server Live</strong> pill at top right, and paste your Render URL!</li>
          </ol>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-accent" onClick={onClose}>
            <span>Got it, thanks!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
