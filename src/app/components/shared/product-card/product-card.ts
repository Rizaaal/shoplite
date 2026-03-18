import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service';
import { CartButton } from '../cart-button/cart-button';
import { cartStorageKey } from '../../../constants';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CartButton],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
  cartEvent = output<Product>();
  addedToCart = signal<boolean>(false);

  product = input<Product>({
    id: 1,
    nome: 'prodotto',
    descrizione: 'descrizione',
    categoria: 'category',
    prezzo: 0,
    stock: 1,
    image: 'placeholder.jpg',
  });

  addToCart(event?: Event) {
    if (event) {
      event.stopPropagation(); // Ferma la navigazione al dettaglio
    }

    const currentItem = this.product();
    const existingItem = this.cartService.items().find((i) => i.id === currentItem.id);

    if (existingItem) {
      this.cartService.updateQty(currentItem.id, existingItem.stock + 1);
    } else {
      const newCart = [...this.cartService.items(), { ...currentItem, stock: 1 }];
      this.cartService.items.set(newCart);
      localStorage.setItem(cartStorageKey, JSON.stringify(newCart));
    }

    this.cartEvent.emit(currentItem);
  }
}

export type Product = {
  id: number;
  nome: string;
  descrizione: string;
  categoria: string;
  prezzo: number;
  stock: number;
  image: string | null;
};
