import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotti-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prodotti-list.html',
})
export class ProdottiListComponent {
  @Input() products: Product[] = [];
}
