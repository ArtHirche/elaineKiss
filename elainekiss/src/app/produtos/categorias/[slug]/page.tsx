"use client";

import { useState, useEffect } from "react";
import { categorias } from "@/data/categorias";
import { useProducts } from "@/hooks/useProducts";
import styles from "../../../styles/produtos.module.css";
import Link from "next/link";

export default function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
    const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
    const { products, loading } = useProducts();

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await params;
            setResolvedParams(resolved);
        };
        resolveParams();
    }, [params]);

    if (!resolvedParams) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Carregando...</h2>
                </div>
            </div>
        );
    }

    const { slug } = resolvedParams;
    const categoriaAtual = categorias.find((c) => c.slug === slug);
    
    // Filtrar produtos pela categoria
    const produtosFiltrados = products.filter(p => p.category === categoriaAtual?.nome);

    return (
        <div className={styles.container}>

            <div className={styles.breadcrumbs}><a href="/">Home</a> &gt; <a href="/produtos">Produtos</a> &gt; {categoriaAtual?.nome}</div>

            <div className={styles.layout}>

                <aside className={styles.sidebar}>
                    <h3 className={styles.categoriasTitle}>Categorias</h3>

                    <ul className={styles.categoriasLista}>
                        {categorias.map((cat, i) => {
                            return (
                                <li key={i} className={styles.categoriaItem}>
                                    <a href={`/produtos/categorias/${cat.slug}`}>
                                        {cat.nome}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
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

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <h2>Carregando produtos...</h2>
                            </div>
                        ) : produtosFiltrados.length === 0 ? (
                            <div className={styles.noResults}>
                                <p>Nenhum produto encontrado para esta categoria.</p>
                                <a href="/produtos">
                                    <button className={styles.clearButton}>
                                        Ver todos os produtos
                                    </button>
                                </a>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {produtosFiltrados.map((p) => (
                                    <Link href={`/produtos/${p.id}`} key={p.id} className={styles.card}>
                                        <img src={p.imageUrl || "/produtos/default.jpg"} alt={p.name} className={styles.img} />
                                        <p className={styles.nome}>{p.name}</p>
                                        <span className={styles.preco}>R$ {p.price.toFixed(2)}</span>
                                        <button className={styles.botaoCarrinho}>
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
