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

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <>
      <header className={styles.header} ref={headerRef}>
        <div>
          <img className={styles.logo} src="/images/logo.png" alt="" />
        </div>
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

          <div className={styles.link_catg}>
            <a className={styles.nav_link} href="#">
              Categorias
            </a>
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

