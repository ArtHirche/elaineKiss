export function Header() {
    return (
        <header
            style={{
                width: "100%",
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "15px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                borderBottom: "1px solid #eee"
            }}
        >
            <div style={{ fontSize: "22px", fontWeight: "bold", minWidth: "140px" }}>
                Minha Loja
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <input
                    type="text"
                    placeholder="O que você está buscando?"
                    style={{
                        width: "70%",
                        maxWidth: "700px",
                        padding: "12px 18px",
                        borderRadius: "10px",
                        border: "2px solid #d100d1",
                        outline: "none",
                        fontSize: "16px"
                    }}
                />
            </div>

            <nav
                style={{
                    display: "flex",
                    gap: "25px",
                    minWidth: "220px",
                    justifyContent: "flex-end",
                    fontSize: "16px"
                }}
            >
                <a href="#" style={{ textDecoration: "none", color: "#000" }}>
                    Atendimento
                </a>
                <a href="#" style={{ textDecoration: "none", color: "#000" }}>
                    Minha Conta
                </a>
                <a href="#" style={{ textDecoration: "none", color: "#000" }}>
                    Carrinho
                </a>
            </nav>
        </header>
    )
}