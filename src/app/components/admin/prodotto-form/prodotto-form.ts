import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prodotto-form.html',
  styleUrl: './prodotto-form.css',
})
export class ProdottoFormComponent {
  private fb = inject(FormBuilder);

  @Input() loading = false;

  @Output() createProduct = new EventEmitter<{
    formData: Omit<Product, 'id'>;
    file: File | null;
  }>();

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
      image: '',
    };

    this.createProduct.emit({
      formData: payload,
      file: this.file,
    });
  }

  hasError(field: 'nome' | 'descrizione' | 'prezzo' | 'stock' | 'categoria'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
