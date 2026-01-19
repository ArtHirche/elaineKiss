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

                        <Link href={`/produtos/mocks/checkout?id=${produto.id}`}>
                            <button className={styles.comprar}>COMPRAR</button>
                        </Link>
                    </div>

                    <button className={styles.comprar_carrinho}>Adicionar ao Carrinho</button>

                    <div className={styles.frete}>
                        <strong>Meios de envio</strong>

                        <div className={styles.cepBox}>
                            <input type="number" placeholder="Seu CEP" />
                            <button>CALCULAR</button>
                        </div>

                        <a href="#">Não sei meu CEP</a>
                    </div>
                </div>

            </section>

        </div>
    );
}

