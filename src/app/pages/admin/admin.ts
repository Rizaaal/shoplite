import { Component } from '@angular/core';
import { CreateProdottoPageComponent } from '../../components/admin/create-prodotto-page/create-prodotto-page';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CreateProdottoPageComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {}
