import { Injectable, resource } from '@angular/core';
import { Product } from '../components/shared/product-card/product-card';
import { baseApiUrl } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products = resource<Product[], string>({
    loader: async () => {
      const response = await fetch(`${baseApiUrl}/products`);

      if (!response.ok) {
        throw new Error('Non è stato possibile caricare i prodotti.');
      }

      return response.json();
    },
  });
}
