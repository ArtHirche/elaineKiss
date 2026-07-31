'use client';

import React, { useState } from 'react';
import { useSiteLayout } from '@/hooks/useSiteLayout';
import { SectionId, SiteLayoutConfig } from '@/types/siteLayout';
import styles from './VisualLayoutEditor.module.css';

const PRESET_PALETTES = [
  {
    name: 'Rosa Chic',
    primary: '#e91e63',
    secondary: '#9c27b0',
    background: '#ffffff',
    cardBackground: '#fff0f5',
    headerBackground: '#ffffff',
    gradient: 'linear-gradient(135deg, #f06292 0%, #ba68c8 100%)',
  },
  {
    name: 'Rose Gold',
    primary: '#b76e79',
    secondary: '#d4af37',
    background: '#faf6f0',
    cardBackground: '#ffffff',
    headerBackground: '#faf6f0',
    gradient: 'linear-gradient(135deg, #b76e79 0%, #e8c39e 100%)',
  },
  {
    name: 'Violeta Real',
    primary: '#7b1fa2',
    secondary: '#e91e63',
    background: '#f3e5f5',
    cardBackground: '#ffffff',
    headerBackground: '#ffffff',
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #e91e63 100%)',
  },
  {
    name: 'Esmeralda Glam',
    primary: '#00897b',
    secondary: '#d4af37',
    background: '#e0f2f1',
    cardBackground: '#ffffff',
    headerBackground: '#ffffff',
    gradient: 'linear-gradient(135deg, #00897b 0%, #4db6ac 100%)',
  },
  {
    name: 'Dark Luxury',
    primary: '#f48fb1',
    secondary: '#ce93d8',
    background: '#121212',
    cardBackground: '#1e1e1e',
    headerBackground: '#1a1a1a',
    gradient: 'linear-gradient(135deg, #ec407a 0%, #ab47bc 100%)',
  },
];

const SECTION_LABELS: Record<SectionId, string> = {
  announcement: '📢 Barra de Avisos (Topo)',
  hero: '🚀 Banner Principal (Hero)',
  recentProducts: '🌟 Produtos Recentes',
  promoBanner: '🏷️ Banner Promocional',
  aboutUs: '📝 Sobre a Loja',
};

