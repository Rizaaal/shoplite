import { Injectable, resource } from '@angular/core';
import { Product } from '../components/shared/product-card/product-card';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://localhost:8080/api';

  products = resource<Product[], string>({
    loader: async () => {
      const response = await fetch(`${this.baseUrl}/products`);

      if (!response.ok) {
        throw new Error('Non è stato possibile caricare i prodotti.');
      }

      return response.json();
    },
  });
}
