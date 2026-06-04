"use client";

import { useCart } from "@/context/CartContext"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { categorias } from "@/data/categorias";
import styles from "./hearder.module.css";
import UserMenu from "@/components/auth/UserMenu";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const { setOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const { products } = useProducts();

  // Close menu and suggestions on navigation
  useEffect(() => {
    setMenuOpen(false);
    setShowSuggestions(false);
    setCategoriesOpen(false);
  }, [pathname]);

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
                {categorias.map((cat) => (
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
                    {cat.nome}
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

