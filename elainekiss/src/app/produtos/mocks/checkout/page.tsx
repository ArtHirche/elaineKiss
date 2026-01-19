import styles from "./checkout.module.css";

import Link from "next/link";

import { produtos } from "../data";

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

                <div className={styles.form}>

                    <h1>Dados de contato</h1>

                    <input
                        type="email"
                        placeholder="E-mail"
                        className={styles.input}
                    />

                    <h1>Entrega</h1>

                    <input
                        type="text"
                        placeholder="CEP"
                        className={styles.input}
                    />

                    <h1>Dados de Entrega</h1>

                    <p>Endereço</p>
                    <input
                        type="text"
                        placeholder="Endereço"
                        className={styles.input}
                    />

                    <p>Nome</p>
                    <input
                        type="text"
                        placeholder="Nome"
                        className={styles.input}
                    />

                    <p>Telefone com DDD</p>
                    <input
                        type="text"
                        placeholder="Telefone com DDD"
                        className={styles.input}
                    />

                    <p>Rua</p>
                    <input
                        type="text"
                        placeholder="Rua"
                        className={styles.input}
                    />

                    <div className={styles.inputGroup}>
                        <div>
                            <p>Número</p>
                            <input
                                type="text"
                                placeholder="Número"
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <p>Complemento (opcional)</p>
                            <input
                                type="text"
                                placeholder="Complemento (opcional)"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <h1>Dados para Nota Fiscal</h1>

                    <p>CPF</p>
                    <input
                        type="text"
                        placeholder="CPF"
                        className={styles.input}
                    />

                    <Link href={`/produtos/mocks/checkout/pagamento?id=${idNum}`}>
                        <button className={styles.continuar}>
                            Continuar para o pagamento
                        </button>
                    </Link>

                </div>

                <div className={styles.resumo}>
                    <div className={styles.produto}>
                        <div className={styles.thumb}></div>
                        <span>{produto.nome}</span>
                        <strong>R$ {produto.preco}</strong>
                    </div>

                </div>

            </div>
        </div>
    );
}
