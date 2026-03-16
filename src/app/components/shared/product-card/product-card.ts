import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input<Product>({
    id: 1,
    name: 'prodotto',
    description: 'descrizione',
    category: 'category',
    price: 0,
    qty: 1,
    imageUrl: 'placeholder.jpg',
  });
}

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  qty: number;
  imageUrl: string;
};
