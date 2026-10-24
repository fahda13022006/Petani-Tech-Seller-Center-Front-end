import initialProducts from '@/mock/products.json';
import { Product, CreateProductInput, ProductStatus } from '@/types';
import { simulateDelay } from '@/api/client';
import { storage } from '@/services/storage';

const STORAGE_KEY_PRODUCTS = 'petani_tech_products';

class ProductService {
  private async getLocalProducts(): Promise<Product[]> {
    const raw = await storage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      await storage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts as Product[];
    }
    try {
      return JSON.parse(raw) as Product[];
    } catch {
      return initialProducts as Product[];
    }
  }

  private async saveLocalProducts(products: Product[]): Promise<void> {
    await storage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }

  async getProducts(params?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Product[]> {
    await simulateDelay(250);
    let items = await this.getLocalProducts();

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (params?.category && params.category !== 'Semua') {
      items = items.filter((p) => p.category === params.category);
    }

    if (params?.status) {
      if (params.status === 'low_stock') {
        items = items.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert);
      } else if (params.status === 'out_of_stock') {
        items = items.filter((p) => p.stock === 0);
      } else if (params.status === 'active') {
        items = items.filter((p) => p.status === 'Aktif');
      } else if (params.status === 'review') {
        items = items.filter((p) => p.status === 'Sedang Diperiksa');
      }
    }

    return items;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    await simulateDelay(150);
    const items = await this.getLocalProducts();
    return items.find((p) => p.id === id);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    await simulateDelay(350);
    const items = await this.getLocalProducts();

    let status: ProductStatus = 'Aktif';
    if (input.stock === 0) status = 'Habis';
    else if (input.stock <= (input.minStockAlert || 10)) status = 'Stok Menipis';

    const defaultImg =
      input.image ||
      (input.category === 'Pupuk'
        ? 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80'
        : input.category === 'Pestisida'
        ? 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=500&auto=format&fit=crop&q=80'
        : input.category === 'Benih'
        ? 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80');

    const newProduct: Product = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: input.name,
      category: input.category,
      price: Number(input.price),
      originalPrice: Number(input.price),
      stock: Number(input.stock),
      minStockAlert: input.minStockAlert || 15,
      status,
      image: defaultImg,
      description: input.description,
      unit: input.unit || 'Pcs',
      soldCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
      sku: `AGR-${input.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    };

    items.unshift(newProduct);
    await this.saveLocalProducts(items);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await simulateDelay(300);
    const items = await this.getLocalProducts();
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Produk tidak ditemukan');

    const updated = { ...items[idx], ...updates };

    // automatically adjust status based on stock
    if (typeof updated.stock === 'number') {
      if (updated.stock === 0) updated.status = 'Habis';
      else if (updated.stock <= updated.minStockAlert) updated.status = 'Stok Menipis';
      else if (updated.status === 'Habis' || updated.status === 'Stok Menipis') updated.status = 'Aktif';
    }

    items[idx] = updated;
    await this.saveLocalProducts(items);
    return updated;
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    return this.updateProduct(id, { stock: newStock });
  }

  async deleteProduct(id: string): Promise<boolean> {
    await simulateDelay(250);
    const items = await this.getLocalProducts();
    const filtered = items.filter((p) => p.id !== id);
    await this.saveLocalProducts(filtered);
    return true;
  }
}

export const productService = new ProductService();
export default productService;
