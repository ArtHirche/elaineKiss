'use client';

import React, { useState } from 'react';
import { useSiteLayout } from '@/hooks/useSiteLayout';
import { SectionId, SiteLayoutConfig } from '@/types/siteLayout';
import { imageService } from '@/lib/firebase/imageService';
import styles from './VisualLayoutEditor.module.css';

const PRESET_PALETTES = [
  {
    name: 'Azul Elaine',
    primary: '#060748',
    secondary: '#3a3c85',
    background: '#ffffff',
    cardBackground: '#f8fafc',
    headerBackground: '#060748',
    gradient: 'linear-gradient(135deg, #060748 0%, #3a3c85 100%)',
  },
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
    name: 'Pêssego Warm',
    primary: '#e07a5f',
    secondary: '#f2cc8f',
    background: '#fffdfa',
    cardBackground: '#fefae0',
    headerBackground: '#ffffff',
    gradient: 'linear-gradient(135deg, #e07a5f 0%, #f2cc8f 100%)',
  },
  {
    name: 'Oceano Sereno',
    primary: '#0077b6',
    secondary: '#90e0ef',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    headerBackground: '#0077b6',
    gradient: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)',
  },
  {
    name: 'Lavanda Soft',
    primary: '#8e7dbe',
    secondary: '#c8b6ff',
    background: '#fbfaff',
    cardBackground: '#ffffff',
    headerBackground: '#8e7dbe',
    gradient: 'linear-gradient(135deg, #8e7dbe 0%, #b8c0ff 100%)',
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [containerWidth, setContainerWidth] = useState(700);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const previewContainerRef = React.useRef<HTMLDivElement>(null);

  // ResizeObserver para medir a largura real disponivel do container de preview
  React.useEffect(() => {
    if (!previewContainerRef.current) return;
    const updateWidth = () => {
      if (previewContainerRef.current) {
        const w = previewContainerRef.current.clientWidth - 40; // descontando padding
        setContainerWidth(w > 0 ? w : 700);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [sidebarCollapsed, deviceView]);

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

  const handleCreateCustomPreset = () => {
    const name = prompt('Digite o nome do seu novo Preset de Cores:');
    if (!name || !name.trim()) return;

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: name.trim(),
      primary: layoutConfig.theme.primary,
      secondary: layoutConfig.theme.secondary,
      background: layoutConfig.theme.background,
      cardBackground: layoutConfig.theme.cardBackground,
      headerBackground: layoutConfig.theme.headerBackground,
      gradient: layoutConfig.theme.accentGradient,
      isCustom: true,
    };

    const updatedCustomPresets = [...(layoutConfig.customPresets || []), newPreset];
    setLayoutConfig((prev) => ({
      ...prev,
      customPresets: updatedCustomPresets,
    }));
    showNotification(`✅ Preset "${name.trim()}" criado com sucesso!`);
  };

  const handleDeleteCustomPreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja excluir este preset customizado?')) {
      const updated = (layoutConfig.customPresets || []).filter(p => p.id !== presetId);
      setLayoutConfig((prev) => ({
        ...prev,
        customPresets: updated,
      }));
    }
  };

  const handleUpdateCustomPreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const presetIndex = (layoutConfig.customPresets || []).findIndex(p => p.id === presetId);
    if (presetIndex === -1) return;

    const presetName = layoutConfig.customPresets![presetIndex].name;
    const updatedCustomPresets = [...(layoutConfig.customPresets || [])];
    updatedCustomPresets[presetIndex] = {
      ...updatedCustomPresets[presetIndex],
      primary: layoutConfig.theme.primary,
      secondary: layoutConfig.theme.secondary,
      background: layoutConfig.theme.background,
      cardBackground: layoutConfig.theme.cardBackground,
      headerBackground: layoutConfig.theme.headerBackground,
      gradient: layoutConfig.theme.accentGradient,
    };

    setLayoutConfig((prev) => ({
      ...prev,
      customPresets: updatedCustomPresets,
    }));

    showNotification(`💾 Cores do preset "${presetName}" foram atualizadas com sucesso!`);
  };

  const allPresets = [
    ...PRESET_PALETTES,
    ...(layoutConfig.customPresets || []).map(p => ({
      ...p,
      gradient: p.gradient || `linear-gradient(135deg, ${p.primary} 0%, ${p.secondary} 100%)`,
    })),
  ];

  const getTargetWidth = () => {
    switch (deviceView) {
      case 'tablet':
        return 768;
      case 'mobile':
        return 375;
      default:
        return 1280;
    }
  };

  const targetWidth = getTargetWidth();
  const deviceScale = Math.min(containerWidth / targetWidth, 1);

  const getWrapperStyle = (): React.CSSProperties => {
    const baseHeight = deviceView === 'mobile' ? 700 : 850;
    const renderWidth = targetWidth * deviceScale;
    const renderHeight = baseHeight * deviceScale;

    return {
      width: `${renderWidth}px`,
      height: `${renderHeight}px`,
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      background: '#ffffff',
      margin: '0 auto',
      transition: 'width 0.3s ease, height 0.3s ease',
    };
  };

  const getIframeStyle = (): React.CSSProperties => {
    const baseHeight = deviceView === 'mobile' ? 700 : 850;

    return {
      width: `${targetWidth}px`,
      height: `${baseHeight}px`,
      transform: deviceScale < 1 ? `scale(${deviceScale})` : 'none',
      transformOrigin: 'top left',
      border: 'none',
    };
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
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '▶ Expandir Controles' : '◀ Ocultar Controles'}
          </button>

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
      <div className={`${styles.editorGrid} ${sidebarCollapsed ? styles.editorGridCollapsed : ''}`}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ margin: 0 }}>Paletas de Cores & Presets</label>
                    <button
                      type="button"
                      onClick={handleCreateCustomPreset}
                      style={{
                        background: '#fce4ec',
                        color: '#e91e63',
                        border: '1px solid #f48fb1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ➕ Criar Novo Preset
                    </button>
                  </div>
                  <div className={styles.presetsGrid}>
                    {allPresets.map((p, idx) => (
                      <div
                        key={(p as any).id || p.name || idx}
                        className={styles.presetCard}
                        onClick={() => applyPalette(p)}
                      >
                        <div className={styles.presetSwatches}>
                          <div className={styles.presetSwatch} style={{ background: p.primary }} />
                          <div className={styles.presetSwatch} style={{ background: p.secondary }} />
                          <div className={styles.presetSwatch} style={{ background: p.background }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <div
                            className={styles.presetLabel}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                            }}
                          >
                            {p.name} {(p as any).isCustom ? '⭐' : ''}
                          </div>

                          {(p as any).isCustom && (
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                              <button
                                type="button"
                                onClick={(e) => handleUpdateCustomPreset((p as any).id!, e)}
                                style={{
                                  background: '#eff6ff',
                                  color: '#2563eb',
                                  border: '1px solid #bfdbfe',
                                  borderRadius: '6px',
                                  padding: '2px 6px',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                }}
                                title="Salvar as cores atuais selecionadas neste preset"
                              >
                                💾
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomPreset((p as any).id!, e)}
                                style={{
                                  background: '#fef2f2',
                                  color: '#ef4444',
                                  border: '1px solid #fecaca',
                                  borderRadius: '6px',
                                  padding: '2px 6px',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                }}
                                title="Excluir preset"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
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
                  <label>Imagem da Artesã / Destaque da Home</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="/images/elaine_pic.jpg ou URL da imagem"
                    value={layoutConfig.hero.artisanImage || ''}
                    onChange={(e) => updateSectionConfig('hero', { artisanImage: e.target.value })}
                  />
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      📁 Enviar Nova Imagem
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const url = await imageService.uploadProductImage(file);
                              updateSectionConfig('hero', { artisanImage: url });
                            } catch (err: any) {
                              alert('Erro ao enviar imagem: ' + err.message);
                            }
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                      (Formatos: JPG, PNG, WEBP)
                    </span>
                  </div>
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
        <div className={styles.previewContainer} ref={previewContainerRef}>
          <div style={getWrapperStyle()}>
            <iframe
              ref={iframeRef}
              src="/"
              title="Site Live Preview"
              style={getIframeStyle()}
              onLoad={syncPreviewIframe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
