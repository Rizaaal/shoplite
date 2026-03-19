import { Injectable, signal } from '@angular/core';
import { Product } from '../components/shared/product-card/product-card';
import { cartStorageKey } from '../constants';

export type CartItem = Product & {
  quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(JSON.parse(localStorage.getItem(cartStorageKey) || '[]'));

  private persist(cart: CartItem[]) {
    this.items.set(cart);
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }

  add(product: Product) {
    this.items.update((cart) => {
      const existing = cart.find((i) => i.id === product.id);

      if (existing) {
        if (existing.quantity >= existing.stock) {
          return cart;
        }

        const newCart = cart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );

        localStorage.setItem(cartStorageKey, JSON.stringify(newCart));
        return newCart;
      }

      const newCart: CartItem[] = [...cart, { ...product, quantity: 1 }];
      localStorage.setItem(cartStorageKey, JSON.stringify(newCart));
      return newCart;
    });
  }

  updateQty(id: number, quantity: number) {
    const newCart = this.items().map((i) => {
      if (i.id !== id) return i;

      const clampedQty = Math.max(1, Math.min(quantity, i.stock));
      return { ...i, quantity: clampedQty };
    });

    this.persist(newCart);
  }

  remove(id: number) {
    const newCart = this.items().filter((i) => i.id !== id);
    this.persist(newCart);
  }

  clear() {
    this.items.set([]);
    localStorage.removeItem(cartStorageKey);
  }
}
