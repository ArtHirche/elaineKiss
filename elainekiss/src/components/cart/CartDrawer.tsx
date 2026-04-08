"use client";

import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { getImageSrc } from "@/lib/imageUtils";
import styles from "./cart.module.css";

export default function CartDrawer() {
    const { open, setOpen, cartItems, loading, error, removeFromCart, getTotalPrice, getTotalItems } = useCart();
    const { products } = useProducts();

    const handleRemoveItem = (itemId: string) => {
        removeFromCart(itemId);
    };

    const handleWhatsAppPurchase = () => {
        if (cartItems.length === 0) return;
        
        const productsList = cartItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            return `${item.quantity} do ${product?.name || 'Produto não encontrado'}`;
        }).join(', ');
        
        const message = `Olá, estou interessado em ${productsList}`;
        const whatsappUrl = `https://wa.me/5511976965006?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();

    if (loading) {
        return (
            <>
                {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
                <div className={`${styles.drawer} ${open ? styles.open : ""}`}>
                    <button className={styles.close} onClick={() => setOpen(false)}>
                        ✕
                    </button>
                    <div className={styles.list}>
                        <p>Carregando...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
                <div className={`${styles.drawer} ${open ? styles.open : ""}`}>
                    <button className={styles.close} onClick={() => setOpen(false)}>
                        ✕
                    </button>
                    <div className={styles.list}>
                        <p>Erro: {error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Overlay escuro */}
            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

            {/* Drawer */}
            <div className={`${styles.drawer} ${open ? styles.open : ""}`}>
                <button className={styles.close} onClick={() => setOpen(false)}>
                    ✕
                </button>

                <div className={styles.list}>
                    {cartItems.length === 0 ? (
                        <p>Seu carrinho está vazio</p>
                    ) : (
                        cartItems.map((item) => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.thumb}>
                                        {product?.imageUrl && (
                                            <img 
                                                src={getImageSrc(product.imageUrl)} 
                                                alt={product.name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: "4px"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.info}>
                                        <p className={styles.nome}>Produto: {product?.name || 'Carregando...'}</p>
                                        <span className={styles.preco}>R$ {item.price.toFixed(2)}</span>
                                        <p className={styles.quantidade}>Quantidade: {item.quantity}</p>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className={styles.removeButton}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span>Total de itens: {totalItems}</span>
                            <span>Total: R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button className={styles.buy} onClick={handleWhatsAppPurchase}>Comprar Agora</button>
                    </div>
                )}
            </div>
        </>
    );
}
