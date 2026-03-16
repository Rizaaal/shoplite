import { Component, computed, inject } from '@angular/core';
import { ProductCard } from '../../components/shared/product-card/product-card';
import { ChiSiamo } from '../../components/shared/chi-siamo/chi-siamo';
import { ProductsService } from '../../services/products.service';
import { NgClass } from '../../../../node_modules/@angular/common/types/_common_module-chunk';

@Component({
  selector: 'app-home',
  imports: [ProductCard, ChiSiamo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productsService = inject(ProductsService);

  products = computed(() => {
    const products = this.productsService.products;

    // check if defined
    if (!products.hasValue()) return [];

    // get first 4 elements
    const filtered = products.value().filter((_, i) => i < 4);

    return filtered;
  });
}
