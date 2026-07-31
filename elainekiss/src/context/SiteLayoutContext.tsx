'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteLayoutConfig, DEFAULT_SITE_LAYOUT } from '@/types/siteLayout';
import { siteLayoutService } from '@/lib/firebase/siteLayoutService';

interface SiteLayoutContextType {
  layoutConfig: SiteLayoutConfig;
  setLayoutConfig: React.Dispatch<React.SetStateAction<SiteLayoutConfig>>;
  updateTheme: (updates: Partial<SiteLayoutConfig['theme']>) => void;
  updateSectionConfig: <K extends keyof SiteLayoutConfig>(section: K, updates: Partial<SiteLayoutConfig[K]>) => void;
  saveConfig: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  loading: boolean;
  isSaving: boolean;
  isInlineEditMode: boolean;
  setIsInlineEditMode: (active: boolean) => void;
}

const SiteLayoutContext = createContext<SiteLayoutContextType | undefined>(undefined);

export const SiteLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutConfig, setLayoutConfig] = useState<SiteLayoutConfig>(DEFAULT_SITE_LAYOUT);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInlineEditMode, setIsInlineEditMode] = useState(false);

  // Carregar configurações iniciais do Firestore
  useEffect(() => {
    async function loadLayout() {
      try {
        setLoading(true);
        const config = await siteLayoutService.getLayoutConfig();
        setLayoutConfig(config);
      } catch (err) {
        console.error('Erro ao carregar layout:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLayout();
  }, []);

  // Ouvir atualizações postMessage em tempo real (para o iframe do preview)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SITE_LAYOUT_UPDATE') {
        setLayoutConfig(event.data.config);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Injetar variáveis CSS globais no :root quando o tema mudar
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const { theme } = layoutConfig;

    if (theme) {
      root.style.setProperty('--primary-color', theme.primary);
      root.style.setProperty('--primary-hover', theme.primaryHover);
      root.style.setProperty('--secondary-color', theme.secondary);
      root.style.setProperty('--site-bg', theme.background);
      root.style.setProperty('--card-bg', theme.cardBackground);
      root.style.setProperty('--text-color', theme.textColor);
      root.style.setProperty('--header-bg', theme.headerBackground);
      root.style.setProperty('--footer-bg', theme.footerBackground);
      root.style.setProperty('--accent-gradient', theme.accentGradient);
      root.style.setProperty('--border-radius-custom', theme.borderRadius);
      if (document.body) {
        document.body.style.backgroundColor = theme.background;
      }
    }
  }, [layoutConfig]);

  const updateTheme = (updates: Partial<SiteLayoutConfig['theme']>) => {
    setLayoutConfig((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...updates,
      },
    }));
  };

  const updateSectionConfig = <K extends keyof SiteLayoutConfig>(
    section: K,
    updates: Partial<SiteLayoutConfig[K]>
  ) => {
    setLayoutConfig((prev) => ({
      ...prev,
      [section]: typeof updates === 'object' && !Array.isArray(updates)
        ? { ...(prev[section] as object), ...updates }
        : updates,
    }));
  };

  const saveConfig = async () => {
    try {
      setIsSaving(true);
      await siteLayoutService.saveLayoutConfig(layoutConfig);
    } catch (error) {
      console.error('Erro ao salvar layout:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm('Tem certeza que deseja restaurar todas as configurações de layout para o padrão original?')) {
      setLayoutConfig(DEFAULT_SITE_LAYOUT);
      await siteLayoutService.saveLayoutConfig(DEFAULT_SITE_LAYOUT);
    }
  };

  return (
    <SiteLayoutContext.Provider
      value={{
        layoutConfig,
        setLayoutConfig,
        updateTheme,
        updateSectionConfig,
        saveConfig,
        resetToDefaults,
        loading,
        isSaving,
        isInlineEditMode,
        setIsInlineEditMode,
      }}
    >
      {children}
    </SiteLayoutContext.Provider>
  );
};

export function useSiteLayout() {
  const context = useContext(SiteLayoutContext);
  if (!context) {
    throw new Error('useSiteLayout deve ser usado dentro de um SiteLayoutProvider');
  }
  return context;
}
