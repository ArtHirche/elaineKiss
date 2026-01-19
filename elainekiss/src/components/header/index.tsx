"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../header/hearder.module.css";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

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
          <img className={styles.logo} src="/images/logo.svg" alt="" />
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
            <img className={styles.link_img} src="/images/chat.svg" alt="" />
            <a className={styles.nav_link} href="#">
              Atendimento
            </a>
          </div>

          <div className={styles.link}>
            <img className={styles.link_img} src="/images/profile.svg" alt="" />
            <a className={styles.nav_link} href="#">
              Minha Conta
            </a>
          </div>

          <div className={styles.link}>
            <img className={styles.link_img} src="/images/car.svg" alt="" />
            <a className={styles.nav_link} href="#">
              Carrinho
            </a>
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
          <span><a href="#">Minha Conta</a></span>
          <span><a href="#">Carrinho</a></span>
        </div>
      )}
    </>
  );
}

