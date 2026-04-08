"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { getImageSrc } from "@/lib/imageUtils";

export default function ProductList() {
    const { products, loading, error } = useProducts();
    const { addToCart } = useCart();

    const handleAddToCart = (productId: string, price: number) => {
        addToCart(productId, 1, price);
    };

    if (loading) return <div>Carregando produtos...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>Nossos Produtos</h1>
            
            {products.length === 0 ? (
                <p>Nenhum produto disponível no momento.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            {product.imageUrl && (
                                <img
                                    src={getImageSrc(product.imageUrl)}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        marginBottom: "10px",
                                    }}
                                />
                            )}
                            
                            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>{product.name}</h3>
                            <p style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}>
                                {product.description}
                            </p>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#007bff" }}>
                                    R$ {product.price.toFixed(2)}
                                </span>
                                <span style={{ fontSize: "12px", color: "#666" }}>
                                    Estoque: {product.stock}
                                </span>
                            </div>
                            
                            <div style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
                                Categoria: {product.category}
                            </div>
                            
                            <button
                                onClick={() => handleAddToCart(product.id!, product.price)}
                                disabled={product.stock === 0}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: product.stock === 0 ? "#6c757d" : "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: product.stock === 0 ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                {product.stock === 0 ? "Fora de Estoque" : "Adicionar ao Carrinho"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
