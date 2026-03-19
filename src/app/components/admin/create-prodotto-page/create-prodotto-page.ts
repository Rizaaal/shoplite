import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
  selectedProduct = signal<Product | null>(null);
  loading = signal(false);
  error = signal('');

  isEditMode = computed(() => !!this.selectedProduct());

  async ngOnInit() {
    try {
      const products = await this.service.products.value();
      if (products) {
        this.products.set(products);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      this.error.set('Errore caricamento prodotti');
    }
  }

  async handleSaveProduct(event: { formData: FormProduct; file: File | null }) {
    this.loading.set(true);
    this.error.set('');

    try {
      const currentProduct = this.selectedProduct();

      if (currentProduct) {
        let image = currentProduct.image;

        if (event.file) {
          const upload = await this.service.uploadProductImage(event.file);
          image = upload.url;
        }

        const updated = await this.service.updateProduct(currentProduct.id, {
          ...event.formData,
          image,
        });

        this.product.set(updated);
        this.products.update((products) =>
          products.map((item) => (item.id === updated.id ? updated : item)),
        );
        this.selectedProduct.set(null);
        return;
      }

      if (!event.file) {
        this.error.set("Seleziona un'immagine");
        return;
      }

      const upload = await this.service.uploadProductImage(event.file);

      const payload: FormProduct = {
        ...event.formData,
        image: upload.url,
      };

      const created = await this.service.createProduct(payload);

      this.product.set(created);
      this.products.set([created, ...this.products()]);
    } catch (error) {
      console.error(error);
      this.error.set(
        this.isEditMode() ? 'Errore aggiornamento prodotto' : 'Errore creazione prodotto',
      );
    } finally {
      this.loading.set(false);
    }
  }

  handleEditProduct(product: Product) {
    this.error.set('');
    this.selectedProduct.set(product);
    this.product.set(product);
  }

  async handleDeleteProduct(product: Product) {
    this.loading.set(true);
    this.error.set('');

    try {
      await this.service.deleteProduct(product.id);

      this.products.update((products) => products.filter((item) => item.id !== product.id));

      if (this.selectedProduct()?.id === product.id) {
        this.selectedProduct.set(null);
      }

      if (this.product()?.id === product.id) {
        this.product.set(null);
      }
    } catch (error) {
      console.error(error);
      this.error.set('Errore eliminazione prodotto');
    } finally {
      this.loading.set(false);
    }
  }

  cancelEdit() {
    this.selectedProduct.set(null);
    this.product.set(null);
    this.error.set('');
  }

  goBack() {
    this.location.back();
  }
}

export type FormProduct = Omit<Product, 'id'>;
