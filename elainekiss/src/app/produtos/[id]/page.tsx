"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { getImageSrc } from "@/lib/imageUtils";
import styles from "./produto.module.css";

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
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const handleWhatsAppPurchase = () => {
        const message = `Olá, estou interessado em ${quantity} do ${produto.name}`;
        const whatsappUrl = `https://wa.me/5511980979540?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

        
    return (
        <div className={styles.page}>
            <section className={styles.produto_container}>

                <img
                    className={styles.produto_imagem}
                    src={getImageSrc(produto.imageUrl)}
                    alt={produto.name}
                />

                <div className={styles.produto_detalhe}>
                    <div className={styles.breadcrumbs}>
                        <a href="/">Início</a> &gt;
                        <a href="/produtos"> Produtos</a> &gt;
                        <span> {produto.name}</span>
                    </div>

                    <h1>{produto.name}</h1>

                    <p className={styles.preco}>R$ {produto.price.toFixed(2)}</p>

                    <div className={styles.compra_container}>
                        <div className={styles.quantidade}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >-</button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                            >+</button>
                        </div>

                        <div className={styles.botoes_compra}>
                            <button 
                                onClick={handleWhatsAppPurchase}
                                className={styles.comprar}
                            >
                                <img className={styles.whatsapp} src="/images/whatsapp.svg" alt="WhatsApp" />
                                COMPRAR
                            </button>
                            <button
                                onClick={() => handleAddToCart()}
                                className={styles.comprar_carrinho}
                            >Adicionar ao Carrinho</button>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}
