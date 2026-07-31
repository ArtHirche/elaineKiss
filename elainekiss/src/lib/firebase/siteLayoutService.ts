import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SiteLayoutConfig, DEFAULT_SITE_LAYOUT } from '@/types/siteLayout';

const LAYOUT_DOC_PATH = { collection: 'site_settings', doc: 'layout' };

export const siteLayoutService = {
  async getLayoutConfig(): Promise<SiteLayoutConfig> {
    try {
      console.log('siteLayoutService: Carregando configurações de layout...');
      const docRef = doc(db, LAYOUT_DOC_PATH.collection, LAYOUT_DOC_PATH.doc);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as SiteLayoutConfig;
        console.log('siteLayoutService: Configuração carregada com sucesso:', data);
        // Garantir mesclagem com valores padrão caso existam novas chaves
        return {
          ...DEFAULT_SITE_LAYOUT,
          ...data,
          theme: { ...DEFAULT_SITE_LAYOUT.theme, ...(data.theme || {}) },
          announcement: { ...DEFAULT_SITE_LAYOUT.announcement, ...(data.announcement || {}) },
          hero: { ...DEFAULT_SITE_LAYOUT.hero, ...(data.hero || {}) },
          promoBanner: { ...DEFAULT_SITE_LAYOUT.promoBanner, ...(data.promoBanner || {}) },
          aboutUs: { ...DEFAULT_SITE_LAYOUT.aboutUs, ...(data.aboutUs || {}) },
          recentProducts: { ...DEFAULT_SITE_LAYOUT.recentProducts, ...(data.recentProducts || {}) },
          footer: { ...DEFAULT_SITE_LAYOUT.footer, ...(data.footer || {}) },
          sectionOrder: data.sectionOrder || DEFAULT_SITE_LAYOUT.sectionOrder,
        };
      }

      console.log('siteLayoutService: Nenhum documento encontrado, usando padrão.');
      return DEFAULT_SITE_LAYOUT;
    } catch (error) {
      console.error('siteLayoutService: Erro ao carregar configurações de layout:', error);
      return DEFAULT_SITE_LAYOUT;
    }
  },

  async saveLayoutConfig(config: SiteLayoutConfig): Promise<void> {
    try {
      console.log('siteLayoutService: Salvando configurações no Firestore...', config);
      const docRef = doc(db, LAYOUT_DOC_PATH.collection, LAYOUT_DOC_PATH.doc);
      const configToSave: SiteLayoutConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
      };
      await setDoc(docRef, configToSave);
      console.log('siteLayoutService: Configurações salvas com sucesso!');
    } catch (error) {
      console.error('siteLayoutService: Erro ao salvar configurações de layout:', error);
      throw error;
    }
  }
};
