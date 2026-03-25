"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";

export default function ProductManager() {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
    const [isCreating, setIsCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        imageUrl: "",
        isActive: true,
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            category: "",
            stock: 0,
            imageUrl: "",
            isActive: true,
        });
        setIsCreating(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await createProduct(formData);
            }
            resetForm();
        } catch (err) {
            console.error("Error saving product:", err);
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            imageUrl: product.imageUrl || "",
            isActive: product.isActive,
        });
        setEditingProduct(product);
        setIsCreating(false);
    };

    const handleDelete = async (productId: string) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                await deleteProduct(productId);
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };

    if (loading) return <div>Carregando produtos...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>Gerenciamento de Produtos</h1>

            {!isCreating && !editingProduct && (
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginBottom: "20px",
                    }}
                >
                    Adicionar Produto
                </button>
            )}

            {(isCreating || editingProduct) && (
                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "5px",
                        marginBottom: "20px",
                    }}
                >
                    <h2>{editingProduct ? "Editar Produto" : "Novo Produto"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "15px" }}>
                            <label>Nome:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Descrição:</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={{ width: "100%", padding: "8px", marginTop: "5px", minHeight: "80px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Preço:</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                required
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Categoria:</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Estoque:</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                required
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>URL da Imagem:</label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                Ativo
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                            >
                                {editingProduct ? "Atualizar" : "Criar"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div>
                <h2>Lista de Produtos</h2>
                {products.length === 0 ? (
                    <p>Nenhum produto encontrado.</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    borderRadius: "5px",
                                    backgroundColor: product.isActive ? "white" : "#f8f9fa",
                                }}
                            >
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                                <p><strong>Categoria:</strong> {product.category}</p>
                                <p><strong>Estoque:</strong> {product.stock}</p>
                                <p><strong>Status:</strong> {product.isActive ? "Ativo" : "Inativo"}</p>
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{ width: "100%", height: "150px", objectFit: "cover", marginTop: "10px" }}
                                    />
                                )}
                                <div style={{ marginTop: "10px" }}>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                            marginRight: "5px",
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id!)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
