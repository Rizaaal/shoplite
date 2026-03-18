import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prodotto-form.html',
})
export class ProdottoFormComponent {
  private fb = inject(FormBuilder);

  @Input() loading = false;

  @Output() createProduct = new EventEmitter<{
    formData: Omit<Product, 'id'>;
    file: File | null;
  }>();

  file: File | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    descrizione: ['', Validators.required],
    prezzo: [0, Validators.required],
    stock: [0, Validators.required],
    categoria: ['', Validators.required],
  });

  categories = ['GPU', 'Memoria', 'Accessori', 'Case', 'CPU', 'Scheda Madre'];

  onFileChange(e: any) {
    this.file = e.target.files[0];
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
}
