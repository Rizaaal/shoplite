import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  product = {
    name: 'RTX 4070',
    price: 650,
    category: 'GPU',
    image: 'assets/gpu1.jpg',
    description: 'La GeForce RTX™ 4070 ti permette di affrontare i giochi e le app più recenti con l\'ultra-efficiente architettura NVIDIA Ada Lovelace.',
    available: true,
    rating: 4.8,
    reviews: 342
  };

  addToCart() {
    console.log('Prodotto aggiunto:', this.product.name);
  }
}