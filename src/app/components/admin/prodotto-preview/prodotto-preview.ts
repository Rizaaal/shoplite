import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotto-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prodotto-preview.html',
})
export class ProdottoPreviewComponent {
  @Input() product: Product | null = null;
}
