"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { categorias } from "@/data/categorias";

export default function ProductManager() {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
    const [isCreating, setIsCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
        imageUrl: "",
        fileName: "",
        fileType: "",
        isActive: true,
    });

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            category: "",
            imageUrl: "",
            fileName: "",
            fileType: "",
            isActive: true,
        });
        setFile(null);
        setIsCreating(false);
        setEditingProduct(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validar tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert('Apenas arquivos JPG, PNG e PDF são permitidos');
                return;
            }
            setFile(selectedFile);
            setFormData({
                ...formData,
                fileName: selectedFile.name,
                fileType: selectedFile.type,
            });
        }
    };

    const uploadFile = async (file: File): Promise<string> => {
        // Simulação de upload - na prática você usaria Firebase Storage
        // Por agora, vamos criar uma URL temporária
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula URL de upload
                const mockUrl = `https://mock-upload-bucket.com/${file.name}`;
                resolve(mockUrl);
            }, 1000);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = formData.imageUrl;

            // Se houver arquivo, fazer upload
            if (file) {
                imageUrl = await uploadFile(file);
            }

            const productData = {
                ...formData,
                imageUrl,
                price: parseFloat(formData.price.toString()),
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await createProduct(productData);
            }

            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erro ao salvar produto');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl || "",
            fileName: product.fileName || "",
            fileType: product.fileType || "",
            isActive: product.isActive,
        });
        setEditingProduct(product);
        setIsCreating(true);
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await deleteProduct(productId);
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Erro ao excluir produto');
            }
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Gerenciamento de Produtos</h1>
            
            {!isCreating ? (
                <div>
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        Novo Produto
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {products.map((product) => (
                            <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                <h3>{product.name}</h3>
                                <p><strong>Categoria:</strong> {product.category}</p>
                                <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                                <p><strong>Descrição:</strong> {product.description}</p>
                                {product.fileName && (
                                    <p><strong>Arquivo:</strong> {product.fileName}</p>
                                )}
                                {product.imageUrl && (
                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '10px' }} />
                                )}
                                <p style={{ color: product.isActive ? 'green' : 'red' }}>
                                    {product.isActive ? 'Ativo' : 'Inativo'}
                                </p>
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            marginRight: '5px'
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id!)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                    <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Nome:
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Descrição:
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Preço:
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Categoria:
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map((cat) => (
                                    <option key={cat.slug} value={cat.nome}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Anexar Arquivo (JPG, PNG, PDF):
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileChange}
                                style={{ width: '100%', padding: '8px' }}
                            />
                            {file && (
                                <p style={{ marginTop: '5px', color: '#666' }}>
                                    Arquivo selecionado: {file.name}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
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
                                disabled={uploading}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: uploading ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    marginRight: '10px',
                                }}
                            >
                                {uploading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Criar')}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
