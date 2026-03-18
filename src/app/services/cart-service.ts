import { Injectable, signal } from '@angular/core';
import { Product } from '../components/shared/product-card/product-card';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<Product[]>([]);

  add(product: Product) {
    this.items.update((cart) => {
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        return cart.map((i) => (i.id === product.id ? { ...i, stock: i.stock + 1 } : i));
      }
      return [...cart, { ...product, stock: 1 }];
    });
  }

  updateQty(id: number, stock: number) {
    this.items.update((cart) => cart.map((i) => (i.id === id ? { ...i, stock } : i)));
  }

  remove(id: number) {
    this.items.update((cart) => cart.filter((i) => i.id !== id));
  }

  clear() {
    this.items.set([]);
  }
}
