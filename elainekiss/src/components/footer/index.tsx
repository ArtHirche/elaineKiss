const baseStyleSection = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: "20px",
    gap: "40px"
}

const baseStyleH1 = {
    color: "#d100d1",
    fontSize: "24px",
    marginBottom: "10px",
    textBold: "bold"
}

const baseStyleDiv = {
    padding: "10px"
}

export function Footer() {
    return (
        <footer  style={{
            width: "100%",
            height: "300px",
            backgroundColor: "#cacacaff",
            color: "black",
            padding: "15px 30px",
            borderTop: "1px solid #eee",
            gap: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <section style={{
                ...baseStyleSection
            }}>
                <div style={{
                    ...baseStyleDiv
                }}>
                    <h1 style={{
                        ...baseStyleH1
                    }}>Institucional</h1>
                    <p>Quem Somos</p>
                    <p>FAQ/Perguntas Frequentes</p>
                    <p>Termos de Uso</p>
                </div>

                <div style={{
                    ...baseStyleDiv
                }}>
                    <h1 style={{
                        ...baseStyleH1
                    }}>Entre em Contato</h1>
                    <p>5511980979540</p>
                    <p>+55 11 98097-9540</p>
                    <p>elainekiss11@hotmail.com</p>
                    <p>São Paulo - SP</p>
                </div>

                <div style={{
                    ...baseStyleDiv
                }}>
                    <h1 style={{
                        ...baseStyleH1
                    }}>Redes Sociais</h1>
                    <p>Instagram</p>
                </div>
            </section>

            <section style={{
                ...baseStyleSection
            }}>
                <h1 style={{
                        ...baseStyleH1
                    }}>Meios de Pagamento</h1>
                <p>Visa, Mastercard, Elo, Pix</p>
            </section>
        </footer>
    )
}