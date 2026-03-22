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
                    <p>Instagram</p>
                </div>

            </section>

            <section className={styles.section}>

                <h1 className={styles.h1}>Meios de Pagamento</h1>
                <img src="images/pix.png" alt="Meios de Pagamento"/>

            </section>

        </footer>
    )
}