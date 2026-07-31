'use client';

import React, { useState } from 'react';
import { useSiteLayout } from '@/hooks/useSiteLayout';
import Link from 'next/link';

export default function InlineFrontEditorToolbar() {
  const { isInlineEditMode, setIsInlineEditMode, saveConfig, isSaving, resetToDefaults } = useSiteLayout();
  const [minimized, setMinimized] = useState(false);

  if (!isInlineEditMode) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        background: 'rgba(17, 24, 39, 0.92)',
        backdropFilter: 'blur(12px)',
        color: '#ffffff',
        padding: minimized ? '8px 16px' : '14px 24px',
        borderRadius: '50px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>🎨</span>
        {!minimized && (
          <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.3px' }}>
            Modo Edição Visual Ativo
          </span>
        )}
      </div>

      {!minimized && (
        <>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />

          <Link
            href="/admin/products?tab=layout"
            style={{
              color: '#f48fb1',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ⚙️ Painel Completo
          </Link>

          <button
            onClick={resetToDefaults}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d1d5db',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            🔄 Reset
          </button>

          <button
            onClick={saveConfig}
            disabled={isSaving}
            style={{
              background: 'linear-gradient(135deg, #e91e63 0%, #d81b60 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
            }}
          >
            {isSaving ? 'Salvando...' : '💾 Salvar Alterações'}
          </button>
        </>
      )}

      <button
        onClick={() => setIsInlineEditMode(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: '#ffffff',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '0.8rem',
        }}
        title="Sair da Edição"
      >
        ✕
      </button>

      <button
        onClick={() => setMinimized(!minimized)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '0.8rem',
        }}
        title={minimized ? 'Expandir' : 'Minimizar'}
      >
        {minimized ? '◀▶' : '―'}
      </button>
    </div>
  );
}
