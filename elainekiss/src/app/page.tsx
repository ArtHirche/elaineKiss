"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./styles/home.module.css";

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    
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
        },
        { 
            id: 6, 
            nome: "Anel Prata Fina", 
            preco: 89.90, 
            imagem: "/produtos/6.jpg", 
            categoria: "Aneis, Correntes e Pulseiras",
            novo: true
        },
        { 
            id: 7, 
            nome: "Caneta Decorada Flores", 
            preco: 15.00, 
            imagem: "/produtos/7.jpg", 
            categoria: "Canetas/Lápis",
            novo: true
        },
        { 
            id: 8, 
            nome: "Corrente de Óculos Dourada", 
            preco: 35.00, 
            imagem: "/produtos/8.jpg", 
            categoria: "Corrente de Óculos",
            novo: true
        }
    ];

    const itemsPerView = 4;
    const maxIndex = Math.max(0, produtosRecentes.length - itemsPerView);

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const ProdutoCard = ({ produto }: { produto: any }) => (
        <div className={styles.carouselItem}>
            <Link href={`/produtos/mocks/${produto.id}`} className={styles.card}>
                <span className={`${styles.tag} ${styles.tagNovo}`}>NOVO</span>
                
                <img src={produto.imagem} alt={produto.nome} className={styles.img} />
                
                <h3 className={styles.nome}>{produto.nome}</h3>
                
                <span className={styles.preco}>R$ {produto.preco.toFixed(2)}</span>
                
                <button className={styles.botaoCarrinho}>
                    Adicionar ao carrinho
                </button>
            </Link>
        </div>
    );

    const totalDots = Math.ceil(produtosRecentes.length / itemsPerView);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Elaine Kiss</h1>
                <p className={styles.subtitle}>
                    Acessórios únicos e artesanais com muito amor e carinho para você
                </p>
                <Link href="/produtos" className={styles.botaoProdutos}>
                    Ver Todos os Produtos
                </Link>
            </header>

            <main>
                {/* Produtos Recentes em Carrossel */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>🌟 Produtos Recentes</h2>
                    
                    <div className={styles.carousel}>
                        <button 
                            className={`${styles.carouselButton} ${styles.prev}`}
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                        >
                            ‹
                        </button>
                        
                        <button 
                            className={`${styles.carouselButton} ${styles.next}`}
                            onClick={nextSlide}
                            disabled={currentIndex >= maxIndex}
                        >
                            ›
                        </button>
                        
                        <div 
                            className={styles.carouselContainer}
                            style={{
                                transform: `translateX(-${currentIndex * 280}px)`
                            }}
                        >
                            {produtosRecentes.map((produto, index) => (
                                <ProdutoCard key={produto.id} produto={produto} />
                            ))}
                        </div>
                    </div>
                    
                    <div className={styles.carouselDots}>
                        {Array.from({ length: totalDots }, (_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === Math.floor(currentIndex / itemsPerView) ? styles.active : ''}`}
                                onClick={() => goToSlide(i * itemsPerView)}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
