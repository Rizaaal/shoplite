import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input<Product>({
    id: 1,
    nome: 'prodotto',
    descrizione: 'descrizione',
    categoria: 'category',
    prezzo: 0,
    stock: 1,
    image: 'placeholder.jpg',
  });
}

export type Product = {
  id: number;
  nome: string;
  descrizione: string;
  categoria: string;
  prezzo: number;
  stock: number;
  image: string;
};
