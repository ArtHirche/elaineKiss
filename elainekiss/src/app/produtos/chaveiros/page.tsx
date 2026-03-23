import styles from "../../styles/produtos.module.css";
import Link from "next/link";

export default function CaetasLapisPage() {
    const categorias = [
        "Aneis, Correntes e Pulseiras",
        "Bolsa Infantil",
        "Brincos",
        "Button/Broches",
        "Canetas/Lápis",
        "Chaveiros",
        "Chaveiro Crochê",
        "Clips",
        "Corrente de Óculos",
        "Cremes/Batons",
        "Escova de Cabelo",
        "Estojo",
        "Etiquetas",
        "Imã de Geladeira",
        "Marca Página",
        "Pin Tênis e Crock",
        "Phone Scrap",
        "Ponteira de Lápis",
        "Pregador de Papeis/Alimentos",
        "Prendedor de Chupeta",
        "Produtos de Cabelo",
        "Roller Clips/Crachá/Bilhete",
        "Terços e Mini Terços",
        "Tubetes"
    ];

    const produtos = [
        { id: 1, nome: "Produto 1", preco: 12.50, imagem: "/produtos/1.jpg" },
        { id: 2, nome: "Produto 2", preco: 19.90, imagem: "/produtos/2.jpg" },
        { id: 3, nome: "Produto 3", preco: 29.99, imagem: "/produtos/3.jpg" },
        { id: 4, nome: "Produto 4", preco: 29.99, imagem: "/produtos/4.jpg" },
        { id: 5, nome: "Produto 5", preco: 29.99, imagem: "/produtos/5.jpg" },
        { id: 6, nome: "Produto 6", preco: 200.99, imagem: "/produtos/6.jpg" },
        { id: 7, nome: "Produto 7", preco: 20.99, imagem: "/produtos/7.jpg" },
        { id: 8, nome: "Produto 8", preco: 29.99, imagem: "/produtos/8.jpg" },
        { id: 9, nome: "Produto 9", preco: 29.99, imagem: "/produtos/9.jpg" },
        { id: 10, nome: "Produto 10", preco: 29.99, imagem: "/produtos/10.jpg" },
        { id: 11, nome: "Produto 11", preco: 29.99, imagem: "/produtos/11.jpg" },
        { id: 12, nome: "Produto 12", preco: 29.99, imagem: "/produtos/12.jpg" },
    ];

    return (
        <div className={styles.container}>

            <div className={styles.breadcrumbs}><a href="/">Home</a> &gt; <a href="/produtos">Produtos</a> &gt; Chaveiros</div>

            <div className={styles.layout}>

                <aside className={styles.sidebar}>
                    <h3 className={styles.categoriasTitle}>Categorias</h3>

                    <ul className={styles.categoriasLista}>
                        {categorias.map((cat, i) => {

                            const slug = cat
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/,/g, "")
                                .replace(/\//g, "-")
                                .replace(/ /g, "-")
                                .replace(/[^\w-]+/g, "");

                            return (
                                <li key={i} className={styles.categoriaItem}>
                                    <a href={`/produtos/${slug}`}>
                                        {cat}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <main className={styles.main}>

                    <div className={styles.sortBar}>
                        <select className={styles.sortSelect}>
                            <option>Mais antigo ao mais novo</option>
                            <option>Mais novo ao mais antigo</option>
                            <option>Maior preço</option>
                            <option>Menor preço</option>
                        </select>
                    </div>

                    <section className={styles.sectionProdutos}>

                        <h1 className={styles.sectionTitle}>Chaveiros</h1>

                        <div className={styles.separator}>
                            <span></span>
                        </div>

                        <div className={styles.grid}>
                            {produtos.map((p) => (
                                <a href={`/produtos/mocks/${p.id}`} key={p.id} className={styles.card}>
                                    <img src={p.imagem} alt={p.nome} className={styles.img} />
                                    <p className={styles.nome}>{p.nome}</p>
                                    <span className={styles.preco}>R$ {p.preco.toFixed(2)}</span>
                                    <button className={styles.botaoCarrinho}>
                                        Adicionar ao carrinho
                                    </button>
                                </a>
                            ))}
                        </div>


                    </section>

                </main>
            </div>
        </div>
    );
}