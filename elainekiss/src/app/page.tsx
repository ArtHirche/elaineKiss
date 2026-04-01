"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles/home.module.css";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { products, loading } = useProducts();
    
    // Pegar apenas os 8 produtos mais recentes para o carrossel
    const produtosRecentes = products.slice(0, 8).map(product => ({
        id: product.id,
        nome: product.name,
        preco: product.price,
        imagem: product.imageUrl || "/produtos/default.jpg",
        categoria: product.category,
        novo: true
    }));

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
            <Link href={`/produtos/${produto.id}`} className={styles.card}>
                <span className={`${styles.tag} ${styles.tagNovo}`}>NOVO</span>
                
                <img src={produto.imagem} alt={produto.nome} className={styles.img} />
                
                <h3 className={styles.nome}>{produto.nome}</h3>
                
                <span className={styles.preco}>R$ {produto.preco.toFixed(2)}</span>
            </Link>
        </div>
    );

    const totalDots = Math.ceil(produtosRecentes.length / itemsPerView);

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Carregando produtos...</h2>
                </div>
            </div>
        );
    }

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
