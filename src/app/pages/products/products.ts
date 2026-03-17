import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCard } from '../../components/shared/product-card/product-card';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true,
  imports: [CommonModule, ProductCard]
})
export class Products { // <--- Rinominata in Products per il test
  categories = ["GPU", "Memoria", "Accessori", "Case", "CPU", "Scheda Madre"];
  selectedCategories: string[] = [];
  searchQuery: string = "";
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOption: string = '';

  products = [
    { id: 1, name: "RTX 4070", price: 650, category: "GPU", image: "assets/gpu1.jpg", available: true },
    { id: 2, name: "Corsair 16GB RAM", price: 80, category: "Memoria", image: "assets/ram1.jpg", available: true },
    { id: 3, name: "Gaming Headset", price: 60, category: "Accessori", image: "assets/headset.jpg", available: false },
    { id: 4, name: "Case Mid Tower", price: 120, category: "Case", image: "assets/case1.jpg", available: true }
  ];

  filteredProducts = [...this.products];

  constructor(private router: Router) {}

  goToDetail(productId: number) {
    this.router.navigate(['/product-detail', productId]); 
  }

  getCategoryCount(cat: string): number {
    return this.products.filter(p => p.category === cat).length;
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.applyFilters();
  }

  toggleCategory(cat: string) {
    if (this.selectedCategories.includes(cat)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
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
    this.filteredProducts = this.products
      .filter(p => !this.selectedCategories.length || this.selectedCategories.includes(p.category))
      .filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      .filter(p => this.minPrice === null || p.price >= this.minPrice!)
      .filter(p => this.maxPrice === null || p.price <= this.maxPrice!);

    if (this.sortOption === 'name_asc') this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortOption === 'name_desc') this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    if (this.sortOption === 'price_asc') this.filteredProducts.sort((a, b) => a.price - b.price);
    if (this.sortOption === 'price_desc') this.filteredProducts.sort((a, b) => b.price - a.price);
  }
}