export default function VisualLayoutEditor() {
  const {
    layoutConfig,
    updateTheme,
    updateSectionConfig,
    setLayoutConfig,
    saveConfig,
    resetToDefaults,
    isSaving,
    isInlineEditMode,
    setIsInlineEditMode,
  } = useSiteLayout();

  const [activeTab, setActiveTab] = useState<'theme' | 'hero' | 'announcement' | 'recentProducts'>('theme');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [notification, setNotification] = useState<string | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Enviar alterações para o iframe em tempo real via postMessage
  const syncPreviewIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SITE_LAYOUT_UPDATE', config: layoutConfig },
        '*'
      );
    }
  };

  React.useEffect(() => {
    syncPreviewIframe();
  }, [layoutConfig]);

  const handleSave = async () => {
    try {
      await saveConfig();
      showNotification('✅ Configurações salvas com sucesso no site!');
    } catch (err: any) {
      showNotification('❌ Erro ao salvar configurações: ' + err.message);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const applyPalette = (preset: typeof PRESET_PALETTES[0]) => {
    updateTheme({
      primary: preset.primary,
      secondary: preset.secondary,
      background: preset.background,
      cardBackground: preset.cardBackground,
      headerBackground: preset.headerBackground,
      accentGradient: preset.gradient,
    });
  };

  const getPreviewWidth = () => {
    switch (deviceView) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#111827',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontWeight: 600,
        }}>
          {notification}
        </div>
      )}

      {/* Top Action Bar */}
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <h2>🎨 Editor Visual do Site</h2>
          <span className={styles.titleBadge}>Sem Código</span>
        </div>

        <div className={styles.actionsArea}>
          <div className={styles.deviceSelector}>
            <button
              className={`${styles.deviceBtn} ${deviceView === 'desktop' ? styles.deviceBtnActive : ''}`}
              onClick={() => setDeviceView('desktop')}
            >
              🖥️ Desktop
            </button>
            <button
              className={`${styles.deviceBtn} ${deviceView === 'tablet' ? styles.deviceBtnActive : ''}`}
              onClick={() => setDeviceView('tablet')}
            >
              📱 Tablet
            </button>
            <button
              className={`${styles.deviceBtn} ${deviceView === 'mobile' ? styles.deviceBtnActive : ''}`}
              onClick={() => setDeviceView('mobile')}
            >
              📲 Mobile
            </button>
          </div>

          <button
            className={styles.btnSecondary}
            onClick={() => setIsInlineEditMode(!isInlineEditMode)}
            style={{
              borderColor: isInlineEditMode ? '#e91e63' : undefined,
              color: isInlineEditMode ? '#e91e63' : undefined,
            }}
          >
            {isInlineEditMode ? '✏️ Modo Inline Ativo' : '✏️ Ativar Edição no Front'}
          </button>

          <button className={styles.btnSecondary} onClick={resetToDefaults}>
            🔄 Restaurar Padrões
          </button>

          <button className={styles.btnPrimary} onClick={handleSave} disabled={isSaving}>
            {isSaving ? '💾 Salvando...' : '💾 Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className={styles.editorGrid}>
        {/* Left Sidebar Controls */}
        <div className={styles.controlSidebar}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'theme' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              🎨 Cores & Tema
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'hero' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('hero')}
            >
              🚀 Título & Botão
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'announcement' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('announcement')}
            >
              📢 Avisos Topo
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'recentProducts' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('recentProducts')}
            >
              🌟 Produtos Recentes
            </button>
          </div>

          <div className={styles.tabBody}>
            {/* TAB: CORES & TEMA */}
            {activeTab === 'theme' && (
              <>
                <div className={styles.formGroup}>
                  <label>Paletas Prontas Recomendadas</label>
                  <div className={styles.presetsGrid}>
                    {PRESET_PALETTES.map((p) => (
                      <div
                        key={p.name}
                        className={styles.presetCard}
                        onClick={() => applyPalette(p)}
                      >
                        <div className={styles.presetSwatches}>
                          <div className={styles.presetSwatch} style={{ background: p.primary }} />
                          <div className={styles.presetSwatch} style={{ background: p.secondary }} />
                          <div className={styles.presetSwatch} style={{ background: p.background }} />
                        </div>
                        <div className={styles.presetLabel}>{p.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Cor Principal (Botões e Destaques)</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={layoutConfig.theme.primary}
                      onChange={(e) => updateTheme({ primary: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={layoutConfig.theme.primary}
                      onChange={(e) => updateTheme({ primary: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Cor Secundária / Accent</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={layoutConfig.theme.secondary}
                      onChange={(e) => updateTheme({ secondary: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={layoutConfig.theme.secondary}
                      onChange={(e) => updateTheme({ secondary: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Cor de Fundo da Página</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={layoutConfig.theme.background}
                      onChange={(e) => updateTheme({ background: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={layoutConfig.theme.background}
                      onChange={(e) => updateTheme({ background: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Arredondamento dos Cards & Botões</label>
                  <select
                    className={styles.formSelect}
                    value={layoutConfig.theme.borderRadius}
                    onChange={(e) => updateTheme({ borderRadius: e.target.value })}
                  >
                    <option value="4px">Pouco Arredondado (4px)</option>
                    <option value="12px">Médio Arredondado (12px)</option>
                    <option value="20px">Super Arredondado (20px)</option>
                    <option value="999px">Pill / Arredondado Total</option>
                  </select>
                </div>
              </>
            )}

            {/* TAB: HERO BANNER */}
            {activeTab === 'hero' && (
              <>
                <div className={styles.toggleRow}>
                  <span className={styles.toggleLabel}>Exibir Banner Principal</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={layoutConfig.hero.enabled}
                      onChange={(e) => updateSectionConfig('hero', { enabled: e.target.checked })}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>Título Principal</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={layoutConfig.hero.title}
                    onChange={(e) => updateSectionConfig('hero', { title: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subtítulo / Descrição</label>
                  <textarea
                    rows={3}
                    className={styles.formTextarea}
                    value={layoutConfig.hero.subtitle}
                    onChange={(e) => updateSectionConfig('hero', { subtitle: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Texto do Botão de Ação (CTA)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={layoutConfig.hero.buttonText}
                    onChange={(e) => updateSectionConfig('hero', { buttonText: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Link do Botão</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={layoutConfig.hero.buttonUrl}
                    onChange={(e) => updateSectionConfig('hero', { buttonUrl: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* TAB: BARRA DE ANÚNCIOS */}
            {activeTab === 'announcement' && (
              <>
                <div className={styles.toggleRow}>
                  <span className={styles.toggleLabel}>Ativar Barra de Avisos no Topo</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={layoutConfig.announcement.enabled}
                      onChange={(e) => updateSectionConfig('announcement', { enabled: e.target.checked })}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>Texto da Mensagem de Anúncio</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={layoutConfig.announcement.text}
                    onChange={(e) => updateSectionConfig('announcement', { text: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Cor de Fundo da Barra</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={layoutConfig.announcement.backgroundColor}
                      onChange={(e) => updateSectionConfig('announcement', { backgroundColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={layoutConfig.announcement.backgroundColor}
                      onChange={(e) => updateSectionConfig('announcement', { backgroundColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Cor do Texto</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={layoutConfig.announcement.textColor}
                      onChange={(e) => updateSectionConfig('announcement', { textColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={layoutConfig.announcement.textColor}
                      onChange={(e) => updateSectionConfig('announcement', { textColor: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB: PRODUTOS RECENTES */}
            {activeTab === 'recentProducts' && (
              <>
                <div className={styles.toggleRow}>
                  <span className={styles.toggleLabel}>Exibir Seção Produtos Recentes</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={layoutConfig.recentProducts.enabled}
                      onChange={(e) => updateSectionConfig('recentProducts', { enabled: e.target.checked })}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>Título da Seção</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={layoutConfig.recentProducts.title}
                    onChange={(e) => updateSectionConfig('recentProducts', { title: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Quantidade Máxima de Produtos no Carrossel</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className={styles.formInput}
                    value={layoutConfig.recentProducts.maxItems}
                    onChange={(e) => updateSectionConfig('recentProducts', { maxItems: parseInt(e.target.value) || 8 })}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Live Screen Preview Frame */}
        <div className={styles.previewContainer}>
          <div className={styles.previewWrapper} style={{ width: getPreviewWidth() }}>
            <iframe
              ref={iframeRef}
              src="/"
              title="Site Live Preview"
              className={styles.previewFrame}
              onLoad={syncPreviewIframe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
