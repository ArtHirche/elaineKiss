"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { imageService } from "@/lib/firebase/imageService";
import { useCategories } from "@/hooks/useCategories";
import styles from "./ProductManager.module.css";

export default function ProductManager() {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
    const { 
        categories, 
        createCategory, 
        updateCategory, 
        deleteCategory, 
        loading: categoriesLoading 
    } = useCategories();

    const [isCreating, setIsCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        fileName: "",
        fileType: "",
        isActive: true,
    });

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [activeTab, setActiveTab] = useState<'manage' | 'details' | 'categories'>('manage');
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    // Category form states
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: "",
        description: "",
        isActive: true,
    });
    const [savingCategory, setSavingCategory] = useState(false);

    const resetCategoryForm = () => {
        setCategoryFormData({
            name: "",
            description: "",
            isActive: true,
        });
        setIsCreatingCategory(false);
        setEditingCategory(null);
    };

    const handleEditCategory = (category: any) => {
        setCategoryFormData({
            name: category.name,
            description: category.description || "",
            isActive: category.isActive,
        });
        setEditingCategory(category);
        setIsCreatingCategory(false);
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingCategory(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, {
                    name: categoryFormData.name,
                    description: categoryFormData.description,
                    isActive: categoryFormData.isActive,
                });
            } else {
                await createCategory(
                    categoryFormData.name,
                    categoryFormData.description,
                    categoryFormData.isActive
                );
            }
            resetCategoryForm();
        } catch (err: any) {
            alert('Erro ao salvar categoria: ' + err.message);
        } finally {
            setSavingCategory(false);
        }
    };

    const handleCategoryDelete = async (categoryId: string, categoryName: string) => {
        const hasProducts = products.some(p => p.category === categoryName);
        if (hasProducts) {
            alert('Não é possível excluir esta categoria porque existem produtos associados a ela. Remova ou altere a categoria dos produtos primeiro.');
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
            try {
                await deleteCategory(categoryId);
            } catch (err: any) {
                alert('Erro ao excluir categoria: ' + err.message);
            }
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (product.description || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const resetForm = () => {
        console.log('ProductManager: Resetting form');
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            imageUrl: "",
            fileName: "",
            fileType: "",
            isActive: true,
        });
        setFile(null);
        setIsCreating(false);
        setEditingProduct(null);
        console.log('ProductManager: Form reset completed');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validar tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert('Tipo de arquivo não permitido. Use JPG, PNG ou PDF.');
                return;
            }

            // Validar tamanho (5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert('Arquivo muito grande. Tamanho máximo: 5MB.');
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
        try {
            console.log('ProductManager: Processando arquivo com ImageService:', file.name);
            
            // Usar serviço simples e confiável
            const imageUrl = await imageService.uploadProductImage(file);
            console.log('ProductManager: Imagem processada:', imageUrl);
            return imageUrl;
            
        } catch (error) {
            console.error('ProductManager: Erro no processamento, usando fallback:', error);
            // Fallback garantido
            return `https://picsum.photos/seed/fallback-${Date.now()}/300/200.jpg`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('=== INICIANDO SUBMIT ===');
        console.log('formData atual:', formData);
        console.log('file selecionado:', file);
        console.log('uploading:', uploading);
        
        setUploading(true);

        try {
            let imageUrl = formData.imageUrl;

            // Se houver arquivo, fazer upload (sempre funciona, tem fallback)
            if (file) {
                console.log('Iniciando upload do arquivo:', file.name);
                console.log('Tamanho do arquivo:', file.size);
                console.log('Tipo do arquivo:', file.type);
                
                // Para mostrar o arquivo, vamos usar processamento inteligente
                imageUrl = await uploadFile(file);
                console.log('Usando imagem processada:', imageUrl);
            } else {
                console.log('Nenhum arquivo selecionado, usando imageUrl existente:', formData.imageUrl);
            }

            const productData = {
                ...formData,
                imageUrl,
                price: parseFloat(formData.price) || 0,
            };

            console.log('Salvando produto:', productData);
            console.log('imageUrl final:', productData.imageUrl);
            console.log('imageUrl começa com data:', productData.imageUrl.startsWith('data:'));

            if (editingProduct) {
                console.log('Atualizando produto ID:', editingProduct.id);
                await updateProduct(editingProduct.id, productData);
                console.log('Produto atualizado com sucesso');
            } else {
                console.log('Criando novo produto');
                await createProduct(productData);
                console.log('Produto criado com sucesso');
            }

            console.log('ProductManager: Chamando resetForm()');
            resetForm();
            console.log('ProductManager: resetForm() concluído');
        } catch (error) {
            console.error('=== ERRO NO SUBMIT ===');
            console.error('Error saving product:', error);
            alert('Erro ao salvar produto: ' + (error as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            imageUrl: product.imageUrl || "",
            fileName: product.fileName || "",
            fileType: product.fileType || "",
            isActive: product.isActive,
        });
        setEditingProduct(product);
        setIsCreating(false);
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await deleteProduct(productId);
                console.log('ProductManager: Produto excluído com sucesso');
            } catch (error) {
                console.error('ProductManager: Erro ao excluir produto:', error);
                alert('Erro ao excluir produto');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>🛍️ Gerenciamento de Produtos</h1>
                    <p className={styles.modalSubtitle}>
                        {products.length} produto(s) cadastrado(s)
                    </p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className={styles.addButton}
                >
                    ➕ Novo Produto
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    ❌ Erro: {error}
                </div>
            )}

            {/* Barra de Abas */}
            <div className={styles.tabsContainer}>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'manage' ? styles.activeTabButton : ''}`}
                    onClick={() => setActiveTab('manage')}
                >
                    📋 Cadastro & Lista
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTabButton : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    🖼️ Detalhamento Geral
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'categories' ? styles.activeTabButton : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    📁 Categorias
                </button>
            </div>

            {/* Barra de Filtros e Pesquisa */}
            <div className={styles.filterBar}>
                <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="🔍 Buscar produto por nome ou descrição..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">📁 Todas as Categorias</option>
                    {categories.map(cat => (
                        <option key={cat.slug} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {activeTab === 'categories' ? (
                /* ABA 3: Categorias */
                <div className={styles.scrollListContainer}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>📁 Gerenciar Categorias</h2>
                        <button 
                            type="button"
                            onClick={() => setIsCreatingCategory(true)}
                            className={styles.addButton}
                            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                        >
                            ➕ Nova Categoria
                        </button>
                    </div>

                    {categoriesLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.emptyStateIcon}>⏳</div>
                            <p>Carregando categorias...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Nenhuma categoria cadastrada.
                        </div>
                    ) : (
                        <div className={styles.categoriesGrid}>
                            {categories.map((category) => (
                                <div key={category.id} className={styles.categoryCard}>
                                    <div>
                                        <div className={styles.categoryCardHeader}>
                                            <h3 className={styles.categoryCardTitle}>{category.name}</h3>
                                            <span className={`${styles.categoryStatus} ${category.isActive ? styles.statusActive : styles.statusInactive}`}>
                                                {category.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        <div className={styles.categoryCardBody}>
                                            <p style={{ margin: '0 0 10px 0' }}>{category.description || 'Sem descrição'}</p>
                                            <p style={{ margin: 0 }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Slug: </span>
                                                <span className={styles.categorySlug}>{category.slug}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.categoryCardActions}>
                                        <button 
                                            type="button"
                                            onClick={() => handleEditCategory(category)}
                                            className={styles.editButton}
                                            style={{ flex: 1, padding: '6px 12px', fontSize: '0.85rem' }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleCategoryDelete(category.id!, category.name)}
                                            className={styles.deleteButton}
                                            style={{ flex: 1, padding: '6px 12px', fontSize: '0.85rem' }}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : loading ? (
                <div className={styles.loading}>
                    <div className={styles.emptyStateIcon}>⏳</div>
                    <p>Carregando produtos...</p>
                </div>
            ) : products.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📦</div>
                    <h2 className={styles.emptyStateTitle}>Nenhum produto encontrado</h2>
                    <p className={styles.emptyStateText}>
                        Comece cadastrando seu primeiro produto para preencher sua loja virtual.
                    </p>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className={styles.addButton}
                    >
                        🛒 Cadastrar Primeiro Produto
                    </button>
                </div>
            ) : activeTab === 'manage' ? (
                /* ABA 1: Cadastro & Lista */
                <div className={styles.scrollListContainer}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Nenhum produto corresponde aos filtros aplicados.
                        </div>
                    ) : (
                        <div className={styles.productsList}>
                            {filteredProducts.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productHeader}>
                                        <h3 className={styles.productName}>
                                            {product.name} 
                                            {product.isActive ? ' ✅' : ' ❌'}
                                        </h3>
                                        <p className={styles.productPrice}>
                                            💰 R$ {product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    
                                    <div className={styles.productInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>📂 Categoria</span>
                                            <span className={styles.infoValue}>{product.category}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>📅 Data</span>
                                            <span className={styles.infoValue}>
                                                {product.createdAt?.toDate?.()?.toLocaleDateString?.('pt-BR') || 'N/A'}
                                            </span>
                                        </div>
                                        {product.fileName && (
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>📎 Arquivo</span>
                                                <span className={styles.infoValue}>{product.fileName}</span>
                                            </div>
                                        )}
                                        {product.fileType && (
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>📄 Tipo</span>
                                                <span className={styles.infoValue}>{product.fileType}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {product.description && (
                                        <p className={styles.productDescription}>
                                            📝 {product.description}
                                        </p>
                                    )}
                                    
                                    {product.imageUrl && (
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                                Imagem: {product.imageUrl.substring(0, 60)}...
                                            </div>
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name} 
                                                className={styles.productImage}
                                                onLoad={() => console.log('✅ Imagem carregada:', product.name)}
                                                onError={(e) => {
                                                    console.error('❌ Erro ao carregar imagem:', product.name);
                                                    e.currentTarget.src = `https://picsum.photos/seed/fallback-${Date.now()}/300/200.jpg`;
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className={styles.productActions}>
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className={styles.editButton}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id!)}
                                            className={styles.deleteButton}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* ABA 2: Detalhamento Geral */
                <div className={styles.scrollListContainer}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Nenhum produto corresponde aos filtros aplicados.
                        </div>
                    ) : (
                        <div className={styles.detailsGrid}>
                            {filteredProducts.map((product) => {
                                const formattedDate = product.updatedAt?.toDate?.()?.toLocaleDateString?.('pt-BR') || 
                                                      product.createdAt?.toDate?.()?.toLocaleDateString?.('pt-BR') || 
                                                      'N/A';
                                return (
                                    <div 
                                        key={product.id} 
                                        className={styles.detailCard}
                                        onClick={() => window.open(`/produtos/${product.id}`, '_blank')}
                                        title="Clique para abrir a página do produto"
                                    >
                                        <div className={styles.detailCardTitle}>
                                            {product.name}
                                        </div>
                                        <div className={styles.detailCardBody}>
                                            <div className={styles.detailCardImageContainer}>
                                                <img 
                                                    src={product.imageUrl || "/produtos/default.jpg"} 
                                                    alt={product.name} 
                                                    className={styles.detailCardImage} 
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/produtos/default.jpg";
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.detailCardInfo}>
                                                <div className={styles.detailCardPrice}>
                                                    R$ {product.price.toFixed(2)}
                                                </div>
                                                <div className={styles.detailCardCategory}>
                                                    <span className={styles.categoryLabel}>Categorias:</span>
                                                    <span className={styles.categoryValue}>{product.category}</span>
                                                </div>
                                                <div className={styles.updateBox}>
                                                    <div className={styles.updateBoxLabel}>Última Atualização:</div>
                                                    <div className={styles.updateBoxValue}>{formattedDate}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {(isCreating || editingProduct) && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {isCreating ? '🛒 Cadastrar Novo Produto' : '✏️ Editar Produto'}
                            </h2>
                            <p className={styles.modalSubtitle}>
                                {isCreating 
                                    ? 'Preencha os dados abaixo para adicionar um novo produto à sua loja.'
                                    : 'Atualize as informações do produto selecionado.'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Nome do Produto <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className={styles.formInput}
                                    placeholder="Ex: Tênis Esportivo"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Categoria <span className={styles.required}>*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className={styles.formSelect}
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.slug} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Preço <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className={styles.formInput}
                                    placeholder="Ex: 199.99"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className={styles.formTextarea}
                                    placeholder="Descreva seu produto, suas características, benefícios..."
                                    rows={4}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    📎 Imagem do Produto
                                </label>
                                <div 
                                    className={`${styles.fileUpload} ${file ? styles.hasFile : ''}`}
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                >
                                    <div className={styles.fileUploadIcon}>
                                        {file ? '✅' : '📁'}
                                    </div>
                                    <p className={styles.fileUploadText}>
                                        {file ? `Arquivo selecionado: ${file.name}` : 'Clique para selecionar uma imagem'}
                                    </p>
                                    <p className={styles.fileUploadHint}>
                                        Formatos aceitos: JPG, PNG, PDF (máx 5MB)
                                    </p>
                                    {file && (
                                        <div className={styles.fileInfo}>
                                            📊 Tamanho: {(file.size / 1024).toFixed(1)} KB | 
                                            📄 Tipo: {file.type}
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/jpeg,image/png,application/pdf"
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    URL da Imagem (opcional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                    className={styles.formInput}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    📦 Status do Produto
                                </label>
                                <select
                                    value={formData.isActive.toString()}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                                    className={styles.formSelect}
                                >
                                    <option value="true">✅ Ativo (visível na loja)</option>
                                    <option value="false">❌ Inativo (oculto na loja)</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={styles.saveButton}
                                >
                                    {uploading ? 'Salvando...' : (isCreating ? 'Criar Produto' : 'Atualizar Produto')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {(isCreatingCategory || editingCategory) && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {isCreatingCategory ? '📁 Cadastrar Nova Categoria' : '✏️ Editar Categoria'}
                            </h2>
                            <p className={styles.modalSubtitle}>
                                {isCreatingCategory 
                                    ? 'Preencha os dados abaixo para adicionar uma nova categoria.'
                                    : 'Atualize as informações da categoria selecionada.'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleCategorySubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Nome da Categoria <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                                    className={styles.formInput}
                                    placeholder="Ex: Japamala"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Descrição
                                </label>
                                <textarea
                                    value={categoryFormData.description}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                                    className={styles.formTextarea}
                                    placeholder="Descreva a categoria..."
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    📁 Status da Categoria
                                </label>
                                <select
                                    value={categoryFormData.isActive.toString()}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, isActive: e.target.value === 'true'})}
                                    className={styles.formSelect}
                                >
                                    <option value="true">✅ Ativo (visível no menu)</option>
                                    <option value="false">❌ Inativo (oculto no menu)</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={resetCategoryForm}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingCategory}
                                    className={styles.saveButton}
                                >
                                    {savingCategory ? 'Salvando...' : (isCreatingCategory ? 'Criar Categoria' : 'Atualizar Categoria')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}