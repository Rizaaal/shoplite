import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<Product>();
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
