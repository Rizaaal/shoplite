import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCard, Product } from '../../components/shared/product-card/product-card';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true,
  imports: [CommonModule, ProductCard],
})
export class Products {
  productsService = inject(ProductsService);

  // <--- Rinominata in Products per il test
  categories = ['GPU', 'Memoria', 'Accessori', 'Case', 'CPU', 'Scheda Madre'];
  selectedCategories: string[] = [];
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOption: string = '';
  filteredProducts: Product[] = [];

  products = computed(() => {
    const products = this.productsService.products;

    // check if defined
    if (!products.hasValue()) return [];

    this.filteredProducts = products.value();

    return products.value();
  });

  constructor(private router: Router) {}

  goToDetail(productId?: number) {
    this.router.navigate(['/product-detail', productId]);
  }

  getCategoryCount(cat: string): number {
    return this.products().filter((p) => p.categoria === cat).length;
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.applyFilters();
  }

  toggleCategory(cat: string) {
    if (this.selectedCategories.includes(cat)) {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== cat);
    } else {
      this.selectedCategories.push(cat);
    }
    this.applyFilters();
  }

  onMinPriceChange(value: string) {
    this.minPrice = value ? Number(value) : null;
    this.applyFilters();
  }

  onMaxPriceChange(value: string) {
    this.maxPrice = value ? Number(value) : null;
    this.applyFilters();
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.applyFilters();
  }

  applyFilters() {
    let newFilteredProducts = this.products()
      .filter(
        (p) => !this.selectedCategories.length || this.selectedCategories.includes(p.categoria),
      )
      .filter((p) => p.nome.toLowerCase().includes(this.searchQuery.toLowerCase()))
      .filter((p) => this.minPrice === null || p.prezzo >= this.minPrice!)
      .filter((p) => this.maxPrice === null || p.prezzo <= this.maxPrice!);

    if (this.sortOption === 'name_asc')
      newFilteredProducts.sort((a, b) => a.nome.localeCompare(b.nome));
    if (this.sortOption === 'name_desc')
      newFilteredProducts.sort((a, b) => b.nome.localeCompare(a.nome));
    if (this.sortOption === 'price_asc') newFilteredProducts.sort((a, b) => a.prezzo - b.prezzo);
    if (this.sortOption === 'price_desc') newFilteredProducts.sort((a, b) => b.prezzo - a.prezzo);

    this.filteredProducts = newFilteredProducts;
  }
}
