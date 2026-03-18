import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Aggiungi Router
import { ProductCard } from '../../components/shared/product-card/product-card'; // Importa la tua card
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ProductCard], // Aggiungi ProductCard qui
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  productsService = inject(ProductsService);
  cartService = inject(CartService);

  product: any;
  suggestedProducts: any[] = []; // Array per le card in basso

  products = computed(() => {
    const products = this.productsService.products;

    // check if defined
    if (!products.hasValue()) return [];

    return products.value();
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // Usiamo subscribe per reagire ai cambi di URL mentre siamo nella stessa pagina
    this.route.params.subscribe((params) => {
      const productId = Number(params['id']);

      // 1. Cerchiamo il prodotto attuale
      this.product = this.products().find((p) => p.id === productId) || this.products()[0];

      // 2. Prendiamo i suggerimenti (tutti tranne quello che stiamo guardando)
      this.suggestedProducts = this.products()
        .filter((p) => p.id !== this.product.id)
        .slice(0, 4); // Ne prendiamo massimo 4
    });
  }

  // Funzione per cliccare sulle card suggerite
  goToDetail(id: number) {
    this.router.navigate(['/product-detail', id]);
    window.scrollTo(0, 0); // Torna in cima alla pagina dopo il click
  }

  addToCart() {
    console.log('Prodotto aggiunto:', this.product.name);
    this.cartService.add(this.product);
  }
}
