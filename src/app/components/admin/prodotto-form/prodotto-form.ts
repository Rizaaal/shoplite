import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prodotto-form.html',
  styleUrl: './prodotto-form.css',
})
export class ProdottoFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() loading = false;
  @Input() product: Product | null = null;
  @Input() isEditMode = false;

  @Output() saveProduct = new EventEmitter<{
    formData: Omit<Product, 'id'>;
    file: File | null;
  }>();

  @Output() cancelEdit = new EventEmitter<void>();

  file: File | null = null;
  fileName = '';

  form = this.fb.group({
    nome: ['', Validators.required],
    descrizione: ['', Validators.required],
    prezzo: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoria: ['', Validators.required],
  });

  categories = ['GPU', 'Memoria', 'Accessori', 'Case', 'CPU', 'Scheda Madre'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      if (this.product) {
        this.form.patchValue({
          nome: this.product.nome,
          descrizione: this.product.descrizione,
          prezzo: this.product.prezzo,
          stock: this.product.stock,
          categoria: this.product.categoria,
        });

        this.file = null;
        this.fileName = '';
        this.form.markAsPristine();
      } else {
        this.resetForm();
      }
    }
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const selectedFile = input.files?.[0] ?? null;

    this.file = selectedFile;
    this.fileName = selectedFile?.name ?? '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const payload: Omit<Product, 'id'> = {
      nome: v.nome!,
      descrizione: v.descrizione!,
      prezzo: Number(v.prezzo),
      stock: Number(v.stock),
      categoria: v.categoria!,
      image: this.product?.image ?? '',
    };

    this.saveProduct.emit({
      formData: payload,
      file: this.file,
    });

    if (!this.isEditMode) {
      this.resetForm();
    }
  }

  onCancelEdit() {
    this.resetForm();
    this.cancelEdit.emit();
  }

  resetForm() {
    this.form.reset({
      nome: '',
      descrizione: '',
      prezzo: 0,
      stock: 0,
      categoria: '',
    });

    this.file = null;
    this.fileName = '';
  }

  hasError(field: 'nome' | 'descrizione' | 'prezzo' | 'stock' | 'categoria'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
                                                                                                                                                                                                                                          