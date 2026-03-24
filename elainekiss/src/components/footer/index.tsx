import styles from "../footer/footer.module.css"
import Link from "next/link"

export function Footer() {
    return (
        <footer className={styles.footer}>

            <section className={styles.section}>

                <div className={styles.div}>
                    <h1 className={styles.h1}>Institucional</h1>
                    <p>Quem Somos</p>
                    <p>FAQ/Perguntas Frequentes</p>
                    <Link href="/termos" style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}>
                        <p>Termos de Uso</p>
                    </Link>
                </div>

                <div className={styles.div}>
                    <h1 className={styles.h1}>Entre em Contato</h1>
                    <p>5511980979540</p>
                    <p>+55 11 98097-9540</p>
                    <p>elainekiss11@hotmail.com</p>
                    <p>São Paulo - SP</p>
                </div>

                <div className={styles.div}>
                    <h1 className={styles.h1}>Redes Sociais</h1>
                    <div className={styles.socialLink}>
                        <Link 
                            href="https://www.instagram.com/kisselainecristina/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}
                        >
                            <img 
                                src="/images/instagram.png" 
                                alt="Instagram" 
                                className={styles.socialIcon}
                            />
                            <span>Instagram</span>
                        </Link>
                    </div>
                </div>

            </section>

        </footer>
    )
}