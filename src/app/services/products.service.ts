import { Injectable, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../components/shared/product-card/product-card';
import { baseApiUrl, localStorageKey } from '../constants';
import { firstValueFrom } from 'rxjs';

interface UploadResponse {
  success?: boolean;
  data?: {
    file?: {
      url?: string;
      public_id?: string;
    };
  };
  file?: {
    url?: string;
    public_id?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  products = resource<Product[], string>({
    loader: async () => {
      const response = await fetch(`${baseApiUrl}/prodotti`);

      if (!response.ok) {
        throw new Error('Non è stato possibile caricare i prodotti.');
      }

      const result = await response.json();
      return Array.isArray(result?.data) ? result.data : result;
    },
  });

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${baseApiUrl}/prodotti`);

    if (!response.ok) {
      throw new Error('Non è stato possibile caricare i prodotti.');
    }

    const result = await response.json();
    return Array.isArray(result?.data) ? result.data : result;
  }

  async uploadProductImage(file: File): Promise<{ url: string; public_id?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await firstValueFrom(
      this.http.post<UploadResponse>(`${baseApiUrl}/upload/image`, formData),
    );

    const url = response?.data?.file?.url || response?.file?.url || '';
    const public_id = response?.data?.file?.public_id || response?.file?.public_id;

    if (!url) {
      throw new Error("L'upload dell'immagine non ha restituito un URL valido.");
    }

    return { url, public_id };
  }

  async createProduct(payload: Product): Promise<Product> {
    const sessionRaw = localStorage.getItem(localStorageKey);
    const token = sessionRaw ? JSON.parse(sessionRaw).token : null;

    if (!token) {
      throw new Error('Token mancante');
    }

    const response = await fetch(`${baseApiUrl}/prodotti`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      console.log('CREATE PRODUCT RESPONSE ERROR:', errorBody);
      throw new Error('Errore durante la creazione del prodotto.');
    }

    const result = await response.json();
    console.log('CREATE PRODUCT RESPONSE:', result);

    return result?.data ?? result;
  }
}
