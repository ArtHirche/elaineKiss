"use client";

import { useCart } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartDrawer() {
    const { open, setOpen, cartItems, loading, error, removeFromCart, getTotalPrice, getTotalItems } = useCart();

    const handleRemoveItem = (itemId: string) => {
        removeFromCart(itemId);
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
                        cartItems.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.thumb}></div>
                                <div>
                                    <p>Produto ID: {item.productId}</p>
                                    <span>R$ {item.price.toFixed(2)}</span>
                                    <p>Quantidade: {item.quantity}</p>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)}
                                        style={{ 
                                            background: 'red', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span>Total de itens: {totalItems}</span>
                            <span>Total: R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button className={styles.buy}>Comprar Agora</button>
                    </div>
                )}
            </div>
        </>
    );
}
