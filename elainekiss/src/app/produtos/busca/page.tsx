import Link from "next/link";
import { produtos } from "../mocks/data";
import styles from "./busca.module.css";

interface Props {
  searchParams: {
    q: string;
  };
}

export default function BuscaPage({ searchParams }: Props) {
  const query = searchParams.q?.toLowerCase() || "";
  
  // Debug: Log the search params and query
  console.log("SearchParams:", searchParams);
  console.log("Query:", query);
  
  // First, check if the query matches any category
  const categoriasUnicas = Array.from(new Set(produtos.map(p => p.categoria)));
  console.log("Categorias disponíveis:", categoriasUnicas);
  
  // Find the best matching category with scoring system
  const categoryMatches = categoriasUnicas
    .map(categoria => {
      const categoriaLower = categoria.toLowerCase();
      let score = 0;
      
      // Exact match gets highest score
      if (categoriaLower === query) score = 100;
      // Starts with query gets high score
      else if (categoriaLower.startsWith(query)) score = 80;
      // Contains query gets medium score
      else if (categoriaLower.includes(query)) score = 60;
      // Check individual words
      else {
        const words = categoriaLower.split(' ');
        words.forEach(word => {
          if (word.includes(query)) {
            score += 30;
          }
        });
      }
      
      return { categoria, score };
    })
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);
  
  const matchedCategory = categoryMatches.length > 0 ? categoryMatches[0].categoria : null;
  
  console.log("Matched category:", matchedCategory);
  
  let produtosFiltrados;
  let searchType = "";
  
  if (matchedCategory) {
    // If query matches a category, show all products from that category
    produtosFiltrados = produtos.filter(produto => 
      produto.categoria.toLowerCase() === matchedCategory.toLowerCase()
    );
    searchType = `categoria "${matchedCategory}"`;
  } else {
    // Otherwise, search by product name
    produtosFiltrados = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(query)
    );
    searchType = `"${searchParams.q}"`;
  }
  
  console.log("Produtos filtrados:", produtosFiltrados);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Resultados da busca: {searchType}</h1>
      
      {produtosFiltrados.length === 0 ? (
        <div className={styles.noResults}>
          <p>Nenhum produto encontrado para "{searchParams.q}".</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className={styles.productCard}>
              <h3 className={styles.productName}>{produto.nome}</h3>
              <p className={styles.productCategory}>
                {produto.categoria}
              </p>
              <p className={styles.productPrice}>R$ {produto.preco.toFixed(2)}</p>
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
