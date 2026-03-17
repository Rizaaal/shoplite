import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Aggiungi Router
import { ProductCard } from '../../components/shared/product-card/product-card'; // Importa la tua card

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ProductCard], // Aggiungi ProductCard qui
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: any;
  suggestedProducts: any[] = []; // Array per le card in basso

  mockProducts = [
    { id: 1, name: 'RTX 4070', price: 650, category: 'GPU', image: 'https://i.postimg.cc/pLzGdjK8/jpeg-2.png', description: 'La GeForce RTX™ 4070 ti permette di affrontare i giochi e le app più recenti con l\'ultra-efficiente architettura NVIDIA Ada Lovelace. Sperimenta il ray-tracing accelerato e la grafica potenziata dall\'IA con DLSS 3.', available: true, rating: 4.8, reviews: 342 },
    { id: 2, name: 'Ryzen 7 7800X3D', price: 450, category: 'CPU', image: 'https://i.postimg.cc/pLzGdjK8/jpeg-2.png', description: 'La GeForce RTX™ 4070 ti permette di affrontare i giochi e le app più recenti con l\'ultra-efficiente architettura NVIDIA Ada Lovelace. Sperimenta il ray-tracing accelerato e la grafica potenziata dall\'IA con DLSS 3.', available: true, rating: 4.9, reviews: 156 },
    { id: 3, name: 'DDR5 32GB', price: 150, category: 'RAM', image: 'https://i.postimg.cc/pLzGdjK8/jpeg-2.png', description: 'La GeForce RTX™ 4070 ti permette di affrontare i giochi e le app più recenti con l\'ultra-efficiente architettura NVIDIA Ada Lovelace. Sperimenta il ray-tracing accelerato e la grafica potenziata dall\'IA con DLSS 3.', available: false, rating: 4.5, reviews: 89 },
    { id: 4, name: 'Samsung 990 Pro', price: 180, category: 'Storage', image: 'https://i.postimg.cc/pLzGdjK8/jpeg-2.png', description: 'La GeForce RTX™ 4070 ti permette di affrontare i giochi e le app più recenti con l\'ultra-efficiente architettura NVIDIA Ada Lovelace. Sperimenta il ray-tracing accelerato e la grafica potenziata dall\'IA con DLSS 3.', available: true, rating: 4.9, reviews: 512 }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Usiamo subscribe per reagire ai cambi di URL mentre siamo nella stessa pagina
    this.route.params.subscribe(params => {
      const productId = Number(params['id']);
      
      // 1. Cerchiamo il prodotto attuale
      this.product = this.mockProducts.find(p => p.id === productId) || this.mockProducts[0];

      // 2. Prendiamo i suggerimenti (tutti tranne quello che stiamo guardando)
      this.suggestedProducts = this.mockProducts
        .filter(p => p.id !== this.product.id)
        .slice(0, 4); // Ne prendiamo massimo 4
    });
  }

  // Funzione per cliccare sulle card suggerite
  goToDetail(id: number) {
    this.router.navigate(['/product-detail', id]);
    window.scrollTo(0, 0); // Torna in cima alla pagina dopo il click
  }

  addToCart() {
    console.log('Prodotto aggiunto:', this.product.name);
  }
}