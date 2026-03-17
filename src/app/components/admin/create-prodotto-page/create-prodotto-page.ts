import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../shared/product-card/product-card';
import { ProductsService } from '../../../services/products.service';
import { ProdottoFormComponent } from '../prodotto-form/prodotto-form';
import { ProdottoPreviewComponent } from '../prodotto-preview/prodotto-preview';
import { ProdottiListComponent } from '../prodotti-list/prodotti-list';

@Component({
  selector: 'app-create-prodotto-page',
  standalone: true,
  imports: [CommonModule, ProdottoFormComponent, ProdottoPreviewComponent, ProdottiListComponent],
  templateUrl: './create-prodotto-page.html',
  styleUrl: './create-prodotto-page.css',
})
export class CreateProdottoPageComponent implements OnInit {
  private service = inject(ProductsService);
  private location = inject(Location);

  product = signal<Product | null>(null);
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal('');

  async ngOnInit() {
    try {
      this.products.set(await this.service.getProducts());
    } catch (error) {
      console.error(error);
      this.error.set('Errore caricamento prodotti');
    }
  }

  async handleCreateProduct(event: { formData: Product; file: File | null }) {
    if (!event.file) {
      this.error.set("Seleziona un'immagine");
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const upload = await this.service.uploadProductImage(event.file);

      const payload: Product = {
        ...event.formData,
        image: upload.url,
      };

      const created = await this.service.createProduct(payload);

      this.product.set(created);
      this.products.set([created, ...this.products()]);
    } catch (error) {
      console.error(error);
      this.error.set('Errore creazione prodotto');
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.location.back();
  }
}
