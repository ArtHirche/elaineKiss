"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import styles from "../../styles/produtos.module.css";

export default function ProdutoDetalhe({ params }: { params: Promise<{ id: string }> }) {
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
    const { products, loading, error } = useProducts();
    const { user } = useAuth();
    const { addToCart } = useCart(user?.uid || "");
    const [quantity, setQuantity] = useState(1);

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
    
    const produto = products.find(p => p.id === resolvedParams.id);

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Carregando produto...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Erro ao carregar produto</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!produto) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Produto não encontrado</h2>
                    <p>O produto que você está procurando não existe ou foi removido.</p>
                </div>
            </div>
        );
    }

    console.log('Produto encontrado:', produto);
    console.log('URL da imagem:', produto.imageUrl);

    const handleAddToCart = () => {
        addToCart(produto.id!, quantity, produto.price);
        alert('Produto adicionado ao carrinho!');
    };

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbs}>
                <a href="/">Home</a> &gt; 
                <a href="/produtos">Produtos</a> &gt; 
                {produto.name}
            </div>

            <div className={styles.produtoContainer}>
                <div className={styles.imagemContainer}>
                    <img 
                        src={produto.imageUrl || "/produtos/default.jpg"} 
                        alt={produto.name} 
                        className={styles.imagem}
                        onError={(e) => {
                            console.error('Erro ao carregar imagem:', produto.imageUrl);
                            console.log('Trocando para imagem padrão...');
                            e.currentTarget.src = "/produtos/default.jpg";
                        }}
                    />
                </div>

                <div className={styles.detalhesContainer}>
                    <h1 className={styles.nome}>{produto.name}</h1>
                    <p className={styles.categoria}>{produto.category}</p>
                    <p className={styles.descricao}>{produto.description}</p>
                    
                    <div className={styles.precoContainer}>
                        <span className={styles.preco}>R$ {produto.price.toFixed(2)}</span>
                    </div>

                    <div className={styles.compraContainer}>
                        <div className={styles.quantidadeContainer}>
                            <label>Quantidade:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className={styles.quantidadeInput}
                            />
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className={styles.botaoComprar}
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>

                    {produto.fileName && (
                        <div className={styles.arquivoInfo}>
                            <p><strong>Arquivo anexo:</strong> {produto.fileName}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
