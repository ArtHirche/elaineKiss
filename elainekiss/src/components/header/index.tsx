"use client";

import { useCart } from "@/context/CartContext"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { produtos } from "../../app/produtos/mocks/data";
import styles from "../header/hearder.module.css";
import UserMenu from "@/components/auth/UserMenu";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriasDropdownOpen, setCategoriasDropdownOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const { setOpen } = useCart();
  const router = useRouter();

  // Generate suggestions based on input
  useEffect(() => {
    if (busca.length > 2) {
      const filteredProducts = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(busca.toLowerCase())
      );
      
      const uniqueSuggestions: string[] = Array.from(
        new Set(filteredProducts.map(p => p.nome))
      ).slice(0, 5);
      
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [busca]);

  const handleSuggestionClick = (suggestion: string) => {
    setBusca(suggestion);
    setShowSuggestions(false);
    router.push(`/produtos/busca?q=${suggestion}`);
  };

  const categorias = [
    "Aneis, Correntes e Pulseiras",
    "Bolsa Infantil",
    "Brincos",
    "Button/Broches",
    "Canetas/Lápis",
    "Chaveiros",
    "Chaveiro Crochê",
    "Clips",
    "Corrente de Óculos",
    "Cremes/Batons",
    "Escova de Cabelo",
    "Estojo",
    "Etiquetas",
    "Imã de Geladeira",
    "Marca Página",
    "Pin Tênis e Crock",
    "Phone Scrap",
    "Ponteira de Lápis",
    "Pregador de Papeis/Alimentos",
    "Prendedor de Chupeta",
    "Produtos de Cabelo",
    "Roller Clips/Crachá/Bilhete",
    "Terços e Mini Terços",
    "Tubetes"
  ].sort();


  useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        const h = Math.ceil(headerRef.current.getBoundingClientRect().height);
        document.documentElement.style.setProperty("--header-height", `${h}px`);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      // Removido - não há mais dropdown de categorias
    }

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className={styles.header} ref={headerRef}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img className={styles.logo} src="/images/logo.png" alt="Elaine Kiss Logo" />
        </Link>
        <div className={styles.sectionPesqBurg}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/produtos/busca?q=${busca}`);
            }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className={styles.search}
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
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
              <a className={styles.nav_link} href="#">
                Carrinho
              </a>
            </button>
          </div>

          <div className={styles.link_catg}>
            <button
              className={styles.nav_link}
              onClick={() => setCategoriasDropdownOpen(!categoriasDropdownOpen)}
            >
              Categorias
            </button>

            {categoriasDropdownOpen && (
              <div className={styles.categoriasDropdown}>
                <ul className={styles.categoriasDropdownMenu}>
                  {categorias.map((cat, i) => {
                    const slug = cat
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/,/g, "")
                      .replace(/\//g, "-")
                      .replace(/ /g, "-")
                      .replace(/[^\w-]+/g, "");

                    return (
                      <li key={i} className={styles.categoriasDropdownItem}>
                        <Link href={`/produtos/${slug}`}>
                          {cat}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

        </div>


      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <span><a href="#">Atendimento</a></span>
          <span>
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
          </span>
          <span><a href="#">Carrinho</a></span>
        </div>
      )}
    </>
  );
}

