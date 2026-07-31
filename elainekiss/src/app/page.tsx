"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles/home.module.css";
import { useProducts } from "@/hooks/useProducts";
import { useSiteLayout } from "@/hooks/useSiteLayout";

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { products, loading } = useProducts();
    const { layoutConfig, isInlineEditMode, updateSectionConfig } = useSiteLayout();

    // Verificar se está em mobile para ajustar o carrossel
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const itemsPerView = isMobile ? 1 : 4;
    const maxItems = layoutConfig?.recentProducts?.maxItems || 8;

    // Get recent products
    const produtosRecentes = products.slice(0, maxItems).map(product => ({
        id: product.id,
        nome: product.name,
        preco: product.price,
        imagem: product.imageUrl || "/produtos/default.jpg",
        categoria: product.category,
        novo: true
    }));

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

    const handleInlineTextEdit = (section: any, key: string, currentVal: string) => {
        if (!isInlineEditMode) return;
        const newVal = prompt(`Editar texto (${key}):`, currentVal);
        if (newVal !== null && newVal.trim() !== "") {
            updateSectionConfig(section, { [key]: newVal.trim() });
        }
    };

    const ProdutoCard = ({ produto, isMobile, currentIndex, index }: { produto: any; isMobile?: boolean; currentIndex?: number; index?: number }) => (
        <div
            className={styles.carouselItem}
            style={{
                display: isMobile ? (index === currentIndex ? 'block' : 'none') : 'block'
            }}
        >
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

    const hero = layoutConfig?.hero || {
        enabled: true,
        title: "Elaine Kiss",
        subtitle: "Acessórios únicos e artesanais com muito amor e carinho para você",
        buttonText: "Ver Todos os Produtos",
        buttonUrl: "/produtos",
    };

    const recentProducts = layoutConfig?.recentProducts || {
        enabled: true,
        title: "🌟 Produtos Recentes",
    };

    return (
        <div className={styles.container}>
            {hero.enabled && (
                <header className={styles.header}>
                    <h1
                        className={styles.title}
                        style={{ cursor: isInlineEditMode ? 'pointer' : 'default' }}
                        onClick={() => handleInlineTextEdit('hero', 'title', hero.title)}
                        title={isInlineEditMode ? 'Clique para editar o título' : undefined}
                    >
                        {hero.title || 'Elaine Kiss'}
                    </h1>
                    <p
                        className={styles.subtitle}
                        style={{ cursor: isInlineEditMode ? 'pointer' : 'default' }}
                        onClick={() => handleInlineTextEdit('hero', 'subtitle', hero.subtitle)}
                        title={isInlineEditMode ? 'Clique para editar o subtítulo' : undefined}
                    >
                        {hero.subtitle || 'Acessórios únicos e artesanais com muito amor e carinho para você'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <img
                            src="/images/elaine_pic.jpg"
                            alt="Foto da artesã"
                            className={styles.fotoArtesa}
                        />
                    </div>

                    {hero.buttonText && (
                        <Link
                            href={hero.buttonUrl || '/produtos'}
                            className={styles.botaoProdutos}
                            style={{
                                backgroundColor: layoutConfig?.theme?.primary || '#060748',
                                borderRadius: layoutConfig?.theme?.borderRadius || '8px',
                            }}
                        >
                            {hero.buttonText}
                        </Link>
                    )}
                </header>
            )}

            <main>
                {recentProducts.enabled && (
                    <section className={styles.section}>
                        <h2
                            className={styles.sectionTitle}
                            style={{ cursor: isInlineEditMode ? 'pointer' : 'default' }}
                            onClick={() => handleInlineTextEdit('recentProducts', 'title', recentProducts.title)}
                        >
                            {recentProducts.title || '🌟 Produtos Recentes'}
                        </h2>

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
                                    transform: isMobile ? 'none' : `translateX(-${currentIndex * 330}px)`
                                }}
                            >
                                {produtosRecentes.map((produto, index) => (
                                    <ProdutoCard
                                        key={produto.id}
                                        produto={produto}
                                        isMobile={isMobile}
                                        currentIndex={currentIndex}
                                        index={index}
                                    />
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
                )}
            </main>
        </div>
    );
}
