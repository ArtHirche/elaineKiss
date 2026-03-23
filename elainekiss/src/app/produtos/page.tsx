"use client";

import styles from "../styles/produtos.module.css";
import { useState, useEffect } from "react";

import Link from "next/link";

export default function Produtos() {
    const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
    
    const categorias = [
        "Aneis, Correntes e Pulseiras",
        "Bolsa Infantil",
        "Brincos",
        "Button/Broches",
        "Canetas/Lápis",
        "Chaveiros",
        "Chaveiro Crochê",
        "Clips",
        "Corrente de Óculos",
        "Cremes/Batons",
        "Escova de Cabelo",
        "Estojo",
        "Etiquetas",
        "Imã de Geladeira",
        "Marca Página",
        "Pin Tênis e Crock",
        "Phone Scrap",
        "Ponteira de Lápis",
        "Pregador de Papeis/Alimentos",
        "Prendedor de Chupeta",
        "Produtos de Cabelo",
        "Roller Clips/Crachá/Bilhete",
        "Terços e Mini Terços",
        "Tubetes"
    ];

    const handleCategoriaChange = (categoria: string) => {
    setSelectedCategorias(prev => 
        prev.includes(categoria) 
            ? prev.filter(c => c !== categoria)
            : [...prev, categoria]
    );
};
    
    const produtos = [
        { id: 1, nome: "Produto 1", preco: 12.50, imagem: "/produtos/1.jpg", categoria: "Brincos" },
        { id: 2, nome: "Produto 2", preco: 19.90, imagem: "/produtos/2.jpg", categoria: "Aneis, Correntes e Pulseiras" },
        { id: 3, nome: "Produto 3", preco: 29.99, imagem: "/produtos/3.jpg", categoria: "Clips" },
        { id: 4, nome: "Produto 4", preco: 29.99, imagem: "/produtos/4.jpg", categoria: "Chaveiros" },
        { id: 5, nome: "Produto 5", preco: 29.99, imagem: "/produtos/5.jpg", categoria: "Bolsa Infantil" },
        { id: 6, nome: "Produto 6", preco: 200.99, imagem: "/produtos/6.jpg", categoria: "Button/Broches" },
        { id: 7, nome: "Produto 7", preco: 20.99, imagem: "/produtos/7.jpg", categoria: "Canetas/Lápis" },
        { id: 8, nome: "Produto 8", preco: 29.99, imagem: "/produtos/8.jpg", categoria: "Chaveiro Crochê" },
        { id: 9, nome: "Produto 9", preco: 29.99, imagem: "/produtos/9.jpg", categoria: "Corrente de Óculos" },
        { id: 10, nome: "Produto 10", preco: 29.99, imagem: "/produtos/10.jpg", categoria: "Cremes/Batons" },
        { id: 11, nome: "Produto 11", preco: 29.99, imagem: "/produtos/11.jpg", categoria: "Escova de Cabelo" },
        { id: 12, nome: "Produto 12", preco: 29.99, imagem: "/produtos/12.jpg", categoria: "Estojo" },
    ];

    const produtosFiltrados = selectedCategorias.length === 0 
        ? produtos 
        : produtos.filter(produto => selectedCategorias.includes(produto.categoria));

    return (
        <div className={styles.container}>

            <div className={styles.breadcrumbs}><a href="/">Home</a> &gt; Produtos</div>

            <div className={styles.layout}>

                <aside className={styles.sidebar}>
                    <h3 className={styles.categoriasTitle}>Categorias</h3>

                    <div className={styles.checkboxContainer}>
                        {categorias.map((cat, i) => (
                            <label key={i} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={selectedCategorias.includes(cat)}
                                    onChange={() => handleCategoriaChange(cat)}
                                />
                                <span className={styles.checkboxText}>{cat}</span>
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
                                    <a href={`/produtos/mocks/${p.id}`} key={p.id} className={styles.card}>
                                        <img src={p.imagem} alt={p.nome} className={styles.img} />
                                        <p className={styles.nome}>{p.nome}</p>
                                        <span className={styles.preco}>R$ {p.preco.toFixed(2)}</span>
                                        <button className={styles.botaoCarrinho}>
                                            Adicionar ao carrinho
                                        </button>
                                    </a>
                                ))}
                            </div>
                        )}

                    </section>

                </main>
            </div>
        </div>
    );
}
