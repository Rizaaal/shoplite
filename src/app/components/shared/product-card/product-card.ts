import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service';
import { CartButton } from '../cart-button/cart-button';

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
      event.stopPropagation();
    }

    const currentItem = this.product();
    this.cartService.add(currentItem);
    this.cartEvent.emit(currentItem);
  }

  isMaxQuantityReached(): boolean {
    const currentItem = this.product();
    const existingItem = this.cartService.items().find((i) => i.id === currentItem.id);

    if (!existingItem) return false;

    return existingItem.quantity >= currentItem.stock;
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
