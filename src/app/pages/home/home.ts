import { Component } from '@angular/core';
import { ProductCard } from "../../components/shared/product-card/product-card";
import { ChiSiamo } from "../../components/shared/chi-siamo/chi-siamo";

@Component({
  selector: 'app-home',
  imports: [ProductCard, ChiSiamo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
