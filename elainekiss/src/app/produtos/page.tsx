"use client";

import styles from "../styles/produtos.module.css";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { categorias } from "@/data/categorias";
import { getImageSrc } from "@/lib/imageUtils";
import Link from "next/link";

export default function Produtos() {
    const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
    const { products, loading, error } = useProducts();
    const { addToCart, setOpen } = useCart();
    
    const handleCategoriaChange = (categoria: string) => {
        setSelectedCategorias(prev => 
            prev.includes(categoria) 
                ? prev.filter(c => c !== categoria)
                : [...prev, categoria]
        );
    };
    
    const handleAddToCart = (product: any, event: React.MouseEvent) => {
        event.preventDefault(); // Prevent navigation
        event.stopPropagation(); // Prevent link click
        
        // Add product to cart with quantity 1
        addToCart(product.id, 1, product.price);
        
        // Open cart drawer to show the added item
        setOpen(true);
        
        // Refresh page to update cart state
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };
    
    const produtosFiltrados = selectedCategorias.length === 0 
        ? products 
        : products.filter(produto => selectedCategorias.includes(produto.category));

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Carregando produtos...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Erro ao carregar produtos</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            <div className={styles.breadcrumbs}><a href="/">Home</a> &gt; Produtos</div>

            <div className={styles.layout}>

                <aside className={styles.sidebar}>
                    <h3 className={styles.categoriasTitle}>Categorias</h3>

                    <div className={styles.checkboxContainer}>
                        {categorias.map((cat) => (
                            <label key={cat.slug} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={selectedCategorias.includes(cat.nome)}
                                    onChange={() => handleCategoriaChange(cat.nome)}
                                />
                                <span className={styles.checkboxText}>{cat.nome}</span>
                            </label>
                        ))}
                    </div>
                    
                    {selectedCategorias.length > 0 && (
                        <div className={styles.selectedInfo}>
                            <span>{selectedCategorias.length} categoria(s) selecionada(s)</span>
                            <button 
                                className={styles.clearButton}
                                onClick={() => setSelectedCategorias([])}
                            >
                                Limpar
                            </button>
                        </div>
                    )}
                </aside>

                <main className={styles.main}>

                    <div className={styles.sortBar}>
                        <select className={styles.sortSelect}>
                            <option>Mais antigo ao mais novo</option>
                            <option>Mais novo ao mais antigo</option>
                            <option>Maior preço</option>
                            <option>Menor preço</option>
                        </select>
                    </div>

                    <section className={styles.sectionProdutos}>

                        {produtosFiltrados.length === 0 ? (
                            <div className={styles.noResults}>
                                <p>Nenhum produto encontrado para as categorias selecionadas.</p>
                                <button 
                                    className={styles.clearButton}
                                    onClick={() => setSelectedCategorias([])}
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {produtosFiltrados.map((p) => (
                                    <Link href={`/produtos/${p.id}`} key={p.id} className={styles.card}>
                                        <img 
                                            src={getImageSrc(p.imageUrl)} 
                                            alt={p.name} 
                                            className={styles.img}
                                            onError={(e) => {
                                                console.error('Erro ao carregar imagem para', p.name, ':', p.imageUrl);
                                                e.currentTarget.src = "/produtos/default.jpg";
                                            }}
                                        />
                                        <p className={styles.nome}>{p.name}</p>
                                        <span className={styles.preco}>R$ {p.price.toFixed(2)}</span>
                                        <button 
                                            className={styles.botaoCarrinho}
                                            onClick={(e) => handleAddToCart(p, e)}
                                        >
                                            Adicionar ao carrinho
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        )}

                    </section>

                </main>
            </div>
        </div>
    );
}
