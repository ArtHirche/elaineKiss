export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  background: string;
  cardBackground: string;
  textColor: string;
  headerBackground: string;
  footerBackground: string;
  accentGradient: string;
  borderRadius: string; // e.g., '8px', '16px', '24px'
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  linkUrl: string;
  backgroundColor: string;
  textColor: string;
}

export interface HeroConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  artisanImage?: string;
  bgMode: 'gradient' | 'image' | 'solid';
  bgImage: string;
  bgColor: string;
  alignment: 'center' | 'left' | 'right';
}

export interface PromoBannerConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  backgroundColor: string;
  textColor: string;
}

export interface AboutUsConfig {
  enabled: boolean;
  title: string;
  content: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
}

export interface RecentProductsConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  maxItems: number;
}

export interface FooterConfig {
  copyrightText: string;
  showSocialLinks: boolean;
  instagramUrl: string;
  whatsappNumber: string;
}

export interface ColorPreset {
  id?: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  cardBackground: string;
  headerBackground: string;
  gradient?: string;
  isCustom?: boolean;
}

export type SectionId = 'announcement' | 'hero' | 'recentProducts' | 'promoBanner' | 'aboutUs';

export interface SiteLayoutConfig {
  theme: ThemeColors;
  announcement: AnnouncementConfig;
  hero: HeroConfig;
  promoBanner: PromoBannerConfig;
  aboutUs: AboutUsConfig;
  recentProducts: RecentProductsConfig;
  footer: FooterConfig;
  sectionOrder: SectionId[];
  customPresets?: ColorPreset[];
  lastUpdated?: string;
}

export const DEFAULT_SITE_LAYOUT: SiteLayoutConfig = {
  theme: {
    primary: "#060748",
    primaryHover: "#3a3c85",
    secondary: "#3a3c85",
    background: "#ffffff",
    cardBackground: "#f8f9fa",
    textColor: "#171717",
    headerBackground: "#060748",
    footerBackground: "#060748",
    accentGradient: "linear-gradient(135deg, #060748 0%, #3a3c85 100%)",
    borderRadius: "16px",
  },
  announcement: {
    enabled: true,
    text: "✨ Frete grátis para compras acima de R$ 150,00! Aproveite! ✨",
    linkUrl: "/produtos",
    backgroundColor: "#e91e63",
    textColor: "#ffffff",
  },
  hero: {
    enabled: true,
    title: "Elaine Kiss",
    subtitle: "Acessórios únicos e artesanais com muito amor e carinho para você",
    buttonText: "Ver Todos os Produtos",
    buttonUrl: "/produtos",
    artisanImage: "/images/elaine_pic.jpg",
    bgMode: "gradient",
    bgImage: "",
    bgColor: "#fff0f5",
    alignment: "center",
  },
  promoBanner: {
    enabled: true,
    badge: "OFERTA ESPECIAL",
    title: "Coleção Artesanal Exclusiva",
    subtitle: "Peças feitas à mão com materiais selecionados de altíssima qualidade.",
    buttonText: "Explorar Coleção",
    buttonUrl: "/produtos",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#fff0f6",
    textColor: "#171717",
  },
  aboutUs: {
    enabled: true,
    title: "Sobre a Elaine Kiss",
    content: "Criamos acessórios artesanais únicos pensando no seu bem-estar, estilo e espiritualidade. Cada item é elaborado com atenção aos mínimos detalhes e energias positivas.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    imagePosition: "left",
  },
  recentProducts: {
    enabled: true,
    title: "🌟 Produtos Recentes",
    subtitle: "Confira as últimas novidades que acabaram de chegar na loja",
    maxItems: 8,
  },
  footer: {
    copyrightText: "© Elaine Kiss - Todos os direitos reservados",
    showSocialLinks: true,
    instagramUrl: "https://instagram.com",
    whatsappNumber: "5511999999999",
  },
  sectionOrder: ["announcement", "hero", "recentProducts", "promoBanner", "aboutUs"],
};
