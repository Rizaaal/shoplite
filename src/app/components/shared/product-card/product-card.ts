import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
  cartEvent = output<Product>();

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
    const existingItem = this.cartService.items().find(i => i.id === currentItem.id);
    
    if (existingItem) {
      this.cartService.updateQty(currentItem.id, existingItem.stock + 1);
    } else {
      this.cartService.items.set([...this.cartService.items(), { ...currentItem, stock: 1 }]);
    }
    
    this.cartEvent.emit(currentItem);
  }
}

export type Product = {
  id?: number;
  nome: string;
  descrizione: string;
  categoria: string;
  prezzo: number;
  stock: number;
  image: string | null;
};
