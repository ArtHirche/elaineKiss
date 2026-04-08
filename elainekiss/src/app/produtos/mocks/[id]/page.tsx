import Link from "next/link";

import styles from "./produto.module.css";

import { produtos } from "../data";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ProdutoPage({ params }: PageProps) {
    const { id } = await params;
    const idNum = Number(id);
    const produto = produtos.find((p) => p.id === idNum);

    if (!produto) {
        return <h1>Produto não encontrado</h1>;
    }

    return (
        <div className={styles.page}>
            <section className={styles.produto_container}>

                <img className={styles.produto_imagem} src="#" alt="" />

                <div className={styles.produto_detalhe}>
                    <div className={styles.breadcrumbs}>
                        <Link href="/">Início</Link> &gt;
                        <Link href="/produtos"> Produtos</Link> &gt;
                        <span> {produto.nome}</span>
                    </div>

                    <h1>{produto.nome}</h1>

                    <p className={styles.preco}>R$ {produto.preco}</p>

                    <div className={styles.compra_container}>
                        <div className={styles.quantidade}>
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                        </div>

                        <div className={styles.botoes_compra}>
                            <button className={styles.comprar}>
                                <img className={styles.whatsapp} src="/images/whatsapp.svg" alt="WhatsApp" />
                                COMPRAR
                            </button>
                            <button className={styles.comprar_carrinho}>Adicionar ao Carrinho</button>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

