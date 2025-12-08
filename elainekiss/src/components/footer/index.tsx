import styles from "../footer/footer.module.css"

export function Footer() {
    return (
        <footer className={styles.footer}>

            <section className={styles.section}>

                <div className={styles.div}>
                    <h1 className={styles.h1}>Institucional</h1>
                    <p>Quem Somos</p>
                    <p>FAQ/Perguntas Frequentes</p>
                    <p>Termos de Uso</p>
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
                <p>Visa, Mastercard, Elo, Pix</p>
                
            </section>

        </footer>
    )
}