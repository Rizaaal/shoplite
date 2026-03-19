import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotti-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prodotti-list.html',
  styleUrl: './prodotti-list.css',
})
export class ProdottiListComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;

  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();

  onEdit(product: Product) {
    this.editProduct.emit(product);
  }

  onDelete(product: Product) {
    this.deleteProduct.emit(product);
  }
}
