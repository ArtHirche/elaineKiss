"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { getImageSrc } from "@/lib/imageUtils";
import styles from "./busca.module.css";

function BuscaContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const query = q.toLowerCase();

  const { products, loading, error } = useProducts();

  // Função para normalizar texto (remove acentos)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Divide a busca em palavras ignorando preposições comuns
  const getQueryWords = (q: string) => {
    const normalized = normalizeText(q);
    const stopWords = new Set(["de", "do", "da", "em", "para", "com", "o", "a", "os", "as"]);
    const words = normalized
      .split(/\s+/)
      .filter((word) => word.length > 0);
    
    const filteredWords = words.filter(word => !stopWords.has(word));
    return filteredWords.length > 0 ? filteredWords : words;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Carregando busca...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Erro ao buscar produtos</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const queryWords = getQueryWords(query);

  const produtosFiltrados = products.filter((produto) => {
    const nome = normalizeText(produto.name);
    const categoria = normalizeText(produto.category);

    // O produto deve conter todas as palavras da busca (seja no nome ou na categoria)
    return queryWords.every((word) => nome.includes(word) || categoria.includes(word));
  });

  const searchType = `"${q}"`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Resultados da busca: {searchType}
      </h1>

      {produtosFiltrados.length === 0 ? (
        <div className={styles.noResults}>
          <p>
            Nenhum produto encontrado para "{q}".
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className={styles.productCard}>
              <h3 className={styles.productName}>
                {produto.name}
              </h3>

              <img 
                className={styles.productImage} 
                src={getImageSrc(produto.imageUrl)} 
                alt={produto.name}
                onError={(e) => {
                  e.currentTarget.src = "/produtos/default.jpg";
                }}
              />

              <p className={styles.productCategory}>
                {produto.category}
              </p>

              <p className={styles.productPrice}>
                R$ {produto.price.toFixed(2)}
              </p>

              <Link
                href={`/produtos/${produto.id}`}
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

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Carregando busca...</div>}>
      <BuscaContent />
    </Suspense>
  );
}
