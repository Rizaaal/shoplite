import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { Product } from '../../components/shared/product-card/product-card';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello {
  router = inject(Router);
  cartService = inject(CartService);

  cartItems = computed(() => this.cartService.items());

  total = computed(() => this.cartItems().reduce((sum, item) => sum + item.prezzo * item.stock, 0));

  increaseQty(item: Product) {
    this.cartService.updateQty(item.id, item.stock + 1);
  }

  decreaseQty(item: Product) {
    if (item.stock > 1) this.cartService.updateQty(item.id, item.stock - 1);
  }

  removeItem(id: number) {
    this.cartService.remove(id);
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
