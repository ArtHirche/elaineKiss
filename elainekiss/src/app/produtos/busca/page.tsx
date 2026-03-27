"use client";

import React from "react";
import Link from "next/link";
import { produtos } from "../mocks/data";
import styles from "./busca.module.css";

interface Props {
  searchParams: Promise<{
    q: string;
  }>;
}

export default function BuscaPage({ searchParams }: Props) {
  const resolvedSearchParams = React.use(searchParams);
  const query = resolvedSearchParams.q?.toLowerCase() || "";

  // Função para normalizar texto (remove acentos)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const normalizedQuery = normalizeText(query);

  const produtosFiltrados = produtos.filter((produto) => {
    const nome = normalizeText(produto.nome);
    const categoria = normalizeText(produto.categoria);

    return (
      nome.includes(normalizedQuery) ||
      categoria.includes(normalizedQuery)
    );
  });

  const searchType = `"${resolvedSearchParams.q}"`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Resultados da busca: {searchType}
      </h1>

      {produtosFiltrados.length === 0 ? (
        <div className={styles.noResults}>
          <p>
            Nenhum produto encontrado para "
            {resolvedSearchParams.q}".
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className={styles.productCard}>
              <h3 className={styles.productName}>
                {produto.nome}
              </h3>

              <img className={styles.productImage} src="#" alt={produto.nome} />

              <p className={styles.productCategory}>
                {produto.categoria}
              </p>

              <p className={styles.productPrice}>
                R$ {produto.preco.toFixed(2)}
              </p>

              <Link
                href={`/produtos/mocks/${produto.id}`}
                className={styles.viewProductLink}
              >
                Ver Produto
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
