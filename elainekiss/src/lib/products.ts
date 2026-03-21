import { Product, Category, CreateProductInput, UpdateProductInput, CreateCategoryInput } from '@/types/product';

class ProductDatabase {
  private products: Product[] = [];
  private categories: Category[] = [];

  async createProduct(productData: CreateProductInput, createdBy: string): Promise<Product> {
    const product: Product = {
      id: this.generateId(),
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      image: productData.image,
      images: productData.images || [],
      stock: productData.stock || 0,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
    };

    this.products.push(product);
    return product;
  }

  async getProducts(category?: string, activeOnly: boolean = true): Promise<Product[]> {
    let filteredProducts = this.products;

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (activeOnly) {
      filteredProducts = filteredProducts.filter(p => p.isActive);
    }

    return filteredProducts;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async updateProduct(id: string, updates: UpdateProductInput): Promise<Product | null> {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return this.products[productIndex];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    this.products.splice(productIndex, 1);
    return true;
  }

  async createCategory(categoryData: CreateCategoryInput): Promise<Category> {
    const category: Category = {
      id: this.generateId(),
      name: categoryData.name,
      description: categoryData.description,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories.push(category);
    return category;
  }

  async getCategories(activeOnly: boolean = true): Promise<Category[]> {
    let filteredCategories = this.categories;

    if (activeOnly) {
      filteredCategories = filteredCategories.filter(c => c.isActive);
    }

    return filteredCategories;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categories.find(category => category.id === id) || null;
  }

  async updateCategory(id: string, updates: Partial<CreateCategoryInput>): Promise<Category | null> {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) return null;

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return this.categories[categoryIndex];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) return false;

    this.categories.splice(categoryIndex, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

export const productDb = new ProductDatabase();
