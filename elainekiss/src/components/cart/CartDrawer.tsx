"use client";

import { useCart } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartDrawer() {
    const { open, setOpen } = useCart();

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
                    <div className={styles.item}>
                        <div className={styles.thumb}></div>
                        <div>
                            <p>Produto Exemplo</p>
                            <span>R$ 10,99</span>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <div className={styles.thumb}></div>
                        <div>
                            <p>Produto Exemplo</p>
                            <span>R$ 10,99</span>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <div className={styles.thumb}></div>
                        <div>
                            <p>Produto Exemplo</p>
                            <span>R$ 10,99</span>
                        </div>
                    </div>
                </div>

                <button className={styles.buy}>Comprar Agora</button>
            </div>
        </>
    );
}
