import styles from "./pagamento.module.css";

import Link from "next/link";

import { produtos } from "../../data";

interface PageProps {
    searchParams: Promise<{
        id?: string;
    }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {

    const { id } = await searchParams;
    const idNum = Number(id || "1");
    const produto = produtos.find((p) => p.id === idNum);

    if (!produto) {
        return <h1>Produto não encontrado</h1>;
    }
    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <div className={styles.left}>

                    <div className={styles.box}>
                        <p className={styles.alerta}>
                            O tempo em média de produção do produto varia entre 5h à 10 dias.
                        </p>

                        <div className={styles.info}>
                            <span><strong>E-mail:</strong> cliente@email.com</span>
                        </div>

                        <div className={styles.info}>
                            <span><strong>Endereço:</strong> Rua Exemplo, 123 - SP</span>
                        </div>

                        <div className={styles.info}>
                            <span><strong>Entrega:</strong> Sedex - R$ 11,91</span>
                        </div>
                    </div>

                    <h2 className={styles.titulo_pagamento}>Forma de pagamento</h2>

                    <div className={styles.pagamento}>
                        <button className={styles.metodo}>
                            <img src="https://img.icons8.com/color/48/000000/pix.png" alt="Pix" />
                            Pix
                        </button>
                    </div>

                    <button className={styles.finalizar}>
                        FAZER PEDIDO
                    </button>
                </div>

                <div className={styles.right}>
                    <div className={styles.resumo}>
                        <div className={styles.produto}>
                            <div className={styles.thumb}></div>
                            <span>{produto.nome}</span>
                            <strong>R$ {produto.preco.toFixed(2)}</strong>
                        </div>

                        <div className={styles.linha}>
                            <span>Subtotal</span>
                            <span>R$ {produto.preco}</span>
                        </div>

                        <div className={styles.linha}>
                            <span>Frete</span>
                            <span>R$ 11,00</span>
                        </div>

                        <div className={styles.total}>
                            <span>Total</span>
                            <strong>R$ {produto.preco + 11}</strong>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
