"use client";

import { useCart } from "@/context/CartContext"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../header/hearder.module.css";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement | null>(null);
  const { setOpen } = useCart();
  const router = useRouter();

  

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
        <Link href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
          <img className={styles.logo} src="/images/logo.png" alt="Elaine Kiss Logo" />
        </Link>
        <section className={styles.sectionPesqBurg}>
          <input
            type="text"
            className={styles.search}
            placeholder="Buscar produtos..."
          />

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          
        </section>

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
                style={{textDecoration: 'none', color: 'inherit'}}
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

          
        </div>


      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <span><a href="#">Atendimento</a></span>
          <span>
            <Link 
              href="/login" 
              style={{textDecoration: 'none', color: 'inherit'}}
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

