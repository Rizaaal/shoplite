import { Injectable, signal } from '@angular/core';
import { Product } from '../components/shared/product-card/product-card';
import { cartStorageKey } from '../constants';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<Product[]>(JSON.parse(localStorage.getItem(cartStorageKey) || '[]'));

  add(product: Product) {
    this.items.update((cart) => {
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        return cart.map((i) => (i.id === product.id ? { ...i, stock: i.stock + 1 } : i));
      }
      const newCart = [...cart, { ...product, stock: 1 }];
      localStorage.setItem(cartStorageKey, JSON.stringify(newCart));

      return newCart;
    });
  }

  updateQty(id: number, stock: number) {
    const newCart = this.items().map((i) => (i.id === id ? { ...i, stock } : i));
    this.items.set(newCart);
    localStorage.setItem(cartStorageKey, JSON.stringify(newCart));
  }

  remove(id: number) {
    const newCart = this.items().filter((i) => i.id !== id);
    this.items.set(newCart);
    localStorage.setItem(cartStorageKey, JSON.stringify(newCart));
  }

  clear() {
    this.items.set([]);
  }
}
