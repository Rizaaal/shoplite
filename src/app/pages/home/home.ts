import { Component, computed, inject } from '@angular/core';
import { ProductCard } from '../../components/shared/product-card/product-card';
import { ChiSiamo } from '../../components/shared/chi-siamo/chi-siamo';
import { ProductsService } from '../../services/products.service';
import { Router, RouterLink } from '@angular/router'; // Fondamentale per navigare
import { CommonModule } from '@angular/common'; // Serve per gestire i dati

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCard, ChiSiamo, RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productsService = inject(ProductsService);
  router = inject(Router);

  featuredProducts = computed(() => {
    const products = this.productsService.products;

    console.log(products);

    // check if defined
    if (!products.hasValue()) return [];

    // get first 4 elements
    const filtered = products.value().filter((_, i) => i < 4);

    return filtered;
  });

  goToDetail(productId: number) {
    this.router.navigate(['/product-detail', productId]);
  }
}
