"use client";

import Link from "next/link";
import styles from "./styles/home.module.css";

export default function Home() {
    // Produtos mockados - em um projeto real, viriam de uma API
    const produtosRecentes = [
        { 
            id: 1, 
            nome: "Brinco Flor Amarela", 
            preco: 25.90, 
            imagem: "/produtos/1.jpg", 
            categoria: "Brincos",
            novo: true
        },
        { 
            id: 2, 
            nome: "Pulseira Concha do Mar", 
            preco: 35.50, 
            imagem: "/produtos/2.jpg", 
            categoria: "Aneis, Correntes e Pulseiras",
            novo: true
        },
        { 
            id: 3, 
            nome: "Chaveiro Crochê Girafa", 
            preco: 18.90, 
            imagem: "/produtos/3.jpg", 
            categoria: "Chaveiro Crochê",
            novo: true
        },
        { 
            id: 4, 
            nome: "Clips de Cabelo Coloridos", 
            preco: 12.50, 
            imagem: "/produtos/4.jpg", 
            categoria: "Clips",
            novo: true
        },
        { 
            id: 5, 
            nome: "Bolsa Infantil Unicornio", 
            preco: 45.00, 
            imagem: "/produtos/5.jpg", 
            categoria: "Bolsa Infantil",
            novo: true
        }
    ];

    const produtosPromocao = [
        { 
            id: 6, 
            nome: "Anel Prata Fina", 
            preco: 89.90, 
            precoOriginal: 120.00,
            imagem: "/produtos/6.jpg", 
            categoria: "Aneis, Correntes e Pulseiras",
            promocao: true
        },
        { 
            id: 7, 
            nome: "Caneta Decorada Flores", 
            preco: 8.90, 
            precoOriginal: 15.00,
            imagem: "/produtos/7.jpg", 
            categoria: "Canetas/Lápis",
            promocao: true
        },
        { 
            id: 8, 
            nome: "Corrente de Óculos Dourada", 
            preco: 22.50, 
            precoOriginal: 35.00,
            imagem: "/produtos/8.jpg", 
            categoria: "Corrente de Óculos",
            promocao: true
        },
        { 
            id: 9, 
            nome: "Button Broche Gatinho", 
            preco: 6.90, 
            precoOriginal: 10.00,
            imagem: "/produtos/9.jpg", 
            categoria: "Button/Broches",
            promocao: true
        },
        { 
            id: 10, 
            nome: "Estojo Escolar Disney", 
            preco: 28.90, 
            precoOriginal: 45.00,
            imagem: "/produtos/10.jpg", 
            categoria: "Estojo",
            promocao: true
        }
    ];

    const ProdutoCard = ({ produto }: { produto: any }) => (
        <Link href={`/produtos/mocks/${produto.id}`} className={styles.card}>
            {produto.novo && <span className={`${styles.tag} ${styles.tagNovo}`}>NOVO</span>}
            {produto.promocao && <span className={`${styles.tag} ${styles.tagPromocao}`}>PROMOÇÃO</span>}
            
            <img src={produto.imagem} alt={produto.nome} className={styles.img} />
            
            <h3 className={styles.nome}>{produto.nome}</h3>
            
            <div className={styles.precoContainer}>
                {produto.promocao ? (
                    <>
                        <span className={styles.precoPromocional}>R$ {produto.preco.toFixed(2)}</span>
                        <span className={styles.precoOriginal}>R$ {produto.precoOriginal.toFixed(2)}</span>
                    </>
                ) : (
                    <span className={styles.preco}>R$ {produto.preco.toFixed(2)}</span>
                )}
            </div>
            
            <button className={styles.botaoCarrinho}>
                Adicionar ao carrinho
            </button>
        </Link>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Elaine Kiss</h1>
                <p className={styles.subtitle}>
                    Acessórios únicos e artesanais com muito amor e carinho para você
                </p>
            </header>

            <main>
                {/* Produtos Recentes */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>🌟 Produtos Recentes</h2>
                    <div className={styles.grid}>
                        {produtosRecentes.map((produto) => (
                            <ProdutoCard key={produto.id} produto={produto} />
                        ))}
                    </div>
                </section>

                <div className={styles.separator}></div>

                {/* Produtos em Promoção */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>🔥 Ofertas Especiais</h2>
                    <div className={styles.grid}>
                        {produtosPromocao.map((produto) => (
                            <ProdutoCard key={produto.id} produto={produto} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
