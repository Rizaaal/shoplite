import { Component } from '@angular/core';
import { ChiSiamo } from '../../components/shared/chi-siamo/chi-siamo';
import { ProductCard } from '../../components/shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [ChiSiamo, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
