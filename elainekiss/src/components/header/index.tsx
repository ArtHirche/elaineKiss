"use client";

import { useCart } from "@/context/CartContext"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSiteLayout } from "@/hooks/useSiteLayout";
import { useAuth } from "@/hooks/useAuth";
import styles from "./hearder.module.css";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const { setOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { layoutConfig } = useSiteLayout();
  const { user, logout } = useAuth();
  const activeCategories = categories.filter(cat => cat.isActive);

  // Close menu and suggestions on navigation
  useEffect(() => {
    setMenuOpen(false);
    setShowSuggestions(false);
    setCategoriesOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const getUserFirstName = (user: any) => {
    if (!user) return "";
    if (user.displayName && user.displayName.trim() !== "") {
      const nameParts = user.displayName.trim().split(" ");
      return nameParts[0];
    }
    if (user.email) {
      const emailUsername = user.email.split("@")[0];
      const cleanName = emailUsername.replace(/[._-]/g, " ");
      const firstName = cleanName.split(" ")[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    return "Cliente";
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      setMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Função para normalizar texto (remove acentos)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Divide a busca em palavras ignorando preposições comuns
  const getQueryWords = (q: string) => {
    const normalized = normalizeText(q);
    const stopWords = new Set(["de", "do", "da", "em", "para", "com", "o", "a", "os", "as"]);
    const words = normalized
      .split(/\s+/)
      .filter((word) => word.length > 0);
    
    const filteredWords = words.filter(word => !stopWords.has(word));
    return filteredWords.length > 0 ? filteredWords : words;
  };

  // Generate suggestions based on input
  useEffect(() => {
    if (busca.length > 2) {
      const queryWords = getQueryWords(busca);
      const filteredProducts = products.filter(produto => {
        const nome = normalizeText(produto.name);
        const categoria = normalizeText(produto.category);
        return queryWords.every((word) => nome.includes(word) || categoria.includes(word));
      });
      
      const uniqueSuggestions: string[] = Array.from(
        new Set(filteredProducts.map(p => p.name))
      ).slice(0, 5);
      
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [busca, products]);

  const handleSuggestionClick = (suggestion: string) => {
    setBusca(suggestion);
    setShowSuggestions(false);
    router.push(`/produtos/busca?q=${suggestion}`);
  };

  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const h = Math.ceil(headerRef.current.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const clickInsideHeader = headerRef.current?.contains(event.target as Node);
      const mobileMenu = document.querySelector(`.${styles.mobileMenu}`);
      const clickInsideMobileMenu = mobileMenu?.contains(event.target as Node);
      
      const searchInput = document.querySelector(`.${styles.search}`);
      const suggestionsDropdown = document.querySelector(`.${styles.suggestionsDropdown}`);
      
      const clickInsideSearch = searchInput?.contains(event.target as Node) || 
                                 suggestionsDropdown?.contains(event.target as Node);
      
      if (!clickInsideSearch) {
        setShowSuggestions(false);
      }

      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      
      if (!clickInsideHeader && !clickInsideMobileMenu) {
        setMenuOpen(false);
      }
    }

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      {layoutConfig?.announcement?.enabled && (
        <div style={{
          background: layoutConfig.announcement.backgroundColor || 'var(--primary-color, #e91e63)',
          color: layoutConfig.announcement.textColor || '#ffffff',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '0.88rem',
          fontWeight: 600,
          letterSpacing: '0.3px',
          zIndex: 1000,
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {layoutConfig.announcement.linkUrl ? (
            <Link href={layoutConfig.announcement.linkUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
              {layoutConfig.announcement.text}
            </Link>
          ) : (
            layoutConfig.announcement.text
          )}
        </div>
      )}
      <header className={styles.header} ref={headerRef}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            className={styles.logo} 
            src="/images/logo.png" 
            alt="Elaine Kiss Logo" 
            onLoad={updateHeaderHeight}
            style={{ width: '100px', height: '100px' }}
          />
        </Link>
        <div className={styles.sectionPesqBurg}>
          <form
            className={styles.searchForm}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/produtos/busca?q=${busca}`);
            }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className={`${styles.search} ${showSuggestions && suggestions.length > 0 ? styles.searchActive : ""}`}
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        <div className={styles.options}>
          <div className={styles.link}>
            <img className={styles.link_img} src="/images/help.svg" alt="" />
            <a className={styles.nav_link} href="#">
              Atendimento
            </a>
          </div>

          {user ? (
            <div className={styles.userMenuContainer} ref={userDropdownRef}>
              <button 
                className={styles.userProfileBtn}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title={`Conectado como ${user.email}`}
              >
                <div className={styles.avatarWrapper}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={getUserFirstName(user)} className={styles.userAvatarImg} />
                  ) : (
                    <img className={styles.link_img} src="/images/profile.svg" alt="Perfil" />
                  )}
                  <span className={styles.onlineBadge} title="Sessão Ativa" />
                </div>
                <div className={styles.nav_link}>
                  <span className={styles.welcomeText}>Olá, {getUserFirstName(user)}</span>
                  <span className={styles.accountSubtext}>Minha Conta ▼</span>
                </div>
              </button>

              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownHeader}>
                    <div className={styles.userDropdownAvatar}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" />
                      ) : (
                        <span>{getUserFirstName(user).charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className={styles.userDropdownInfo}>
                      <strong className={styles.userDropdownName}>
                        {user.displayName || getUserFirstName(user)}
                      </strong>
                      <span className={styles.userDropdownEmail}>{user.email}</span>
                      <span className={styles.statusTag}>● Sessão Ativa</span>
                    </div>
                  </div>

                  <div className={styles.userDropdownDivider} />

                  <button 
                    className={styles.userDropdownLogoutBtn}
                    onClick={handleLogout}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sair da Conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.link}>
              <img className={styles.link_img} src="/images/profile.svg" alt="" />
              <div className={styles.nav_link}>
                <Link
                  href="/login"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/login');
                  }}
                >
                  Minha Conta
                </Link>
              </div>
            </div>
          )}

          <div className={styles.link}>
            <button className={styles.link_btn} onClick={() => setOpen(true)}>
              <img className={styles.link_img} src="/images/cart01.svg" alt="" />
              <span className={styles.nav_link}>
                Carrinho
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div 
            className={styles.mobileMenuItem}
            style={{
              display: 'block',
              padding: '12px 0',
              borderBottom: '1px solid rgba(254, 212, 109, 0.15)',
              color: '#FED46D',
              fontWeight: 500
            }}
          >
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setMenuOpen(false)}>
              Início
            </Link>
          </div>

          <div 
            className={styles.mobileMenuDropdown}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderBottom: categoriesOpen ? '1px solid rgba(254, 212, 109, 0.15)' : 'none'
            }}
          >
            <div 
              className={styles.mobileMenuDropdownHeader}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                cursor: 'pointer',
                fontWeight: 500,
                color: '#FED46D',
                borderBottom: categoriesOpen ? 'none' : '1px solid rgba(254, 212, 109, 0.15)'
              }}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              <span>Produtos</span>
              <span>
                {categoriesOpen ? "▼" : "▶"}
              </span>
            </div>
            
            {categoriesOpen && (
              <div 
                className={styles.mobileSubMenu}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  margin: '5px 0 10px',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  maxHeight: '350px',
                  overflowY: 'auto'
                }}
              >
                <Link
                  href="/produtos"
                  className={styles.mobileSubMenuItem}
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    color: '#ffedbf',
                    textDecoration: 'none',
                    fontSize: '14px',
                    borderBottom: '1px solid rgba(254, 212, 109, 0.05)'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  Ver todos os produtos
                </Link>
                {activeCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/produtos/categorias/${cat.slug}`}
                    className={styles.mobileSubMenuItem}
                    style={{
                      display: 'block',
                      padding: '8px 10px',
                      color: '#ffedbf',
                      textDecoration: 'none',
                      fontSize: '14px',
                      borderBottom: '1px solid rgba(254, 212, 109, 0.05)'
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div 
            className={styles.mobileMenuItem}
            style={{
              display: 'block',
              padding: '12px 0',
              borderBottom: '1px solid rgba(254, 212, 109, 0.15)',
              color: '#FED46D',
              fontWeight: 500
            }}
          >
            <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              Atendimento
            </a>
          </div>
          
          {user ? (
            <div 
              style={{
                padding: '12px',
                backgroundColor: 'rgba(254, 212, 109, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(254, 212, 109, 0.25)',
                margin: '8px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #FED46D' }} />
                  ) : (
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#FED46D',
                      color: '#060748',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      {getUserFirstName(user).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#10B981',
                    border: '2px solid #060748',
                    borderRadius: '50%'
                  }} />
                </div>
                <div>
                  <div style={{ color: '#FED46D', fontWeight: 600, fontSize: '15px' }}>
                    Olá, {getUserFirstName(user)}
                  </div>
                  <div style={{ color: '#ffedbf', fontSize: '12px', opacity: 0.8 }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                Sair da conta
              </button>
            </div>
          ) : (
            <div 
              className={styles.mobileMenuItem}
              style={{
                display: 'block',
                padding: '12px 0',
                borderBottom: '1px solid rgba(254, 212, 109, 0.15)',
                color: '#FED46D',
                fontWeight: 500
              }}
            >
              <Link
                href="/login"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  router.push('/login');
                }}
              >
                Minha Conta
              </Link>
            </div>
          )}

          <div 
            className={styles.mobileMenuItem}
            style={{
              display: 'block',
              padding: '12px 0',
              borderBottom: '1px solid rgba(254, 212, 109, 0.15)',
              color: '#FED46D',
              fontWeight: 500
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                setOpen(true);
              }}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              Carrinho
            </a>
          </div>
        </div>
      )}
    </>
  );
}

